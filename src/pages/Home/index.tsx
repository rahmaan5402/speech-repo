import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Mini from '../Mini';
import { useState } from 'react';
import Header from '../Header';

function Home() {
    const [isOpenMini, setIsOpenMini] = useState(true);
    const [side, setSide] = useState<"left" | "right">("right");

    console.log("siderbar side = ", side);

    return (
        <>
            {
                isOpenMini ? (
                    <Mini miniChangeOpen={setIsOpenMini} setSide={setSide} side={side} />
                ) : (
                    <div className={`fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'} w-96 h-screen z-50`}>
                        <div className={`flex flex-col w-full h-full bg-white/95 backdrop-blur-xl shadow-2xl 
                            ${side === 'left' ? 'border-r' : 'border-l'} border-white/20`}>
                            <Header miniChangeOpen={setIsOpenMini} setSide={setSide} side={side}/>
                            <Outlet />
                            <Toaster />
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default Home
