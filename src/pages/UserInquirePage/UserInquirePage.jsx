import React, { useEffect, useRef } from 'react';
import styles from './UserInquirePage.module.scss'

const UserInquirePage = () => {
    const phoneScreenRef = useRef(null);

    useEffect(() => {
        const phoneScreen = phoneScreenRef.current;
        if (phoneScreen) {
            phoneScreen.scrollTop = phoneScreen.scrollHeight;
        }
    }, []);

    const handleFileUpload = (e) => {
        const file = e.target.files[0]; // 업로드된 파일
        if (file) {
            console.log("파일 업로드됨:", file.name);
            // 파일 업로드 처리 로직 추가
        }
    };

    return (
        <main>
            <section className={styles.body}>
                <section className={styles.userInquireBody}>
                    {/* 헤더 영역 */}
                    <div className={styles.userInquireHeader}>
                        {/* 제목 */}
                        <div className={styles.userInquireTitleArea}>
                            <div className={styles.userInquireTitle}>
                                <h4>관리자와의 1:1 문의</h4>
                            </div>
                        </div>
                        <div className={styles.userInquireQuitArea}>
                            <button className={styles.userInquireQuitBtn}>
                                <h4>문의 종료</h4>
                            </button>
                        </div>
                    </div>

                    <div className={styles.userInquireChat}>
                        <div className={styles.phoneContainer}>
                            <div ref={phoneScreenRef} className={styles.phoneScreen}>
                                <div className={styles.chatMessage}>
                                    <div className={styles.chatBubble}>
                                        안녕하세요. 문의 드릴게 있어서요..
                                    </div>
                                </div>
                                <div className={`${styles.chatMessage} ${styles.myMessage}`}>
                                    <div className={styles.chatBubble}>
                                        네~ 말씀해주세요!
                                    </div>
                                </div>
                                <div className={styles.chatMessage}>
                                    <div className={styles.chatBubble}>
                                        회원 가입이 제대로 안되네요?
                                    </div>
                                </div>
                                <div className={styles.chatMessage}>
                                    <div className={styles.chatBubble}>
                                        안녕하세요. 문의 드릴게 있어서요..
                                    </div>
                                </div>
                                <div className={`${styles.chatMessage} ${styles.myMessage}`}>
                                    <div className={styles.chatBubble}>
                                        네~ 말씀해주세요!
                                    </div>
                                </div>
                                <div className={styles.chatMessage}>
                                    <div className={styles.chatBubble}>
                                        회원 가입이 제대로 안되네요?
                                    </div>
                                </div>
                                <div className={styles.chatMessage}>
                                    <div className={styles.chatBubble}>
                                        안녕하세요. 문의 드릴게 있어서요..
                                    </div>
                                </div>
                                <div className={`${styles.chatMessage} ${styles.myMessage}`}>
                                    <div className={styles.chatBubble}>
                                        네~ 말씀해주세요!
                                    </div>
                                </div>
                                <div className={styles.chatMessage}>
                                    <div className={styles.chatBubble}>
                                        회원 가입이 제대로 안되네요?
                                    </div>
                                </div>
                                <div className={`${styles.chatMessage} ${styles.myMessage}`}>
                                    <div className={styles.chatBubble}>
                                        네~ 말씀해주세요!
                                    </div>
                                </div>
                                <div className={styles.chatMessage}>
                                    <div className={styles.chatBubble}>
                                        회원 가입이 제대로 안되네요?
                                    </div>
                                </div>
                                <div className={`${styles.chatMessage} ${styles.myMessage}`}>
                                    <div className={styles.chatBubble}>
                                        네~ 말씀해주세요!
                                    </div>
                                </div>
                                <div className={styles.chatMessage}>
                                    <div className={styles.chatBubble}>
                                        회원 가입이 제대로 안되네요?
                                    </div>
                                </div>
                            </div>
                            <div className={styles.phoneScreenInput}>
                                <div className={styles.phoneScreenFileInputArea}>
                                    <label htmlFor="file-upload" className={styles.fileUploadButton}>
                                        +
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className={styles.fileInput}
                                        onChange={(e) => handleFileUpload(e)}
                                    />
                                </div>

                                <div className={styles.phoneScreenInputArea}>
                                    <input id='input-message' type='text' placeholder='메세지 입력'></input>
                                    <button className={styles.sendButton}></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
};

export default UserInquirePage;