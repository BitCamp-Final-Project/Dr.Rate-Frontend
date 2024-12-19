import React, { useState, useEffect } from 'react';
import styles from './AdminEmailInquirePage.module.scss';

const AdminEmailInquirePage = () => {
    const [isMobileView, setIsMobileView] = useState(false); // 모바일 뷰 여부
    const [showAdminSection, setShowAdminSection] = useState(false); // 관리자 섹션 보기 여부

    useEffect(() => {
        const handleResize = () => {
            // 880px 이하일 때 모바일 뷰로 전환
            setIsMobileView(window.innerWidth <= 880);
        };

        // 초기화 및 리스너 설정
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize); // 리스너 정리
    }, []);

    return (
        <div className={styles.emailInquireDiv}>
            <div className={styles.emailInquireListArea}>
                {/* 유저 문의 섹션 */}
                {!isMobileView || !showAdminSection ? (
                    <div className={styles.emailInquireListUser}>
                        <div className={styles.inquiryType}>문의 유형</div>
                        <div className={styles.userName}>유저 이름</div>
                        <div className={styles.userEmail}>이메일</div>
                        <div className={styles.inquiryTitle}>제목</div>
                        <div className={styles.inquiryContent}>문의 내용</div>
                        <div className={styles.inquiryAttachment}>첨부 파일</div>

                        {/* 버튼 - 880px 이하에서만 렌더링 */}
                        {isMobileView && (
                            <div className={styles.toggleButtons}>
                                <button onClick={() => setShowAdminSection(true)}>관리자 답변 작성</button>
                            </div>
                        )}
                    </div>
                ) : null}

                {/* 관리자 답변 섹션 */}
                {!isMobileView || showAdminSection ? (
                    <div className={styles.emailInquireListAdmin}>
                        <div className={styles.sendEmailSection}>
                            <p>보내는 이메일:</p>
                            <input type="email" placeholder="admin@example.com" />
                            <button>동일 이메일</button>
                        </div>
                        <div className={styles.emailTitle}>
                            <label>제목</label>
                            <input type="text" placeholder="답변 제목을 입력하세요" />
                        </div>
                        <div className={styles.emailContent}>
                            <label>문의 내용</label>
                            <textarea placeholder="답변 내용을 작성하세요" rows="10"></textarea>
                        </div>
                        <div className={styles.emailAttachment}>
                            <p>첨부 파일</p>
                            <input type="file" />
                        </div>

                        {/* 버튼 - 880px 이하에서만 렌더링 */}
                        {isMobileView && (
                            <div className={styles.toggleButtons}>
                                <button onClick={() => setShowAdminSection(false)}>유저 문의 보기</button>
                                <button>문의 작성</button>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default AdminEmailInquirePage;
