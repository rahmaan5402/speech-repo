import { create } from 'zustand';
import { addTag, deleteTagById, deleteTagByName, getAllTags, getTagsByCategory } from '@/service/tags';

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  selectedTags: [],
  allTagsByCategory: [],
  setSelectedTags: (tags) => set({ selectedTags: tags }),

  // 加载全部 tag
  loadTags: async () => {
    const allTags = await getAllTags();
    set({ tags: allTags });
  },

  // 添加 tag（名称唯一）
  addTag: async (category: string, tagName: string) => {
    await addTag(category, tagName);
    await get().getTagsByCategory(category);
  },

  // 删除 tag（并刷新）
  deleteTag: async (id) => {
    await deleteTagById(id);
    await get().loadTags();
  },

  // 删除 tag（并刷新）
  deleteTagByName: async (name: string) => {
    await deleteTagByName(name);
    await get().loadTags();
    return true;
  },

  // 添加根据分类聚合标签的方法
  getTagsByCategory: async (category) => {
    const tags = await getTagsByCategory(category);
    set({ allTagsByCategory: tags });
    return tags;
  },

}));
