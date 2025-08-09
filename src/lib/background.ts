import { defaultCategories, defaultScripts, defaultTags } from "@/utils/constants";
import Dexie, { Table } from "dexie";

export class SpeechDB extends Dexie {
    static readonly databaseName = 'speech_db';
    scripts!: Table<Script, number>;
    tags!: Table<Tag, number>;      // 添加 tags 表
    categories!: Table<Category, number>;  // 添加 categories 表

    constructor() {
        super(SpeechDB.databaseName);
        this.version(1).stores({
            // 主键 id，自增
            scripts: '++id, category, tags',
            tags: '++id, &name',        // tags 表定义
            categories: '++id, &name, sorted'   // categories 表定义
        });

        // ✅ 首次创建数据库时触发
        this.on('populate', async () => {
            console.log('init database table...');
            await this.scripts.bulkAdd(defaultScripts);
            await this.tags.bulkAdd(defaultTags);
            await this.categories.bulkAdd(defaultCategories);
            console.log('init database table success...');
        });
    }
}

export const db = new SpeechDB();

console.log("background.js chrome.runtime = ", chrome.runtime);

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // 确保异步操作完成后再发送响应
  (async () => {
    try {
      const { action, data } = message;

      console.log("background.js onMessage addListener = ", action, data);

      // 根据不同的操作类型处理请求
      switch (action) {
        // 分类相关操作
        case 'getAllCategories':
          sendResponse({ success: true, data: await db.categories.orderBy('sorted').toArray() });
          break;
        case 'addCategory':
          const exists = await db.categories.where('name').equalsIgnoreCase(data.name).first();
          if (exists) {
            sendResponse({ success: false, error: '分类已存在' });
          } else {
            const last = await db.categories.orderBy('sorted').last();
            const nextSort = last ? last.sorted + 1 : 1;
            const id = await db.categories.add({ name: data.name, sorted: nextSort });
            sendResponse({ success: true, data: id });
          }
          break;
        case 'deleteCategoryByName':
          await db.categories.where('name').equals(data.name).delete();
          sendResponse({ success: true });
          break;

        // 脚本相关操作
        case 'getScriptsByPage':
          const offset = (data.page - 1) * data.pageSize;
          let scripts = [];
          if (data.category === 'all') {
            scripts = await db.scripts.offset(offset).limit(data.pageSize).toArray();
          } else {
            scripts = await db.scripts
              .where('category')
              .equals(data.category)
              .offset(offset)
              .limit(data.pageSize)
              .toArray();
          }
          console.log('getScriptsByPage = ', scripts);
          sendResponse({ success: true, data: scripts });
          break;
        case 'getTotalScriptCount':
          let count;
          if (data === 'all') {
            count = await db.scripts.count();
          } else {
            count = await db.scripts.where('category').equals(data).count();
          }
          console.log('getTotalScriptCount = ', count);
          sendResponse({ success: true, data: count });
          break;
        case 'addScript':
          const scriptId = await db.scripts.add(data);
          sendResponse({ success: true, data: scriptId });
          break;
        case 'deleteScriptById':
          await db.scripts.delete(data);
          sendResponse({ success: true });
          break;
        case 'updateScript':
          await db.scripts.put(data);
          sendResponse({ success: true });
          break;
        case 'getScriptById':
          const script = await db.scripts.get(data);
          sendResponse({ success: true, data: script });
          break;
        case 'deleteScriptsByCategory':
          await db.scripts.where('category').equals(data).delete();
          sendResponse({ success: true });
          break;

        // 标签相关操作
        case 'getAllTags':
          sendResponse({ success: true, data: await db.tags.toArray() });
          break;
        case 'addTag':
          const tagExists = await db.tags.where('name').equals(data).first();
          if (tagExists) {
            sendResponse({ success: false, error: '标签已存在' });
          } else {
            const tagId = await db.tags.add({ name: data });
            sendResponse({ success: true, data: tagId });
          }
          break;
        case 'deleteTagById':
          await db.tags.delete(data);
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ success: false, error: '未知操作' });
      }
    } catch (error) {
      console.log("background.js error = ", error);
      sendResponse({ success: false, error: error.message });
    }
  })();

  // 保持消息通道开放，直到异步操作完成
  return true;
});
// ... existing code ...