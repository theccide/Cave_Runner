const sharp = require('sharp');
const fs = require('fs');

const gridSize={x: 9, y: 5};

// Function to process an image
async function processImage(inputImagePath, outputImagePath) {
  try {
    // Read the image
    const image = sharp(inputImagePath);
    const metadata = await image.metadata();

    const cellWidth = Math.floor(metadata.width / gridSize.x);
    const cellHeight = Math.floor(metadata.height / gridSize.y);

    // Create an empty array to hold promises for processing each cell
    let promises = [];

    for (let y = 0; y < gridSize.y; y++) {
      for (let x = 0; x < gridSize.x; x++) {
        // Calculate the top-left corner of the current cell
        const top = y * cellHeight;
        const left = x * cellWidth;

        // Extract the cell from the image
        const cell = image.extract({
          left: left,
          top: top,
          width: cellWidth,
          height: cellHeight
        });

        // Flip the cell image
        const flippedCell = cell.flip().flop();

        // Push the promise to the array
        promises.push(
          flippedCell.toBuffer().then(buffer => ({
            input: buffer,
            top: top,
            left: left
          }))
        );
      }
    }

    // When all cells have been processed, composite them back onto the image
    const cells = await Promise.all(promises);
    const compositeCells = cells.map(cell => ({
      input: cell.input,
      top: cell.top,
      left: cell.left,
      blend: 'over'
    }));

    // Composite the cells onto a blank image and save
    sharp({
      create: {
        width: metadata.width,
        height: metadata.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite(compositeCells)
      .toFile(outputImagePath);

    console.log(`Image processed and saved as ${outputImagePath}`);
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

// Call the function with your image paths
processImage('golem.png', 'output.png');
