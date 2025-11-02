
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface BillItem extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  date: string; // ISO string
  items: BillItem[];
  total: number;
}
