const fs = require('fs');
const readline = require('readline');

const inputFile = 'old.txt'; // Replace with the actual file name
const outputFile = 'new.txt';
const removedFile = 'removed.txt';

const processFile = async () => {
  try {
    const inputStream = fs.createReadStream(inputFile);
    const outputStream = fs.createWriteStream(outputFile);
    const removedStream = fs.createWriteStream(removedFile);

    const rl = readline.createInterface({
      input: inputStream,
      crlfDelay: Infinity
    });

    let hasRemovedLines = false; // Flag to track if any lines were removed

    for await (const line of rl) {
      const modifiedLine = line.replace(/^\d+:\d+$/, '');
      if (line !== modifiedLine) {
        removedStream.write(`${line}\n`);
        hasRemovedLines = true;
      }
      outputStream.write(`${modifiedLine}\n`);
    }

    if (hasRemovedLines) {
      console.log(`Numbers removed from "${inputFile}" and written to "${outputFile}".`);
      console.log(`Removed lines written to "${removedFile}".`);
    } else {
      console.log(`No lines in the format "x:xx" were found in "${inputFile}".`);
    }

    await rl.close();
    await outputStream.end();
    removedStream.end(); // Ensure removedStream is closed even if no lines were removed
  } catch (error) {
    console.error('Error processing file:', error);
  }
};

processFile();
