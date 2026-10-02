export const CRAFT_MATERIALS = [
  'Blue Pottery',
  'Brass Metal',
  'Naqshi Art',
  'Salt Lamps',
  'Sheesham Wood',
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
  address: '27 New Anarkali Road, Anarkali Bazaar, Lahore, Punjab 54000, Pakistan',
  mapsUrl: 'https://maps.app.goo.gl/7sGBoDgCb1imyGME8',
  phone: '+92 310 4755973',
  whatsappNumber: '923104755973',
  email: 'concierge@ghazalihandicrafts.com',
};
