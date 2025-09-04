import { handleBackgroundRequest } from "@/lib/utils";

// 分页查询脚本
export async function getScriptsByPage(category: string, page: number, pageSize: number): Promise<Script[]> {
  return await handleBackgroundRequest('getScriptsByPage', { category, page, pageSize });
}

// 查询总数量（分页用）
export async function getTotalScriptCount(category: string): Promise<number> {
  return await handleBackgroundRequest('getTotalScriptCount', category);
}

// 添加脚本
export async function addScript(script: Omit<Script, 'id'>): Promise<void> {
  try {
    await handleBackgroundRequest("addScript", script)
      .then(res => console.log("success", res))
      .catch(err => console.error("捕捉到错误:", err));
  } catch (error) {
    console.log('handleBackgroundRequest 添加脚本失败:', error);
    throw error;
  }
}

// 删除脚本
export async function deleteScriptById(id: number): Promise<void> {
  await handleBackgroundRequest('deleteScriptById', id);
}

// 编辑脚本
export async function updateScript(script: Script): Promise<void> {
  await handleBackgroundRequest('updateScript', script);
}

// 根据 ID 查询脚本
export async function getScriptById(id: number): Promise<Script | undefined> {
  return await handleBackgroundRequest('getScriptById', id);
}

// 根据分类删除脚本
export async function deleteScriptsByCategory(category: string): Promise<void> {
  await handleBackgroundRequest('deleteScriptsByCategory', category);
}

// 添加根据分类和标签查询脚本的方法
export async function getScriptsByCategoryAndTags(category: string, tags: string[], page: number, pageSize: number): Promise<{ data: Script[], total: number }> {
  return await handleBackgroundRequest('getScriptsByCategoryAndTags', { category, tags, page, pageSize });
}