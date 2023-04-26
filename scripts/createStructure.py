import os

folders = [
    "config",
    "models",
    "controllers",
    "middleware",
    "routes",
    "public/css",
    "public/js",
    "public/question-images",
    "public/answer-images",
    "services",
    "utils",
    "tests",
]

js_files = [
    "config/database.js",
    "config/socketio.js",
    "models/User.js",
    "models/Lobby.js",
    "models/Game.js",
    "models/Chat.js",
    "controllers/userController.js",
    "controllers/lobbyController.js",
    "controllers/gameController.js",
    "controllers/chatController.js",
    "middleware/validation.js",
    "middleware/errorHandling.js",
    "routes/userRoutes.js",
    "routes/lobbyRoutes.js",
    "routes/gameRoutes.js",
    "routes/chatRoutes.js",
    "services/imageService.js",
    "utils/eventHandlers.js",
    "tests/testImageService.js",
    "app.js",
    "package.json",
]

# Create folders
for folder in folders:
    os.makedirs(folder, exist_ok=True)

# Create empty JS files
for file in js_files:
    with open(file, "w") as f:
        pass