import { sendMessageToBackground } from "@/lib/utils";

export async function getAllCategories(): Promise<Category[]> {
  return await sendMessageToBackground('getAllCategories');
}

export async function addCategory(name: string): Promise<number | null> {
  try {
    return await sendMessageToBackground('addCategory', { name });
  } catch (error) {
    console.error('添加分类失败:', error);
    return null;
  }
}

export async function deleteCategoryByName(name: string): Promise<void> {
  await sendMessageToBackground('deleteCategoryByName', { name });
}