import styles from './MyDepositPage.module.scss';
import React, { useEffect } from 'react';
import { PATH } from "src/utils/path";
import MyNav from 'src/components/MyNav';
import FavoritePanel from 'src/components/FavoritePanel';
import useMyFavorite from 'src/hooks/useMyFavorite';


const MyDepositPage = () => {
    const { favoriteData, fetchFavorites, loading, error, individualChecked, handleIndividualCheck } = useMyFavorite();

    useEffect(() => {
        fetchFavorites(); 
    }, [fetchFavorites]); 

    

    return (
        <main>
            <MyNav />

            <section className={styles.favoriteSection}>
                {/* FavoritePanel은 항상 렌더링 */}
                <FavoritePanel favoriteDataLength={favoriteData.length} />

                {/* 상태에 따라 내부 내용만 바뀜 */}
                {loading && <div></div>}
                {error && <div className={styles.errorDiv}>데이터를 불러오는 중 에러가 발생했습니다.</div>}

                {/* 정상 데이터 로드 */}
                {!loading && !error && (
                    <div className={styles.favoriteListDiv}>
                        {favoriteData.map((item, index) => (
                            <div key={index} className={styles.favoriteList}>
                                <input type="hidden" value={item.favoriteId} readOnly />
                                <input
                                    type="checkbox"
                                    name="check"
                                    className={styles.check}
                                    checked={individualChecked[index] || false}
                                    onChange={(e) => handleIndividualCheck(index, e.target.checked)}
                                />
                                <div className={styles.favoriteLogoDiv}>
                                    <img
                                        src={`${PATH.STORAGE_BANK}/${item.bankLogo}`} 
                                        alt={`${item.bankName} 로고`} 
                                        className={styles.favoriteLogoImg}
                                    />
                                </div>
                                <div className={styles.favoriteInfoDiv}>
                                    <div className={styles.favoriteBankProDiv}>
                                        <div className={styles.favoriteBank}>{item.bankName}</div> 
                                        <div className={styles.favoritePro}>{item.prdName}</div>   
                                    </div>
                                    <div className={styles.favoriteRateDiv}>
                                        <div className={styles.favoriteHighestRateDiv}>
                                            <div className={styles.favoriteHighestRateText}>최고금리</div>
                                            <div className={styles.favoriteHighestRatePer}>
                                                <span className={styles.spcl_rate}>{item.spclRate.toFixed(2)}</span>% 
                                            </div>
                                        </div>
                                        <div className={styles.favoriteSBaseRateDiv}>
                                            <div className={styles.favoriteBaseRateText}>기본금리</div>
                                            <div className={styles.favoriteBaseRatePer}>
                                                <span className={styles.basic_rate}>{item.basicRate.toFixed(2)}</span>%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default MyDepositPage;