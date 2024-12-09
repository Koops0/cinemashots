import os

def reduce_text_file(input_file, output_file, reduction_factor=5):
    """
    Reduces the number of lines in a text file by a given factor.

    Parameters:
    - input_file (str): Path to the input text file.
    - output_file (str): Path to save the reduced text file.
    - reduction_factor (int): Factor by which to reduce the file size (default: 5).
    """
    try:
        with open(input_file, 'r') as infile:
            lines = infile.readlines()

        # Keep every `reduction_factor`th line
        reduced_lines = lines[::reduction_factor]

        with open(output_file, 'w') as outfile:
            outfile.writelines(reduced_lines)

        print(f"Reduced file saved to {output_file}. Original lines: {len(lines)}, Reduced lines: {len(reduced_lines)}")
    except Exception as e:
        print(f"Error: {e}")

# Example Usage
reduce_text_file(
    input_file='C:/Users/parsa/OneDrive/Desktop/CSCI 3240U/Project_Repos/Dataset/training_data.txt',
    output_file='C:/Users/parsa/OneDrive/Desktop/CSCI 3240U/Project_Repos/Dataset/training_data_reduced_plus.txt',
    reduction_factor=8
)

reduce_text_file(
    input_file='C:/Users/parsa/OneDrive/Desktop/CSCI 3240U/Project_Repos/Dataset/testing_data.txt',
    output_file='C:/Users/parsa/OneDrive/Desktop/CSCI 3240U/Project_Repos/Dataset/testing_data_reduced_plus.txt',
    reduction_factor=8
)
