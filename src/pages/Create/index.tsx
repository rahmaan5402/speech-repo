import { MultiSelect } from '@/components/multi-select';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useScriptStore } from '@/store/scripts';
import { useEffect } from 'react';
import { useTagStore } from '@/store/tags';
import { useCategoryStore } from '@/store/categories';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useToastFeedback } from '@/hooks/useToastFeedback';


const initScript: Script = {
    content: '',
    category: '',
    tags: [],
}

function Create() {
    const { t } = useTranslation();
    const withToastFeedback = useToastFeedback();
    const navigate = useNavigate();
    const { control, getValues, reset, trigger, formState: { errors } } = useForm({ defaultValues: initScript });
    const { addScript, getScriptById, updateScript } = useScriptStore();
    const { tags, loadTags } = useTagStore();
    const { categories, loadCategories } = useCategoryStore();
    const location = useLocation();
    let options: Option[] = [];

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const id = query.get("id");
        if (id) {
            const fetchData = async () => {
                const script = await getScriptById(Number(id));
                console.log("script = ", script);
                if (script) {
                    reset(script);
                }
            };
            fetchData();
        }
        loadTags();
        loadCategories();
    }, []);

    const showHomePage = () => {
        navigate('/')
    };

    if (tags.length !== 0) {
        tags.forEach(tag => {
            options.push({ value: tag.name, label: tag.name });
        });
    }

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
        const { id, ...values } = getValues() as Script;
        if (id) {
            await withToastFeedback(() => updateScript({ ...values, id }));
        } else {
            await withToastFeedback(() => addScript(values));
        }
        showHomePage(); // 返回首页
    }

    return (
        <>
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
                                <Select onValueChange={field.onChange} value={field.value}>
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
                            onClick={showHomePage}
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