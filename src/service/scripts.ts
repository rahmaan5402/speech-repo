import { db } from './db';

// 分页查询脚本
export async function getScriptsByPage(category: string, page: number, pageSize: number): Promise<Script[]> {
    const offset = (page - 1) * pageSize;
    if (category === 'all') {
        return await db.scripts.offset(offset).limit(pageSize).toArray();
    }
    return await db.scripts
        .where('category')
        .equals(category)
        .offset(offset)
        .limit(pageSize)
        .toArray();
}

// 查询总数量（分页用）
export async function getTotalScriptCount(category: string): Promise<number> {
    if (category === 'all') {
        return await db.scripts.count();
    }
    return await db.scripts.where('category').equals(category).count();
}

// 添加脚本
export async function addScript(script: Omit<Script, 'id'>): Promise<number> {
    return await db.scripts.add(script);
}

// 删除脚本
export async function deleteScriptById(id: number): Promise<void> {
    await db.scripts.delete(id);
}

// 编辑脚本
export async function updateScript(script: Script): Promise<void> {
    await db.scripts.put(script);
}

// 根据 ID 查询脚本
export async function getScriptById(id: number): Promise<Script | undefined> {
    return await db.scripts.get(id);
}

// scripts.ts
export async function deleteScriptsByCategory(category: string): Promise<void> {
  await db.scripts.where('category').equals(category).delete();
}