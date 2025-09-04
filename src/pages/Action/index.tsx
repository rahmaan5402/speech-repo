import { FileDown, FileInput, Globe, Plus } from 'lucide-react';
import { useScriptStore } from '@/store/scripts';
import * as XLSX from 'xlsx';
import { useState } from 'react';
import UploadDialog from '@/components/common/UploadDialog';
import { useTagStore } from '@/store/tags';
import { useCategoryStore } from '@/store/categories';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import i18n from '@/i18n/i18n';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '@/lib/common';
import { useNavigate } from 'react-router-dom';
import SingleInputDialog from '@/components/common/SingleInputDialog';
import TagsDialog from '../Tags';
import { useToastFeedback } from '@/hooks/useToastFeedback';

function Action() {
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const { t } = useTranslation();
    const withToastFeedback = useToastFeedback();

    const navigate = useNavigate();

    const [openTagsDialog, setOpenTagsDialog] = useState(false);
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

    const { addCategory, loadCategories } = useCategoryStore();

    // 导出Excel功能
    const handleExport = async () => {
        const store = useScriptStore.getState();
        const tag = useTagStore.getState();
        // query all data.
        await store.getExportScripts(store.currentFilter, tag.selectedTags);
        // 加载完成后，可以通过getState再次获取最新数据
        const updatedStore = useScriptStore.getState();
        // 准备导出数据
        let exportData = updatedStore.exportScripts.map(script => ({
            [t('export.title.content')]: script.content,
            [t('export.title.category')]: script.category,
            [t('export.title.tag')]: script.tags.join(',')
        }));
        // 检查数据是否为空，如果为空则添加一个包含表头的空行
        if (exportData.length === 0) {
            exportData = [{
                [t('export.title.content')]: '',
                [t('export.title.category')]: '',
                [t('export.title.tag')]: ''
            }];
        }
        // 创建工作簿和工作表
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, t('export.sheet.name'));
        // 生成Excel文件并下载
        XLSX.writeFile(workbook, `${t('export.sheet.name')}_${formatDateTime(new Date())}.xlsx`);
    };

    // 导入Excel功能
    const handleUploadComplete = async (files: File[]) => {
        if (files.length === 0) return;

        const file = files[0];
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            toast.error(t('action.toast.failure'), { description: t('import.format.require') });
            return;
        }

        const uploadAction = async () => {
            // 读取Excel文件
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // 验证表头
            if (jsonData.length === 0) {
                throw new Error(t('import.data.empty'));
            }

            const firstRow = jsonData[0];
            const requiredHeaders = [t('export.title.content'), t('export.title.category'), t('export.title.tag')];
            // @ts-ignore
            const hasAllHeaders = requiredHeaders.every(header => header in firstRow);

            if (!hasAllHeaders) {
                throw new Error(t('import.data.header.require'));
            }

            // 加载现有分类和标签
            const categoryStore = useCategoryStore.getState();
            const tagStore = useTagStore.getState();
            const scriptStore = useScriptStore.getState();

            await Promise.all([
                categoryStore.loadCategories(),
                tagStore.loadTags()
            ]);

            // 获取最新的分类和标签数据
            const categories = useCategoryStore.getState().categories;
            const tags = useTagStore.getState().tags;

            // 用于跟踪已添加的分类和标签，避免重复添加
            const addedCategories = new Set(categories.map(c => c.name));
            const tagsByCategory = new Map<string, Set<string>>();

            // 初始化按分类存储的标签集合
            tags.forEach(tag => {
                if (!tagsByCategory.has(tag.category)) {
                    tagsByCategory.set(tag.category, new Set());
                }
                tagsByCategory.get(tag.category)?.add(tag.name);
            });

            // 处理每个脚本条目
            for (const item of jsonData) {
                try {
                    const content = item[t('export.title.content')]?.trim();
                    const categoryName = item[t('export.title.category')]?.trim();
                    const tagsStr = item[t('export.title.tag')]?.trim() || '';
                    // 验证必要字段
                    if (!content || !categoryName) {
                        continue;
                    }
                    // 检查并添加分类（如果不存在）
                    if (!addedCategories.has(categoryName)) {
                        await categoryStore.addCategory(categoryName);
                        addedCategories.add(categoryName);
                    }
                    const tagNames = tagsStr.split(/[,，]/).map(t => t.trim()).filter(t => t);
                    // 类型存在，判断是否已包含标签
                    for (const tagName of tagNames) {
                        if (!tagsByCategory.has(categoryName) || !tagsByCategory.get(categoryName)?.has(tagName)) {
                            await tagStore.addTag(categoryName, tagName);
                            // 确保当前分类的标签集合已初始化
                            if (!tagsByCategory.has(categoryName)) {
                                tagsByCategory.set(categoryName, new Set());
                            }
                            // 将新添加的标签添加到对应分类的集合中
                            tagsByCategory.get(categoryName)?.add(tagName);
                        }
                    }
                    // 添加脚本
                    await scriptStore.addScript({
                        content,
                        category: categoryName,
                        tags: tagNames
                    });
                } catch (error) {
                    console.log("import error", error, item);
                    throw error;
                }
            }
        };
        await withToastFeedback(() => uploadAction());
        await loadCategories();
        console.log("导入成功，重新加载");
    };

    return (
        <div className='w-14 bg-white/70 border-l border-black/5 flex flex-col gap-5 justify-start items-center p-2 pt-6'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className='flex flex-col items-center justify-center group'>
                        <div className={`rounded-full p-1.5 cursor-pointer bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors duration-200`}>
                            <Plus size={18} />
                        </div>
                        <span className='text-[10px] text-gray-700 group-hover:font-semibold'>{t('header.addMenu')}</span>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent forceMount={true} side={'left'} align={'start'}>
                    <DropdownMenuItem onClick={() => navigate('/create')}>{t('header.addMenu.speech')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenCategoryDialog(true)}>{t('header.addMenu.category')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenTagsDialog(true)}>{t('header.addMenu.tag')}</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className='flex flex-col items-center justify-center group'>
                        <div className={`rounded-full p-1.5 cursor-pointer bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors duration-200`}>
                            <Globe size={18} />
                        </div>
                        <span className='text-[10px] text-gray-700 group-hover:font-semibold'>{t('action.language')}</span>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent forceMount={true} side={'left'} align={'start'}>
                    <DropdownMenuItem onClick={() => i18n.changeLanguage('zh')}>中文</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => i18n.changeLanguage('en')}>English</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className='flex flex-col items-center justify-center group'
                onClick={() => setOpenUploadDialog(true)}>
                <div className={`rounded-full p-1.5 cursor-pointer bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors duration-200`}>
                    <FileInput size={18} />
                </div>
                <span className='text-[10px] text-gray-700 group-hover:font-semibold'>{t('action.import')}</span>
            </div>

            <div className='flex flex-col items-center justify-center group'
                onClick={handleExport}>
                <div className={`rounded-full p-1.5 cursor-pointer bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors duration-200`}>
                    <FileDown size={18} />
                </div>
                <span className='text-[10px] text-gray-700 group-hover:font-semibold'>{t('action.export')}</span>
            </div>

            <UploadDialog
                open={openUploadDialog}
                onOpenChange={setOpenUploadDialog}
                onUploadComplete={handleUploadComplete}
                title={t('import.title')}
                accept='.xlsx,.xls'
            />


            {/* 添加标签功能 */}
            <TagsDialog
                open={openTagsDialog}
                onOpenChange={setOpenTagsDialog}
            />

            <SingleInputDialog
                open={openCategoryDialog}
                onOpenChange={setOpenCategoryDialog}
                title={t('dialog.category.title')}
                placeholder={t('dialog.category.placeholder')}
                onSubmit={(value) => addCategory(value)}
            />

        </div>
    )
}

export default Action

