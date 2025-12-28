import { User } from '@/types/auth';

// Dummy users for demonstration
export const dummyUsers: User[] = [
  {
    id: '1',
    username: 'seller1',
    email: 'seller@battery.com',
    role: 'seller',
    name: 'John Smith',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller1',
    company: 'Battery Retailers Inc.',
    phone: '+1 (555) 123-4567',
  },
  {
    id: '2',
    username: 'manufacturer1',
    email: 'manufacturer@battery.com',
    role: 'manufacturer',
    name: 'Sarah Johnson',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manufacturer1',
    company: 'PowerCell Manufacturing',
    phone: '+1 (555) 234-5678',
  },
  {
    id: '3',
    username: 'logistics1',
    email: 'logistics@battery.com',
    role: 'logistics',
    name: 'Michael Chen',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=logistics1',
    company: 'FastShip Logistics',
    phone: '+1 (555) 345-6789',
  },
];

// For demo purposes, password is 'demo123' for all users
export const DEMO_PASSWORD = 'demo123';

// Battery supply chain dummy data
export interface Battery {
  id: string;
  name: string;
  type: string;
  capacity: string;
  voltage: string;
  manufacturer: string;
  price: number;
  stock: number;
  status: 'available' | 'low_stock' | 'out_of_stock';
}

export interface Order {
  id: string;
  batteryId: string;
  batteryName: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  seller?: string;
  manufacturer?: string;
  logistics?: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  origin: string;
  destination: string;
  status: 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered';
  trackingNumber: string;
  estimatedDelivery: string;
  currentLocation?: string;
}

export const batteries: Battery[] = [
  {
    id: 'bat001',
    name: 'LiPo High Performance 5000mAh',
    type: 'Lithium Polymer',
    capacity: '5000mAh',
    voltage: '11.1V',
    manufacturer: 'PowerCell Manufacturing',
    price: 89.99,
    stock: 150,
    status: 'available',
  },
  {
    id: 'bat002',
    name: 'Li-ion Industrial 10000mAh',
    type: 'Lithium Ion',
    capacity: '10000mAh',
    voltage: '12V',
    manufacturer: 'PowerCell Manufacturing',
    price: 149.99,
    stock: 75,
    status: 'available',
  },
  {
    id: 'bat003',
    name: 'LiFePO4 Solar 200Ah',
    type: 'Lithium Iron Phosphate',
    capacity: '200Ah',
    voltage: '12.8V',
    manufacturer: 'PowerCell Manufacturing',
    price: 599.99,
    stock: 25,
    status: 'low_stock',
  },
  {
    id: 'bat004',
    name: 'NiMH AA Rechargeable Pack',
    type: 'Nickel Metal Hydride',
    capacity: '2500mAh',
    voltage: '1.2V',
    manufacturer: 'PowerCell Manufacturing',
    price: 19.99,
    stock: 500,
    status: 'available',
  },
  {
    id: 'bat005',
    name: 'AGM Deep Cycle 100Ah',
    type: 'Lead Acid AGM',
    capacity: '100Ah',
    voltage: '12V',
    manufacturer: 'PowerCell Manufacturing',
    price: 249.99,
    stock: 0,
    status: 'out_of_stock',
  },
];

export const orders: Order[] = [
  {
    id: 'ord001',
    batteryId: 'bat001',
    batteryName: 'LiPo High Performance 5000mAh',
    quantity: 50,
    totalPrice: 4499.50,
    status: 'delivered',
    orderDate: '2025-12-15',
    seller: 'Battery Retailers Inc.',
    manufacturer: 'PowerCell Manufacturing',
    logistics: 'FastShip Logistics',
  },
  {
    id: 'ord002',
    batteryId: 'bat002',
    batteryName: 'Li-ion Industrial 10000mAh',
    quantity: 30,
    totalPrice: 4499.70,
    status: 'shipped',
    orderDate: '2025-12-20',
    seller: 'Battery Retailers Inc.',
    manufacturer: 'PowerCell Manufacturing',
    logistics: 'FastShip Logistics',
  },
  {
    id: 'ord003',
    batteryId: 'bat003',
    batteryName: 'LiFePO4 Solar 200Ah',
    quantity: 10,
    totalPrice: 5999.90,
    status: 'processing',
    orderDate: '2025-12-25',
    seller: 'Battery Retailers Inc.',
    manufacturer: 'PowerCell Manufacturing',
    logistics: 'FastShip Logistics',
  },
  {
    id: 'ord004',
    batteryId: 'bat004',
    batteryName: 'NiMH AA Rechargeable Pack',
    quantity: 100,
    totalPrice: 1999.00,
    status: 'pending',
    orderDate: '2025-12-28',
    seller: 'Battery Retailers Inc.',
    manufacturer: 'PowerCell Manufacturing',
  },
];

export const shipments: Shipment[] = [
  {
    id: 'shp001',
    orderId: 'ord001',
    origin: 'PowerCell Manufacturing, San Jose, CA',
    destination: 'Battery Retailers Inc., Austin, TX',
    status: 'delivered',
    trackingNumber: 'FS1234567890',
    estimatedDelivery: '2025-12-18',
    currentLocation: 'Delivered',
  },
  {
    id: 'shp002',
    orderId: 'ord002',
    origin: 'PowerCell Manufacturing, San Jose, CA',
    destination: 'Battery Retailers Inc., Austin, TX',
    status: 'in_transit',
    trackingNumber: 'FS1234567891',
    estimatedDelivery: '2025-12-30',
    currentLocation: 'Phoenix, AZ Distribution Center',
  },
  {
    id: 'shp003',
    orderId: 'ord003',
    origin: 'PowerCell Manufacturing, San Jose, CA',
    destination: 'Battery Retailers Inc., Austin, TX',
    status: 'picked_up',
    trackingNumber: 'FS1234567892',
    estimatedDelivery: '2026-01-02',
    currentLocation: 'Origin Facility',
  },
];
