import { useEffect, useState } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    Check,
    Edit,
    Trash2,
    EllipsisVertical,
    ChevronDown
} from 'lucide-react';
import { useScriptStore } from '@/store/scripts';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCategoryStore } from '@/store/categories';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { pageSize } from '@/lib/constants';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useTagStore } from '@/store/tags';
import { getLastFocusedInput } from '../Home';

function List() {
    const { t } = useTranslation();
    const [currentPageNum, setCurrentPageNum] = useState(1);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [scriptIdToDelete, setScriptIdToDelete] = useState<number | null>(null);
    const navigate = useNavigate();
    // 打开话术操作下拉菜单
    const [openDropdowns, setOpenDropdowns] = useState<Set<number>>(new Set());
    // 在组件顶部添加一个状态
    // @ts-ignore
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // 标签页面的展开状态.
    const [isTagsExpanded, setIsTagsExpanded] = useState(false);
    const location = useLocation();

    const {
        scripts,
        total,
        deleteScript,
        deleteCategory,
        currentFilter,
        setCurrentFilter,
        loadScriptsByCategoryAndTags
    } = useScriptStore();
    const { categories, loadCategories } = useCategoryStore();
    const {
        selectedTags,
        setSelectedTags,
        allTagsByCategory,
        getTagsByCategory
    } = useTagStore();

    // 初始化时加载分类
    useEffect(() => {
        loadCategories();
    }, []);

    const handleCategoryChange = async (category: string) => {
        const newPage = 1;
        const newTags: string[] = [];

        setCurrentFilter(category);
        setCurrentPageNum(newPage);
        setSelectedTags(newTags);

        await getTagsByCategory(category);
        // 直接加载脚本，避免依赖更新导致的多次触发
        await loadScriptsByCategoryAndTags(newPage, pageSize, category, newTags);
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const category = queryParams.get('category');
        console.log("queryParams category = ", category);
        // 如果有默认的分类则加载默认的
        if (category) {
            handleCategoryChange(category);
        } else {
            // 没有默认分类时，默认选择第一个分类
            if (categories && categories.length > 0) {
                handleCategoryChange(categories[0].name);
            } else {
                handleCategoryChange('');
            }
        }
    }, [categories]);

    const totalPages = Math.ceil(total / pageSize);

    const goToPage = async (page: number) => {
        setCurrentPageNum(page);
        await loadScriptsByCategoryAndTags(page, pageSize, currentFilter, selectedTags);
    };

    const copyScript = async (id: number, text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            toast.success(t('action.copied'), {
                icon: <Check size={14} className="text-emerald-600" />
            });
            setTimeout(() => setCopiedId(null), 3000);

            // 使用 lastFocusedInput 或 document.activeElement
            const el = getLastFocusedInput();
            if (!el) return;

            // ---------- 1. input / textarea ----------
            if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
                const start = el.selectionStart ?? el.value.length;
                const end = el.selectionEnd ?? el.value.length;

                const newValue = el.value.substring(0, start) + text + el.value.substring(end);
                setNativeValue(el, newValue);

                el.dispatchEvent(new Event("input", { bubbles: true, composed: true }));

                const cursorPos = start + text.length;
                el.focus();
                el.setSelectionRange(cursorPos, cursorPos);

                // ---------- 2. contenteditable div ----------
            } else if (el instanceof HTMLElement && el.isContentEditable) {
                el.focus();

                // 如果是富文本编辑器（例如 Draft.js），用 execCommand 插入文本
                const isRichText = el.querySelector("[data-offset-key]") !== null;
                if (isRichText) {
                    // execCommand 会触发框架内部状态更新，插入到光标位置
                    document.execCommand("insertText", false, text);
                } else {
                    // 普通 contenteditable，用 Range 插入
                    const selection = window.getSelection();
                    if (!selection) return;

                    let range: Range;
                    if (selection.rangeCount > 0) {
                        range = selection.getRangeAt(0);
                    } else {
                        range = document.createRange();
                        range.selectNodeContents(el);
                        range.collapse(false);
                    }

                    const textNode = document.createTextNode(text);
                    range.deleteContents();
                    range.insertNode(textNode);

                    // 光标移动到插入文本末尾
                    range.setStartAfter(textNode);
                    range.setEndAfter(textNode);
                    selection.removeAllRanges();
                    selection.addRange(range);

                    el.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
                }
            } else {
                console.warn("无法插入文本，lastFocusedInput 不支持该元素:", el);
            }
        } catch (err) {
            console.error('复制失败:', err);
        }
    };


    function setNativeValue(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
        const { set: valueSetter } =
            Object.getOwnPropertyDescriptor(element, "value") || {};
        const prototype = Object.getPrototypeOf(element);
        const { set: prototypeValueSetter } =
            Object.getOwnPropertyDescriptor(prototype, "value") || {};

        if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else if (valueSetter) {
            valueSetter.call(element, value);
        } else {
            throw new Error("The given element does not have a value setter");
        }
    }

    const editScript = (id: number) => {
        navigate(`/create?id=${id}`);
    };

    // 处理标签选择
    const handleTagClick = (tag: string, hasSkip: boolean) => {
        // 如果对话框是打开状态，则不执行任何操作
        if (!hasSkip) {
            if (isDialogOpen) {
                return;
            }
        }
        // 计算新的选中标签数组
        let newSelectedTags: string[];
        if (selectedTags.includes(tag)) {
            // 如果标签已选中，则取消选中
            newSelectedTags = selectedTags.filter(t => t !== tag);
        } else {
            // 如果标签未选中，则添加到选中列表
            newSelectedTags = [...selectedTags, tag];
        }
        // 更新选中标签状态
        setSelectedTags(newSelectedTags);
        // 重新加载脚本列表
        loadScriptsByCategoryAndTags(currentPageNum, pageSize, currentFilter, newSelectedTags);
    };

    const handleDelete = (id: number) => {
        setScriptIdToDelete(id);
        setOpenConfirmDialog(true);
    }

    const handleDeleteScript = async (id: number) => {
        await deleteScript(id);
        await loadScriptsByCategoryAndTags(1, pageSize, currentFilter, selectedTags);
    };

    return (
        <>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-5 shadow-lg">
                <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">{t('header.title')}</p>
                    <div className='flex gap-2.5 items-center'>
                        <Select value={currentFilter} onValueChange={(e) => {
                            handleCategoryChange(e);
                        }}>
                            <SelectTrigger className="w-[120px] bg-white/5">
                                <SelectValue placeholder={t("category.placeholder")} />
                            </SelectTrigger>
                            <SelectContent className="min-w-[5rem]">
                                <SelectGroup>
                                    {
                                        categories.map((c) => (
                                            <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <ConfirmDialog
                            title={t('category.delete')}
                            description={t(total === 0 ? 'category.delete.confirm' : 'category.delete.confirm.withItems', {
                                category: currentFilter,
                                count: total
                            })}
                            onConfirm={() => deleteCategory(currentFilter)}
                            trigger={
                                <Trash2 size={16} className='hover:text-red-400' />
                            }
                            confirmText={t('dialog.confirm.title')}
                            cancelText={t('dialog.cancel.title')}
                        />
                    </div>
                </div>
            </div>

            <div className='relative flex flex-col items-center justify-center z-10'>
                <div className='flex gap-3 items-center justify-start'>
                    <div className={"pt-5 pb-5 flex gap-2 w-[310px] overflow-x-auto scrollbar-hidden transition-all duration-300 ease-in-out"}>
                        {allTagsByCategory.map(tag => (
                            <button
                                key={tag.id}
                                onClick={() => handleTagClick(tag.name, false)}
                                className={`flex items-center gap-0.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-all whitespace-nowrap ${selectedTags.includes(tag.name)
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {tag.name}
                                {/* 删除标签功能 */}
                                {/* {selectedTags.includes(tag.name) && (
                                    <ConfirmDialog
                                        title={t('tag.delete')}
                                        description={t('tag.delete.confirm', { tag: tag.name })}
                                        onConfirm={() => {
                                            setIsDialogOpen(false);
                                            handleTagClick(tag.name, true);
                                            withToastFeedback(() => deleteTagByName(tag.name));
                                        }}
                                        onOpenChange={(open) => {
                                            console.log("ConfirmDialog onOpenChange =", open);
                                            setIsDialogOpen(open);
                                        }}
                                        trigger={
                                            <span onClick={(e) => {
                                                e.stopPropagation();
                                                setIsDialogOpen(true);
                                            }}>
                                                <X size={12} />
                                            </span>
                                        }
                                        confirmText={t('dialog.confirm.title')}
                                        cancelText={t('dialog.cancel.title')}
                                    />
                                )} */}
                            </button>
                        ))}
                    </div>
                    {
                        allTagsByCategory && allTagsByCategory.length > 3 && (
                            <button
                                onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                                className='text-gray-700 hover:text-indigo-600 transition-colors'
                            >
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-300 ${isTagsExpanded ? 'rotate-180' : ''}`}
                                />
                            </button>
                        )
                    }
                </div>
                {isTagsExpanded && (
                    <>
                        <Separator />
                        <div className="absolute top-full left-0 right-0 bg-white border-gray-100 shadow-xl rounded-b-xs z-20 animate-fadeIn" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <div className="p-5 flex flex-wrap gap-2">
                                {allTagsByCategory.map(tag => (
                                    <button
                                        key={`expanded-${tag.id}`}
                                        onClick={() => handleTagClick(tag.name, false)}
                                        className={`flex items-center gap-0.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-all justify-between ${selectedTags.includes(tag.name)
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-md'
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span>{tag.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="relative p-5 pt-0 flex-1 overflow-y-auto scrollbar-hidden">
                <div className="space-y-3 mb-5">
                    <div className="flex flex-col items-center bg-white/70 backdrop-blur-sm">
                        {scripts.map(script => (
                            <div key={script.id} className="w-full">
                                <div title={script.content}
                                    className={`w-[310px] flex items-center text-xs leading-relaxed hover:underline ${openDropdowns.has(script.id!) ? 'underline' : ''} transition-all duration-200 cursor-pointer group`}
                                >
                                    <span>
                                        {copiedId === script.id && <Check size={14} className="mr-1 shrink-0 text-emerald-600" />}
                                    </span>
                                    <div
                                        onClick={() => copyScript(script.id!, script.content)}
                                        className="overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-gray-800">
                                        {script.content}
                                    </div>
                                    <DropdownMenu onOpenChange={(open) => setOpenDropdowns(prev => {
                                        const newSet = new Set(prev);
                                        if (open) {
                                            newSet.add(script.id!);
                                        } else {
                                            newSet.delete(script.id!);
                                        }
                                        return newSet;
                                    })}>
                                        <DropdownMenuTrigger asChild>
                                            <span className={`transition-opacity duration-200 rounded-full bg-gray-100 ${openDropdowns.has(script.id!) ? 'block' : 'hidden group-hover:block'}`}>
                                                <EllipsisVertical size={14} className="text-gray-500" />
                                            </span>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            forceMount={true}
                                            side={'bottom'}
                                            align={'end'}
                                            className="min-w-[5rem] p-0.5"
                                        >
                                            <DropdownMenuItem className="px-1.5 py-1 text-xs" onClick={() => editScript(script.id!)}>
                                                <div className="flex items-center gap-1 text-xs text-amber-600 hover:bg-amber-50 transition-all hover:scale-105">
                                                    <Edit size={8} className="text-amber-600" />
                                                    <span>{t('action.edit')}</span>
                                                </div>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="px-1.5 py-1 text-xs" onClick={() => handleDelete(script.id!)}>
                                                <div className="flex items-center gap-1 text-xs text-red-600 hover:bg-red-50 transition-all hover:scale-105">
                                                    <Trash2 size={8} className="text-red-600" />
                                                    <span>{t('action.delete')}</span>
                                                </div>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


            </div>

            {/* Pagination */}
            <Pagination
                totalPages={totalPages}
                currentPageNum={currentPageNum}
                goToPage={goToPage} />

            <ConfirmDialog
                open={openConfirmDialog}
                onOpenChange={setOpenConfirmDialog}
                title={t('action.delete')}
                description={t('action.delete.confirm')}
                onConfirm={() => handleDeleteScript(scriptIdToDelete)}
                confirmText={t('dialog.confirm.title')}
                cancelText={t('dialog.cancel.title')}
            />


        </>
    )
}

const Pagination = ({ totalPages, currentPageNum, goToPage }: { totalPages: number, currentPageNum: number, goToPage: (page: number) => void }) => {
    return (
        <>
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1.5 p-5">
                    <button
                        onClick={() => goToPage(currentPageNum - 1)}
                        disabled={currentPageNum === 1}
                        className="w-8 h-8 rounded bg-white/50 flex items-center justify-center transition-all hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {/* 生成页码和省略号 */}
                    {(() => {
                        const pages = [];
                        // 总页数不超过5页，直接显示所有页码
                        if (totalPages <= 5) {
                            for (let i = 1; i <= totalPages; i++) {
                                pages.push(
                                    <button
                                        key={i}
                                        onClick={() => goToPage(i)}
                                        className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition-all ${currentPageNum === i
                                            ? 'bg-[#7161F6] text-white'
                                            : 'bg-white/50 hover:bg-indigo-100'
                                            }`}
                                    >
                                        {i}
                                    </button>
                                );
                            }
                        } else {
                            // 总页数超过5页，最多显示5个页码
                            // 显示第一页
                            pages.push(
                                <button
                                    key={1}
                                    onClick={() => goToPage(1)}
                                    className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition-all ${currentPageNum === 1
                                        ? 'bg-[#7161F6] text-white'
                                        : 'bg-white/50 hover:bg-indigo-100'
                                        }`}
                                >
                                    1
                                </button>
                            );

                            // 如果当前页码大于2，添加第一个省略号
                            if (currentPageNum > 2) {
                                pages.push(
                                    <span key="ellipsis1" className="w-4 h-4 flex items-center justify-center text-xs text-gray-500">...</span>
                                );
                            }

                            // 确定要显示的中间页码范围
                            let startPage, endPage;
                            if (currentPageNum <= 2) {
                                // 当前页码靠近前面，显示页码2,3,4
                                startPage = 2;
                                endPage = 4;
                            } else if (currentPageNum >= totalPages - 1) {
                                // 当前页码靠近后面，显示页码totalPages-3, totalPages-2, totalPages-1
                                startPage = totalPages - 3;
                                endPage = totalPages - 1;
                            } else {
                                // 当前页码在中间，显示前一页、当前页、后一页
                                startPage = currentPageNum - 1;
                                endPage = currentPageNum + 1;
                            }

                            // 显示中间页码
                            for (let i = startPage; i <= endPage; i++) {
                                if (i > 1 && i < totalPages) {
                                    pages.push(
                                        <button
                                            key={i}
                                            onClick={() => goToPage(i)}
                                            className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition-all ${currentPageNum === i
                                                ? 'bg-[#7161F6] text-white'
                                                : 'bg-white/50 hover:bg-indigo-100'
                                                }`}
                                        >
                                            {i}
                                        </button>
                                    );
                                }
                            }

                            // 如果当前页码小于totalPages-1，添加第二个省略号
                            if (currentPageNum < totalPages - 1) {
                                pages.push(
                                    <span key="ellipsis2" className="w-4 h-4 flex items-center justify-center text-xs text-gray-500">...</span>
                                );
                            }

                            // 显示最后一页
                            pages.push(
                                <button
                                    key={totalPages}
                                    onClick={() => goToPage(totalPages)}
                                    className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition-all ${currentPageNum === totalPages
                                        ? 'bg-[#7161F6] text-white'
                                        : 'bg-white/50 hover:bg-indigo-100'
                                        }`}
                                >
                                    {totalPages}
                                </button>
                            );
                        }
                        return pages;
                    })()}

                    <button
                        onClick={() => goToPage(currentPageNum + 1)}
                        disabled={currentPageNum === totalPages}
                        className="w-8 h-8 rounded bg-white/50 flex items-center justify-center transition-all hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </>
    );
}

export default List