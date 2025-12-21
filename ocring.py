from PIL import Image, ImageFilter
import pytesseract

# Open the image
img = Image.open('C:/Users/LENOVO/Pictures/Screenshots/goku.png')

# Resize to increase resolution (double size)
img = img.resize((img.width * 2, img.height * 2), Image.LANCZOS)

# Convert to grayscale for better OCR
img = img.convert('L')

# Apply a filter to enhance contrast (optional, experiment with this)
img = img.filter(ImageFilter.MedianFilter())

# Use pytesseract with configuration for better text extraction
custom_config = r'--oem 3 --psm 3'  # Changed PSM to 3 for full page
text = pytesseract.image_to_string(img, config=custom_config)

print(text)