import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from './MyEmailInquirePage.module.scss';
import { PATH } from "src/utils/path";
import MyNav from 'src/components/MyNav'; 
import rightArrowIcon from 'src/assets/icons/rightArrow.svg';

// 객체 배열 함수; 문의 내역 가져오는 api 개발 시 삭제
const emailInquireData = () => [
    {
        id: 1,
        inquire_ctg: "서비스 개선 제안",
        inquire_email: "p3chaeyeon@naver.com",
        inquire_title: "예금·적금 즐겨찾기 기능 개선 요청",
        inquire_content: `1. 즐겨찾기 검색 옵션 추가
현재 즐겨찾기 검색 옵션에 은행과 상품 2개 뿐입니다. 최고 금리, 기본 금리 옵션도 추가되면 좋을 것 같습니다.

2. 금리 변경 알림 기능
즐겨찾기한 상품의 금리가 변경되면 알림을 받을 수 있도록 해주세요.
특히, 최고 금리나 우대 금리 변동 시 알려준다면 매우 유용할 것 같습니다.`,
        inquire_date: "2024.12.25",
        answer_title: "예금·적금 즐겨찾기 기능 개선 요청 답변",
        answer_content: `안녕하세요, 고객님. 금리박사 서비스를 이용해 주셔서 감사합니다.
고객님께서 제안해 주신 사항에 대해 검토한 결과는 다음과 같습니다.

1. 즐겨찾기 검색 옵션 추가
즐겨찾기 검색 옵션은 '기본 금리', '최고 금리' 옵션이 추가될 수 있도록 준비 중입니다.

2. 금리 변경 알림 기능
현재 개발팀에서 우선순위로 검토 중이며, 이르면 다음 분기 내에 추가될 예정입니다.`,
        answer_date: "2024.12.26"
    },
    {
        id: 2,
        inquire_ctg: "시스템 오류 제보",
        inquire_email: "testuser2@example.com",
        inquire_title: "이자 계산기 오류 문의",
        inquire_content: `이자 계산기에서 금리를 입력해도 계산이 되지 않습니다.
확인 부탁드립니다.`,
        inquire_date: "2024.12.26",
        answer_title: "이자 계산기 오류 문의 답변",
        answer_content: `고객님께서 제보해주신 오류를 확인하였으며, 현재 수정 작업을 진행 중입니다.
빠르게 해결할 수 있도록 하겠습니다.`,
        answer_date: "2024.12.27"
    },
    {
        id: 3,
        inquire_ctg: "서비스 개선 제안",
        inquire_email: "sample3@domain.com",
        inquire_title: "대출 상품 비교 기능 추가 요청",
        inquire_content: `대출 상품도 금리 비교 기능이 있으면 좋겠습니다.
추가 검토 부탁드립니다.`,
        inquire_date: "2024.12.27",
        answer_title: "대출 상품 비교 기능 추가 요청 답변",
        answer_content: `현재 대출 상품 비교 기능에 대한 검토를 시작하였습니다.
추후 업데이트 계획에 반영될 수 있도록 하겠습니다.`,
        answer_date: "2024.12.28"
    }
];



const MyEmailInquirePage = () => {
    const navigate = useNavigate();
    const inquiries = emailInquireData();

    return (
        <main>
            <MyNav />
            <section className={styles.myEmailInquireSection}>

                {/* 문의 내역 카테고리 - 예금 or 적금 */}
                <div className={ styles.inquireTypeDiv }>
                    <div className={ styles.inquireTypeItem }>문의 내역</div>
                    <div className={ styles.inquireTypeItem }>
                        <img src={rightArrowIcon} alt="오른쪽 화살표" className={styles.rightArrowIcon} />
                    </div>
                    <div className={ styles.inquireTypeItem }>
                        이메일 문의
                    </div>
                </div>

                {/* 반복 렌더링 */}
                <div className={styles.inquireListDiv}>
                    {inquiries.map((inquire) => (
                        <div className={styles.inquireList} key={inquire.id}>
                            <div className={styles.listTopDiv}>
                                <div className={styles.topCategory}>{inquire.inquire_ctg}</div>
                                <div className={styles.topDate}>{inquire.inquire_date}</div>
                            </div>

                            <div className={styles.listContentDiv}>
                                <div className={styles.contentQ}><div>Q</div></div>
                                <div className={styles.contentDiv}>
                                    <div className={styles.inquireTitleDiv}>
                                        <span className={styles.inquireTitle}>{inquire.inquire_title}</span>
                                    </div>
                                    <div className={styles.inquireEmailDiv}>
                                        문의자 이메일 : <span className={styles.inquireEmail}>{inquire.inquire_email}</span>
                                    </div>
                                    <div className={styles.inquireContentDiv}>
                                        <pre className={styles.inquireContent}>{inquire.inquire_content}</pre>
                                    </div>
                                    <div className={styles.inquireFileDiv}>
                                        파일 이미지 div
                                        {/* <img  나중에 파일 uuid 로 바궈야 함 
                                            src={`${PATH.STORAGE_BANK}/${item.bankLogo}`} 
                                            alt={`${item.bankName}`} 
                                            className={styles.inquireFile}
                                         /> */}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.listAnswerDiv}>
                                <div className={styles.answerDiv}>
                                    <div className={styles.answerTitleDiv}>
                                        <pre className={styles.answerTitle}>{inquire.answer_title}</pre>
                                    </div>
                                    <div className={styles.answerContentDiv}>
                                        <pre className={styles.answerContent}>{inquire.answer_content}</pre>
                                    </div>
                                </div>
                                <div className={styles.answerDate}>
                                    {inquire.answer_date}
                                </div>
                            </div>

                            <div className={styles.btnDiv}>
                                <button className={styles.deleteBtn}>삭제</button>
                            </div>
                        </div>
                    ))}
                </div>

            </section>
        </main>
    );
};

export default MyEmailInquirePage;
