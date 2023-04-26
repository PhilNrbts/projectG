// config/socketio.js

// badge1

const { handleNewQuestion } = require('../controllers/gameController');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected');

    // Handle request for a new question
    socket.on('request_question', () => {
      handleNewQuestion(socket);
    });

    // Handle user's answer (example)
    socket.on('submit_answer', (answer) => {
      // Process user's answer and provide feedback
      // ...
    });

    // Other socket event handlers can be added here as needed

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};