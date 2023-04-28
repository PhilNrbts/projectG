const fs = require('fs');
const path = require('path');
const dox = require('dox');

const directory = './';
const extensions = ['.js'];

function generateDocs(filePath) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const fileComments = dox.parseComments(fileContents, {raw: true});

  const docFilePath = filePath + '.doc';
  const stream = fs.createWriteStream(docFilePath, {flags: 'w'});

  fileComments.forEach((comment) => {
    const output = dox.outputJSON([comment]);
    stream.write(output);
  });

  console.log(`Documentation generated for ${filePath}`);
}

function searchFiles(directory, extensions) {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const fileStat = fs.statSync(filePath);

    if (file === 'gameController.js') {
      generateDocs(filePath);
    } else if (fileStat.isDirectory()) {
      searchFiles(filePath, extensions);
    }
  });
}

searchFiles(directory, extensions);
