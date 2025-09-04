import { Outlet, useNavigate } from 'react-router-dom';
import Mini from '../Mini';
import { useEffect, useState } from 'react';
// import Header from '../Header';
import { Toaster } from '@/components/ui/sonner';
import { ChevronLast } from 'lucide-react';
import { toggleSidebar } from '@/lib/utils';
import Action from '../Action';

// 创建一个全局变量来保存最后聚焦的输入元素
let lastFocusedInput: HTMLInputElement | HTMLTextAreaElement | HTMLElement | null = null;

function Home() {
    const [isOpenMini, setIsOpenMini] = useState(true);
    const [side, setSide] = useState<"left" | "right">("right");
    const navigate = useNavigate();

    const handleSidebarClose = () => {
        setIsOpenMini(true);
        setSide(side);
        toggleSidebar(false);
    }

    const handleSidebarOpen = () => {
        setIsOpenMini(false);
        navigate('/');
    }

    // 初始化时添加文本聚焦监听
    useEffect(() => {
        const handleFocusIn = (e: FocusEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement 
                || (e.target instanceof HTMLElement && e.target.isContentEditable)) {
                lastFocusedInput = e.target;
            }
        };
        document.addEventListener("focusin", handleFocusIn);
        
        // 添加清理函数，移除事件监听器
        return () => {
            document.removeEventListener("focusin", handleFocusIn);
        };
    }, []);

    return (
        <>
            {
                isOpenMini ? (
                    <Mini miniChangeOpen={handleSidebarOpen} setSide={setSide} side={side} />
                ) : (
                    <div className={`fixed top-0 right-0 w-[410px] h-screen z-50`}>
                        <div className={`fixed top-0 right-0 w-[410px] h-screen z-50 flex`}>
                            {/* 关闭按钮 - 放在侧边栏外面，但 z-index 更低 */}
                            <div
                                onClick={handleSidebarClose}
                                className={`fixed top-1/2 right-[410px] transform -translate-y-1/2 w-8 h-8 rounded-lg bg-white/95 backdrop-blur-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 border border-white/20 z-40`}
                                style={{ marginRight: "-10px", boxShadow: "rgba(0, 0, 0, 0.1) -2px 0px 8px" }} // 让按钮向右偏移 4px，露出更多图标
                            >
                                <span className="text-gray-700 font-bold transform translate-x-0.5 mr-2"> {/* 微调图标位置 */}
                                    <ChevronLast size={16} />
                                </span>
                            </div>

                            {/* 侧边栏 - z-index 更高，覆盖按钮 */}
                            <div className={`relative flex flex-col w-full h-full bg-white/95 backdrop-blur-xl border-l border-white/20 z-50`}>
                                <Outlet />
                                <Toaster />
                            </div>
                            <Action />
                        </div>
                    </div >
                )
            }
        </>
    );
}

// 导出获取最后聚焦输入元素的方法，供其他组件使用
export const getLastFocusedInput = (): HTMLInputElement | HTMLTextAreaElement | HTMLElement | null => {
    return lastFocusedInput;
};

export default Home
