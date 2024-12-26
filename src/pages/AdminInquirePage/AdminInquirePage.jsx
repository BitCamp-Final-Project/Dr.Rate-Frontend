import React, { useEffect, useRef, useState } from 'react';
import styles from './AdminInquirePage.module.scss';
import { useLocation } from 'react-router-dom';
import { Stomp } from '@stomp/stompjs';
import { parseJwt } from "src/utils/jwt";
import useModal from 'src/hooks/useModal';
import AlertModal from 'src/components/Modal/AlertModal';
import ConfirmModal from 'src/components/Modal/ConfirmModal';
import { PATH } from 'src/utils/path';
import api from 'src/apis/axiosInstanceAPI';

const AdminInquirePage = () => {
    const { state } = useLocation();
    const token = localStorage.getItem("Authorization");
    const adminId = parseJwt(token)?.id;  // access token을 parse하여 id값 가져옴
    const roomId = state?.roomId || null; // 이전 list 페이지에서 전달된 roomId  
    const phoneScreenRef = useRef(null); // 스크롤 처리를 위한 ref
    const [messages, setMessages] = useState([]); // 메세지 데이터 저장
    const [page, setPage] = useState(0);  // 현재 페이지 상태
    const [isLastPage, setIsLastPage] = useState(false); // 마지막 페이지 여부 상태
    const [inputMessage, setInputMessage] = useState(""); // 메시지 입력 필드 상태
    const [stompClient, setStompClient] = useState(null); // WebSocket STOMP 클라이언트 상태

    const [isDragging, setIsDragging] = useState(false); // 드래그 상태

    const {
        isAlertOpen,
        openAlertModal,
        closeAlertModal,
        alertContent,
        isConfirmOpen,
        openConfirmModal,
        closeConfirmModal,
        confirmContent,
    } = useModal();

    /* 이벤트 처리 영역 */
    // roomId나 page가 변경될 때 메시지 데이터를 가져옴
    useEffect(() => {
        if (roomId) {
            fetchMessage(roomId, page);
        }
    }, [roomId, page]);


    // messages 상태가 변경될 때마다 화면을 스크롤하여 최신 메시지로 이동
    useEffect(() => {
        const phoneScreen = phoneScreenRef.current;

        if (phoneScreen && page === 0) { // 페이지가 처음 로드될 때만 맨 아래로 스크롤
            phoneScreen.scrollTop = phoneScreen.scrollHeight;
        }
    }, [messages, page]); // messages와 page가 변경될 때 실행



    // 스크롤이 맨 위에 도달했을 때 페이지를 증가시켜 이전 메시지를 가져옴
    const handleScroll = () => {
        const phoneScreen = phoneScreenRef.current;
        if (phoneScreen && phoneScreen.scrollTop === 0 && !isLastPage) {
            setPage(prevPage => prevPage + 1); // 다음 페이지 로드
        }
    };

    // 입력 메시지를 STOMP 클라이언트를 통해 서버로 전송
    const handleSendMessage = () => {
        if (inputMessage.trim() === "" || !stompClient) return; // 메시지가 비어있거나 WebSocket 연결이 없을 경우 종료

        const messagePayload = {
            content: inputMessage,
            senderId: adminId, // 관리자 ID
            roomId: roomId,
        };

        // WebSocket 메시지 전송
        stompClient.send(
            `/pub/chat/room/${roomId}`,
            { Authorization: `Bearer ${token}` },
            JSON.stringify(messagePayload)
        );

        setInputMessage(""); // 입력창 초기화
    };

    // Enter 키 입력 시 메시지 전송
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    /* 드래그 이벤트 */
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true); // 드래그 상태 활성화
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false); // 드래그 상태 비활성화
    };


    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false); // 드래그 상태 비활성화

        const file = e.dataTransfer.files[0]; // 드롭된 파일 가져오기
        if (file) {
            openConfirmModal(
                "파일 업로드",
                `파일명: ${file.name}, 크기: ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                () => {
                    handleFileUpload(file); // 파일 업로드 로직 실행
                    closeConfirmModal();
                },
                () => closeConfirmModal()
            );
        }
    };

    // 이미지를 클릭했을 때 모달에 표시
    const handleImageClick = (imageUrl) => {
        openAlertModal("이미지 보기", imageUrl);
    };


    /* Api 처리 영역 */

    // WebSocket 연결 및 STOMP 클라이언트 설정
    useEffect(() => {
        if (roomId) {
            let retries = 1000; // Kafka 토픽 준비를 위한 최대 재시도 횟수
    
            const connectWebSocket = () => {
                const socket = new WebSocket(`${PATH.SERVER}/ws`);
                const client = Stomp.over(socket);
    
                client.connect(
                    { Authorization: `Bearer ${token}` },
                    () => {
                        console.log("WebSocket connected");
    
                        const checkTopicAndSubscribe = async () => {
                            while (retries > 0) {
                                try {
                                    // Kafka 토픽 상태 확인
                                    const response = await api.get(`/api/topic/check/chat-room-${roomId}`);
                                    if (response.data.success==="OK") {
                                        console.log("Kafka topic ready, subscribing...");
                                        client.subscribe(`/sub/chat/room/${roomId}`, (message) => {
                                            const newMessage = JSON.parse(message.body);
                                            setMessages((prevMessages) => [...prevMessages, newMessage]);
                                        });
                                        break; // 구독 성공 시 반복 종료
                                    }
                                } catch (error) {
                                    console.error("Error checking Kafka topic:", error);
                                }
    
                                retries--;
                                await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기 후 재시도
                            }
    
                            if (retries === 0) {
                                console.error("Failed to subscribe to Kafka topic after multiple retries");
                            }
                        };
    
                        checkTopicAndSubscribe();
                    },
                    (error) => {
                        console.error("WebSocket connection error:", error);
                        setTimeout(connectWebSocket, 5000); // 5초 후 재시도
                    }
                );
    
                setStompClient(client);
    
                return () => {
                    if (client) {
                        console.log("Disconnecting WebSocket");
                        client.disconnect(() => {
                            console.log("WebSocket disconnected");
                        }, {});
                    }
                };
            };
    
            connectWebSocket();
        }
    }, [roomId, token]);
    

    // 메세지 불러옴(페이징 처리)
    const fetchMessage = async (roomId, currentPage) => {
        try {
            const phoneScreen = phoneScreenRef.current;
            const previousScrollHeight = phoneScreen ? phoneScreen.scrollHeight : 0; // 이전 scrollHeight 저장

            const response = await api.get(`/api/chatmessages/list`, {
                params: { roomId, page: currentPage, size: 15 },
            });
            const data = response.data;
            if (data.success) {
                const reversedMessages = data.result.content.reverse(); // 메시지 최신순 정렬
                setMessages((prevMessages) => [...reversedMessages, ...prevMessages]); // 기존 메시지 앞에 추가
                setIsLastPage(data.result.last); // 마지막 페이지 여부 업데이트

                // 메시지 추가 후 스크롤 위치 조정
                setTimeout(() => {
                    if (phoneScreen) {
                        phoneScreen.scrollTop = phoneScreen.scrollHeight - previousScrollHeight; // 이전 스크롤 위치 유지
                    }
                }, 0);
            } else {
                console.error("Error fetching messages:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    // 파일 업로드
    const handleFileUpload = async (file) => {
        if (!file) return; // 파일이 선택되지 않았을 경우 처리하지 않음

        const formData = new FormData();
        formData.append("file", file);
        formData.append("senderId", adminId);

        try {
            const response = await api.post(`/chat/upload/${roomId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const data = response.data;

            if (data.success) {
                console.log("File uploaded successfully:", data);
            } else {
                console.error("File upload failed:", data.message);
            }
        } catch (error) {
            console.error("Error during file upload:", error);
        }
    };
    

    return (
        <div className={styles.adminInquireBody}>
            <div className={styles.adminInquireMain}>
                <div className={styles.adminInquireMainHeader}>
                    <h3><span>User</span>님과의 1:1 문의</h3>
                </div>
                <div className={styles.adminInquireMainChat}>
                    <div className={styles.phoneContainer} onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave}>
                        {/* 드래그 중 안내 메시지 */}
                        {isDragging && (
                            <div className={styles.dragOverlay}>
                                <p>파일을 여기에 드롭하세요</p>
                            </div>
                        )}
                        <div ref={phoneScreenRef} className={styles.phoneScreen} onScroll={handleScroll}>
                            {messages.map((message, index) => (
                                <div key={index} className={`${styles.chatMessage} ${message.senderId === String(adminId) ? styles.myMessage : ""}`}>
                                    {message.senderId === String(adminId) ? (
                                        // myMessage일 경우
                                        <>
                                            <span className={styles.messageTimestamp}>
                                                {new Date(message.createdAt).toLocaleString()} {/* 날짜와 시간 표시 */}
                                            </span>
                                            <div className={styles.chatBubble}>
                                                {message.content.startsWith("http") ? ( // URL이면 이미지로 렌더링
                                                    <img src={message.content} alt="uploaded" className={styles.chatImage} onClick={() => handleImageClick(message.content)} />
                                                ) : (
                                                    message.content // 일반 텍스트 메시지
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        // 상대방 메시지일 경우
                                        <>
                                            <div className={styles.chatBubble}>
                                                {message.content.startsWith("http") ? ( // URL이면 이미지로 렌더링
                                                    <img src={message.content} alt="uploaded" className={styles.chatImage} onClick={() => handleImageClick(message.content)} />
                                                ) : (
                                                    message.content // 일반 텍스트 메시지
                                                )}
                                            </div>
                                            <span className={styles.messageTimestamp}>
                                                {new Date(message.createdAt).toLocaleString()} {/* 날짜와 시간 표시 */}
                                            </span>
                                        </>
                                    )}
                                </div>
                            ))}
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
                                    onChange={(e) => handleFileUpload(e.target.files[0])}
                                />
                            </div>

                            <div className={styles.phoneScreenInputArea}>
                                <input
                                    id='input-message'
                                    type='text'
                                    placeholder='메세지 입력'
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyDown={handleKeyPress} // Enter 입력 이벤트 추가
                                />
                                {inputMessage.trim() && (
                                    <button className={styles.sendButton} onClick={handleSendMessage}>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AlertModal - 이미지 보기 */}
            {isAlertOpen && (
                <AlertModal
                    isOpen={isAlertOpen}
                    closeModal={closeAlertModal}
                    title={alertContent.title}
                    message={
                        <img
                            src={alertContent.message}
                            alt="이미지 보기"
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                        />
                    }
                />
            )}

            {/* ConfirmModal - 파일 업로드 확인 */}
            {isConfirmOpen && (
                <ConfirmModal
                    isOpen={isConfirmOpen}
                    closeModal={closeConfirmModal}
                    title={confirmContent.title}
                    message={confirmContent.message}
                    onConfirm={confirmContent.onConfirm}
                    onCancel={confirmContent.onCancel}
                />
            )}
        </div>
    );
};

export default AdminInquirePage;
