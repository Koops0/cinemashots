import os

filters = ["_1977", "aden", "amaro", "brannan", "brooklyn", "clarendon", "earlybird",
    "gingham", "hudson", "inkwell", "kelvin", "lark", "lofi", "maven", "mayfair",
    "moon", "nashville", "perpetua", "reyes", "rise", "slumber", "stinson", "toaster",
    "valencia","walden", "xpro2"]

def generate_dataset_txt(original_dir,  stylized_dir, output_txt_path):

     # Get all image files in the original directory
    original_images = [f for f in os.listdir(original_dir) 
                       if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    # Prepare to write output
    with open(output_txt_path, 'w') as f:
        for original_image in original_images:

            # Write entries for each selected filter
            for filter_name in filters:

                stylized_image = f"{filter_name}_{original_image}" 

                # Check if stylized image exists
                if os.path.exists(os.path.join(stylized_dir, stylized_image)):
                    f.write(f"{original_image} {stylized_image}\n")
                else:
                    print(f"Warning: Stylized image not found for {original_image} with filter {filter_name}")

    # Print summary
    print(f"Generated dataset txt file: {output_txt_path}")
    print(f"Total images processed: {len(original_images) * len(filters)}")
    
# Example usage
if __name__ == "__main__":

    # Get relative paths 
    original_images_dir = "C:/Users/parsa/OneDrive/Desktop/CSCI 3240U/Project_Repos/Dataset/coco/testing_subset"
    stylized_images_dir = "C:/Users/parsa/OneDrive/Desktop/CSCI 3240U/Project_Repos/Dataset/testing_data"
    output_txt_path = "C:/Users/parsa/OneDrive/Desktop/CSCI 3240U/Project_Repos/Dataset/testing_data.txt"

    generate_dataset_txt(
        original_dir=original_images_dir,
        stylized_dir=stylized_images_dir,
        output_txt_path=output_txt_path,
    )

    
