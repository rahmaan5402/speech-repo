import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTagStore } from '@/store/tags';
import { useTranslation } from 'react-i18next';
import { useCategoryStore } from '@/store/categories';
import { useScriptStore } from '@/store/scripts';
import { useToastFeedback } from '@/hooks/useToastFeedback';

function TagsDialog({ open, onOpenChange, defaultTagType }: TagsDialogProps) {
    const { currentFilter } = useScriptStore();
    const { categories } = useCategoryStore();
    const withToastFeedback = useToastFeedback();

    const { t } = useTranslation();
    const { addTag } = useTagStore();
    const [tagName, setTagName] = useState('');
    const [tagType, setTagType] = useState(defaultTagType || currentFilter);
    const [loading, setLoading] = useState(false);
    const [tagNameError, setTagNameError] = useState<string | null>(null);
    const [tagTypeError, setTagTypeError] = useState<string | null>(null);

    // 当对话框打开或默认标签类型改变时，重置表单
    useEffect(() => {
        if (open) {
            setTagName('');
            setTagType(defaultTagType || currentFilter);
            setTagNameError(null);
            setTagTypeError(null);
        }
    }, [open, defaultTagType, currentFilter]);

    // 标签验证函数 - 检查是否包含中文或英文逗号
    const validateTag = (value: string): string | null => {
        if (value.includes(',') || value.includes('，')) {
            return t('dialog.tag.error.comma');
        }
        if (!value.trim()) {
            return t('dialog.tag.error.empty');
        }
        return null;
    };

    const handleSubmit = async () => {
        // 清除之前的错误状态
        setTagNameError(null);
        setTagTypeError(null);
        // 验证类型
        if (!tagType) {
            setTagTypeError(t('dialog.tag.error.type'));
        }
        // 验证标签名称
        const nameError = validateTag(tagName);
        if (nameError) {
            setTagNameError(nameError);
        }
        // 如果有任何错误，不提交表单
        if (!tagType || nameError) {
            return;
        }
        setLoading(true);
        try {
            // 根据 tagType 实现不同类型的标签创建逻辑
            withToastFeedback(() => addTag(tagType, tagName));
            onOpenChange(false);
        } catch (err) {
            console.error('添加标签失败:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('dialog.tag.title')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 pt-4">
                    {/* 类型选择框 */}
                    <div className="grid grid-cols-4 items-center gap-2">
                        <Label htmlFor="tagType" className="text-gray-700 text-right">
                            {t('dialog.tag.type')}
                        </Label>
                        <Select value={tagType} onValueChange={(value) => {
                            setTagType(value);
                            // 清除类型错误
                            setTagTypeError(null);
                        }}>
                            <SelectTrigger id="tagType" className={`col-span-3 w-full ${tagTypeError ? 'border-red-500 focus:ring-red-500' : ''}`}>
                                <SelectValue placeholder={t('dialog.tag.type.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 标签名称输入框 */}
                    <div className="grid grid-cols-4 items-center gap-2">
                        <Label htmlFor="tagName" className="text-gray-700 text-right">
                            {t('dialog.tag.name')}
                        </Label>
                        <Input
                            id="tagName"
                            placeholder={t('dialog.tag.name.placeholder')}
                            value={tagName}
                            onChange={(e) => {
                                setTagName(e.target.value);
                                setTagNameError(null);
                            }}
                            className={`col-span-3 ${tagNameError ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                        {(tagTypeError || tagNameError) && (
                            <div className="col-start-2 col-span-3">
                                <p className="text-red-500 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                                    {tagTypeError || tagNameError}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        className="bg-[#7161F6] hover:bg-[#7161F6]"
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || !!tagTypeError || !!tagNameError}
                    >
                        {loading ? t('dialog.common.action.saving') : t('dialog.common.action.save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default TagsDialog;