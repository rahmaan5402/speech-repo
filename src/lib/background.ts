import { Result } from "@/lib/utils";
import { db } from "@/lib/db";

// 消息处理器映射
const messageHandlers: Record<string, MessageHandler> = {};

// 查询全部类型
messageHandlers['getAllCategories'] = async () => {
  const data = await db.categories.orderBy('sorted').toArray();
  return Result.success(data);
};

// 添加类型
messageHandlers['addCategory'] = async (data) => {
  const exists = await db.categories.where('name').equals(data.name).first();
  if (exists) {
    return Result.error('分类已存在');
  }
  const last = await db.categories.orderBy('sorted').last();
  const nextSort = last ? last.sorted + 1 : 1;
  await db.categories.add({ name: data.name, sorted: nextSort });
  return Result.success();
};

// 根据名称删除类型
messageHandlers['deleteCategoryByName'] = async (data) => {
  await db.categories.where('name').equals(data.name).delete();
  return Result.success();
};

// 添加话术
messageHandlers['addScript'] = async (data) => {
  await db.scripts.add(data);
  return Result.success();
};

messageHandlers['deleteScriptById'] = async (data) => {
  await db.scripts.delete(data);
  return Result.success();
};

messageHandlers['updateScript'] = async (data) => {
  await db.scripts.put(data);
  return Result.success();
};

messageHandlers['getScriptById'] = async (data) => {
  const script = await db.scripts.get(data);
  return Result.success(script);
};

messageHandlers['deleteScriptsByCategory'] = async (data) => {
  try {
    await db.transaction('rw', db.tags, db.categories, db.scripts, async () => {
      // 1. 删除该分类的标签
      await db.tags.where({ category: data }).delete();
      // 2. 删除该分类的脚本
      await db.scripts.where('category').equals(data).delete();
      // 3. 删除该分类
      await db.categories.where('name').equals(data).delete();
    });
    return Result.success();
  } catch (error) {
    return Result.error(error);
  }
};

messageHandlers['getAllTags'] = async () => {
  const data = await db.tags.toArray();
  return Result.success(data);
};

messageHandlers['addTag'] = async (data) => {
  const tagExists = await db.tags.where({ category: data.category, name: data.tagName }).first();
  if (tagExists) {
    return Result.error('标签已存在');
  }
  await db.tags.add({ name: data.tagName, category: data.category });
  return Result.success(data);
};

messageHandlers['deleteTagById'] = async (data) => {
  await db.tags.delete(data);
  return Result.success();
};

messageHandlers['getScriptsByCategoryAndTags'] = async (data) => {
  const { category: filterCategory, tags: filterTags, page: filterPage, pageSize: filterPageSize } = data;
  const filterOffset = (filterPage - 1) * filterPageSize;
  let query = db.scripts.where('category').equals(filterCategory);
  // 应用标签过滤
  if (filterTags && filterTags.length > 0) {
    query = query.filter(script =>
      filterTags.some(tag => script.tags.includes(tag))
    );
  }
  const result = await query.offset(filterOffset).limit(filterPageSize).toArray();
  const total = await query.count();
  return Result.success({data: result, total: total});
};

messageHandlers['deleteTagByCategoryAndName'] = async (data) => {
  await db.transaction('rw', db.tags, db.scripts, async () => {
    // 1. 删除该分类的标签
    await db.tags.where({ category: data.category, name: data.name }).delete();
    // 找到所有包含这个 tag 的脚本
    const scriptsWithTag = await db.scripts
      .filter(script => script.tags.includes(data.name))
      .toArray();

    // 更新 scripts
    for (const script of scriptsWithTag) {
      const updatedTags = script.tags.filter(tag => tag !== data.name);
      await db.scripts.update(script.id!, { tags: updatedTags });
    }
  });
  return Result.success();
};

messageHandlers['getTagsByCategory'] = async (data) => {
  const tagsByCategory = await db.tags.where('category').equals(data).toArray();
  return Result.success(tagsByCategory);
};

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // 确保异步操作完成后再发送响应
  (async () => {
    const { action, data } = message;
    try {
      // 检查是否存在对应的处理器
      if (messageHandlers[action]) {
        // 调用对应的处理函数并获取结果
        const result = await messageHandlers[action](data);
        sendResponse(result);
      } else {
        sendResponse(Result.error('未知操作'));
      }
    } catch (error) {
      console.error('service error:', error, action, data);
      sendResponse(Result.error(error.message));
    }
  })();
  return true;
});