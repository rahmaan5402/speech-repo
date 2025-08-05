import { create } from 'zustand';
import { addTag, deleteTagById, getAllTags } from '@/service/tags';

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],

  // 加载全部 tag
  loadTags: async () => {
    const allTags = await getAllTags();
    set({ tags: allTags });
  },

  // 添加 tag（名称唯一）
  addTag: async (name) => {
    const result = await addTag(name);
    if (result !== null) {
      await get().loadTags();
      return true;
    }
    return false;
  },

  // 删除 tag（并刷新）
  deleteTag: async (id) => {
    await deleteTagById(id);
    await get().loadTags();
  },
}));
