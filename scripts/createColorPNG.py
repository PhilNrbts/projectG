import os
from PIL import Image

def create_colored_square(color, size, filename):
    img = Image.new('RGB', (size, size), color)
    img.save(filename)

colors = {
    'red': (255, 0, 0),
    'blue': (0, 0, 255),
    'yellow': (255, 255, 0),
    'green': (0, 255, 0),
    'purple': (128, 0, 128)
}

square_size = 100  # Change this to the size you want.

# Get the current script's directory.
script_dir = os.path.dirname(os.path.abspath(__file__))

# Define the output directory relative to the script's location.
output_dir = os.path.join(script_dir, '..', 'public', 'answer-images')

# Create the output directory if it doesn't exist.
os.makedirs(output_dir, exist_ok=True)

for color_name, color in colors.items():
    output_file = os.path.join(output_dir, f"{color_name}.png")
    create_colored_square(color, square_size, output_file)