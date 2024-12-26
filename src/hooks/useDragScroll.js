import React, { useEffect, useRef, useState } from 'react';

const useDragScroll = () => {
    
        /* 드레그 */
        const bankListRef = useRef(null);
        const [isDragging, setIsDragging] = useState(false); // 드래그 상태 추적
        const [startX, setStartX] = useState(0); // 드래그 시작 위치
        const [scrollLeft, setScrollLeft] = useState(0); // 초기 scrollLeft 상태
    
        // 드레그  - 현재 스크롤 위치 저장 
        const handleMouseDown = (e) => {
            setIsDragging(true);
            setStartX(e.clientX); // 드래그 시작 X 좌표
            setScrollLeft(bankListRef.current.scrollLeft);
        };
    
        // 드레그 - 드래그 중일 때만 처리
        const handleMouseMove = (e) => {
            if (!isDragging) return;
    
            const distance = e.clientX - startX; // 마우스 이동 거리
            bankListRef.current.scrollLeft = scrollLeft - distance; // 스크롤 이동
        };
    
        // 드레그 - 종료
        const handleMouseUp = () => {
            setIsDragging(false);
        };
    
    
        // 마우스 이벤트 바인딩
        useEffect(() => {
            const list = bankListRef.current;
    
            if(list){
                list.addEventListener('mousedown', handleMouseDown);
                list.addEventListener('mousemove', handleMouseMove);
                list.addEventListener('mouseup', handleMouseUp);
                // 마우스가 리스트 밖으로 나갔을 때
                list.addEventListener('mouseleave', handleMouseUp);
        
                return () => {
                    list.removeEventListener('mousedown', handleMouseDown);
                    list.removeEventListener('mousemove', handleMouseMove);
                    list.removeEventListener('mouseup', handleMouseUp);
                    list.removeEventListener('mouseleave', handleMouseUp);
                };
            }
        }, [isDragging, startX, scrollLeft]);
    
    
        /* 스크롤 */
        const scrollList = (direction) => {
            const scrollAmount = 150;
            const duration = 300;
            const start = bankListRef.current.scrollLeft;
            const end = direction === 'left' ? start - scrollAmount : start + scrollAmount;
            const startTime = performance.now();
    
            // 애니메이션
            const animateScroll = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                bankListRef.current.scrollLeft = start + (end - start) * progress;
    
                if (progress < 1) {
                requestAnimationFrame(animateScroll);
                }
            };
    
            requestAnimationFrame(animateScroll);
        };
    
    return {
        bankListRef,
        scrollList
    };
};

export default useDragScroll;