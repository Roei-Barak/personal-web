export interface SkiItem {
  id: number;
  cat: string;
  name: string;
  status: string;
  packed: boolean;
  optional: boolean;
  img: string;
}

export interface Reminder {
  id: number;
  text: string;
  done: boolean;
  priority: 'urgent' | 'medium' | 'low';
  emoji: string;
}

export interface Resort {
  id: number;
  name: string;
  flag: string;
  country: string;
  flight: string;
  pkg: string;
  level: string;
  rating: number;
  details: string;
}

export interface Insurance {
  id: number;
  name: string;
  logo: string;
  medical: string;
  sports: boolean | string;
  cancel: boolean | string;
  cancelNote: string;
  price: string;
  features: string[];
  sports_detail: string;
  contact: string;
}

export interface Place {
  id: number;
  name: string;
  type: string;
  visited: boolean;
  emoji: string;
  note: string;
}

export interface Expense {
  id: number;
  desc: string;
  amount: number;
  payer: number;
  split: number[];
  date: string;
}

export interface MediaItem {
  id: number;
  device: string;
  desc: string;
  run: string;
  uploaded: boolean;
}

export interface UploadTask {
  id: number;
  title: string;
  done: boolean;
  platform: string;
}