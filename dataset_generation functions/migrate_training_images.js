const fs = require('fs');
const path = require('path');

const IMAGE_LIMIT = 1000;

// Function to get all image files from a directory
function getImageFiles(directoryPath) {
    return fs.readdirSync(directoryPath)
        .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
        })
        .slice(0, IMAGE_LIMIT);
}

(async () => {
    try {
        console.log("Script started...");

        const originalImagesDir = path.resolve("C:/Users/parsa/OneDrive/Desktop/CSCI 3240U/Project_Repos/Dataset/coco/train2017");
        const trainingImagesDir = path.resolve("C:/Users/parsa/OneDrive/Desktop/CSCI 3240U/Project_Repos/Dataset/coco/training_subset");

        console.log("Original directory:", originalImagesDir);
        console.log("Target directory:", trainingImagesDir);

        const imageFiles = getImageFiles(originalImagesDir);
        console.log(`Found ${imageFiles.length} image(s) to process.`);

        if (!fs.existsSync(trainingImagesDir)) {
            fs.mkdirSync(trainingImagesDir, { recursive: true });
            console.log(`Created directory: ${trainingImagesDir}`);
        }

        for (const imageFile of imageFiles) {
            console.log(`Processing: ${imageFile}`);
            const sourcePath = path.join(originalImagesDir, imageFile);
            const destinationPath = path.join(trainingImagesDir, imageFile);

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
