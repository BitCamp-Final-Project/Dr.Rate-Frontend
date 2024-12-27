import styles from './MyInstallmentPage.module.scss';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { PATH } from 'src/utils/path';
import { useSession } from 'src/hooks/useSession';
import ConfirmModal from 'src/components/Modal/ConfirmModal';
import useModal from 'src/hooks/useModal';
import MyNav from 'src/components/MyNav';
import FavoritePanel from 'src/components/FavoritePanel';
import useMyFavorite from 'src/hooks/useMyFavorite';
import rightArrowIcon from 'src/assets/icons/rightArrow.svg';
import spinner from 'src/assets/icons/spinner.gif';



const MyInstallmentPage = () => {

    const navigate = useNavigate();

    const { isLoggedIn } = useSession();

    const {
        isConfirmOpen,
        openConfirmModal,
        closeConfirmModal,
        confirmContent
    } = useModal();

    const handleConfirm = () => {
        navigate(PATH.SIGN_IN);
        closeConfirmModal();
    };

    const handleCancel = () => {
        navigate(PATH.HOME);
        closeConfirmModal();
    };

    const { favoriteData, fetchFavorites, loading, error, individualChecked, handleIndividualCheck } = useMyFavorite();

    useEffect(() => {
        if (!isLoggedIn) {
            openConfirmModal(
                '로그인이 필요합니다.',
                '로그인 페이지로 이동하시겠습니까?',
                handleConfirm,
                handleCancel
            );
        } else {
            fetchFavorites(); // 로그인된 경우에만 즐겨찾기 데이터를 가져옴
        }
    }, [isLoggedIn, fetchFavorites]); // isLoggedIn이 변경될 때 실행



    return (
        <main>
            <MyNav />
            <ConfirmModal
                isOpen={isConfirmOpen}
                closeModal={closeConfirmModal}
                title={confirmContent.title}
                message={confirmContent.message}
                onConfirm={confirmContent.onConfirm}
                onCancel={confirmContent.onCancel}
            />

            <section className={styles.favoriteSection}>
                {/* FavoritePanel은 항상 렌더링 */}
                <FavoritePanel favoriteDataLength={favoriteData.length} />

                {/* 상태에 따라 내부 내용만 바뀜 */}
                {loading &&
                    <div className={styles.errorDiv}>
                        <img className={styles.loadingImg} src={spinner} alt="loading" />
                    </div>}
                {error && <div className={styles.errorDiv}>데이터를 불러오는 중 에러가 발생했습니다.</div>}

                {/* 정상 데이터 로드 */}
                {!loading && !error && (
                    <div className={styles.favoriteListDiv}>
                        {/* 즐겨찾기 데이터가 없을 경우 메시지 출력 */}
                        {favoriteData.length === 0 ? (
                            <div className={styles.noFavoriteList}>
                                <h4>즐겨찾기가 없습니다.</h4>
                                <div className={styles.moveList}>
                                    즐겨찾기 추가하기
                                    <img src={rightArrowIcon} alt="오른쪽 화살표" className={styles.rightArrowIcon} />
                                    <span className={styles.listLink} onClick={() => navigate(PATH.INSTALLMENT_LIST)}>적금 목록 페이지</span>
                                    <span>로 이동하기</span>
                                </div>
                            </div>
                        ) : (
                            // 즐겨찾기 데이터가 있을 경우 리스트 출력
                            favoriteData.map((item, index) => (
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
                            ))
                        )}
                    </div>
                )}

            </section>
        </main>
    );
}

export default MyInstallmentPage;