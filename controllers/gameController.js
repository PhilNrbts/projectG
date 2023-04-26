// controllers/gameController.js

// badge1

const fs = require('fs');
const { generateQuestionImage } = require('../services/imageService');

async function handleNewQuestion(socket) {
  const { image, answerColor } = await generateQuestionImage();
  const imageFileName = `q${Date.now()}.jpg`;

  // Save generated image to the question-images folder
  fs.writeFile(`public/question-images/${imageFileName}`, image, (err) => {
    if (err) throw err;
    console.log('Image saved:', imageFileName);

    // Send question and answer to the client
    socket.emit('question', {
      image: `/question-images/${imageFileName}`,
      answerColor
    });
  });
}

// Other game-related functions can be added here as needed

module.exports = {
  handleNewQuestion,
  // Export other functions as needed
};