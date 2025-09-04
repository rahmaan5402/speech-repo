import {
    addScript,
    deleteScriptById,
    deleteScriptsByCategory,
    getScriptById,
    getScriptsByCategoryAndTags,
    getScriptsByPage,
    getTotalScriptCount,
    updateScript
} from '@/service/scripts';
import { create } from 'zustand';
import { useCategoryStore } from './categories';

export const useScriptStore = create<ScriptState>((set) => ({
    scripts: [],
    total: 0,
    exportScripts: [],
    currentFilter: '', // 默认值
    setCurrentFilter: (filter) => set({ currentFilter: filter }),
    // 分页加载脚本
    loadScripts: async (page, size, category) => {
        const [list, count] = await Promise.all([
            getScriptsByPage(category, page, size),
            getTotalScriptCount(category)
        ]);
        console.log('loadScripts', list);
        set({ scripts: list, total: count });
    },

    // 查询所有
    getExportScripts: async (category, tags) => {
        const { data: list } = await getScriptsByCategoryAndTags(category, tags, 1, 9999999);
        console.log('getExportScripts getScripts', list);
        set({ exportScripts: list });
    },

    // 添加脚本（并重新加载分页数据）
    addScript: async (script): Promise<void> => {
        // 创建话术
        await addScript(script);
    },

    // 删除后刷新当前页数据
    deleteScript: async (id) => {
        await deleteScriptById(id);
    },

    // 更新脚本并刷新当前页
    updateScript: async (script) => {
        await updateScript(script);
    },

    getScriptById: async (id) => {
        return await getScriptById(id); // ✅ 加入调用
    },

    deleteCategory: async (category) => {
        await deleteScriptsByCategory(category);
        await useCategoryStore.getState().loadCategories();
    },

    // 添加支持标签过滤的脚本加载方法
    loadScriptsByCategoryAndTags: async (page, size, category, tags) => {
        const { data: list, total: count } = await getScriptsByCategoryAndTags(category, tags, page, size);
        set({ scripts: list, total: count });
    },
}));