import styles from './Footer.module.scss';
import React from 'react';
import footerDivider from 'src/assets/icons/footerDivider.svg';
import faviconIcon from 'src/assets/icons/faviconIcon.svg';
import labIcon from 'src/assets/icons/labIcon.svg';
import appstoreIcon from 'src/assets/icons/appstoreIcon.svg';
import playstoreIcon from 'src/assets/icons/playstoreIcon.svg';

const Footer = () => {
    return (
        <footer>
            <div className={styles.footerContainer}>
                <div className={ styles.footerInfo }>
                    <div className={ styles.corName }>
                        (주)금리박사
                    </div> {/* // <div className={ styles.corName }> */}

                    <div className={ styles.corAddress}>
                        <div>
                            <p className={ styles.firstRow }><img src={footerDivider} alt="푸터 세로 구분선" className={styles.footerDivider} /></p>
                            <p><img src={footerDivider} alt="푸터 세로 구분선" className={styles.footerDivider} /></p>
                        </div>
                        <div className={styles.addressTitle}>
                            <div className={ styles.firstRow }>
                                {/* 본사 */}
                                <span>본</span>
                                <span className={styles.noneSpan}>박</span> {/* 가리는 텍스트 */}
                                <span className={styles.noneSpan}>박</span>
                                <span className={styles.noneSpan}>박</span>
                                <span>사</span>
                            </div>
                            <div>
                                {/* 금리연구소 */}
                                <span>금</span>
                                <span>리</span>
                                <span>연</span>
                                <span>구</span>
                                <span>소</span>
                            </div>
                        </div>
                        <div>
                            <p className={ styles.firstRow }><img src={footerDivider} alt="푸터 세로 구분선" className={styles.footerDivider} /></p>
                            <p><img src={footerDivider} alt="푸터 세로 구분선" className={styles.footerDivider} /></p>
                        </div>
                        <div>
                            <p className={ styles.firstRow }>서울 강남구 강남대로 94길 20 삼오빌딩 5-9층</p>
                            <p>서울 강남구 강남대로 94길 20 삼오빌딩 602호</p>
                        </div>
                    </div>{/* // <div className={ styles.corAddress}> */}

                    <div className={ styles.corContact }>
                        <div>
                            <div className={ styles.contactTitle }>TEL.</div>
                            <div className={ styles.contactContent }>0507-1414-9601</div>
                        </div>
                        <div><img src={footerDivider} alt="푸터 세로 구분선" className={styles.footerDivider} /></div>
                        <div>
                            <div className={ styles.contactTitle }>E-mail.</div>
                            <div className={ styles.contactContent }>paul9119298@gmail.com</div>
                        </div>
                        <div><img src={footerDivider} alt="푸터 세로 구분선" className={styles.footerDivider} /></div>
                        <div>
                            <div className={ styles.contactTitle }>H.P.</div>
                            <div className={ styles.contactContent }>http://localhost:5173</div>
                        </div>
                    </div>{/* // <div className={ styles.corContact }> */}

                    <div className={ styles.corRight }>
                        <div className={ styles.rightText }>COPYRIGHT</div>
                        <div className={ styles.rightText }>DR.RATE.,LTD & Dancingtuna</div>
                        <div className={ styles.rightText }>RIGHTS RESERVED.</div>
                    </div>{/* // <div className={ styles.corRight }> */}
                </div> {/* // <div className={ styles.footerInfo }> */}

                <div className={ styles.footerIcon }>
                    <div>
                        <a href="https://www.dr-rate.store" target="_blank" rel="dr-rate">
                            <img src={faviconIcon} alt="Dr.Rate Icon" className={ styles.iconSvg } />
                        </a>
                    </div>
                    <div>
                        <a href="https://github.com/BitCamp-Final-Project/Dr.Rate-Frontend" target="_blank" rel="Dr.Rate-Frontend">
                            <img src={labIcon} alt="Lab Icon" className={ styles.iconSvg } />
                        </a>
                    </div>
                    <div><img src={appstoreIcon} alt="Apple Icon" className={ styles.iconSvg } /></div>
                    <div><img src={playstoreIcon} alt="Android Icon" className={ styles.iconSvg } /></div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;