package com.warrantywalket.service;

import org.springframework.stereotype.Service;

@Service
public class CategoryService {

    public String categorize(String productName, String merchantName) {
        String combined = ((productName != null ? productName : "") + " " + (merchantName != null ? merchantName : "")).toLowerCase();

        // Electronics — checked first so "smartwatch" beats "watch" in Jewellery
        if (containsAny(combined,
                "phone", "smartphone", "laptop", "macbook", "tablet", "ipad",
                "computer", "desktop", "monitor", "tv", "television", "camera",
                "gaming", "console", "playstation", "xbox", "nintendo",
                "speaker", "headphone", "earphone", "airpod", "earbuds",
                "smartwatch", "drone", "projector", "printer", "router", "modem",
                "keyboard", "mouse", "graphics card", "gpu", "cpu", "ssd", "ram",
                "hard drive", "ups", "power bank", "charger", "scanner", "webcam")) {
            return "Electronics";
        }

        // Home Appliances
        if (containsAny(combined,
                "refrigerator", "fridge", "washing machine", "washer", "dryer",
                "dishwasher", "air conditioner", "heater", "geyser",
                "water heater", "vacuum cleaner", "iron", "water purifier",
                "air purifier")) {
            return "Home Appliances";
        }

        // Check "ac" carefully — only as standalone word to avoid false matches
        if (containsWord(combined, "ac")) {
            return "Home Appliances";
        }

        // Kitchen Appliances
        if (containsAny(combined,
                "microwave", "oven", "blender", "mixer", "juicer", "toaster",
                "coffee maker", "kettle", "induction cooktop", "cooker",
                "pressure cooker", "chimney", "exhaust fan", "food processor")) {
            return "Kitchen Appliances";
        }

        // Furniture
        if (containsAny(combined,
                "sofa", "couch", "chair", "table", "bed", "wardrobe", "desk",
                "shelf", "cabinet", "drawer", "mattress", "bookcase",
                "recliner", "ottoman", "bench")) {
            return "Furniture";
        }

        // Automotive — "battery" only when paired with automotive context
        if (containsAny(combined,
                "car", "bike", "motorcycle", "scooter", "tire", "tyre",
                "gps", "dash cam", "helmet")) {
            return "Automotive";
        }
        if (containsAny(combined, "battery") &&
                containsAny(combined, "car", "bike", "motorcycle", "scooter", "vehicle", "auto")) {
            return "Automotive";
        }

        // Tools & Hardware
        if (containsAny(combined,
                "drill", "saw", "hammer", "screwdriver", "wrench",
                "power tool", "grinder", "compressor", "generator")) {
            return "Tools & Hardware";
        }

        // Sports & Fitness
        if (containsAny(combined,
                "treadmill", "gym", "dumbbell", "bicycle", "cycle", "yoga",
                "fitness", "sports", "cricket bat", "football", "racket")) {
            return "Sports & Fitness";
        }

        // Jewellery & Watches — "watch" only when NOT paired with "smart"
        if (containsAny(combined,
                "ring", "necklace", "bracelet", "earring", "pendant", "chain",
                "gold", "silver", "diamond")) {
            return "Jewellery & Watches";
        }
        if (containsAny(combined, "watch") && !containsAny(combined, "smart", "smartwatch")) {
            return "Jewellery & Watches";
        }

        // Clothing & Footwear
        if (containsAny(combined,
                "shoes", "sneakers", "boots", "sandals", "shirt", "jacket",
                "coat", "bag", "backpack", "luggage", "handbag")) {
            return "Clothing & Footwear";
        }

        return "Other";
    }

    /**
     * Returns true if the text contains any of the given keywords as substrings.
     */
    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns true if the text contains the given word surrounded by word boundaries.
     * Used for short tokens like "ac" that could appear inside other words.
     */
    private boolean containsWord(String text, String word) {
        return text.matches("(?i).*\\b" + java.util.regex.Pattern.quote(word) + "\\b.*");
    }
}
