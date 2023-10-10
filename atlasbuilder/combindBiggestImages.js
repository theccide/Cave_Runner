const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function combineImages(doubleArray) {
    // This function will load all images and return loaded images with max dimensions.
    async function loadAllImagesAndGetMaxDimensions() {
        let maxWidth = 0;
        let maxHeight = 0;
        const loadedImages = [];

        for (const row of doubleArray) {
            const rowData = [];

            for (const imgSrc of row) {
                const img = await loadImage(imgSrc);
                rowData.push(img);
                maxWidth = Math.max(maxWidth, img.width);
                maxHeight = Math.max(maxHeight, img.height);
            }

            loadedImages.push(rowData);
        }

        return { loadedImages, maxWidth, maxHeight };
    }

    const { loadedImages, maxWidth, maxHeight } = await loadAllImagesAndGetMaxDimensions();

    // Calculate total canvas width and height based on max dimensions
    const totalWidth = maxWidth * Math.max(...loadedImages.map(row => row.length));
    const totalHeight = maxHeight * loadedImages.length;

    // Create a canvas with the calculated width and height
    const canvas = createCanvas(totalWidth, totalHeight);
    const ctx = canvas.getContext('2d');

    // Draw images row by row
    for (let y = 0; y < loadedImages.length; y++) {
        for (let x = 0; x < loadedImages[y].length; x++) {
            const img = loadedImages[y][x];
            const xOffset = x * maxWidth + (maxWidth - img.width) / 2;
            const yOffset = y * maxHeight + (maxHeight - img.height) / 2;
            ctx.drawImage(img, xOffset, yOffset);
        }
    }

    // Save the combined image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('combined.png', buffer);
}

// Sample Usage
const imageDoubleArray = [
    ['sourseImages/Attack01/0.png', 'sourseImages/Attack01/1.png','sourseImages/Attack01/2.png', 'sourseImages/Attack01/3.png','sourseImages/Attack01/4.png','sourseImages/Attack01/5.png'],
    ['sourseImages/Attack02/0.png', 'sourseImages/Attack02/1.png','sourseImages/Attack02/2.png', 'sourseImages/Attack02/3.png','sourseImages/Attack02/4.png'],
    ['sourseImages/PowerUp01/0.png', 'sourseImages/PowerUp01/1.png','sourseImages/PowerUp01/2.png', 'sourseImages/PowerUp01/3.png'],
    ['sourseImages/PowerUp02/0.png', 'sourseImages/PowerUp02/1.png','sourseImages/PowerUp02/2.png', 'sourseImages/PowerUp02/3.png','sourseImages/PowerUp02/4.png'],
    ['sourseImages/Idle/0.png', 'sourseImages/Idle/1.png','sourseImages/Idle/2.png', 'sourseImages/Idle/3.png','sourseImages/Idle/4.png']
];

combineImages(imageDoubleArray).then(() => {
    console.log('Images combined successfully.');
}).catch(err => {
    console.error('Error:', err);
});
