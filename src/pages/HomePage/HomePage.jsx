import React, { useState, useEffect } from "react";
import styles from "./HomePage.module.scss";
import scatterKookmin from 'src/assets/images/scatterKookmin.png';
import scatterToss from 'src/assets/images/scatterToss.png';
import scatterKaKao from 'src/assets/images/scatterKaKao.png';
import scatterNonghyup from 'src/assets/images/scatterNonghyup.png';
import scatterHana from 'src/assets/images/scatterHana.png';
import scatterWoori from 'src/assets/images/scatterWoori.png';
import scatterShinhan from 'src/assets/images/scatterShinhan.png';
import homeBGPhone from "src/assets/images/homeBGPhone.png";
import { trackVisitor } from "src/utils/visitorTracker";

const HomePage = () => {
    const [scatterCollapsed, setScatterCollapsed] = useState(false);
    const [infoVisible, setInfoVisible] = useState(true);
    const [seeTogetherVisible, setSeeTogetherVisible] = useState(false);
    const [phoneFramePartialVisible, setPhoneFramePartialVisible] = useState(false);
    const [phoneFrameFullVisible, setPhoneFrameFullVisible] = useState(false);

    useEffect(() => {
        // 방문자 수 조회 (회원/비회원 구분)
        const authToken = localStorage.getItem("authToken");
        trackVisitor(authToken); // 방문자 기록 함수 실행
        // body에 클래스 추가
        document.body.classList.add(styles.homeBody);

        return () => {
            // 페이지가 변경될 때 클래스 제거
            document.body.classList.remove(styles.homeBody);
        };
    }, []);
    
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            // 은행 이미지 단계적 모임 (스크롤 값에 따라 조금 더 유연하게 조정)
            setScatterCollapsed(scrollY > 1700 && scrollY < 2300);

            // '흩어진 정보' 텍스트 가시성 (1500이 넘으면 사라짐)
            setInfoVisible(scrollY < 1750);

            // "한 번에 확인" 글자 표시 (은행 이미지들이 모인 후 나타남)
            setSeeTogetherVisible(scrollY >= 2000 && scrollY < 2500);

            // 폰 프레임 일부 노출 (은행 로고와 '한 번에 확인' 글자가 사라진 후 표시)
            setPhoneFramePartialVisible(scrollY >= 2000 && scrollY < 2600);

            // 폰 프레임 전체 표시 (완전히 노출)
            setPhoneFrameFullVisible(scrollY >= 2600);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

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

            <section>
                <div>추가적인 내용 여기에 위치</div>
            </section>
        </main>
    );
};

export default HomePage;
