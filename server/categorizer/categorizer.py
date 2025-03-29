import pandas as pd

CUSTOM_CATEGORIES = [
    "food and drink", "groceries", "utilities", "travel", 
    "entertainment", "health", "shopping", "education", 
    "personal care", "other"
]

def categorize_transactions(file_path, output_path='data/categorized_transactions.csv'):
    transactions = pd.read_csv(file_path)
    transactions['category_functional'] = transactions.apply(
        lambda row: categorize_by_merchant(row['merchant_name']), axis=1)
    
    transactions.to_csv(output_path, index=True)
    return transactions

def categorize_by_merchant(merchant):
    if not merchant or pd.isna(merchant):
        return "other"
        
    merchant = str(merchant).lower()
    
    food_drink_merchants = [
        "restaurant", "mcdonald", "taco", "chipotle", "starbucks", "burger", 
        "pizza", "subway", "wendy", "kfc", "popeyes", "panera", "dunkin", 
        "domino", "ihop", "applebee", "chili", "olive garden", "outback", 
        "cheesecake factory", "denny", "buffalo wild", "panda express", 
        "dairy queen", "arby", "sonic", "chick-fil-a", "jack in the box", 
        "hardee", "five guys", "jimmy john", "little caesar", "shake shack", 
        "in-n-out", "whataburger", "doordash", "ubereats", "grubhub", 
        "postmates", "seamless", "bar", "pub", "grill", "cafe", "coffee", 
        "bakery", "deli", "bbq", "sushi", "thai", "chinese", "mexican", "italian"
    ]
    
    grocery_merchants = [
        "whole foods", "trader joe", "safeway", "kroger", "publix", "albertsons", 
        "aldi", "walmart grocery", "costco", "sam's club", "wegmans", "food lion", 
        "giant", "stop & shop", "heb", "meijer", "winn-dixie", "market basket", 
        "sprouts", "fresh market", "vons", "harris teeter", "shoprite", "ralphs", 
        "save-a-lot", "food4less", "winco", "pathmark", "jewel-osco", "acme", 
        "smiths", "king soopers", "lucky", "price chopper", "food mart", "supermarket",
        "grocery", "farmers market", "butcher", "bakery", "deli counter"
    ]
    
    utility_merchants = [
        "comcast", "xfinity", "verizon", "at&t", "pg&e", "electric", "water", "gas", 
        "sewer", "waste", "power", "utility", "telecom", "internet", "cable", "dish", 
        "directv", "sprint", "t-mobile", "spectrum", "cox", "consolidated", "duke energy", 
        "dominion energy", "edison", "water bill", "gas bill", "electric bill", 
        "phone bill", "internet bill", "cable bill", "utility bill", "southern company",
        "constellation", "exelon", "sempra", "centerpoint", "eversource", "entergy",
        "ameren", "firstenergy", "pseg", "nationalgrid", "wireless"
    ]
    
    travel_merchants = [
        "airline", "delta", "united", "american airlines", "southwest", "jetblue", 
        "frontier", "spirit", "alaska air", "british airways", "lufthansa", "air france", 
        "emirates", "hotel", "marriott", "hilton", "hyatt", "westin", "sheraton", 
        "holiday inn", "best western", "motel", "airbnb", "vrbo", "car rental", "hertz", 
        "avis", "enterprise", "national", "budget", "alamo", "gas", "shell", "chevron", 
        "exxon", "mobil", "bp", "valero", "marathon", "sunoco", "76", "texaco", "conoco", 
        "phillips", "pilot", "flying j", "love's", "uber", "lyft", "taxi", "cab", "shuttle", 
        "train", "rail", "amtrak", "metro", "bus", "subway", "transit", "cruise", "carnival", 
        "royal caribbean", "norwegian", "booking.com", "expedia", "kayak", "priceline", 
        "travelocity", "hotwire", "tripadvisor", "hostel", "parking"
    ]
    
    entertainment_merchants = [
        "netflix", "hulu", "spotify", "pandora", "apple music", "amazon prime video", 
        "disney+", "hbo", "showtime", "starz", "peacock", "paramount+", "espn+", 
        "discovery+", "youtube premium", "tidal", "deezer", "amazon music", "amc", 
        "regal", "cinemark", "alamo drafthouse", "movie", "theatre", "theater", "concert", 
        "ticketmaster", "livenation", "stubhub", "seatgeek", "eventbrite", "ticket", 
        "playstation", "xbox", "nintendo", "steam", "epic games", "ea", "blizzard", 
        "riot games", "twitch", "nintendo", "activision", "ubisoft", "gamestop", 
        "museum", "theme park", "disney", "universal", "six flags", "seaworld", 
        "aquarium", "zoo", "bowling", "arcade", "miniature golf", "laser tag", 
        "escape room", "carnival", "casino"
    ]
    
    health_merchants = [
        "pharmacy", "cvs", "walgreens", "rite aid", "duane reade", "boots", "rexall", 
        "hospital", "clinic", "doctor", "physician", "dentist", "orthodontist", 
        "chiropractor", "optometrist", "therapy", "laboratory", "lab", "wellness", 
        "healthcare", "medical", "health", "urgent care", "emergency", "specialist", 
        "radiology", "imaging", "diagnostic", "prescription", "rx", "medicine", "care", 
        "fitness", "gym", "planet fitness", "24 hour fitness", "la fitness", "anytime fitness", 
        "equinox", "crunch", "lifetime", "yoga", "pilates", "crossfit", "supplements", 
        "vitamin", "gnc", "vitamin shoppe", "supplement", "optical", "eyeglasses", 
        "contacts", "massage", "physical therapy", "mental health", "counseling"
    ]
    
    shopping_merchants = [
        "amazon", "target", "walmart", "best buy", "ebay", "etsy", "macy", "nordstrom", 
        "kohl", "lowe", "home depot", "ikea", "wayfair", "overstock", "newegg", "apple store", 
        "microsoft", "dell", "hp", "costco", "sam's club", "bj's", "tj maxx", "marshalls", 
        "ross", "burlington", "dollar", "family dollar", "dollar general", "five below", 
        "hobby lobby", "michaels", "joann", "petsmart", "petco", "staples", "office depot", 
        "barnes & noble", "bed bath & beyond", "crate & barrel", "williams sonoma", "pottery barn", 
        "pier 1", "gap", "old navy", "banana republic", "h&m", "zara", "forever 21", "uniqlo", 
        "american eagle", "hollister", "abercrombie", "victoria's secret", "nike", "adidas", 
        "under armour", "puma", "reebok", "footlocker", "journeys", "dsw", "payless", 
        "the north face", "patagonia", "columbia", "rei", "dick's", "academy", "bass pro", 
        "cabela's", "gamestop", "thrift store", "goodwill", "salvation army", "mall", "outlet"
    ]
    
    education_merchants = [
        "coursera", "udemy", "linkedin learning", "masterclass", "skillshare", "edx", 
        "pluralsight", "khan academy", "brilliant", "duolingo", "rosetta stone", 
        "university", "college", "school", "campus", "educational", "tuition", 
        "textbook", "course", "class", "workshop", "seminar", "training", "education", 
        "academic", "student", "scholarship", "degree", "certificate", "chegg", 
        "pearson", "mcgraw", "wiley", "cengage", "bookstore", "academy", "institute", 
        "learning", "study", "teachable", "tutorial", "lecture", "lesson", "test prep", 
        "sat", "act", "gre", "gmat", "mcat", "lsat", "certification", "continuing education"
    ]
    
    personal_care_merchants = [
        "sephora", "ulta", "body shop", "lush", "bath & body works", "sally beauty", 
        "makeup", "cosmetic", "beauty", "salon", "barber", "hair", "haircut", "spa", 
        "massage", "facial", "manicure", "pedicure", "nail", "wax", "eyebrow", "tanning", 
        "laser", "dermatology", "skin care", "tatoo", "piercing", "perfume", "cologne", 
        "fragrance", "lotion", "soap", "shampoo", "conditioner", "toothpaste", "deodorant", 
        "razor", "shaving", "grooming", "stylist", "esthetician", "beauty supply", 
        "personal care", "hygiene"
    ]
    
    if any(item in merchant for item in food_drink_merchants):
        return "food and drink"
    elif any(item in merchant for item in grocery_merchants):
        return "groceries"
    elif any(item in merchant for item in utility_merchants):
        return "utilities"
    elif any(item in merchant for item in travel_merchants):
        return "travel"
    elif any(item in merchant for item in entertainment_merchants):
        return "entertainment"
    elif any(item in merchant for item in health_merchants):
        return "health"
    elif any(item in merchant for item in shopping_merchants):
        return "shopping"
    elif any(item in merchant for item in education_merchants):
        return "education"
    elif any(item in merchant for item in personal_care_merchants):
        return "personal care"
    
    return "other"

