# Define Variables
$styleImageDir="C:\Users\parsa\OneDrive\Desktop\CSCI 3240U\Project_Repos\Cinemashots\cinemashots\FilterStyleTransfer_with_trained_models\stylizer_test\stylized_photos"
$targetImageDir="C:\Users\parsa\OneDrive\Desktop\CSCI 3240U\Project_Repos\Cinemashots\cinemashots\FilterStyleTransfer_with_trained_models\stylizer_test\photos_to_stylize"
$stylesOrgDir="C:\Users\parsa\OneDrive\Desktop\CSCI 3240U\Project_Repos\Cinemashots\cinemashots\FilterStyleTransfer_with_trained_models\stylizer_test\photos_to_stylize"
$targetGTDir="C:\Users\parsa\OneDrive\Desktop\CSCI 3240U\Project_Repos\Cinemashots\cinemashots\FilterStyleTransfer_with_trained_models\stylizer_test\photos_to_stylize_gt"
$outputDir="C:\Users\parsa\OneDrive\Desktop\CSCI 3240U\Project_Repos\Cinemashots\cinemashots\FilterStyleTransfer_with_trained_models\stylizer_test\photos_after_stylization"
$imageSize=400
$modelPath="C:\Users\parsa\OneDrive\Desktop\CSCI 3240U\Project_Repos\Cinemashots\cinemashots\FilterStyleTransfer_with_trained_models\created_models\model_epoch_9.pth"

# Activate virtual environment
& "C:\Users\parsa\OneDrive\Desktop\CSCI 3240U\Project_Repos\Scripts\Activate"

# Run the Python stylizer script
python main_stylizer.py `
    --uncertainty="aleatoric_combined" `
    --styleImageDir=$styleImageDir `
    --targetImageDir=$targetImageDir `
    --modelPath=$modelPath `
    --imageSize=$imageSize `
    --outputDir=$outputDir `
    --styleImageOrgDir=$stylesOrgDir `
    --targetGTDir=$targetGTDir `
    --reg_weight=0.1 `
    --outputMode=1 `
    --drawOutput


