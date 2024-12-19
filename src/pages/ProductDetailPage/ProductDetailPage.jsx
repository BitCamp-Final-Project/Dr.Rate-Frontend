import styles from './ProductDetailPage.module.scss';
import RateCalc from 'src/pages/ProductDetailPage/RateCalc';
import downArrowIcon2 from 'src/assets/icons/downDetailArrow.svg';

import AlertModal from 'src/components/Modal/AlertModal';
import ConfirmModal from 'src/components/Modal/ConfirmModal';
import useModal from 'src/hooks/useModal';
import AutoClosePopup from 'src/components/Popup';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH } from "src/utils/path";
import { atom, useAtom } from 'jotai';
import useProducts from 'src/hooks/useProducts';
import { useFavorite } from '../../hooks/useFavorite';
import { getProductDetails } from 'src/apis/productsAPI';

/* Jotai 상태 관리 */
const productsAtom = atom({
    optionNum: {},
    options: [],
    product: {},
    conditions: [],
}); 
const isOpenAtom = atom(false);



const ProductDetailPage = () => {
    const navigate = useNavigate();
    const { prdId } = useParams();
    const { isFavorite, toggleFavorite, errorMessage } = useFavorite(prdId);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [favoriteClicked, setFavoriteClicked] = useState(false);
    const { noIdMessage } = useProducts(prdId);

    /* Jotai 상태 관리 */
    const [products, setProducts] = useAtom(productsAtom);
    const [isOpen, setIsOpen] = useAtom(isOpenAtom); // 이자 계산기 열림/닫힘 상태 관리

    
    /* useModal 훅 */
    const {
        isConfirmOpen,
        openConfirmModal,
        closeConfirmModal,
        confirmContent,
        isAlertOpen, 
        openAlertModal, 
        closeAlertModal, 
        alertContent
    } = useModal();
    

    /* 상품 정보 불러오기 */
    useEffect(() => {
        const fetchProductDetails = async () => {
            if(prdId) {
                try {
                    const productDetails = await getProductDetails(prdId);
                    setProducts({
                        optionNum: productDetails.optionNum,
                        options: productDetails.options,
                        product: productDetails.product,
                        conditions: productDetails.conditions
                    });
                    // console.log(productDetails);
                } catch (error) {
                    console.error("Failed to fetch product details:", error);
                }
            }
        };
    
        fetchProductDetails();
    }, [prdId]);
    

    /* 객체 변환 */
    const i = products?.optionNum || 0;
    const options = products?.options || null;
    const product = options?.[i]?.products || {};
    const conditions = products.conditions;



    /* 이자 계산기 */
    const handleToggle = () => {
        // Test 용
        const isUserLoggedIn = sessionStorage.getItem('userLoggedIn');

        // session값 맏아오면 변경해야됨
        if (!isUserLoggedIn) {
            setIsOpen((prev) => !prev);
        } else {
            const confirmMessage = (
                <>
                    로그인 후 이자계산기를 사용할 수 있어요! <br />
                    <span>이미 회원이세요?</span> 
                    <span className={styles.arrow}>&gt;&gt;</span>
                    <span 
                        className={styles.modalLogin} 
                        onClick={handleLoginClick}>
                        로그인
                    </span>
                </>
            );
            openConfirmModal('회원가입 하시겠습니까?', confirmMessage, handleConfirm, handleCancel);

        }

        if(options == null || options[i] == null){
            openAlertModal('오류',`옵션이 없는 상품입니다.` );
            setIsOpen(false);
        }
        
    };


    /* Confirm Modal 로그인 클릭 시 */
    const handleLoginClick = () => {
        closeConfirmModal();
        navigate(PATH.SIGN_IN);
    };

    /* Confirm Modal 확인 클릭 시 */
    const handleConfirm = () => {
        navigate(PATH.HOME);
        closeConfirmModal();
    };

    /* Confirm Modal 취소 클릭 시 */
    const handleCancel = () => {
        closeConfirmModal();
    };



    /* 즐겨찾기 에러 Alert Modal */
    useEffect(() => {
        if (errorMessage) {
            openAlertModal(
                '오류가 발생했습니다.', 
                errorMessage
            ); 
        }
    }, [errorMessage, openAlertModal]);


    /* 즐겨찾기 버튼 핸들러 */
    const handleFavoriteClick = async () => {
        setFavoriteClicked(true); // 버튼 클릭 여부 설정
        try {
            await toggleFavorite(prdId);

            // 즐겨찾기 등록 시 Confirm 모달 표시
            if (!isFavorite) { 
                openConfirmModal(
                    '즐겨찾기가 등록되었습니다.',
                    '마이페이지로 이동하시겠습니까?',
                    handleFavoriteConfirm,
                    handleFavoriteCancel
                );
            } else {
                // 즐겨찾기 취소 시 Alert Modal 표시
                openAlertModal('즐겨찾기가 삭제되었습니다.');

            }
        } catch (error) {
            openAlertModal(
                '오류가 발생했습니다.',
                error.message
            );
        }
    };


    /* 즐겨찾기 Confirm Modal */
    const handleFavoriteConfirm = () => {
        closeConfirmModal();
        if (product.ctg === 'd') {
            navigate(PATH.MY_DEPOSIT); // 예금 즐겨찾기
        } else {
            navigate(PATH.MY_INSTALLMENT); // 적금 즐겨찾기
        }
    };

    const handleFavoriteCancel = () => {
        closeConfirmModal();
    };

    /* 즐겨찾기 등록 시 Confirm 모달 */
    useEffect(() => {
        if (favoriteClicked && isFavorite) { 
            openConfirmModal(
                '즐겨찾기가 등록되었습니다.',
                '마이페이지로 이동하시겠습니까?',
                handleFavoriteConfirm,
                handleFavoriteCancel
            );
        }
    }, [favoriteClicked, isFavorite, openConfirmModal, closeConfirmModal, navigate]);



    /* 유효하지 않은 상품 리다이렉트 팝업 */
    useEffect(() => {
        if (noIdMessage) {
            setIsPopupOpen(true); // 팝업 열기
        }
    }, [noIdMessage]);

    const popupMessage = (
        <>
            {noIdMessage} <br />
            목록으로 이동합니다.
        </>
    );

    return (
        <main>
            <section className={styles.detailSection}>

            <AutoClosePopup
                isOpen={isPopupOpen}
                message={popupMessage}
                redirectPath={PATH.DEPOSIT_LIST}
                duration={3000} // 3초 후 이동
            />

                {/* 상품 제목 및 상단 정보 */}
                <h3 className={styles.title}>{product.ctg === 'i' ? '적금' : '예금'}</h3>
                <div className={styles.topDiv}>
                    <div className={styles.image}><img src={`${PATH.STORAGE_BANK}/${product?.bankLogo || 'remainLogo.png'} `} /></div>
                    <div className={styles.name}>
                        <p className={styles.nameOne}>{product?.bankName || '은행명 없음'}</p>
                        <p className={styles.nameTwo}>{product?.prdName || '상품명 없음'}</p>

                        <p className={styles.nameThree}>{options?.[i]?.rsrvTypeName ?? '자유적립식'}</p>
                    </div>
                    <div className={styles.rate}>
                        <p className={styles.rateOne}>{options?.[i]?.spclRate ? `최고 ${options[i].spclRate} %` : '우대조건 해당사항 없음'}</p>
                        <p className={styles.rateTwo}>기본금리 {options?.[i]?.basicRate ?? '금리 정보 없음'} %</p>
                    </div>
                </div>

                {/* 버튼 영역 */}
                <div className={styles.btnDiv}>
                    <button  
                        className={styles.heartIcon} 
                        onClick={() => handleFavoriteClick(prdId)}
                    >
                        <span className={`${styles.heart} ${isFavorite ? styles.active : ''}`}>&hearts;</span> 즐겨찾기
                    </button>
                    <button className={styles.intobtn}>비교담기</button>
                    <button className={styles.gotoHomePage} onClick={() =>window.open(product?.url, '_blank')}>가입하기</button>
                </div>
                

                {/* 이자 계산기 */}
                {!isOpen && (
                <div className={`${styles.serviceDiv} ${isOpen ? styles.open : ''}`} onClick={handleToggle}>
                    <span className={styles.serviceOne}>이자계산기</span>
                    <span className={styles.serviceTwo}>자세히 <img src={downArrowIcon2} className={styles.downArrowIcon2}/></span>
                </div>
                )}

                {isOpen && options && options[i] && (
                    <RateCalc isOpen={isOpen} options={options[i] || {}} conditions={conditions}  onClose={handleToggle}/>
                )}

                {/* Confirm Modal */}
                {isConfirmOpen && (
                <ConfirmModal
                    isOpen={isConfirmOpen}
                    closeModal={closeConfirmModal}
                    title={confirmContent.title}
                    message={confirmContent.message}
                    onConfirm={confirmContent.onConfirm}
                    onCancel={confirmContent.onCancel}
                />
                )}

                 {/* Alert Modal */}
                {isAlertOpen && (
                <AlertModal
                    isOpen={isAlertOpen}
                    closeModal={closeAlertModal}
                    title={alertContent.title}
                    message={ alertContent.message}
                />
                )}

                {/* 상세 정보 */}
                <div className={styles.detailDiv}>
                <h3 className={styles.detailTitle}>상세정보</h3>
                <ul>
                    <li>
                        <span>가입대상 / 가입제한</span>
                        <p>{product?.joinMember || '정보 없음'}</p>
                    </li>
                    <li>
                        <span>가입기간 / 가입금액</span>
                        <p>{product?.etc || '정보 없음'}</p>
                    </li>
                    <li>
                        <span>납입금액</span>
                        <p>최대 {product?.max || '금액 제한없음'}</p>
                    </li>
                    <li>
                        <span>적용이율 / 적용방식</span>
                        <table className={styles.rateTable}>
                            <thead>
                                <tr>
                                    <td>기간</td>
                                    <td>기본금리</td>
                                    <td>최대금리</td>
                                    <td>이자 적용 방법</td>
                                    <td>적립 방식</td>
                                </tr>
                            </thead>
                            <tbody>
                                {options?.map((option, index) => (
                                    <tr key={index}>
                                        <td>{option.saveTime} 개월</td>
                                        <td>{option.basicRate}%</td>
                                        <td>{option.spclRate}%</td>
                                        <td>{option.rateTypeKo}</td>
                                        <td>{option.rsrvTypeName || '정보 없음'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </li>
                    
                    <li>
                        <span>이자 계산 방법</span>
                        <table className={styles.rateCalcTable}>
                            <thead>
                                <tr>
                                    <td>계산 방법</td>
                                    <td>계산식</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>단리 계산 (적금)</td>
                                    <td>월 적립액 × 10000 × 이자율 × 기간</td>
                                </tr>
                                <tr>
                                    <td>복리 계산 (적금)</td>
                                    <td>(월 적립액 × 10000) × ((1 + (이자율 × 0.01) / 12) ^ (12 × 기간) - 1) / (이자율 / 12)</td>
                                </tr>
                                <tr>
                                    <td>단리 계산 (예금)</td>
                                    <td>월 적립액 × 10000 × 이자율 × 기간</td>
                                </tr>
                                <tr>
                                    <td>복리 계산 (예금)</td>
                                    <td>(월 적립액 × 10000) × (1 + (이자율 × 0.01) / 12) ^ (12 × 기간)</td>
                                </tr>
                            </tbody>
                        </table>
                    </li>

                    <li>
                        <span>만기 후 이율</span>
                        <p className={styles.mtrtInt}>{product?.mtrtInt || '정보 없음'}</p>
                    </li>
                    <li>
                        <span>우대조건</span>
                        <p className={styles.spclCnd}>{product?.spclCnd || '정보 없음'}</p>
                    </li>
                </ul>
            </div>
        </section>
        </main>
    );
};

export default ProductDetailPage;