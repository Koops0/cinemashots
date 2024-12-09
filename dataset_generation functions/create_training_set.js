const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const httpServer = require('http-server');

// Define the filters you want to apply
const filters = ["_1977", "aden", "amaro", "brannan", "brooklyn", "clarendon", "earlybird",
    "gingham", "hudson", "inkwell", "kelvin", "lark", "lofi", "maven", "mayfair",
    "moon", "nashville", "perpetua", "reyes", "rise", "slumber", "stinson", "toaster",
    "valencia","walden", "xpro2"];


const IMAGE_LIMIT = 1000;

// Function to get all image files from a directory
function getImageFiles(directoryPath) {
    return fs.readdirSync(directoryPath)
      .filter(file => {
        // Check for common image file extensions
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
      }).slice(0, IMAGE_LIMIT);
  }

(async () => {
  // Launch Puppeteer browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Start the local HTTP server
  const server = httpServer.createServer({ 
    root: "C:/Users/parsa/OneDrive/Desktop/CSCI 3240U/Project_Repos/Dataset"});
  server.listen(8080, () => {
    console.log('Server started on http://localhost:8080');
  });

  // Wait for the server to start before proceeding
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Ensure output directory exists
  const outputDir = path.resolve("C:/Users/parsa/OneDrive/Desktop/CSCI 3240U/Project_Repos/Dataset/training_data");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Get all image files in the original_images directory
  const originalImagesDir = path.resolve("C:/Users/parsa/OneDrive/Desktop/CSCI 3240U/Project_Repos/Dataset/coco/train2017");
  const imageFiles = getImageFiles(originalImagesDir);

  // Iterate over each image
  for (const imageFile of imageFiles) {
    const imageFileParts = imageFile.split('.')

    for (const filter of filters) {

        const imagePath = `http://localhost:8080/coco/train2017/${imageFile}`;
      
        const outputImagePath = `${outputDir}/${filter}_${imageFileParts[0]}.${imageFileParts[1]}`;
        
        // Define the HTML content with filter-specific classes
        const htmlContent = `
          <html>
            <head>
              <link rel="stylesheet" href="http://localhost:8080/create_datasets/css/cssgram.min.css">
              <style>
                body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                figure { margin: 0; }
                img { max-width: 100%; max-height: 100%; }
              </style>
            </head>
            <body>
              <figure class="${filter}">
                <img src="${imagePath}">
              </figure>
            </body>
          </html>
        `;
    
        // Set the page content
        await page.setContent(htmlContent);
    
        // Wait for the image to load and the filter to be applied
        await page.waitForSelector('figure img');
    
        // Take a screenshot of the filtered image
        await page.screenshot({
          path: outputImagePath,
          clip: await page.evaluate(() => {
            const figure = document.querySelector('figure');
            const rect = figure.getBoundingClientRect();
            return {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height
            };
          })
        });
    
        // console.log(`Saved filtered image: ${outputImagePath}`);
      }

    console.log(`Created all stylized versions of ${imageFile}`)

  }

  // Close the browser and stop the server
  await browser.close();
  server.close();
})().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});