const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const httpServer = require('http-server');

// Function to get all image files from a directory
function getImageFiles(directoryPath) {
    return fs.readdirSync(directoryPath)
      .filter(file => {
        // Check for common image file extensions
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
      })
  }

async function main (serverDirectory, imageFolder, outputDirectory, filters) {
  // Launch Puppeteer browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Start the local HTTP server
  const server = httpServer.createServer({ 
    root: serverDirectory});
  server.listen(8080, () => {
    console.log('Server started on http://localhost:8080');
  });

  // Wait for the server to start before proceeding
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Ensure output directory exists
  const outputDir = path.resolve(outputDirectory);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Get all image files in the server images directory
  const originalImagesDir = path.resolve(serverDirectory + '/' + imageFolder);
  const imageFiles = getImageFiles(originalImagesDir);

  // Iterate over each image
  for (const imageFile of imageFiles) {
    const imageFileParts = imageFile.split('.')

    for (const filter of filters) {

        const imagePath = `http://localhost:8080/${imageFolder}/${imageFile}`;
      
        const outputImagePath = `${outputDir}/${filter}_${imageFileParts[0]}.${imageFileParts[1]}`;
        
        // Define the HTML content with filter-specific classes
        const htmlContent = `
          <html>
            <head>
              <link rel="stylesheet" href="http://localhost:8080/css/cssgram.min.css">
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
}

serverDirectory = "C:/Users/parsa/OneDrive/Desktop/CSCI 3240U/Project_Repos/stylizer_test"
imageFolder = "photos_to_stylize"
outputDirectory = "C:/Users/parsa/OneDrive/Desktop/CSCI 3240U/Project_Repos/stylizer_test/photos_to_stylize_gt"
filters = ['_1977']
size = 400

main(serverDirectory, imageFolder, outputDirectory, filters)