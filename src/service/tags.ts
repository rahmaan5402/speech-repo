import { db } from './db';

export async function getAllTags(): Promise<Tag[]> {
  return await db.tags.toArray();
}

export async function addTag(tagName: string): Promise<number | null> {
  // 确保名称唯一
  const exists = await db.tags.where('name').equals(tagName).first();
  if (exists) {
    return null; // 已存在，返回 null 表示失败
  }
  return await db.tags.add({ name: tagName });
}

export async function deleteTagById(id: number): Promise<void> {
  await db.tags.delete(id);
}
