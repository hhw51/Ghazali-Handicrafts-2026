export const CRAFT_MATERIALS = [
  'Blue Pottery',
  'Brass Metal',
  'Camel Bone',
  'Glasswork',
  'Marble & Onyx',
  'Naqshi Art',
  'Salt Lamps',
  'Sheesham Wood',
  'Sword Frames & Arms',
  'Truck Art',
  'Fridge Magnets',
  'Swati Art',
  'Others',
] as const;

export type CraftMaterial = (typeof CRAFT_MATERIALS)[number];

export const FUNCTIONAL_CATEGORIES = [
  'Swords',
  'Souvenirs',
  'Tissue Boxes',
  'Jewelry Boxes',
  'Keyrings',
  'Plates',
  'Imported China',
  'Trays',
  'Tabla Sets',
  'Ship Models',
  'Dolls',
  'Chess Sets',
  'Fridge Magnets',
  'Clocks / Wall Clocks',
  'Lamps',
  'Wall Hangings',
  'Ash Trays',
  'Charpai Bottles',
  'Fruit Baskets',
  'Candy Boxes',
  'Pen Holders',
  'Sugar Pots',
  'Brass Glasses',
  'Animal Figurines',
  'Vases',
  'Tea Cups',
  'Coffee Tables',
] as const;

export type FunctionalCategory = (typeof FUNCTIONAL_CATEGORIES)[number];

export const FLAGSHIP_STORE_INFO = {
  name: 'Ghazali Handicrafts',
  address: '27 New Anarkali, Lahore, Punjab, Pakistan',
  mapsUrl: 'https://maps.app.goo.gl/fbt2FunN1MfoD7Px6',
  phone: '+92 300 1234567',
  whatsappNumber: '923001234567',
  email: 'concierge@ghazalihandicrafts.com',
};
