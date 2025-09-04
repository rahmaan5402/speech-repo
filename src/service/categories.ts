import { handleBackgroundRequest } from "@/lib/utils";

export async function getAllCategories(): Promise<Category[]> {
  return await handleBackgroundRequest('getAllCategories');
}

export async function addCategory(name: string) {
  await handleBackgroundRequest('addCategory', { name });
}

export async function deleteCategoryByName(name: string): Promise<void> {
  await handleBackgroundRequest('deleteCategoryByName', { name });
}