def update_category(transactions, transaction_id, new_category):
    if new_category not in CUSTOM_CATEGORIES:
        return transactions
    
    idx = transactions.index[transactions['transaction_id'] == transaction_id].tolist()
    if idx:
        transactions.at[idx[0], 'category_functional'] = new_category
    
    return transactions

if __name__ == "__main__":
    try:
        transactions = categorize_transactions('server/data/mock_data.csv', 'server/data/categorized_transactions.csv')
        
        print(f"Processed {len(transactions)} transactions")
        print(f"Saved categorized transactions to 'data/categorized_transactions.csv'")
        
        category_counts = transactions['category_functional'].value_counts()
        for category, count in category_counts.items():
            print(f"{category}: {count} transactions")
        
        sample = transactions[['transaction_id', 'merchant_name', 'amount', 'category_functional']].head(5)
        print("\nSample transactions:")
        print(sample)
        
        test_merchants = {
            "Starbucks": "food and drink",
            "Whole Foods": "groceries",
            "Netflix": "entertainment",
            "Chevron": "travel",
            "CVS Pharmacy": "health",
            "Amazon": "shopping",
            "Coursera": "education",
            "Sephora": "personal care",
            "Comcast": "utilities"
        }
        
        print("\nTesting merchant categorization:")
        for merchant, expected_category in test_merchants.items():
            category = categorize_by_merchant(merchant)
            print(f"{merchant}: Expected '{expected_category}', Got '{category}' - {'PASS' if category == expected_category else 'FAIL'}")
        
        if not transactions.empty:
            test_transaction = transactions.iloc[0]
            test_id = test_transaction['transaction_id']
            orig_category = test_transaction['category_functional']
            
            print(f"\nTesting category update for {test_id}")
            print(f"Original category: {orig_category}")
            
            test_category = "groceries" if orig_category != "groceries" else "food and drink"
            transactions = update_category(transactions, test_id, test_category)
            
            updated_category = transactions.loc[transactions['transaction_id'] == test_id, 'category_functional'].values[0]
            print(f"Updated category: {updated_category}")
            
            test_passed = updated_category == test_category
            print(f"Update test {'PASS' if test_passed else 'FAIL'}")
            
    except Exception as e:
        print(f"Error: {e}")