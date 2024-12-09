# Define variables
$stylizedTrainDir = "C:\Users\parsa\OneDrive\Desktop\CSCI 3240U\Project_Repos\Dataset\training_data"
$orgTrainDir = "C:\Users\parsa\OneDrive\Desktop\CSCI 3240U\Project_Repos\Dataset\coco\training_subset"
$stylizedTestDir = "C:\Users\parsa\OneDrive\Desktop\CSCI 3240U\Project_Repos\Dataset\testing_data"
$orgTestDir = "C:\Users\parsa\OneDrive\Desktop\CSCI 3240U\Project_Repos\Dataset\coco\testing_subset"
$trainSet = "C:\Users\parsa\OneDrive\Desktop\CSCI 3240U\Project_Repos\Dataset\training_data.txt"
$valSet = "C:\Users\parsa\OneDrive\Desktop\CSCI 3240U\Project_Repos\Dataset\testing_data.txt"
$outputDir = "C:\Users\parsa\OneDrive\Desktop\CSCI 3240U\Project_Repos\FST_Fork\FilterStyleTransfer\created_models"
$checkpoint = "C:\Users\parsa\OneDrive\Desktop\CSCI 3240U\Project_Repos\FST_Fork\FilterStyleTransfer\created_models\model_epoch_5.pth"
$batchSize = 16
$nEpochs = 12
$gpu = 0

# Ensure the correct GPU is used
$env:CUDA_VISIBLE_DEVICES = "0"

# Activate virtual environment
& "C:\Users\parsa\OneDrive\Desktop\CSCI 3240U\Project_Repos\Scripts\Activate"

# Run the Python training script
python main_inv_function.py `
    --lr=0.002 `
    --uncertainty=default `
    --print-freq=2000 `
    --gpu=$gpu `
    --batchSize=$batchSize `
    --outputDir=$outputDir `
    --stylizedTrainDir=$stylizedTrainDir `
    --orgTrainDir=$orgTrainDir `
    --stylizedTestDir=$stylizedTestDir `
    --orgTestDir=$orgTestDir `
    --trainSet=$trainSet `
    --valSet=$valSet `
    --resume=$checkpoint `
    --nEpochs=$nEpochs

