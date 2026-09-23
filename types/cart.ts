import { Product } from './product';

export interface UnitSelection {
  color?: string;
  design?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  availableColors: string[];
  availableDesigns: string[];
  unitSelections: UnitSelection[];
  product?: Product;
  selectedColor?: string;
  selectedDesign?: string;
  unitBreakdown?: UnitSelection[];
}
