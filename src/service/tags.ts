import { sendMessageToBackground } from "@/lib/utils";

export async function getAllTags(): Promise<Tag[]> {
  return await sendMessageToBackground('getAllTags');
}

export async function addTag(tagName: string): Promise<number | null> {
  try {
    return await sendMessageToBackground('addTag', tagName);
  } catch (error) {
    console.error('添加标签失败:', error);
    return null;
  }
}

export async function deleteTagById(id: number): Promise<void> {
  await sendMessageToBackground('deleteTagById', id);
}