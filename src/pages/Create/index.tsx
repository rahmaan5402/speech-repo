import { MultiSelect } from '@/components/multi-select';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useScriptStore } from '@/store/scripts';
import { useEffect } from 'react';
import { useTagStore } from '@/store/tags';
import { useCategoryStore } from '@/store/categories';
import { withToastFeedback } from '@/utils/withToastFeedback';
import { toast } from 'sonner';


const initScript: Script = {
    content: '',
    category: '',
    tags: [],
}

function Create() {
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
                    : "请填写完整信息",
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
            withToastFeedback(() => updateScript({ ...values, id }));
        } else {
            withToastFeedback(() => addScript(values));
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
                        rules={{ required: "话术内容不能为空" }}
                        render={({ field }) => (
                            <>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    话术内容
                                </label>
                                <Textarea
                                    {...field}
                                    className="resize-none min-h-[120px]"
                                    placeholder="请输入话术内容..." />
                            </>
                        )}
                    />

                    <Controller
                        name="category"
                        control={control}
                        rules={{ required: "类型不能为空" }}
                        render={({ field }) => (
                            <>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    类型
                                </label>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-[100%]">
                                        <SelectValue placeholder="请选择类型" />
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
                                    标签
                                </label>
                                <MultiSelect
                                    options={options}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    placeholder="请选择标签"
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
                            返回
                        </button>
                        <button
                            type="button"
                            onClick={saveScript}
                            className="flex-1 bg-[#7161F6] text-white py-3 rounded text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            保存话术
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Create