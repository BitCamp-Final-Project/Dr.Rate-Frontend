import React, { useState, useEffect } from 'react';
import styles from './AdminMainPage.module.scss';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import api from 'src/apis/axiosInstanceAPI';
import userLogo from 'src/assets/icons/userIcon.png'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminMainPage = () => {
    // 방문자 현황 체크
    const [visitorSummary, setVisitorSummary] = useState({
        today: { visitorCount: 0, newMembersCount: 0, inquiriesCount: 0 },
        last4Days: [],
        last7DaysTotal: 0,
        thisMonthTotal: 0
    });
    const [newUsers, setNewUsers] = useState([]);  // 신규 회원 데이터를 저장
    const [inquireList, setInquireList] = useState([]);  // 신규 회원 데이터를 저장


    // 신규 회원 데이터를 가져오는 함수
    const fetchNewUsers = async (page = 0) => {
        try {
            const response = await api.get(`/api/userList`, {
                params: { page, size: 4 },
            });
            const data = response.data;

            if (data.success) {
                setNewUsers(data.result.content); // 회원 데이터 저장
            } else {
                console.error("유저 목록 조회 실패:", data.message);
            }
        } catch (error) {
            console.error("API 호출 중 오류:", error);
        }
    };

    const fetchInquiryList = async (page = 0) => {
        try {
            const response = await api.get(`/api/chatrooms/inquireList`, {
                params: { page, size: 4 },
            });
            const data = response.data;

            if (data.success) {
                setInquireList(data.result.content); // 회원 데이터 저장
            } else {
                console.error("유저 목록 조회 실패:", data.message);
            }
        } catch (error) {
            console.error("API 호출 중 오류:", error);
        }
    }

    const fetchVisitorSummary = async () => {
        try {
            const response = await api.get(`/api/admin/visitor-summary`);
            const data = response.data;


            if (data.success) {
                setVisitorSummary(data.result); // 상태에 데이터 저장
            } else {
                console.error("방문자 요약 조회 실패:", data.message);
            }
        } catch (error) {
            console.error("API 호출 중 오류:", error);
        }
    };

    // 컴포넌트가 마운트될 때 데이터 가져오기
    useEffect(() => {
        fetchNewUsers();
        fetchInquiryList();
        fetchVisitorSummary();
    }, []);


    const data = {
        labels: ['오늘', '최근 7일', '이번 달'], // X축 라벨
        datasets: [
            {
                label: '총 방문자 수',
                data: [
                    visitorSummary.today.visitorCount,   // 오늘 방문자 수
                    visitorSummary.last7DaysTotal.visitorCount, // 최근 7일 방문자 수
                    visitorSummary.thisMonthTotal.visitorCount  // 이번 달 방문자 수
                ],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.4,
            },
            {
                label: '신규 가입자 수',
                data: [
                    visitorSummary.today.newMembersCount,  // 오늘 신규 가입자 수
                    visitorSummary.last7DaysTotal.newMembersCount, // 최근 7일 신규 가입자 수
                    visitorSummary.thisMonthTotal.newMembersCount  // 이번 달 신규 가입자 수
                ],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // X축 그리드 숨김
                },
            },
            y: {
                grid: {
                    color: '#eaeaea', // Y축 그리드 색상
                },
                beginAtZero: true,
            },
        },
    };
    return (
        <div className={styles.dashboardDiv}>
            {/* 첫번째 행 영역 */}
            <div className={styles.dashboardRow}>
                {/* 1. 방문자 현황 영역 */}
                <div className={styles.dashboardItemArea}>
                    <div className={styles.dashboardItem}>
                        {/* 방문자 현황 헤더 */}
                        <div className={styles.dashboardItemHeader}>
                            <div className={styles.dashboardItemTitle}>
                                <h4>방문자 현황</h4>
                            </div>
                        </div>
                        {/* 방문자 현황 body : 그래프 */}
                        <div className={styles.dashboardItemBody}>
                            <Line data={data} options={options} />
                        </div>
                    </div>
                </div>
                {/* 2. 일자별 요약 영역 */}
                <div className={styles.dashboardItemArea}>
                    <div className={styles.dashboardItem}>
                        <div className={styles.dashboardItemHeader}>
                            <div className={styles.dashboardItemTitle}>
                                <h4>일자별 요약</h4>
                            </div>
                        </div>
                        {/* 일자별 요약 body */}
                        <div className={styles.dashboardItemBody}>
                            <table className={styles.summaryTable}>
                                <thead>
                                    <tr>
                                        <th>일자</th>
                                        <th>회원 방문자 수</th>
                                        <th>비회원 방문자 수</th>
                                        <th>총 방문자 수</th>
                                        <th>가입</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{visitorSummary.today.visitDate || "오늘"}</td>
                                        <td>{visitorSummary.today.membersCount || 0}</td>
                                        <td>{visitorSummary.today.todayGuestCount || 0}</td>
                                        <td>{visitorSummary.today.totalMembersCount || 0}</td>
                                        <td>{visitorSummary.today.newMembersCount || 0}</td>
                                    </tr>

                                    {visitorSummary.last4Days.map((day, index) => (
                                        <tr key={index}>
                                            <td>{day.visitDate}</td>
                                            <td>{day.memberVisitorsCount}</td>
                                            <td>{day.guestVisitorsCount}</td>
                                            <td>{day.totalVisitorsCount}</td>
                                            <td>{day.newMembersCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td>최근 7일 합계</td>
                                        <td>{visitorSummary.last7DaysTotal.visitorMemberCount}</td>
                                        <td>{visitorSummary.last7DaysTotal.visitorGuestCount}</td>
                                        <td>{visitorSummary.last7DaysTotal.visitorTotalCount}</td>
                                        <td>{visitorSummary.last7DaysTotal.newMembersCount}</td>
                                    </tr>
                                    <tr>
                                        <td>이번달 합계</td>
                                        <td>{visitorSummary.thisMonthTotal.visitorMemberCount}</td>
                                        <td>{visitorSummary.thisMonthTotal.visitorGuestCount}</td>
                                        <td>{visitorSummary.thisMonthTotal.visitorTotalCount}</td>
                                        <td>{visitorSummary.thisMonthTotal.newMembersCount}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
            {/* 두번째 행 영역 */}
            <div className={styles.dashboardRow}>
                {/* 3. 신규 회원 영역 */}
                <div className={styles.dashboardItemArea}>
                    <div className={styles.dashboardItem}>
                        <div className={styles.dashboardItemHeader}>
                            <div className={styles.dashboardItemTitle}>
                                <h4>신규 회원</h4>
                            </div>
                        </div>
                        {/* 신규 회원 body */}
                        <div className={styles.dashboardItemBody}>
                            <ul className={styles.newUserList}>
                                {newUsers.map((user) => {
                                    return ( // 명시적으로 반환
                                        <li key={user.id} className={styles.newUserItem}>
                                            <div className={styles.profileImage}>
                                                <img src={userLogo} alt="사용자 프로필"></img>
                                            </div>
                                            <div className={styles.userInfo}>
                                                <span className={styles.userName}>{user.username}</span>
                                                <span className={styles.userEmail}>{user.email}</span>
                                            </div>
                                            <div className={styles.joinDate}>
                                                {user.createdAt
                                                    ? new Date(user.createdAt).toLocaleDateString()
                                                    : "알 수 없음"}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                {/* 4. 1:1 문의 내역 영역 */}
                <div className={styles.dashboardItemArea}>
                    <div className={styles.dashboardItem}>
                        <div className={styles.dashboardItemHeader}>
                            <div className={styles.dashboardItemTitle}>
                                <h4>1:1 문의 내역</h4>
                            </div>
                        </div>
                        {/* 1:1 문의 내역 body */}
                        <div className={styles.dashboardItemBody}>
                            <ul className={styles.inquiryList}>
                                {inquireList.map((inquire) => {
                                    return (
                                        <li key={inquire.id} className={styles.inquiryItem}>
                                            <div className={styles.profileImage}>
                                                <img src={userLogo} alt="사용자 프로필"></img>
                                            </div>
                                            <div className={styles.inquiryContent}>
                                                <div className={styles.inquiryTitle}>
                                                    {inquire.topicName}
                                                    {inquire.status && (
                                                        <span
                                                            className={`${styles.newBadge} ${inquire.status === "OPEN" ? styles.openStatus : styles.closedStatus
                                                                }`}
                                                        >
                                                            {inquire.status === "OPEN" ? "OPEN" : "CLOSED"}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className={styles.inquiryMeta}>
                                                    <span>{inquire.userName}</span> |
                                                    <span className={styles.inquiryDate}>
                                                        {inquire.updatedAt
                                                            ? `${new Date(inquire.updatedAt).toLocaleDateString()} ${new Date(inquire.updatedAt).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}`
                                                            : "알 수 없음"}
                                                    </span>
                                                </div>

                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminMainPage;