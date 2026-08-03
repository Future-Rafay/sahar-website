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
  marker: "MOCK: Draft pending client wording approval.",
  heroTitleDe: "MOCK: Persische Küche, im Herzen von Wallisellen",
  heroTitleEn: "MOCK: Persian cuisine in the heart of Wallisellen",
  heroSubtitleDe:
    "MOCK: Entdecken Sie aromatische Reisgerichte, Grillklassiker und persische Gastfreundschaft bei SAHAR in Zürich.",
  heroSubtitleEn:
    "MOCK: Discover fragrant rice dishes, grilled classics, and Persian hospitality at SAHAR in Zurich.",
  aboutDe:
    "MOCK: SAHAR bringt die Aromen der persischen Küche nach Wallisellen. Unsere vorläufige Auswahl verbindet duftenden Safranreis, langsam gekochte Schmorgerichte und Grillgerichte, die zum gemeinsamen Geniessen gedacht sind.",
  aboutEn:
    "MOCK: SAHAR brings the flavours of Persian cuisine to Wallisellen. Our provisional selection brings together fragrant saffron rice, slow-cooked stews, and grilled dishes made for sharing.",
} as const;

// MOCK - replace with real client data
export const saharMockVat = {
  marker: "MOCK: Legal confirmation required before production.",
  vatRegistered: false,
  vatNumber: null,
} as const;

// MOCK - replace with real client data
export const saharMockDeliveryZones = [
  {
    nameDe: "MOCK: Wallisellen",
    nameEn: "MOCK: Wallisellen",
    postalCodes: ["MOCK: 8304"],
    deliveryFee: "MOCK: CHF 4.90",
    minimumOrder: "MOCK: CHF 25.00",
  },
  {
    nameDe: "MOCK: Glattpark & Opfikon",
    nameEn: "MOCK: Glattpark & Opfikon",
    postalCodes: ["MOCK: 8152", "MOCK: 8153"],
    deliveryFee: "MOCK: CHF 6.90",
    minimumOrder: "MOCK: CHF 35.00",
  },
  {
    nameDe: "MOCK: Zürich Nord",
    nameEn: "MOCK: Zurich North",
    postalCodes: ["MOCK: 8050", "MOCK: 8051", "MOCK: 8052", "MOCK: 8057"],
    deliveryFee: "MOCK: CHF 8.90",
    minimumOrder: "MOCK: CHF 45.00",
  },
] as const;

// MOCK - replace with real client data
export const saharMockPhotography = [
  {
    use: "MOCK: Hero and kebabs",
    file: "/images/placeholders/persian-kebab.jpg",
    source: "https://www.pexels.com/photo/top-view-of-food-on-blue-and-white-ceramic-plate-14731644/",
    credit: "MOCK: Temporary Pexels photograph by Shameel Mukkath",
  },
  {
    use: "MOCK: Rice dishes",
    file: "/images/placeholders/saffron-rice.jpg",
    source: "https://www.pexels.com/photo/yellow-dish-on-white-ceramic-plate-3996159/",
    credit: "MOCK: Temporary Pexels photograph by Amin Sani",
  },
  {
    use: "MOCK: Stews",
    file: "/images/placeholders/gheimeh-tahdig.jpg",
    source: "https://www.pexels.com/photo/traditional-persian-gheimeh-and-tahdig-dish-28792830/",
    credit: "MOCK: Temporary Pexels photograph by Ahmad Taba",
  },
  {
    use: "MOCK: Desserts",
    file: "/images/placeholders/sholeh-zard.jpg",
    source: "https://www.pexels.com/photo/traditional-iranian-rice-pudding-dessert-17693553/",
    credit: "MOCK: Temporary Pexels photograph by Helia Ghaharian",
  },
  {
    use: "MOCK: Drinks",
    file: "/images/placeholders/persian-tea.jpg",
    source: "https://www.pexels.com/photo/persian-tea-15028365/",
    credit: "MOCK: Temporary Pexels photograph by Behnam Ramezani",
  },
] as const;

// MOCK - replace with real client data
export const saharMockMenu = [
  {
    categoryDe: "MOCK: Vorspeisen",
    categoryEn: "MOCK: Starters",
    nameDe: "MOCK: Mast-o Khiar",
    nameEn: "MOCK: Mast-o Khiar",
    descriptionDe: "MOCK: Joghurt mit Gurke, Minze und getrockneten Kräutern.",
    descriptionEn: "MOCK: Yogurt with cucumber, mint, and dried herbs.",
    price: "MOCK: CHF 8.50",
  },
  {
    categoryDe: "MOCK: Vorspeisen",
    categoryEn: "MOCK: Starters",
    nameDe: "MOCK: Mirza Ghasemi",
    nameEn: "MOCK: Mirza Ghasemi",
    descriptionDe: "MOCK: Geräucherte Aubergine mit Tomate, Knoblauch und Ei.",
    descriptionEn: "MOCK: Smoked aubergine with tomato, garlic, and egg.",
    price: "MOCK: CHF 11.50",
  },
  {
    categoryDe: "MOCK: Vorspeisen",
    categoryEn: "MOCK: Starters",
    nameDe: "MOCK: Kashk-e Bademjan",
    nameEn: "MOCK: Kashk-e Bademjan",
    descriptionDe: "MOCK: Gebratene Aubergine mit Kashk, Minze und Röstzwiebeln.",
    descriptionEn: "MOCK: Fried aubergine with kashk, mint, and crispy onions.",
    price: "MOCK: CHF 12.50",
  },
  {
    categoryDe: "MOCK: Kebabs & Grill",
    categoryEn: "MOCK: Kebabs & Grills",
    nameDe: "MOCK: Kabab Koobideh",
    nameEn: "MOCK: Kabab Koobideh",
    descriptionDe: "MOCK: Zwei Hackfleischspiesse mit Safranreis und Grilltomate.",
    descriptionEn: "MOCK: Two minced beef skewers with saffron rice and grilled tomato.",
    price: "MOCK: CHF 27.50",
  },
  {
    categoryDe: "MOCK: Kebabs & Grill",
    categoryEn: "MOCK: Kebabs & Grills",
    nameDe: "MOCK: Jujeh Kabab",
    nameEn: "MOCK: Jujeh Kabab",
    descriptionDe: "MOCK: Safran-Zitronen-Hähnchenspiess mit Reis und Grilltomate.",
    descriptionEn: "MOCK: Saffron and lemon chicken skewer with rice and grilled tomato.",
    price: "MOCK: CHF 29.00",
  },
  {
    categoryDe: "MOCK: Kebabs & Grill",
    categoryEn: "MOCK: Kebabs & Grills",
    nameDe: "MOCK: Kabab Barg",
    nameEn: "MOCK: Kabab Barg",
    descriptionDe: "MOCK: Marinierter Rindfleischspiess mit Safranreis und Sumach.",
    descriptionEn: "MOCK: Marinated beef fillet skewer with saffron rice and sumac.",
    price: "MOCK: CHF 36.00",
  },
  {
    categoryDe: "MOCK: Reisgerichte (Polow)",
    categoryEn: "MOCK: Rice Dishes (Polow)",
    nameDe: "MOCK: Zereshk Polow ba Morgh",
    nameEn: "MOCK: Zereshk Polow with Chicken",
    descriptionDe: "MOCK: Safranreis mit Berberitzen und geschmortem Hähnchen.",
    descriptionEn: "MOCK: Saffron rice with barberries and braised chicken.",
    price: "MOCK: CHF 28.50",
  },
  {
    categoryDe: "MOCK: Reisgerichte (Polow)",
    categoryEn: "MOCK: Rice Dishes (Polow)",
    nameDe: "MOCK: Baghali Polow ba Mahicheh",
    nameEn: "MOCK: Baghali Polow with Lamb Shank",
    descriptionDe: "MOCK: Dill-Bohnen-Reis mit langsam geschmorter Lammhaxe.",
    descriptionEn: "MOCK: Dill and broad bean rice with slow-braised lamb shank.",
    price: "MOCK: CHF 34.50",
  },
  {
    categoryDe: "MOCK: Reisgerichte (Polow)",
    categoryEn: "MOCK: Rice Dishes (Polow)",
    nameDe: "MOCK: Adas Polow",
    nameEn: "MOCK: Adas Polow",
    descriptionDe: "MOCK: Gewürzter Reis mit Linsen, Rosinen und Röstzwiebeln.",
    descriptionEn: "MOCK: Spiced rice with lentils, raisins, and crispy onions.",
    price: "MOCK: CHF 22.00",
  },
  {
    categoryDe: "MOCK: Schmorgerichte (Khoresht)",
    categoryEn: "MOCK: Stews (Khoresht)",
    nameDe: "MOCK: Ghormeh Sabzi",
    nameEn: "MOCK: Ghormeh Sabzi",
    descriptionDe: "MOCK: Kräuterschmorgericht mit Bohnen, getrockneter Limette und Rindfleisch, dazu Reis.",
    descriptionEn: "MOCK: Herb stew with beans, dried lime, and beef, served with rice.",
    price: "MOCK: CHF 27.00",
  },
  {
    categoryDe: "MOCK: Schmorgerichte (Khoresht)",
    categoryEn: "MOCK: Stews (Khoresht)",
    nameDe: "MOCK: Khoresht-e Gheimeh",
    nameEn: "MOCK: Khoresht-e Gheimeh",
    descriptionDe: "MOCK: Tomatenschmorgericht mit gelben Spalterbsen, Rindfleisch und Kartoffelstiften.",
    descriptionEn: "MOCK: Tomato stew with yellow split peas, beef, and crisp potato sticks.",
    price: "MOCK: CHF 26.50",
  },
  {
    categoryDe: "MOCK: Schmorgerichte (Khoresht)",
    categoryEn: "MOCK: Stews (Khoresht)",
    nameDe: "MOCK: Fesenjan",
    nameEn: "MOCK: Fesenjan",
    descriptionDe: "MOCK: Hähnchen in Walnuss-Granatapfel-Sauce, dazu Safranreis.",
    descriptionEn: "MOCK: Chicken in walnut and pomegranate sauce, served with saffron rice.",
    price: "MOCK: CHF 29.50",
  },
  {
    categoryDe: "MOCK: Vegetarisch",
    categoryEn: "MOCK: Vegetarian",
    nameDe: "MOCK: Kuku Sabzi",
    nameEn: "MOCK: Kuku Sabzi",
    descriptionDe: "MOCK: Persische Kräuterfrittata mit Walnüssen und Berberitzen.",
    descriptionEn: "MOCK: Persian herb frittata with walnuts and barberries.",
    price: "MOCK: CHF 19.50",
  },
  {
    categoryDe: "MOCK: Vegetarisch",
    categoryEn: "MOCK: Vegetarian",
    nameDe: "MOCK: Lubia Polow-e Sabz",
    nameEn: "MOCK: Vegetarian Lubia Polow",
    descriptionDe: "MOCK: Gewürzter Reis mit grünen Bohnen, Tomate und Safran.",
    descriptionEn: "MOCK: Spiced rice with green beans, tomato, and saffron.",
    price: "MOCK: CHF 21.50",
  },
  {
    categoryDe: "MOCK: Desserts",
    categoryEn: "MOCK: Desserts",
    nameDe: "MOCK: Sholeh Zard",
    nameEn: "MOCK: Sholeh Zard",
    descriptionDe: "MOCK: Persischer Safran-Reispudding mit Zimt und Mandeln.",
    descriptionEn: "MOCK: Persian saffron rice pudding with cinnamon and almonds.",
    price: "MOCK: CHF 8.50",
  },
  {
    categoryDe: "MOCK: Desserts",
    categoryEn: "MOCK: Desserts",
    nameDe: "MOCK: Bastani Sonnati",
    nameEn: "MOCK: Bastani Sonnati",
    descriptionDe: "MOCK: Persisches Safraneis mit Rosenwasser und Pistazien.",
    descriptionEn: "MOCK: Persian saffron ice cream with rosewater and pistachios.",
    price: "MOCK: CHF 9.50",
  },
  {
    categoryDe: "MOCK: Getränke",
    categoryEn: "MOCK: Drinks",
    nameDe: "MOCK: Persischer Schwarztee",
    nameEn: "MOCK: Persian Black Tea",
    descriptionDe: "MOCK: Traditionell aufgebrühter Schwarztee, serviert im Glas.",
    descriptionEn: "MOCK: Traditionally brewed black tea served in a glass.",
    price: "MOCK: CHF 4.50",
  },
  {
    categoryDe: "MOCK: Getränke",
    categoryEn: "MOCK: Drinks",
    nameDe: "MOCK: Doogh",
    nameEn: "MOCK: Doogh",
    descriptionDe: "MOCK: Gekühltes Joghurtgetränk mit Minze.",
    descriptionEn: "MOCK: Chilled yogurt drink with mint.",
    price: "MOCK: CHF 5.50",
  },
] as const;
