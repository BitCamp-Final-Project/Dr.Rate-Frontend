import React from 'react';
import styles from './AdminEmailInquireListPage.module.scss';
import { useNavigate } from "react-router-dom";
import { PATH } from "src/utils/path";

const AdminEmailInquireListPage = () => {
    const navigate = useNavigate();


    /* 이벤트 핸들러 */
    const handleRowClick = () => {
        navigate(PATH.ADMIN_EMAIL_INQUIRE);
    };

    return (
        <div className={styles.emailInquireListDiv}>
            <div className={styles.emailInquireListArea}>
                <div className={styles.emailInquireListHeader}>
                    <div className={styles.inquireListTitle}>
                        <h4>이메일 문의 내역</h4>
                    </div>
                    <div className={styles.emailInquireSearchBar}>
                        <select>
                            <optgroup label="검색 항목">
                                <option value="roomId" selected>방 번호</option>
                                <option value="email">이메일</option>
                                <option value="name">이름</option>
                            </optgroup>
                        </select>

                        <input type="text" placeholder="검색어" />
                        <button>조회</button>
                    </div>
                </div>
                <div className={styles.emailInquireListTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>방 번호</th>
                                <th>이메일</th>
                                <th>이름</th>
                                <th>문의 날짜</th>
                                <th className={styles.emailInquireStatus}>답변 여부</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className={styles.row}  onClick={handleRowClick}>
                                <td data-label="아이디">Dancingtuna</td>
                                <td data-label="이메일">paul9498@naver.com</td>
                                <td data-label="이름">오영수</td>
                                <td data-label="최근 답변 날짜">2024.12.12</td>
                                <td data-label="답변 여부">
                                    <div className={styles.statusButtons}>
                                        <button>
                                            완료
                                        </button>
                                    </div>
                                </td>
                            </tr>

                        </tbody>

                    </table>
                </div>
                {/* 페이지네이션 */}
                <div className={styles.pagination}>
                    <div className={styles.pageBtn}>
                        <button>Previous</button>
                        <button>
                            1
                        </button>
                        <button>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEmailInquireListPage;