import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { SkiItem } from '../types/skiTypes';
import { INIT_ITEMS } from '../data/initialSkiData';

interface SkiState {
  items: SkiItem[];
  loading: boolean;
  fetchItems: () => Promise<void>;
  togglePacked: (id: number) => Promise<void>;
  addItem: (newItem: Omit<SkiItem, 'id'>) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

type SetState = (partial: Partial<SkiState> | ((state: SkiState) => Partial<SkiState>)) => void;
type GetState = () => SkiState;

export const useSkiStore = create<SkiState>((set: SetState, get: GetState) => ({
  items: [],
  loading: false,
  fetchItems: async () => {
    set({ loading: true });
    const { data } = await supabase.from('ski_items').select('*').order('id');
    set({ items: data?.length ? data : INIT_ITEMS, loading: false });
  },
  togglePacked: async (id: number) => {
    const item = get().items.find((i: SkiItem) => i.id === id);
    if (!item) return;
    const newPacked = !item.packed;
    set((state: SkiState) => ({
      items: state.items.map((i: SkiItem) => i.id === id ? { ...i, packed: newPacked } : i)
    }));
    await supabase.from('ski_items').update({ packed: newPacked }).eq('id', id);
  },
  addItem: async (newItem: Omit<SkiItem, 'id'>) => {
    const { data } = await supabase.from('ski_items').insert([newItem]).select();
    if (data) set((state: SkiState) => ({ items: [...state.items, data[0]] }));
  },
  deleteItem: async (id: number) => {
    set((state: SkiState) => ({ items: state.items.filter((i: SkiItem) => i.id !== id) }));
    await supabase.from('ski_items').delete().eq('id', id);
  },
}));