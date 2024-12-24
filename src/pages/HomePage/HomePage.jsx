import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'src/utils/path';
import styles from './HomePage.module.scss';
import scatterKookmin from 'src/assets/images/scatterKookmin.png';
import scatterToss from 'src/assets/images/scatterToss.png';
import scatterKaKao from 'src/assets/images/scatterKaKao.png';
import scatterNonghyup from 'src/assets/images/scatterNonghyup.png';
import scatterHana from 'src/assets/images/scatterHana.png';
import scatterWoori from 'src/assets/images/scatterWoori.png';
import scatterShinhan from 'src/assets/images/scatterShinhan.png';
import homeBGPhone from 'src/assets/images/homeBGPhone.png';
import DepositLink from 'src/assets/images/DepositLink.png';
import InstallmentLink from 'src/assets/images/InstallmentLink.png';
import homeCalendar from 'src/assets/images/homeCalendar.png';
import { trackVisitor } from 'src/utils/visitorTracker';


const HomePage = () => {
    const navigate = useNavigate();
    const [scatterCollapsed, setScatterCollapsed] = useState(false);
    const [infoVisible, setInfoVisible] = useState(true);
    const [seeTogetherVisible, setSeeTogetherVisible] = useState(false);
    const [phoneFramePartialVisible, setPhoneFramePartialVisible] = useState(false);
    const [phoneFrameFullVisible, setPhoneFrameFullVisible] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    useEffect(() => {
        // 방문자 수 조회 (회원/비회원 구분)
        const authToken = localStorage.getItem("Authorization");
        trackVisitor(authToken); // 방문자 기록 함수 실행
        // body에 클래스 추가
        document.body.classList.add(styles.homeBody);

        return () => {
            // 페이지가 변경될 때 클래스 제거
            document.body.classList.remove(styles.homeBody);
        };
    }, []);


    // 뷰포트 크기 업데이트
    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    
    
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            if (viewportWidth > 430) { // 가로 크기가 430px 초과일 때
                
                // 은행 이미지 단계적 모임 (스크롤 값에 따라 조금 더 유연하게 조정)
                setScatterCollapsed(scrollY > 1700 && scrollY < 2400);
                
                // '흩어진 정보' 텍스트 가시성 (1750 이 넘으면 사라짐)
                setInfoVisible(scrollY < 1750);

                // "한 번에 확인" 글자 표시 (은행 이미지들이 모인 후 나타남)
                setSeeTogetherVisible(scrollY >= 2000 && scrollY < 2500);

                // 폰 프레임 일부 노출 (은행 로고와 '한 번에 확인' 글자가 사라진 후 표시)
                setPhoneFramePartialVisible(scrollY >= 2000 && scrollY < 2600);

                // 폰 프레임 전체 표시 (완전히 노출)
                setPhoneFrameFullVisible(scrollY >= 2600);


            } else { // 가로 크기가 430px 이하일 때
                setScatterCollapsed(scrollY > 1150 && scrollY < 1650);
                setInfoVisible(scrollY < 1200);
                setSeeTogetherVisible(scrollY >= 1400 && scrollY < 1800);
                setPhoneFramePartialVisible(scrollY >= 1500 && scrollY < 1900);
                setPhoneFrameFullVisible(scrollY >= 1900);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [viewportWidth]); // 뷰포트 너비가 변경될 때마다 스크롤 조건을 업데이트
    


    return (
        <main className={styles.homeMain}>
            <div className={styles.homeMainDiv}>
                <div className={styles.homeTitle}>
                    한눈에 <span className={styles.titleBlue}>예 • 적금</span> 비교
                </div>
            </div>

            {/* 은행 로고 섹션 */}
            <div className={`${styles.bankScatter} ${scatterCollapsed ? styles.collapsed : ""}`}>
                {infoVisible && <p className={styles.scatterText}>흩어진 정보</p>}
                <img src={scatterKookmin} alt="scatter kookmin" className={styles.scatterKookmin} />
                <img src={scatterToss} alt="scatter toss" className={styles.scatterToss} />
                <img src={scatterKaKao} alt="scatter kakao" className={styles.scatterKaKao} />
                <img src={scatterNonghyup} alt="scatter nonghyup" className={styles.scatterNonghyup} />
                <img src={scatterHana} alt="scatter hana" className={styles.scatterHana} />
                <img src={scatterWoori} alt="scatter woori" className={styles.scatterWoori} />
                <img src={scatterShinhan} alt="scatter shinhan" className={styles.scatterShinhan} />
            </div>

            {/* 한 번에 확인 텍스트 섹션 */}
            <div className={`${styles.seeTogether} ${seeTogetherVisible ? styles.visible : styles.hidden}`}>
                <p>한 번에 확인</p>
            </div>

            {/* 폰 프레임 스크롤 섹션 */}
            <div className={`${styles.phoneScroll} ${phoneFramePartialVisible ? styles.partial : ""} ${phoneFrameFullVisible ? styles.full : ""}`}>
                <img src={homeBGPhone} alt="폰 프레임" />
            </div>




            <section className={styles.homeSection}>
                <div className={styles.homeSectionTitle}>
                    예금 • 적금 서비스 바로가기
                </div>

                <div className={styles.productLinkDiv}>
                    <div className={`${styles.linkDiv} ${styles.depositLinkDiv}`}>
                        <div className={styles.linkTitle}>예금 목록</div>
                        <div className={styles.linkImgDiv}>
                        <img className={styles.linkImg} src={DepositLink} alt="예금 목록 링크" />
                        </div>
                        <button
                        className={`${styles.linkBtn} ${styles.depositLinkBtn}`}
                        onClick={() => navigate(PATH.DEPOSIT_LIST)}
                        >
                        바로가기
                        </button>
                    </div>
                    <div className={`${styles.linkDiv} ${styles.installmentLinkDiv}`}>
                        <div className={styles.linkTitle}>적금 목록</div>
                        <div className={styles.linkImgDiv}>
                        <img className={styles.linkImg} src={InstallmentLink} alt="적금 목록 링크" />
                        </div>
                        <button
                        className={`${styles.linkBtn} ${styles.installmentLinkBtn}`}
                        onClick={() => navigate(PATH.INSTALLMENT_LIST)}
                        >
                        바로가기
                        </button>
                    </div>
                </div>



                <div className={`${styles.homeSectionTitle} ${styles.calendarLinkTitle}`} >
                    나의 적금 달력
                </div>

                <div className={styles.calendarLinkDiv}>
                    <div className={styles.calendarLinkBGDiv}>
                        <div className={styles.calendarImgExplainDiv}>
                            <div className={styles.calendarImgDiv}>
                                    <img className={styles.calendarImg} src={homeCalendar} alt="달력 이미지지" />
                            </div>
                            <div className={styles.webExplain}>
                                가입한 적금을 등록하여 납부일, 납부 금액을 확인할 수 있어요
                            </div>
                        </div>
                        <div className={styles.calendarLinkBtnDiv}>
                            <div className={styles.calendarLinkExplain}>적금 납부일, 납부금액 확인</div>
                            <button 
                                className={styles.calendarLinkBtn}
                                onClick={() => navigate(PATH.MY_CALENDAR)}
                            >
                                바로가기
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HomePage;
