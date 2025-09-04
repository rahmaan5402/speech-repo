import { MultiSelect } from '@/components/multi-select';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useScriptStore } from '@/store/scripts';
import { useEffect, useState } from 'react';
import { useTagStore } from '@/store/tags';
import { useCategoryStore } from '@/store/categories';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';


const initScript: Script = {
    content: '',
    category: '',
    tags: [],
}

function Create() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { control, getValues, reset, trigger, setValue, formState: { errors } } = useForm({ defaultValues: initScript });
    const {
        addScript,
        getScriptById,
        updateScript
    } = useScriptStore();
    const { categories, loadCategories } = useCategoryStore();
    const { getTagsByCategory } = useTagStore();
    const location = useLocation();
    // 首先在组件中添加状态来存储标签
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    let options: Option[] = [];

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const id = query.get("id");
        if (id) {
            const fetchData = async () => {
                const script = await getScriptById(Number(id));
                // 获取当前分类的标签 
                if (script) {
                    const tags = await getTagsByCategory(script?.category);
                    setAvailableTags(tags);
                    reset(script);
                }
            };
            fetchData();
        }
        loadCategories();
    }, []);

    // 保存话术
    const saveScript = async () => {
        const isValid = await trigger();
        if (!isValid) {
            const firstErrorKey = Object.keys(errors)[0] as keyof typeof errors;
            const firstError = errors[firstErrorKey];
            // 显示该字段的提示信息，如果没有就显示默认
            toast.warning(
                typeof firstError?.message === "string"
                    ? firstError.message
                    : t('form.speech.action.warning'),
                {
                    action: {
                        label: "OK",
                        onClick: () => console.log("OK"),
                    },
                    className: ""
                }
            );
            return;
        }
        const { id, ...value } = getValues() as Script;
        if (id) {
            await updateScript({ ...value, id });
        } else {
            await addScript(value);
        }
        navigate(`/?category=${value.category}`) // 返回首页
    }

    // 如果有可用标签，转换为 Option 格式
    if (availableTags.length !== 0) {
        options = availableTags.map(tag => ({ value: tag.name, label: tag.name }));
    }

    return (
        <>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-5 shadow-lg">
                <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">{t('header.title')}</p>
                    <div className='flex gap-2.5 items-center'>
                    </div>
                </div>
            </div>
            {/* Content */}
            <div className="p-5 h-[520px] overflow-y-auto">
                <div className="space-y-5">
                    <Controller
                        name="content"
                        control={control}
                        rules={{ required: t('form.speech.content.required') }}
                        render={({ field }) => (
                            <>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('form.speech.content')}
                                </label>
                                <Textarea
                                    {...field}
                                    className="resize-none min-h-[120px]"
                                    placeholder={t('form.speech.content.placeholder')} />
                            </>
                        )}
                    />

                    <Controller
                        name="category"
                        control={control}
                        rules={{ required: t('form.speech.category.required') }}
                        render={({ field }) => (
                            <>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('form.speech.category')}
                                </label>
                                <Select
                                    onValueChange={async (value) => {
                                        field.onChange(value);
                                        const tags = await getTagsByCategory(value);
                                        // 更新可用标签状态
                                        setAvailableTags(tags);
                                        // 清空已选择的标签
                                        setValue('tags', []);
                                    }}
                                    value={field.value}>
                                    <SelectTrigger className="w-[100%]">
                                        <SelectValue placeholder={t('form.speech.category.placeholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                categories.map(c => (
                                                    <SelectItem value={c.name}>{c.name}</SelectItem>
                                                ))
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </>
                        )}
                    />

                    <Controller
                        name="tags"
                        control={control}
                        render={({ field }) => (
                            <>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('form.speech.tag')}
                                </label>
                                <MultiSelect
                                    options={options}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    placeholder={t('form.speech.tag.placeholder')}
                                    variant="inverted"
                                    maxCount={3}
                                />
                            </>
                        )}
                    />

                    {/* Actions */}
                    <div className="flex gap-3 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate(`/`)}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded text-sm font-medium transition-all hover:bg-gray-200"
                        >
                            {t('form.speech.action.cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={saveScript}
                            className="flex-1 bg-[#7161F6] text-white py-3 rounded text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            {t('form.speech.action.save')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Create