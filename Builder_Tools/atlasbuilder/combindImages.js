const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function combineImages(doubleArray) {
    // This function will load all images and return an array of image objects and their required dimensions.
    async function loadAllImages() {
        const rowDimensions = [];
        const loadedImages = [];

        for (const row of doubleArray) {
            let currentWidth = 0;
            let currentHeight = 0;
            const rowData = [];

            for (const imgSrc of row) {
                const img = await loadImage(imgSrc);
                rowData.push(img);
                currentWidth += img.width;
                currentHeight = Math.max(currentHeight, img.height);
            }

            loadedImages.push(rowData);
            rowDimensions.push({ width: currentWidth, height: currentHeight });
        }

        return { loadedImages, rowDimensions };
    }

    const { loadedImages, rowDimensions } = await loadAllImages();

    // Calculate total width and height
    const totalWidth = Math.max(...rowDimensions.map(dim => dim.width));
    const totalHeight = rowDimensions.reduce((acc, dim) => acc + dim.height, 0);

    // Create a canvas with the calculated width and height
    const canvas = createCanvas(totalWidth, totalHeight);
    const ctx = canvas.getContext('2d');

    // Draw images row by row
    let yOffset = 0;
    for (let i = 0; i < loadedImages.length; i++) {
        let xOffset = 0;

        for (const img of loadedImages[i]) {
            ctx.drawImage(img, xOffset, yOffset);
            xOffset += img.width;
        }

        yOffset += rowDimensions[i].height;
    }

    // Save the combined image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('combined.png', buffer);
}

// Sample Usage
const imageDoubleArray = [
    ['sourseImages/peaks/peaks_1.png', 'sourseImages/peaks/peaks_2.png','sourseImages/peaks/peaks_3.png', 'sourseImages/peaks/peaks_4.png'],

    // ['sourseImages/Attack01/0.png', 'sourseImages/Attack01/1.png','sourseImages/Attack01/2.png', 'sourseImages/Attack01/3.png','sourseImages/Attack01/4.png','sourseImages/Attack01/5.png'],
    // ['sourseImages/Attack02/0.png', 'sourseImages/Attack02/1.png','sourseImages/Attack02/2.png', 'sourseImages/Attack02/3.png','sourseImages/Attack02/4.png'],
    // ['sourseImages/PowerUp01/0.png', 'sourseImages/PowerUp01/1.png','sourseImages/PowerUp01/2.png', 'sourseImages/PowerUp01/3.png'],
    // ['sourseImages/PowerUp02/0.png', 'sourseImages/PowerUp02/1.png','sourseImages/PowerUp02/2.png', 'sourseImages/PowerUp02/3.png','sourseImages/PowerUp02/4.png'],
    // ['sourseImages/Idle/0.png', 'sourseImages/Idle/1.png','sourseImages/Idle/2.png', 'sourseImages/Idle/3.png','sourseImages/Idle/4.png']
];

combineImages(imageDoubleArray).then(() => {
    console.log('Images combined successfully.');
}).catch(err => {
    console.error('Error:', err);
});