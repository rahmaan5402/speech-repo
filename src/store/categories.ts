import { create } from 'zustand';
import {
    addCategory,
    deleteCategoryByName,
    getAllCategories
} from '@/service/categories';

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],

    loadCategories: async () => {
        const list = await getAllCategories();
        console.log('loadCategories', list);
        set({ categories: list });
    },

    addCategory: async (name) => {
        await addCategory(name);
        await get().loadCategories();
    },

    deleteCategory: async (name) => {
        await deleteCategoryByName(name);
        await get().loadCategories();
    }
}));
