import { sendMessageToBackground } from "@/lib/utils";

// 分页查询脚本
export async function getScriptsByPage(category: string, page: number, pageSize: number): Promise<Script[]> {
  return await sendMessageToBackground('getScriptsByPage', { category, page, pageSize });
}

// 查询总数量（分页用）
export async function getTotalScriptCount(category: string): Promise<number> {
  return await sendMessageToBackground('getTotalScriptCount', category);
}

// 添加脚本
export async function addScript(script: Omit<Script, 'id'>): Promise<number> {
  return await sendMessageToBackground('addScript', script);
}

// 删除脚本
export async function deleteScriptById(id: number): Promise<void> {
  await sendMessageToBackground('deleteScriptById', id);
}

// 编辑脚本
export async function updateScript(script: Script): Promise<void> {
  await sendMessageToBackground('updateScript', script);
}

// 根据 ID 查询脚本
export async function getScriptById(id: number): Promise<Script | undefined> {
  return await sendMessageToBackground('getScriptById', id);
}

// 根据分类删除脚本
export async function deleteScriptsByCategory(category: string): Promise<void> {
  await sendMessageToBackground('deleteScriptsByCategory', category);
}