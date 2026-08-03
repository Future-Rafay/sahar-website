export const saharRealContent = {
  legalBusinessName: "SAHAR Restaurant",
  displayName: "SAHAR",
  address: {
    street: "Richtiplatz 3",
    postalCode: "8304",
    city: "Wallisellen",
    region: "Zurich",
    country: "Switzerland",
  },
  phone: "+41 44 883 70 00",
  email: "info@sahar.ch",
  domain: "sahar.ch",
  cuisine: "Persian (Iranian)",
  serviceTypes: ["Dine-in", "Takeaway", "Delivery"],
  openingHours: {
    mondayToFriday: "11:00-22:00",
    saturday: "12:00-22:00",
    sunday: "Closed",
    holidayNote: "May vary on holidays.",
  },
  instagram: "https://www.instagram.com/saharzurich",
  logo: "/brand/sahar-logo.png",
} as const;

// MOCK - replace with real client data
export const saharMockCopy = {
  marker: " Draft pending client wording approval.",
  heroTitleDe: " Persische Küche, im Herzen von Wallisellen",
  heroTitleEn: " Persian cuisine in the heart of Wallisellen",
  heroSubtitleDe:
    " Entdecken Sie aromatische Reisgerichte, Grillklassiker und persische Gastfreundschaft bei SAHAR in Zürich.",
  heroSubtitleEn:
    " Discover fragrant rice dishes, grilled classics, and Persian hospitality at SAHAR in Zurich.",
  aboutDe:
    " SAHAR bringt die Aromen der persischen Küche nach Wallisellen. Unsere vorläufige Auswahl verbindet duftenden Safranreis, langsam gekochte Schmorgerichte und Grillgerichte, die zum gemeinsamen Geniessen gedacht sind.",
  aboutEn:
    " SAHAR brings the flavours of Persian cuisine to Wallisellen. Our provisional selection brings together fragrant saffron rice, slow-cooked stews, and grilled dishes made for sharing.",
} as const;

// MOCK - replace with real client data
export const saharMockVat = {
  marker: " Legal confirmation required before production.",
  vatRegistered: false,
  vatNumber: null,
} as const;

// MOCK - replace with real client data
export const saharMockDeliveryZones = [
  {
    nameDe: " Wallisellen",
    nameEn: " Wallisellen",
    postalCodes: [" 8304"],
    deliveryFee: " CHF 4.90",
    minimumOrder: " CHF 25.00",
  },
  {
    nameDe: " Glattpark & Opfikon",
    nameEn: " Glattpark & Opfikon",
    postalCodes: [" 8152", " 8153"],
    deliveryFee: " CHF 6.90",
    minimumOrder: " CHF 35.00",
  },
  {
    nameDe: " Zürich Nord",
    nameEn: " Zurich North",
    postalCodes: [" 8050", " 8051", " 8052", " 8057"],
    deliveryFee: " CHF 8.90",
    minimumOrder: " CHF 45.00",
  },
] as const;

// MOCK - replace with real client data
export const saharMockPhotography = [
  {
    use: " Hero and kebabs",
    file: "/images/placeholders/persian-kebab.jpg",
    source: "https://www.pexels.com/photo/top-view-of-food-on-blue-and-white-ceramic-plate-14731644/",
    credit: " Temporary Pexels photograph by Shameel Mukkath",
  },
  {
    use: " Rice dishes",
    file: "/images/placeholders/saffron-rice.jpg",
    source: "https://www.pexels.com/photo/yellow-dish-on-white-ceramic-plate-3996159/",
    credit: " Temporary Pexels photograph by Amin Sani",
  },
  {
    use: " Stews",
    file: "/images/placeholders/gheimeh-tahdig.jpg",
    source: "https://www.pexels.com/photo/traditional-persian-gheimeh-and-tahdig-dish-28792830/",
    credit: " Temporary Pexels photograph by Ahmad Taba",
  },
  {
    use: " Desserts",
    file: "/images/placeholders/sholeh-zard.jpg",
    source: "https://www.pexels.com/photo/traditional-iranian-rice-pudding-dessert-17693553/",
    credit: " Temporary Pexels photograph by Helia Ghaharian",
  },
  {
    use: " Drinks",
    file: "/images/placeholders/persian-tea.jpg",
    source: "https://www.pexels.com/photo/persian-tea-15028365/",
    credit: " Temporary Pexels photograph by Behnam Ramezani",
  },
] as const;

// MOCK - replace with real client data
export const saharMockMenu = [
  {
    categoryDe: " Vorspeisen",
    categoryEn: " Starters",
    nameDe: " Mast-o Khiar",
    nameEn: " Mast-o Khiar",
    descriptionDe: " Joghurt mit Gurke, Minze und getrockneten Kräutern.",
    descriptionEn: " Yogurt with cucumber, mint, and dried herbs.",
    price: " CHF 8.50",
  },
  {
    categoryDe: " Vorspeisen",
    categoryEn: " Starters",
    nameDe: " Mirza Ghasemi",
    nameEn: " Mirza Ghasemi",
    descriptionDe: " Geräucherte Aubergine mit Tomate, Knoblauch und Ei.",
    descriptionEn: " Smoked aubergine with tomato, garlic, and egg.",
    price: " CHF 11.50",
  },
  {
    categoryDe: " Vorspeisen",
    categoryEn: " Starters",
    nameDe: " Kashk-e Bademjan",
    nameEn: " Kashk-e Bademjan",
    descriptionDe: " Gebratene Aubergine mit Kashk, Minze und Röstzwiebeln.",
    descriptionEn: " Fried aubergine with kashk, mint, and crispy onions.",
    price: " CHF 12.50",
  },
  {
    categoryDe: " Kebabs & Grill",
    categoryEn: " Kebabs & Grills",
    nameDe: " Kabab Koobideh",
    nameEn: " Kabab Koobideh",
    descriptionDe: " Zwei Hackfleischspiesse mit Safranreis und Grilltomate.",
    descriptionEn: " Two minced beef skewers with saffron rice and grilled tomato.",
    price: " CHF 27.50",
  },
  {
    categoryDe: " Kebabs & Grill",
    categoryEn: " Kebabs & Grills",
    nameDe: " Jujeh Kabab",
    nameEn: " Jujeh Kabab",
    descriptionDe: " Safran-Zitronen-Hähnchenspiess mit Reis und Grilltomate.",
    descriptionEn: " Saffron and lemon chicken skewer with rice and grilled tomato.",
    price: " CHF 29.00",
  },
  {
    categoryDe: " Kebabs & Grill",
    categoryEn: " Kebabs & Grills",
    nameDe: " Kabab Barg",
    nameEn: " Kabab Barg",
    descriptionDe: " Marinierter Rindfleischspiess mit Safranreis und Sumach.",
    descriptionEn: " Marinated beef fillet skewer with saffron rice and sumac.",
    price: " CHF 36.00",
  },
  {
    categoryDe: " Reisgerichte (Polow)",
    categoryEn: " Rice Dishes (Polow)",
    nameDe: " Zereshk Polow ba Morgh",
    nameEn: " Zereshk Polow with Chicken",
    descriptionDe: " Safranreis mit Berberitzen und geschmortem Hähnchen.",
    descriptionEn: " Saffron rice with barberries and braised chicken.",
    price: " CHF 28.50",
  },
  {
    categoryDe: " Reisgerichte (Polow)",
    categoryEn: " Rice Dishes (Polow)",
    nameDe: " Baghali Polow ba Mahicheh",
    nameEn: " Baghali Polow with Lamb Shank",
    descriptionDe: " Dill-Bohnen-Reis mit langsam geschmorter Lammhaxe.",
    descriptionEn: " Dill and broad bean rice with slow-braised lamb shank.",
    price: " CHF 34.50",
  },
  {
    categoryDe: " Reisgerichte (Polow)",
    categoryEn: " Rice Dishes (Polow)",
    nameDe: " Adas Polow",
    nameEn: " Adas Polow",
    descriptionDe: " Gewürzter Reis mit Linsen, Rosinen und Röstzwiebeln.",
    descriptionEn: " Spiced rice with lentils, raisins, and crispy onions.",
    price: " CHF 22.00",
  },
  {
    categoryDe: " Schmorgerichte (Khoresht)",
    categoryEn: " Stews (Khoresht)",
    nameDe: " Ghormeh Sabzi",
    nameEn: " Ghormeh Sabzi",
    descriptionDe: " Kräuterschmorgericht mit Bohnen, getrockneter Limette und Rindfleisch, dazu Reis.",
    descriptionEn: " Herb stew with beans, dried lime, and beef, served with rice.",
    price: " CHF 27.00",
  },
  {
    categoryDe: " Schmorgerichte (Khoresht)",
    categoryEn: " Stews (Khoresht)",
    nameDe: " Khoresht-e Gheimeh",
    nameEn: " Khoresht-e Gheimeh",
    descriptionDe: " Tomatenschmorgericht mit gelben Spalterbsen, Rindfleisch und Kartoffelstiften.",
    descriptionEn: " Tomato stew with yellow split peas, beef, and crisp potato sticks.",
    price: " CHF 26.50",
  },
  {
    categoryDe: " Schmorgerichte (Khoresht)",
    categoryEn: " Stews (Khoresht)",
    nameDe: " Fesenjan",
    nameEn: " Fesenjan",
    descriptionDe: " Hähnchen in Walnuss-Granatapfel-Sauce, dazu Safranreis.",
    descriptionEn: " Chicken in walnut and pomegranate sauce, served with saffron rice.",
    price: " CHF 29.50",
  },
  {
    categoryDe: " Vegetarisch",
    categoryEn: " Vegetarian",
    nameDe: " Kuku Sabzi",
    nameEn: " Kuku Sabzi",
    descriptionDe: " Persische Kräuterfrittata mit Walnüssen und Berberitzen.",
    descriptionEn: " Persian herb frittata with walnuts and barberries.",
    price: " CHF 19.50",
  },
  {
    categoryDe: " Vegetarisch",
    categoryEn: " Vegetarian",
    nameDe: " Lubia Polow-e Sabz",
    nameEn: " Vegetarian Lubia Polow",
    descriptionDe: " Gewürzter Reis mit grünen Bohnen, Tomate und Safran.",
    descriptionEn: " Spiced rice with green beans, tomato, and saffron.",
    price: " CHF 21.50",
  },
  {
    categoryDe: " Desserts",
    categoryEn: " Desserts",
    nameDe: " Sholeh Zard",
    nameEn: " Sholeh Zard",
    descriptionDe: " Persischer Safran-Reispudding mit Zimt und Mandeln.",
    descriptionEn: " Persian saffron rice pudding with cinnamon and almonds.",
    price: " CHF 8.50",
  },
  {
    categoryDe: " Desserts",
    categoryEn: " Desserts",
    nameDe: " Bastani Sonnati",
    nameEn: " Bastani Sonnati",
    descriptionDe: " Persisches Safraneis mit Rosenwasser und Pistazien.",
    descriptionEn: " Persian saffron ice cream with rosewater and pistachios.",
    price: " CHF 9.50",
  },
  {
    categoryDe: " Getränke",
    categoryEn: " Drinks",
    nameDe: " Persischer Schwarztee",
    nameEn: " Persian Black Tea",
    descriptionDe: " Traditionell aufgebrühter Schwarztee, serviert im Glas.",
    descriptionEn: " Traditionally brewed black tea served in a glass.",
    price: " CHF 4.50",
  },
  {
    categoryDe: " Getränke",
    categoryEn: " Drinks",
    nameDe: " Doogh",
    nameEn: " Doogh",
    descriptionDe: " Gekühltes Joghurtgetränk mit Minze.",
    descriptionEn: " Chilled yogurt drink with mint.",
    price: " CHF 5.50",
  },
] as const;
