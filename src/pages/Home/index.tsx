import { Outlet } from 'react-router-dom';
import Mini from '../Mini';
import { useState } from 'react';
import Header from '../Header';
import { Toaster } from '@/components/ui/sonner';
import { ChevronLast, Globe } from 'lucide-react';
import { toggleSidebar } from '@/lib/utils';
import i18n from '@/i18n/i18n';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

function Home() {
    const [isOpenMini, setIsOpenMini] = useState(true);
    const [side, setSide] = useState<"left" | "right">("right");

    const handleSidebarClose = () => {
        setIsOpenMini(true);
        setSide(side);
        toggleSidebar(false);
    }

    return (
        <>
            {
                isOpenMini ? (
                    <Mini miniChangeOpen={setIsOpenMini} setSide={setSide} side={side} />
                ) : (
                    <div className={`fixed top-0 right-0 w-[360px] h-screen z-50`}>
                        <div className={`fixed top-0 right-0 w-[360px] h-screen z-50`}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className={`fixed top-1/2 right-[360px] transform -translate-y-1/2 w-8 h-8 rounded-lg bg-white/95 backdrop-blur-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 border border-white/20 z-40`}
                                        style={{ marginRight: "-10px", boxShadow: "rgba(0, 0, 0, 0.1) -2px 0px 8px", marginTop: "-35px" }}
                                    >
                                        <span className="text-gray-700 font-bold transform translate-x-0.5 mr-2">
                                            <Globe size={16} />
                                        </span>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent forceMount={true} side={'left'} align={'start'}>
                                    <DropdownMenuItem onClick={() => i18n.changeLanguage('zh')}>中文</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => i18n.changeLanguage('en')}>English</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* 关闭按钮 - 放在侧边栏外面，但 z-index 更低 */}
                            <div
                                onClick={handleSidebarClose}
                                className={`fixed top-1/2 right-[360px] transform -translate-y-1/2 w-8 h-8 rounded-lg bg-white/95 backdrop-blur-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 border border-white/20 z-40`}
                                style={{ marginRight: "-10px", boxShadow: "rgba(0, 0, 0, 0.1) -2px 0px 8px" }} // 让按钮向右偏移 4px，露出更多图标
                            >
                                <span className="text-gray-700 font-bold transform translate-x-0.5 mr-2"> {/* 微调图标位置 */}
                                    <ChevronLast size={16} />
                                </span>
                            </div>

                            {/* 侧边栏 - z-index 更高，覆盖按钮 */}
                            <div className={`relative flex flex-col w-full h-full bg-white/95 backdrop-blur-xl border-l border-white/20 z-50`}>
                                <Header />
                                <Outlet />
                                <Toaster />
                            </div>
                        </div>
                    </div >
                )
            }
        </>
    );
}

export default Home
