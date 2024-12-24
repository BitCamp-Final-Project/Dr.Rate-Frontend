import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'src/utils/path';
import styles from './AdminInquireListPage.module.scss';
import api from 'src/apis/axiosInstanceAPI';

const AdminInquireListPage = () => {
    const navigate = useNavigate();
    const [chatRooms, setChatRooms] = useState([]);
    const [page, setPage] = useState(0);  // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
    const [searchType, setSearchType] = useState("email"); // 검색 조건 (기본: 이메일)
    const [keyword, setKeyword] = useState(""); // 검색어


    useEffect(() => {
        fetchChatRooms(page, searchType, keyword || ""); // keyword가 없으면 빈 문자열 전달
    }, [page]);


    const fetchChatRooms = async (currentPage, searchType, keyword) => {
        try {
            const queryParams = new URLSearchParams({
                page: currentPage,
                size: 4,
            });

            // 검색 조건이 있을 경우만 쿼리에 추가
            if (typeof keyword === "string" && keyword.trim()) {
                queryParams.append("searchType", searchType);
                queryParams.append("keyword", keyword.trim());
            }

            const response = await api.get(`/api/admin/chatrooms/inquireList`, {
                params: queryParams,
            });
            const data = response.data;

            if (data.success) {
                setChatRooms(data.result.content);
                setTotalPages(data.result.totalPages);
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("문의 목록을 불러오다가 에러 발생:", error);
        }
    };


    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    // 검색 버튼 클릭 핸들러
    const handleSearch = () => {
        setPage(0); // 검색 시 첫 페이지로 초기화
        fetchChatRooms(0, searchType, keyword); // 검색 조건으로 데이터 요청
    };



    return (
        <div className={styles.inquireListDiv}>
            <div className={styles.inquireListArea}>
                {/* 헤더 */}
                <div className={styles.inquireListHeader}>
                    <div className={styles.inquireListTitle}>
                        <h4>1:1 문의 내역</h4>
                    </div>
                    <div className={styles.inquireSearchBar}>
                        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                            <optgroup label="검색 항목">
                                <option value="roomId" selected>방 번호</option>
                                <option value="email">이메일</option>
                                <option value="name">이름</option>
                            </optgroup>
                        </select>

                        <input type="text" placeholder="검색어" value={keyword} onChange={(e) => setKeyword(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch(); // 엔터키 입력 시 검색 실행
                                }
                            }}
                        />
                        <button onClick={handleSearch}>조회</button>
                    </div>
                </div>
                <div className={styles.inquireListTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>방 번호</th>
                                <th>이메일</th>
                                <th>이름</th>
                                <th>최근 답변 날짜</th>
                                <th className={styles.inquireStatus}>답변 여부</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chatRooms.map((room, index) => (
                                <tr
                                    key={index}
                                    className={styles.row}
                                    onClick={() => room.status === "OPEN" && navigate(PATH.ADMIN_INQUIRE, { state: { roomId: room.id } })}
                                    style={{ cursor: room.status === "CLOSED" ? "not-allowed" : "pointer" }} // 완료 상태면 클릭 불가
                                >
                                    <td data-label="방 번호">{room.id}</td>
                                    <td data-label="이메일">{room.email}</td>
                                    <td data-label="이름">{room.userName}</td>
                                    <td data-label="최근 답변 날짜">{room.updatedAt ? new Date(room.updatedAt).toLocaleString() : "N/A"}</td>
                                    <td data-label="답변 여부">
                                        <div className={styles.statusButtons}>
                                            <button
                                                className={`${room.status === "CLOSED" ? styles.completed : styles.pending}`}
                                                disabled={room.status === "CLOSED"} // 완료 상태면 버튼 비활성화
                                                style={{
                                                    backgroundColor: room.status === "CLOSED" ? "#d3d3d3" : "#0056b3", // 완료 상태는 회색, 미완료는 파란색
                                                    color: room.status === "CLOSED" ? "#888" : "#fff", // 완료 상태는 어두운 회색 텍스트
                                                    cursor: room.status === "CLOSED" ? "not-allowed" : "pointer", // 완료 상태면 클릭 불가
                                                }}
                                            >
                                                {room.status === "CLOSED" ? "완료" : "미완료"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

                {/* 페이지네이션 */}
                <div className={styles.pagination}>
                    <div className={styles.pageBtn}>
                        <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>Previous</button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={page === index ? styles.active : ""}
                                onClick={() => handlePageChange(index)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminInquireListPage;