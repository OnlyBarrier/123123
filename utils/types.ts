export interface Invoice {
  id: string;
  eInvoiceCreated: any;
  serial: string;
  userId: string;
  date: string;
  customerName: string;
  customerId: string; // RUC
  total: number;
  active: boolean;
  blNumber: string;
  containerNumber: string;
  nature: string; // el tipo de venta
  receiverType: string;
  rucType: string;
  paymentMethods: string;
  telephones: string;
  emails: string;
  address: string;
  items: Items[];
}

export interface User {
  id: string;
  name: string;
  customerId: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface Items {
  description: string;
  value: string;
  tax: string;
}

export interface EItems {
  prices: { transfer: number };
  itbms: { rate: string };
  description: string;
  quantity: number;
  number: string;
}

export interface Shipping {
  name: string;
  userId: string;
  blNumber: string;
  date: string;
  description: string;
  dimensions: string;
  volume: string;
  containerNumber: string;
  comments: string;
}

export interface InputRow {
  input1: string;
  input2: string;
}

export interface Entries {
  id: string;
  name: string;
  date: string;
  sealNumber: string;
  blNumber: string;
  comments: string;
  active: boolean;
  entryNumber: number;
  containers: Containers[];
}

export interface Containers {
  id: string;
  ruc: string;
  name: string;
  containerNumber: string;
  active: boolean;
  wareHouseName: string;
  description: string;
  email: string;
  address: string;
  phone: string;
  products: Products[];
}

export interface Products {
  id: string;
  date: string;
  payment: string;
  customerName: string;
  ruc: string;
  dimensions: string | number | undefined;
  blNumber: string;
  name: string;
  observations: string;
  active: boolean;
  freeDays: string;
  dayValue: string;
  zoneFQuantity: string;
  nationalQuantity: string;
  patioQuantity: string;
  exitQuantity: number;
  exitDate: string;
}

export interface Exits {
  liqNumber: string; //número de liquidación
  date: string; //fecha de salida
  quantity: string; // cantidad
  transCompany: string; //compañia de transportes
  driverName: string; //nombre del conductor
  truckPlate: string; // placa del camion
  productId: string; //id del producto que sale
  exitType: string; // tipo de salida
}
