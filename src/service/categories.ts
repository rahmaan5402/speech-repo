import { db } from './db';

export async function getAllCategories(): Promise<Category[]> {
  return await db.categories.orderBy('sorted').toArray();
}

export async function addCategory(name: string): Promise<number | null> {
  // 名称是否已存在（忽略大小写）
  const exists = await db.categories.where('name').equalsIgnoreCase(name).first();
  if (exists) {
    return null;
  }

  // 查询当前最大的 sort 值
  const last = await db.categories.orderBy('sorted').last();
  const nextSort = last ? last.sorted + 1 : 1;

  return await db.categories.add({ name, sorted: nextSort });
}

export async function deleteCategoryByName(name: string): Promise<void> {
  await db.categories.where('name').equals(name).delete();
}