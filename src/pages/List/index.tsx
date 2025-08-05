import { useEffect, useState } from 'react'
import {
    Copy,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Check,
    X
} from 'lucide-react';
import { useScriptStore } from '@/store/scripts';
import { useNavigate } from 'react-router-dom';
import { useCategoryStore } from '@/store/categories';
import SingleInputDialog from '@/components/common/SingleInputDialog';
import { useTagStore } from '@/store/tags';
import { Separator } from '@/components/ui/separator';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DEFAULT_ALL, pageSize } from '@/utils/constants';
import { withToastFeedback } from '@/utils/withToastFeedback';



function List() {
    const [currentFilter, setCurrentFilter] = useState(DEFAULT_ALL);
    const [currentPageNum, setCurrentPageNum] = useState(1);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [openTagsDialog, setOpenTagsDialog] = useState(false);
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

    const navigate = useNavigate();

    const { scripts, total, loadScripts, deleteScript, deleteCategory } = useScriptStore();
    const { categories, loadCategories, addCategory } = useCategoryStore();
    const { addTag } = useTagStore();

    useEffect(() => {
        loadScripts(currentPageNum, pageSize, currentFilter);
    }, [currentPageNum, currentFilter]);

    useEffect(() => {
        loadCategories();
    }, []);

    const totalPages = Math.ceil(total / pageSize);

    const goToPage = (page: number) => {
        setCurrentPageNum(page);
    };

    const copyScript = async (id: number, content: string) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
    };

    const handleDeleteScript = async (id: number) => {
        await deleteScript(id, currentPageNum, pageSize, currentFilter);
    };

    const editScript = (id: number) => {
        navigate(`/create?id=${id}`);
    };

    return (
        <>
            {/* Category Filters */}
            <div className="p-5 flex flex-wrap gap-2">
                <button
                    onClick={() => {
                        setCurrentFilter(DEFAULT_ALL);
                        setCurrentPageNum(1);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${currentFilter === DEFAULT_ALL
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg -translate-y-0.5'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    全部
                </button>
                {categories.map(c => (
                    <button
                        onClick={() => {
                            setCurrentFilter(c.name);
                            setCurrentPageNum(1);
                        }}
                        className={`flex items-center gap-0.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${currentFilter === c.name
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg -translate-y-0.5'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {c.name}
                        {
                            currentFilter === c.name && <ConfirmDialog
                                title="删除"
                                description={`确定要删除该类型吗${total === 0 ? '？' : `，该类型下的 ${total} 条话术也会被删除？`}`}
                                onConfirm={() => withToastFeedback(() => deleteCategory(c.name))}
                                trigger={
                                    <X size={12} />
                                }
                            />
                        }
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-5 flex-1 overflow-y-auto scrollbar-hidden">
                {/* Script List */}
                <div className="space-y-3 mb-5">
                    {scripts.map(script => (
                        <div
                            key={script.id}
                            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-black/5 transition-all hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div title={script.content} className="text-sm text-gray-850 leading-relaxed mb-3 line-clamp-2">
                                {script.content}
                            </div>

                            <div className="flex flex-wrap gap-1 mb-3">
                                <span className="px-2 py-1 rounded-sm text-xs bg-[#7161F6] text-white">
                                    {script.category}
                                </span>
                                {script.tags.map((tag) => (
                                    <span className={`px-2 py-1 rounded-sm text-xs bg-[#F5F3FF] text-[#7161F6]`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            <div className="flex gap-2">
                                <button
                                    onClick={() => copyScript(script.id!, script.content)}
                                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-emerald-600 hover:bg-emerald-50 transition-all hover:scale-105"
                                >
                                    {copiedId === script.id ? <Check size={12} /> : <Copy size={12} />}
                                    {copiedId === script.id ? '已复制' : '复制'}
                                </button>
                                <button
                                    onClick={() => editScript(script.id!)}
                                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-amber-600 hover:bg-amber-50 transition-all hover:scale-105"
                                >
                                    <Edit size={12} />
                                    <span>编辑</span>
                                </button>

                                <ConfirmDialog
                                    title="删除"
                                    description="确定要删除这条话术吗？"
                                    onConfirm={() => handleDeleteScript(script.id!)}
                                    trigger={
                                        <button className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-red-600 hover:bg-red-50 transition-all hover:scale-105">
                                            <Trash2 size={12} />
                                            <span>删除</span>
                                        </button>
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 p-5">
                    <button
                        onClick={() => goToPage(currentPageNum - 1)}
                        disabled={currentPageNum === 1}
                        className="w-8 h-8 rounded bg-white/50 flex items-center justify-center transition-all hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const page = i + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition-all ${currentPageNum === page
                                    ? 'bg-[#7161F6] text-white'
                                    : 'bg-white/50 hover:bg-indigo-100'
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => goToPage(currentPageNum + 1)}
                        disabled={currentPageNum === totalPages}
                        className="w-8 h-8 rounded bg-white/50 flex items-center justify-center transition-all hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            <SingleInputDialog
                open={openTagsDialog}
                onOpenChange={setOpenTagsDialog}
                title="创建标签"
                placeholder="请输入标签名称"
                onSubmit={(value) => addTag(value)}
            />

            <SingleInputDialog
                open={openCategoryDialog}
                onOpenChange={setOpenCategoryDialog}
                title="创建类型"
                placeholder="请输入类型名称"
                onSubmit={(value) => addCategory(value)}
            />
        </>
    )
}

export default List