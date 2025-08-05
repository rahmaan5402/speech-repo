import SingleInputDialog from '@/components/common/SingleInputDialog';
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useCategoryStore } from '@/store/categories';
import { useTagStore } from '@/store/tags';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ miniChangeOpen, setSide, side }: HeaderProps) {
    const navigate = useNavigate();

    const [openTagsDialog, setOpenTagsDialog] = useState(false);
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

    const { addCategory } = useCategoryStore();
    const { addTag } = useTagStore();

    const handleSidebarClose = () => {
        miniChangeOpen(true);
        setSide(side);
    }

    return (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-5 shadow-lg">
            {/* 浮动在右上角的 X 按钮 */}
            <div className="absolute top-1 right-1 bg-white/20 rounded-full p-0.5 cursor-pointer" onClick={handleSidebarClose}>
                <X size={12} />
            </div>
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">话术库</h1>
                <div className='flex gap-2.5 items-center'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-white/30 hover:-translate-y-0.5 flex items-center gap-2"
                            >
                                <Plus size={16} />
                                <span>新建</span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent forceMount={true}>
                            <DropdownMenuItem onClick={() => navigate('/create')}>话术</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenCategoryDialog(true)}>类型</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenTagsDialog(true)}>标签</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

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
                </div>
            </div>
        </div>
    )
}

export default Header