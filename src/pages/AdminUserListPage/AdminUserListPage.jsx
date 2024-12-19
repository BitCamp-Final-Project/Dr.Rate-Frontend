import React, { useState, useEffect } from "react";
import styles from './AdminUserListPage.module.scss'
import api from 'src/apis/axiosInstanceAPI';

const AdminUserListPage = () => {
    const [users, setUsers] = useState([]); // 사용자 데이터
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const [searchType, setSearchType] = useState("email"); // 검색 타입
    const [keyword, setKeyword] = useState(""); // 검색어

    const fetchNewUsers = async (page = 0, searchTypeParam = searchType, keywordParam = keyword) => {
        try {
            const queryParams = new URLSearchParams({
                page: page,
                size: 4,
            });

            // 검색 조건이 있을 경우만 쿼리에 추가
            if (typeof keywordParam === "string" && keywordParam.trim()) {
                queryParams.append("searchType", searchTypeParam);
                queryParams.append("keyword", keywordParam.trim());
            }

            const response = await api.get(`/api/userList`, { params: queryParams });
            const data = response.data;

            if (data.success) {
                setUsers(data.result.content);
                setTotalPages(data.result.totalPages);
                setCurrentPage(page); // 현재 페이지 상태 업데이트
            } else {
                console.error("유저 목록 조회 실패:", data.message);
            }
        } catch (error) {
            console.error("API 호출 중 오류:", error);
        }
    };

    useEffect(() => {
        fetchNewUsers(currentPage); // 페이지 변경 시 사용자 데이터 불러오기
    }, [currentPage]);

    const handleSearch = () => {
        setCurrentPage(0); // 페이지를 첫 페이지로 리셋
        fetchNewUsers(0, searchType, keyword); // 검색 조건과 함께 첫 페이지 조회
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className={styles.userListDiv}>
            <div className={styles.userListArea}>
                {/* 헤더 */}
                <div className={styles.userListHeader}>
                    <div className={styles.userListTitle}>
                        <h4>사용자 조회</h4>
                    </div>
                    <div className={styles.userSearchBar}>
                        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                            <optgroup label="검색 항목">
                                <option value="email">이메일</option>
                                <option value="name">이름</option>
                            </optgroup>
                        </select>
                        <input
                            type="text"
                            placeholder="검색어"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                        />
                        <button onClick={handleSearch}>조회</button>
                    </div>
                </div>

                {/* 사용자 목록 테이블 */}
                <div className={styles.userListTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>이메일</th>
                                <th>이름</th>
                                <th>그룹 (역할)</th>
                                <th>가입일자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className={styles.row}>
                                    <td data-label="이메일">{user.email}</td>
                                    <td data-label="이름">{user.username}</td>
                                    <td data-label="그룹 (역할)">{user.role}</td>
                                    <td data-label="가입일자">
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString()
                                            : "알 수 없음"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                <div className={styles.pagination}>
                    <div className={styles.pageBtn}>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index)}
                                className={currentPage === index ? styles.active : ""}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserListPage;

