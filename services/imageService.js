// services/imageService.js

// badge1

const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

async function generateQuestionImage() {
  const colors = ['red', 'blue', 'yellow', 'green', 'purple'];
  const selectedColors = [...colors];
  const answerColor = selectedColors.splice(Math.floor(Math.random() * selectedColors.length), 1)[0];

  // Shuffle selected colors
  for (let i = selectedColors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selectedColors[i], selectedColors[j]] = [selectedColors[j], selectedColors[i]];
  }

  const imagePromises = selectedColors.slice(0, 4).map(color => sharp(path.join(__dirname, `../public/answer-images/${color}.png`)).toBuffer());

  // Read images and combine them
  const images = await Promise.all(imagePromises);
  const topLeft = images[0];
  const topRight = images[1];
  const bottomLeft = images[2];
  const bottomRight = images[3];

  const topLeftMetadata = await sharp(topLeft).metadata();

  // Combine images into 2x2 grid
  const finalImage = await sharp({
         create: {
           width: topLeftMetadata.width * 2,
           height: topLeftMetadata.height * 2,
           channels: 4,
           background: { r: 0, g: 0, b: 0, alpha: 0 },
         },
       })
         .composite([
           { input: topLeft, top: 0, left: 0 },
           { input: topRight, top: 0, left: topLeftMetadata.width },
           { input: bottomLeft, top: topLeftMetadata.height, left: 0 },
           { input: bottomRight, top: topLeftMetadata.height, left: topLeftMetadata.width },
         ])
         .jpeg()
         .toBuffer();
  return { image: finalImage, answerColor };
}

module.exports = {
  generateQuestionImage,
};