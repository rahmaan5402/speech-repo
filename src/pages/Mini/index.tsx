import { useEffect, useRef, useState } from 'react'
import './index.css'
import { toggleSidebar } from '@/lib/utils';

function Mini({ miniChangeOpen, setSide, side }: MiniProps) {
    const [position, setPosition] = useState({
        x: side === "left" ? 0 : window.innerWidth - 40,
        y: window.innerHeight / 2,
    });
    const [isDragging, setIsDragging] = useState(false);
    const [isReturning, setIsReturning] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<any>(null);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const offsetRef = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: any) => {
        if (e.button !== 0) return;
        e.preventDefault();
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        const rect = buttonRef.current.getBoundingClientRect();
        offsetRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        const handleMouseMoveStart = (moveEvent: any) => {
            if (
                Math.abs(moveEvent.clientX - dragStartRef.current.x) > 5 ||
                Math.abs(moveEvent.clientY - dragStartRef.current.y) > 5
            ) {
                setIsDragging(true);
                setIsReturning(false);
                document.body.classList.add("dragging");
                document.removeEventListener("mousemove", handleMouseMoveStart);
            }
        };
        document.addEventListener("mousemove", handleMouseMoveStart);
        document.addEventListener(
            "mouseup",
            () => {
                document.removeEventListener("mousemove", handleMouseMoveStart);
            },
            { once: true },
        );
    };
    const handleClick = (e: any) => {
        if (
            Math.abs(e.clientX - dragStartRef.current.x) > 5 ||
            Math.abs(e.clientY - dragStartRef.current.y) > 5
        ) {
            return;
        }
        setIsOpen(!isOpen);
        // open sidebar
        miniChangeOpen(false);
        // resize layout
        toggleSidebar(true);
    };
    const handleMouseMove = (e: any) => {
        if (!isDragging) return;
        const newX = e.clientX - offsetRef.current.x;
        const newY = e.clientY - offsetRef.current.y;
        const maxX = window.innerWidth - 60;
        const maxY = window.innerHeight - 60;
        const clampedX = Math.max(-20, Math.min(maxX, newX));
        const clampedY = Math.max(20, Math.min(maxY, newY));
        setPosition({ x: clampedX, y: clampedY });
    };
    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        setIsReturning(true);
        document.body.classList.remove("dragging");
        const centerX = window.innerWidth / 2;
        const targetSide = position.x < centerX ? "left" : "right";
        const targetX = targetSide === "left" ? 0 : window.innerWidth - 40;
        setSide(targetSide);
        setPosition((prev) => ({ ...prev, x: targetX }));
        setTimeout(() => {
            setIsReturning(false);
        }, 600);
    };
    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging, position.x]);
    useEffect(() => {
        const handleResize = () => {
            const centerX = window.innerWidth / 2;
            const currentSide = position.x < centerX ? "left" : "right";
            const targetX = currentSide === "left" ? -20 : window.innerWidth - 40;
            if (!isDragging) {
                setSide(currentSide);
                setPosition((prev) => ({ ...prev, x: targetX }));
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isDragging, position.x]);
    const getButtonOpacity = () => {
        if (isDragging) {
            const centerX = window.innerWidth / 2;
            const distanceFromCenter = Math.abs(position.x - centerX);
            const maxDistance = centerX;
            return Math.max(0.7, 1 - (distanceFromCenter / maxDistance) * 0.3);
        }
        return side === "left" || side === "right" ? 0.8 : 1;
    };
    const getButtonScale = () => {
        if (isDragging) {
            const centerX = window.innerWidth / 2;
            const distanceFromCenter = Math.abs(position.x - centerX);
            const maxDistance = centerX;
            return Math.max(1, 1 + (1 - distanceFromCenter / maxDistance) * 0.1);
        }
        return 1;
    };
    const getButtonShadow = () => {
        if (isDragging) {
            return "shadow-2xl";
        }
        return "shadow-lg hover:shadow-xl";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            <div
                ref={buttonRef}
                className={`
                    drag-button fixed w-10 h-10 bg-primary text-white rounded-full
                    flex items-center justify-center cursor-grab hover:cursor-grab
                    ${getButtonShadow()}
                    ${isDragging ? "dragging cursor-grabbing" : ""}
                    ${isReturning ? "returning" : ""}
                    ${isOpen ? "opacity-0 pointer-events-none" : ""}
                `}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    opacity: isOpen ? 0 : getButtonOpacity(),
                    transform: `scale(${getButtonScale()}) ${isDragging ? "rotate(5deg)" : "rotate(0deg)"}`,
                    zIndex: isDragging ? 9999 : 1000,
                }}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
            >
                <div className="w-8 h-8 flex items-center justify-center">
                    <img src={"./speech.png"} />
                </div>
            </div>
        </div>
    )
}

export default Mini