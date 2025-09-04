import { defaultCategories, defaultScripts, defaultTags } from "@/lib/constants";
import Dexie, { Table } from "dexie";

class SpeechDB extends Dexie {
  static readonly databaseName = 'speech_db';
  scripts!: Table<Script, number>;
  tags!: Table<Tag, number>;      // 添加 tags 表
  categories!: Table<Category, number>;  // 添加 categories 表

  constructor() {
    super(SpeechDB.databaseName);
    this.version(1).stores({
      // 主键 id，自增
      scripts: '++id, category, tags',
      tags: '++id, category, name, [category+name]',        // tags 表定义
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