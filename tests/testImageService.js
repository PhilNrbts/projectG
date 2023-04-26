// tests/testImageService.js

// badge2

const fs = require('fs');
const { generateQuestionImage } = require('../services/imageService.js');

(async () => {
  try {
    const { image, answerColor } = await generateQuestionImage();
    const imageFileName = `test-q${Date.now()}.jpg`;

    // Save generated image to the question-images folder
    fs.writeFile(`public/question-images/${imageFileName}`, image, (err) => {
      if (err) throw err;
      console.log('Test image saved:', imageFileName);
      console.log('Correct answer color:', answerColor);
    });
  } catch (error) {
    console.error('Error generating test image:', error);
  }
})();