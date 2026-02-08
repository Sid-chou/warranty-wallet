from PIL import Image, ImageFilter
import pytesseract
import re
import sys
import json

def extract_warranty_details(text):
    data = {}
    
    # Convert to lowercase for easier matching (keep original for extraction)
    text_lower = text.lower()
    
    # 1. Extract Invoice Date
    # Patterns: DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
    date_patterns = [
        r'\b(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})\b',
        r'\b(\d{2,4}[-/.]\d{1,2}[-/.]\d{1,2})\b'
    ]
    for pattern in date_patterns:
        match = re.search(pattern, text)
        if match:
            data['invoice_date'] = match.group(1)
            break
    
    # 2. Extract Invoice Number
    # Look for "Invoice No", "Bill No", "Receipt No" followed by alphanumeric
    invoice_patterns = [
        r'invoice\s*(?:no|number|#)\s*:?\s*([A-Z0-9-]+)',
        r'bill\s*(?:no|number|#)\s*:?\s*([A-Z0-9-]+)',
        r'receipt\s*(?:no|number)\s*:?\s*([A-Z0-9-]+)'
    ]
    for pattern in invoice_patterns:
        match = re.search(pattern, text_lower)
        if match:
            data['invoice_number'] = match.group(1).upper()
            break
    
    # 3. Extract Serial Number
    serial_patterns = [
        r's\.?n\.?\s*:?\s*([A-Z0-9]+)',
        r'serial\s*(?:no|number)\s*:?\s*([A-Z0-9]+)',
        r'serial\s*#\s*:?\s*([A-Z0-9]+)'
    ]
    for pattern in serial_patterns:
        match = re.search(pattern, text_lower)
        if match:
            data['serial_number'] = match.group(1).upper()
            break
    
    # 4. Extract Model Number
    model_patterns = [
        r'model\s*(?:no|number)?\s*:?\s*([A-Z0-9-]+)',
        r'model\s*:?\s*([A-Z0-9-]+)'
    ]
    for pattern in model_patterns:
        match = re.search(pattern, text_lower)
        if match:
            data['model_number'] = match.group(1).upper()
            break
    
    # 5. Extract Price/Amount
    price_patterns = [
        r'(?:total|amount|price)\s*:?\s*₹?\s*(\d+(?:,\d+)*(?:\.\d{2})?)',
        r'₹\s*(\d+(?:,\d+)*(?:\.\d{2})?)',
        r'rs\.?\s*(\d+(?:,\d+)*(?:\.\d{2})?)'
    ]
    for pattern in price_patterns:
        match = re.search(pattern, text_lower)
        if match:
            data['asset_price'] = match.group(1)
            break
    
    # 6. Extract Warranty Period
    warranty_patterns = [
        r'warranty\s*:?\s*(\d+)\s*(month|year|months|years)',
        r'(\d+)\s*(month|year|months|years)\s*warranty'
    ]
    for pattern in warranty_patterns:
        match = re.search(pattern, text_lower)
        if match:
            data['warranty_period'] = f"{match.group(1)} {match.group(2)}"
            break
    
    # 7. Extract Payment Method
    payment_keywords = ['cash', 'card', 'credit card', 'debit card', 'upi', 'online', 'net banking']
    for keyword in payment_keywords:
        if keyword in text_lower:
            data['payment_method'] = keyword.title()
            break
    
    # 8. Extract Merchant/Store Name
    # Look for lines formatted like "* STORE NAME *"
    lines = text.split('\n')
    for line in lines[:10]:  # Check first 10 lines
        stripped = line.strip()
        if stripped.startswith('*') and stripped.endswith('*') and len(stripped) > 4:
            # Remove asterisks and extra spaces
            merchant = stripped.strip('*').strip()
            if merchant and len(merchant) > 2:
                data['merchant_name'] = merchant
                break
    
    # 9. Extract Product Name
    # Look for keywords like "Product", "Item", "Description"
    product_patterns = [
        r'product\s*(?:name)?\s*:?\s*([^\n]+)',
        r'item\s*(?:name)?\s*:?\s*([^\n]+)',
        r'description\s*:?\s*([^\n]+)'
    ]
    for pattern in product_patterns:
        match = re.search(pattern, text_lower)
        if match:
            # Get original case from text
            start = match.start(1)
            end = match.end(1)
            data['product_name'] = text[start:end].strip()
            break
    
    return data

def main():
    if len(sys.argv) < 2:
        error_response = {"error": "No image path provided"}
        print(json.dumps(error_response))
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    try:
        # Open the image
        img = Image.open(image_path)
        
        # Resize to increase resolution (double size)
        img = img.resize((img.width * 2, img.height * 2), Image.LANCZOS)
        
        # Convert to grayscale for better OCR
        img = img.convert('L')
        
        # Apply a filter to enhance contrast
        img = img.filter(ImageFilter.MedianFilter())
        
        # Use pytesseract with configuration for better text extraction
        custom_config = r'--oem 3 --psm 3'
        text = pytesseract.image_to_string(img, config=custom_config)
        
        # Filter out separator lines (lines consisting only of asterisks)
        lines = text.split('\n')
        filtered_lines = [line for line in lines if not re.match(r'^[*]+$', line.strip())]
        filtered_text = '\n'.join(filtered_lines)
        
        # Extract warranty details
        extracted_data = extract_warranty_details(filtered_text)
        
        # Output as JSON
        print(json.dumps(extracted_data))
        sys.exit(0)
        
    except FileNotFoundError:
        error_response = {"error": f"Image file not found: {image_path}"}
        print(json.dumps(error_response))
        sys.exit(1)
    except Exception as e:
        error_response = {"error": str(e)}
        print(json.dumps(error_response))
        sys.exit(1)

if __name__ == "__main__":
    main()
