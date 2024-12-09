const fs = require('fs');
const path = require('path');

const IMAGE_LIMIT = 1000;
const RANDOM_SELECTION_COUNT = 100;

// Function to get all image files from a directory
function getImageFiles(directoryPath) {
    return fs.readdirSync(directoryPath)
        .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
        })
        .slice(IMAGE_LIMIT);
}

// Function to shuffle an array randomly (Fisher-Yates Shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

(async () => {
    try {
        console.log("Script started...");

        const originalImagesDir = path.resolve("C:/Users/parsa/OneDrive/Desktop/CSCI 3240U/Project_Repos/Dataset/coco/train2017");
        const testingImagesDir = path.resolve("C:/Users/parsa/OneDrive/Desktop/CSCI 3240U/Project_Repos/Dataset/coco/testing_subset");

        console.log("Original directory:", originalImagesDir);
        console.log("Target directory:", testingImagesDir);

        const imageFiles = getImageFiles(originalImagesDir);

        // Take the first 100 random images from the shuffled list
        const randomImages = shuffleArray(imageFiles)
        const remainingImages = randomImages.slice(0, RANDOM_SELECTION_COUNT);

        console.log(`Found ${randomImages.length} image(s) to process.`);

        if (!fs.existsSync(testingImagesDir)) {
            fs.mkdirSync(testingImagesDir, { recursive: true });
            console.log(`Created directory: ${testingImagesDir}`);
        }

        for (const imageFile of remainingImages) {
            console.log(`Processing: ${imageFile}`);
            const sourcePath = path.join(originalImagesDir, imageFile);
            const destinationPath = path.join(testingImagesDir, imageFile);

            try {
                fs.copyFileSync(sourcePath, destinationPath);
                console.log(`Copied: ${imageFile}`);
            } catch (error) {
                console.error(`Failed to copy: ${imageFile}`, error);
            }
        }

        console.log('Finished copying images!');
    } catch (error) {
        console.error("Error in script:", error);
    }
})();
