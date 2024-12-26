import styles from './ProductComparePage.module.scss';
import historyIcon from 'src/assets/icons/rightArrow.svg';

import CompareModal from 'src/components/Modal/CompareModal';
import useModal from 'src/hooks/useCompare';

import React, { useEffect, useRef, useState } from 'react';
import { PATH } from 'src/utils/path';
import { useNavigate, useParams } from 'react-router-dom';
import useCalc from 'src/hooks/useCalc';

const ProductComparePage = () => {
    const navigate = useNavigate();
    
    // 경로에서 받은 ctg 값
    const { ctg } = useParams();
    // 비교 상품 리스트
    const [products, setProducts] = useState([]);
    const [EffectRefresh, setEffectRefresh] = useState(false);



    /* 상품 추가 */
    /* Compare 훅 */
    const {
        isCompareOpen,
        openCompareModal,
        closeCompareModal,
        compareContent
    } = useModal();

    const handleToggle = () => {
        openCompareModal(
            ctg == 'd' ? '예금' : '적금',
            handleCompare,
            handleCancel
        );
    }

    // 확인 클릭 시
    const handleCompare = () => {
        closeCompareModal();
    };

    // 취소 클릭 시
    const handleCancel = () => {
        closeCompareModal();
    };


    // 숫자 변형
    const formatNumber = (num) => Math.floor(num).toLocaleString();


    /* 비교상품 */
    /* 상품 불러오기 */
    useEffect(() => {
        if(EffectRefresh){
            setEffectRefresh(false);
        }
        fetchcompare();

    }, [EffectRefresh, ctg]);

    // 카테고리별로 storage에 있는 상품 번호 불러오기 - LocalStorage
    const fetchcompare = () => {
        const fetchCompareProducts = () => {
            let compareList;
            if(ctg === "d"){
                compareList = JSON.parse(localStorage.getItem('depCompareList')) || [];
            } else if(ctg === "i"){
                compareList = JSON.parse(localStorage.getItem('insCompareList')) || [];
            }

            setProducts(compareList);
        };
    
        fetchCompareProducts();
    }


    /* 비교 상품 삭제 */
    const handleDelete = (prdId) => {

        setProducts((prevProducts) => {
            const updatedProducts = prevProducts.filter(product => product.product.id !== prdId)

            if(ctg === "d"){
                localStorage.setItem('depCompareList', JSON.stringify(updatedProducts));
            } else if(ctg === "i"){
                localStorage.setItem('insCompareList', JSON.stringify(updatedProducts));
            }

            return updatedProducts;
        });
    }

    


    /* 상품 옵션 변경하기 */

    // 옵션 인덱스 변경
    const handleChangeIndex = (prdId, index) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.product.id === prdId ? {
                        ...product,
                        index: index,
                    } : product
            )
        );
    };


    /* 옵션 드롭다운 */
    const [dropdownState, setDropdownState] = useState({});
    const dropdownRef = useRef(null);

    // 드롭다운 토글
    const toggleDropdown = (prdId) => {
        setDropdownState((prevState) => ({
            ...prevState,
            [prdId]: !prevState[prdId],
        }));
    };

    // 옵션 선택 시 드롭다운 닫기 
    const handleItemClick = (prdId, index) => {
        setDropdownState((prevState) => ({
            ...prevState,
            [prdId]: false,
        }));
        handleChangeIndex(prdId, index);
    };

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownState((prev) => {
                    const newState = { ...prev };
                    Object.keys(newState).forEach(key => {
                        newState[key] = false;
                    });
                    return newState;
                });
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    
    
    
    return (
        <main>
            <section className={styles.compareSection}>
            {/* 상품 추가 모달창 */}
            {isCompareOpen && (
            <CompareModal
                isOpen={isCompareOpen}
                closeModal={() => { closeCompareModal();  setEffectRefresh(true); }}
                title={compareContent.title}
                listLength={products.length}
                message={
                    <>
                        {compareContent.message}
                    </>
                }
                onCompare={compareContent.onCompare}
                onCancel={compareContent.onCancel}
                ctg={ctg}
            />
            )}

                {/* Title */}
                <div className={styles.history}>
                    <div className={styles.historyDiv}>
                        <span>비교</span> 
                        <img src={historyIcon}/>
                        <span className={styles.historyAction}>{ctg == 'd' ? '예금' : '적금'}</span>
                    </div>

                    <div className={styles.addComparePrd} 
                        onClick={handleToggle}>
                            상품 추가하기
                    </div>
                </div>

                
                {/* 비교상품 */}
                <div className={styles.compareDiv}>
                    {products.length > 0 && products.slice(0, 3).map((product, index) => (
                        <div key={index} className={styles.comparePrd}>

                            {/* 삭제버튼 */}
                            <div className={styles.dtnDiv}>
                                <div className={styles.deleteBtnX} 
                                    onClick={() => handleDelete(product.product.id)}>X</div>
                            </div>

                            {/* 상품정보 */}
                            <img src={`${PATH.STORAGE_BANK}/${product.product.bankLogo}`} 
                                className={styles.bankLogo} alt="Bank Logo" />
                            <p className={styles.compareTitle} 
                                onClick={() => navigate(`${PATH.PRODUCT_DETAIL}/${product.product.id}`)}>
                                <span className={styles.bankName}>{product.product.bankName}</span>
                                <span className={styles.prdName}>{product.product.prdName}</span>
                            </p>

                            <p className={styles.rate}>
                                <span className={styles.basicRate}>기본금리 {product.options[product.index].basicRate} %</span>
                                <span className={styles.spclRate}>최고 {product.options[product.index].spclRate} %</span>
                            </p>


                            {/* 상품상세정보 */}
                            <div className={styles.compareDetailTable}>
                                <div className={styles.compareDetailDiv}>
                                    <span>가입대상</span>
                                    <span>{product.product.joinMember}</span>
                                </div>
                                <div className={styles.compareDetailDiv}>
                                    <span>가입방식</span>
                                    <span>{product.product.joinWay}</span>
                                </div>
                                <div className={styles.compareDetailDiv}>
                                    <span>금액한도</span>
                                    <span>{product.product.max === null ? '한도 없음' : `${formatNumber(product.product.max)} 원`}</span>
                                </div>
                                <div className={styles.compareDetailDiv}>
                                    <span>이자계산방식</span>
                                    <span>{product.options[product.index].rateTypeKo}</span>
                                </div>
                                <div className={styles.compareDetailDiv}>
                                    <span>적금기간</span>
                                    <span>{product.options[product.index].saveTime} 개월</span>
                                </div>
                                <div className={styles.compareDetailDiv}>
                                    <span>적립방식</span>
                                    <span> {product.options[product.index]?.rsrvTypeName || '적립방식 없음'}</span>
                                </div>
                               

                                {/* 옵션 */}
                                <div className={styles.compareDetailDiv}>
                                    <span>옵션</span>
                                    <div className={styles.allSelect}>
                                        <div onClick={() => toggleDropdown(product.product.id)} 
                                            className={`${styles.selectOptions} 
                                                        ${dropdownState[product.product.id] ? styles.selectedItem : ''}`}>
                                            {product.options[product.index].saveTime} 개월 | 최고 {product.options[product.index].spclRate}% 기본 {product.options[product.index].basicRate}%
                                        </div>
                                        
                                    {dropdownState[product.product.id] && (
                                        <div ref={dropdownRef} className={styles.optionItemDiv}>
                                        
                                        {product.options.map((item, index) => (
                                            <div key={index} value={index} 
                                                className={`${styles.optionItem} 
                                                            ${product.index === index ? styles.selected : ''}`}
                                                onClick={() => handleItemClick(product.product.id, index)}>

                                                {item.saveTime} 개월, 최고 {item.spclRate}% 기본 {product.options[product.index].basicRate}%
                                            </div>
                                        ))}

                                        </div>
                                    )}
                                    </div>
                                </div>


                            </div>

                            {/* 버튼 */}
                            <div className={styles.btn}>
                                <button className={styles.deleteBtn} onClick={() => handleDelete(product.product.id)}>삭제</button>
                                <button className={styles.joinBtn} onClick={() => window.open(product.product?.url, '_blank')}>가입하기</button>
                            </div>
                        </div>
                    ))}

                    {/* 상품이 비었을 때 */}
                    {products.length < 3 && (
                        <div className={products.length === 0 ? styles.noncomparePrdAll : styles.noncomparePrd} >
                            <span>비교할 상품이 없습니다.</span>
                            <span>상품을 추가하세요.</span>
                        </div>
                    )}
                </div>

            </section>
        </main>
    );
};

export default ProductComparePage;