const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Функция для рекурсивного обхода директорий
function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

// Функция для сжатия изображения без потери качества
async function compressImage(inputPath, outputPath) {
  try {
    const metadata = await sharp(inputPath).metadata();
    const format = metadata.format;
    
    let sharpInstance = sharp(inputPath);
    
    // Настройки для lossless сжатия в зависимости от формата
    if (format === 'jpeg' || format === 'jpg') {
      // Для JPEG используем качество 100 (lossless) и оптимизацию
      sharpInstance = sharpInstance.jpeg({
        quality: 100,
        mozjpeg: true, // Использует mozjpeg для лучшего сжатия
        progressive: true // Прогрессивный JPEG
      });
    } else if (format === 'png') {
      // Для PNG используем lossless сжатие с оптимизацией
      sharpInstance = sharpInstance.png({
        compressionLevel: 9, // Максимальное сжатие
        adaptiveFiltering: true,
        palette: true // Попытка использовать палитру, если возможно
      });
    } else if (format === 'webp') {
      // Для WebP используем lossless режим
      sharpInstance = sharpInstance.webp({
        lossless: true,
        effort: 6 // Усилие сжатия (0-6, где 6 - максимальное)
      });
    }
    
    // Создаем директорию для выходного файла, если её нет
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    await sharpInstance.toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
    
    return {
      success: true,
      originalSize,
      compressedSize,
      savings: parseFloat(savings)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Основная функция
async function main() {
  const imagesDir = path.join(__dirname, '..', 'images');
  const outputDir = path.join(__dirname, '..', 'images-compressed');
  
  // Проверяем существование директории с изображениями
  if (!fs.existsSync(imagesDir)) {
    console.error(`Директория ${imagesDir} не найдена!`);
    process.exit(1);
  }
  
  // Получаем все изображения
  const imageFiles = getAllImageFiles(imagesDir);
  
  if (imageFiles.length === 0) {
    console.log('Изображения не найдены!');
    return;
  }
  
  console.log(`Найдено ${imageFiles.length} изображений для обработки...\n`);
  
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  let successCount = 0;
  let failCount = 0;
  
  // Обрабатываем каждое изображение
  for (const imagePath of imageFiles) {
    const relativePath = path.relative(imagesDir, imagePath);
    const outputPath = path.join(outputDir, relativePath);
    
    console.log(`Обработка: ${relativePath}`);
    
    const result = await compressImage(imagePath, outputPath);
    
    if (result.success) {
      totalOriginalSize += result.originalSize;
      totalCompressedSize += result.compressedSize;
      successCount++;
      
      const sizeMB = (result.compressedSize / 1024 / 1024).toFixed(2);
      const savings = result.savings > 0 ? `-${result.savings}%` : `+${Math.abs(result.savings)}%`;
      
      console.log(`  ✓ Успешно: ${sizeMB} MB (${savings})\n`);
    } else {
      failCount++;
      console.log(`  ✗ Ошибка: ${result.error}\n`);
    }
  }
  
  // Итоговая статистика
  console.log('\n' + '='.repeat(50));
  console.log('ИТОГИ СЖАТИЯ:');
  console.log('='.repeat(50));
  console.log(`Обработано успешно: ${successCount}`);
  console.log(`Ошибок: ${failCount}`);
  console.log(`\nИсходный размер: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Сжатый размер: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`);
  
  if (totalOriginalSize > 0) {
    const totalSavings = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(2);
    console.log(`Экономия: ${totalSavings}% (${((totalOriginalSize - totalCompressedSize) / 1024 / 1024).toFixed(2)} MB)`);
  }
  
  console.log(`\nСжатые изображения сохранены в: ${outputDir}`);
  console.log('\nВнимание: Проверьте качество сжатых изображений перед заменой оригиналов!');
}

// Запускаем скрипт
main().catch(console.error);

