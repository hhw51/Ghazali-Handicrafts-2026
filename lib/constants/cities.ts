export const PAKISTAN_LOGISTICS_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Gujranwala',
  'Sialkot',
  'Quetta',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Hyderabad',
  'Gujrat',
  'Mardan',
  'Kasur',
  'Sahiwal',
  'Swat',
  'Chiniot',
  'Sheikhupura',
  'Okara',
  'Jhelum',
  'Wah Cantt',
  'Rahim Yar Khan',
  'Dera Ghazi Khan',
  'Mirpur (AJK)',
  'Muzaffarabad',
  'Nawabshah',
  'Larkana',
  'Mingora',
  'Turbat',
] as const;

export type PakistanCity = (typeof PAKISTAN_LOGISTICS_CITIES)[number];

export function isStandardizedCity(city: string): boolean {
  return PAKISTAN_LOGISTICS_CITIES.includes(city as PakistanCity);
}
