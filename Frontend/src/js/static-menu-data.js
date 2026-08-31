/**
 * ================================================================
 * STATIC MENU ITEMS WITH IMAGE PATHS
 * ================================================================
 * Complete menu with all 24 menu items and correct image paths
 * Image paths are relative to Frontend/public/ directory
 */

export const COMPLETE_MENU_ITEMS = [
  // BREAKFAST - 6 items
  {
    id: 1,
    name: { en: "Pasta with Bread", am: "ፓስታ በዳቦ" },
    category: "breakfast",
    price: 75,
    image: "/assets/images/food/breakfast/pasta-with-bread.jpg",
    description: { en: "Pasta served with fresh bread", am: "ፓስታ ከትኩስ ዳቦ ጋር" },
    availability: true
  },
  {
    id: 2,
    name: { en: "Pasta with Injera", am: "ፓስታ በእንጀራ" },
    category: "breakfast",
    price: 80,
    image: "/assets/images/food/breakfast/pasta-with-injera.jpg",
    description: { en: "Pasta with traditional injera", am: "ፓስታ ከባህላዊ እንጀራ ጋር" },
    availability: true
  },
  {
    id: 3,
    name: { en: "Firfir", am: "ፍርፍር" },
    category: "breakfast",
    price: 70,
    image: "/assets/images/food/breakfast/firfir.jpeg",
    description: { en: "Spiced torn injera with berbere sauce", am: "በርበሬ ወጥ የተጣለ እንጀራ" },
    availability: true
  },
  {
    id: 4,
    name: { en: "Scrambled Eggs", am: "እንቁላል ፍርፍር" },
    category: "breakfast",
    price: 90,
    image: "/assets/images/food/breakfast/scrambled-egg.jpeg",
    description: { en: "Fluffy scrambled eggs with butter", am: "ለስላሳ የተፈጨ እንቁላል በቅቤ" },
    availability: true
  },
  {
    id: 5,
    name: { en: "Omelette", am: "እንቁላል ስልስ" },
    category: "breakfast",
    price: 90,
    image: "/assets/images/food/breakfast/omelett(Enkulal sils).jpeg",
    description: { en: "Omelette with vegetables and cheese", am: "እንቁላል ስልስ በአትክልት እና አይብ" },
    availability: true
  },
  {
    id: 6,
    name: { en: "Egg", am: "እንቁላል" },
    category: "breakfast",
    price: 80,
    image: "/assets/images/food/breakfast/scrambled-egg.jpeg",
    description: { en: "Fried or boiled egg served with bread", am: "የተጠበሰ ወይም የተቀቀለ እንቁላል ከዳቦ ጋር" },
    availability: true
  },

  // MAIN MEALS - 9 items
  {
    id: 7,
    name: { en: "Pasta with Vegetables", am: "ፓስታ በአትክልት" },
    category: "main-meals",
    price: 75,
    image: "/assets/images/food/main-meals/pasta-with-vegetables.jpeg",
    description: { en: "Pasta with fresh mixed vegetables", am: "ፓስታ ከትኩስ አትክልት ጋር" },
    availability: true
  },
  {
    id: 8,
    name: { en: "Shiro Feses", am: "ሽሮ ፈሰስ" },
    category: "main-meals",
    price: 75,
    image: "/assets/images/food/main-meals/shiro-feses.jpg",
    description: { en: "Traditional chickpea stew with spices", am: "ባህላዊ ሽሮ በቅመማ ቅመም" },
    availability: true
  },
  {
    id: 9,
    name: { en: "Tomato Sauce", am: "ቲማቲም ስልስ" },
    category: "main-meals",
    price: 70,
    image: "/assets/images/food/main-meals/tomato-sauce.jpeg",
    description: { en: "Rich tomato sauce with spices", am: "የበለጸገ ቲማቲም ስልስ በቅመማ ቅመም" },
    availability: true
  },
  {
    id: 10,
    name: { en: "Cheese with Butter", am: "አይብ በቅቤ" },
    category: "main-meals",
    price: 100,
    image: "/assets/images/food/main-meals/cheese-with-butter.jpeg",
    description: { en: "Fresh cheese served with butter and bread", am: "ትኩስ አይብ ከቅቤ እና ዳቦ ጋር" },
    availability: true
  },
  {
    id: 11,
    name: { en: "Red Stew", am: "ቀይ ወጥ" },
    category: "main-meals",
    price: 180,
    image: "/assets/images/food/main-meals/red-stew.jpeg",
    description: { en: "Spicy beef stew with berbere sauce", am: "ቅመማ ቅመም የበርበሬ ወጥ" },
    availability: true
  },
  {
    id: 12,
    name: { en: "Grilled Meat", am: "የስጋ ጥብስ" },
    category: "main-meals",
    price: 250,
    image: "/assets/images/food/main-meals/grilled-meat.jpeg",
    description: { en: "Grilled meat served with vegetables", am: "የተጠበሰ ስጋ ከአትክልት ጋር" },
    availability: true
  },
  {
    id: 13,
    name: { en: "Egg with Meat", am: "እንቁላል በስጋ" },
    category: "main-meals",
    price: 180,
    image: "/assets/images/food/main-meals/egg-with-meat.jpg",
    description: { en: "Egg served with meat stew", am: "እንቁላል ከስጋ ወጥ ጋር" },
    availability: true
  },
  {
    id: 14,
    name: { en: "Cabbage with Meat", am: "ጎመን በስጋ" },
    category: "main-meals",
    price: 160,
    image: "/assets/images/food/main-meals/cabbage-with-meat.jpeg",
    description: { en: "Cabbage cooked with meat and spices", am: "ጎመን ከስጋ እና ቅመም ጋር" },
    availability: true
  },
  {
    id: 15,
    name: { en: "Vegetables with Meat", am: "አትክልት በስጋ" },
    category: "main-meals",
    price: 160,
    image: "/assets/images/food/main-meals/vegetables-with-meat.jpeg",
    description: { en: "Mixed vegetables cooked with meat", am: "የተቀላቀለ አትክልት ከስጋ ጋር" },
    availability: true
  },

  // FASTING MEALS - 4 items
  {
    id: 16,
    name: { en: "Lentil Stew", am: "ምስር ወጥ" },
    category: "fasting",
    price: 80,
    image: "/assets/images/food/fasting/lentil-stew.jpeg",
    description: { en: "Traditional lentil stew with spices", am: "ባህላዊ ምስር ወጥ በቅመማ ቅመም" },
    availability: true
  },
  {
    id: 17,
    name: { en: "Ful with Bread", am: "ፉል ከዳቦ" },
    category: "fasting",
    price: 80,
    image: "/assets/images/food/fasting/ful-with-bread.jpg",
    description: { en: "Fasting ful served with bread", am: "የጾም ፉል ከዳቦ ጋር" },
    availability: true
  },
  {
    id: 18,
    name: { en: "Fasting Sandwich", am: "የጾም ሳንዱች" },
    category: "fasting",
    price: 50,
    image: "/assets/images/food/fasting/ful with Bread (Fasting).jpg",
    description: { en: "Vegetarian sandwich with vegetables", am: "የአትክልት ሳንዱች" },
    availability: true
  },
  {
    id: 19,
    name: { en: "Mixed Fasting", am: "በየዓይነት" },
    category: "fasting",
    price: 80,
    image: "/assets/images/food/fasting/mixed-fasting(yetsom Beyaynet).jpeg",
    description: { en: "Mixed fasting meal with 5 items", am: "የተለያዩ 5 የጾም ምግቦች" },
    availability: true
  },

  // BEVERAGES - 3 items
  {
    id: 20,
    name: { en: "Juice", am: "ጁስ" },
    category: "beverages",
    price: 55,
    image: "/assets/images/food/beverages/juice.jpeg",
    description: { en: "Fresh fruit juice", am: "ትኩስ የፍራፍሬ ጭማቂ" },
    availability: true
  },
  {
    id: 21,
    name: { en: "Water", am: "ውሃ" },
    category: "beverages",
    price: 30,
    image: "/assets/images/food/beverages/water.jpeg",
    description: { en: "Bottled water", am: "የታሸገ ውሃ" },
    availability: true
  },
  {
    id: 22,
    name: { en: "Soft Drink", am: "ለስላሳ" },
    category: "beverages",
    price: 70,
    image: "/assets/images/food/beverages/soft-drink.jpeg",
    description: { en: "Carbonated soft drink", am: "የካርቦን ለስላሳ መጠጥ" },
    availability: true
  },

  // SNACKS - 2 items
  {
    id: 23,
    name: { en: "Avocado with Injera", am: "አቮካዶ በእንጀራ" },
    category: "snacks",
    price: 85,
    image: "/assets/images/food/snacks/Avocado with injera.jpg",
    description: { en: "Fresh avocado served with injera", am: "ትኩስ አቮካዶ ከእንጀራ ጋር" },
    availability: true
  },
  {
    id: 24,
    name: { en: "Meat Sandwich", am: "የስጋ ሳንዱች" },
    category: "snacks",
    price: 100,
    image: "/assets/images/food/snacks/meat-sandwich.jpg",
    description: { en: "Sandwich with grilled meat and vegetables", am: "ሳንዱች ከተጠበሰ ስጋ እና አትክልት ጋር" },
    availability: true
  }
];
