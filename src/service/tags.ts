import { handleBackgroundRequest } from "@/lib/utils";

export async function getAllTags(): Promise<Tag[]> {
  return await handleBackgroundRequest('getAllTags');
}

export async function addTag(category: string, tagName: string): Promise<number | null> {
  try {
    return await handleBackgroundRequest('addTag', { category, tagName });
  } catch (error) {
    console.error('添加标签失败:', error);
    return null;
  }
}

export async function deleteTagById(id: number): Promise<void> {
  await handleBackgroundRequest('deleteTagById', id);
}

export async function deleteTagByName(name: string): Promise<void> {
  await handleBackgroundRequest('deleteTagByName', name);
}

export async function getTagsByCategory(category: string): Promise<Tag[]> {
  return await handleBackgroundRequest('getTagsByCategory', category);
}