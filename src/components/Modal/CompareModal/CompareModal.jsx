import React, { useEffect, useRef, useState } from 'react';
import { PATH } from 'src/utils/path';

import styles from 'src/components/Modal/CompareModal/CompareModal.module.scss';
import verticalDividerIcon from 'src/assets/icons/verticalDivider.svg';
import leftArrow from 'src/assets/icons/leftArrow.svg';
import rightArrow from 'src/assets/icons/rightArrow.svg';
import searchIcon from 'src/assets/icons/searchIcon.svg';
import spinner from 'src/assets/icons/spinner.gif';

import useCheckedBanks from 'src/hooks/useCheckedBanks';
import {banks, getAllProducts} from 'src/apis/productsAPI';

import AlertModal from 'src/components/Modal/AlertModal';
import useModal from 'src/hooks/useModal';
import useDragScroll from 'src/hooks/useDragScroll';

const CompareModal = ({isOpen, closeModal, title, onCancel, listLength, ctg}) => {
    if(!isOpen) return null;
    
    /* 모달 배경창 닫기 */
    const handleBackgroundClick = (e) => {
        if (e.target.classList.contains(styles.compareModal)) {
            closeModal();
        }
    };


    
    /* Alert 훅 */
    const {
        isAlertOpen, 
        openAlertModal, 
        closeAlertModal, 
        alertContent
    } = useModal();
    
    // Alert 취소 클릭 시
    const handleCancel = () => {
        closeAlertModal();
    };
    
    /* checkbox 훅 */
    const limit = 3-listLength;
    const { 
        checkedBanks, 
        handleCheckboxChange,
        handleAddProduct,
        deletePrd,
        addProduct,
        addPrdId
    } = useCheckedBanks(banks, limit, openAlertModal);


    
    /* drag 훅 */
    const {
        bankListRef, 
        scrollList 
    } = useDragScroll();


    

    /* 은행 코드 */
    const bankCodes = [10001, 10927, 11625, 13175, 13909, 15130, 17801, 10016, 10017, 10026, 10022];
    /* 상품 */
    const [products, setProducts] = useState([]);
    
    /* APIS GETALLPRODUCTS */
    useEffect(() => {
        const fetchAllProduct = async () => {
            try {
                const allProducts = await getAllProducts();

                const filteredProducts = allProducts.filter(product => product.product.ctg === ctg);

                // 기타 은행 코드 변경
                const updatedProducts = filteredProducts.map(product => {
                    if (!bankCodes.includes(product.product.bankCo)) {
                        return {
                            ...product,
                            product: {
                                ...product.product,
                                bankCo: 10000
                            }
                        };
                    }
                    return product;
                });

                // 최고 금리 옵션 추가 및 정렬
                const sortedProducts = updatedProducts.map(product => {
                    const maxOption = product.options.reduce((max, option) => {
                        return option.spclRate > max.spclRate ? option : max;
                    }, product.options[0]);

                    const index = product.options.findIndex(option => option === maxOption);

                    return {
                        ...product,
                        index : index
                    };
                }).sort((a, b) => b.options[b.index].spclRate - a.options[a.index].spclRate)

                setProducts(sortedProducts);

            } catch (error) {
                console.error(error);
            }
        };

        fetchAllProduct();
    }, [ctg]);




    /* 필터 기능 */
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [sortType, setSortType] = useState(0);

    // 은행 체크박스, 검색창 필터링 
    const filterProductsByBanks = () => {
        let filtered = checkedBanks.length === 0 || checkedBanks.includes(null)
            ? products
            : products.filter(product => checkedBanks.includes(product.product.bankCo));
        
        // 검색
        if (search) {
            filtered = filtered.filter(product => 
                product.product.prdName.toLowerCase().includes(search.toLowerCase()) || 
                product.product.bankName.toLowerCase().includes(search.toLowerCase())
            );
        }

        // 정렬
        if(sortType === 0){
            filtered.sort((a, b) => {
                return b.options[b.index].spclRate - a.options[a.index].spclRate;
            })
        }else if(sortType === 1){
            filtered.sort((a, b) => {
                return b.options[b.index].basicRate - a.options[a.index].basicRate;
            })
        }
        
        setFilteredProducts(filtered);
    };

    // 검색 핸들러
    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    // 필터 적용
    useEffect(() => {
        filterProductsByBanks();
    }, [checkedBanks, search]);

    // 상품 로드 후 필터링 및 정렬
    useEffect(() => {
        if (products.length > 0) {
            filterProductsByBanks();
        }

        setSortType(0);
    }, [products]);





    /* 상품 추가 */
    const addComparePrd = async (addPrdId, addProduct) => {

        if (addPrdId.length === 0) {
            openAlertModal('선택한 상품이 없습니다', '상품을 선택해주세요.');
        } else {
            let compareList;

            if(ctg === "d"){
                compareList = JSON.parse(localStorage.getItem('depCompareList')) || [];
            } else if(ctg === "i"){
                compareList = JSON.parse(localStorage.getItem('insCompareList')) || [];
            }

            const duplicateProduct = compareList.some(product => product.product.id === addProduct[0].product.id);
    
            if (duplicateProduct) {
                openAlertModal('이미 추가된 상품입니다', '이 상품은 이미 비교 목록에 있습니다.');
                return; // 중복된 상품이 있으면 추가 작업을 중단
            }

            if (compareList.length >= 3) {
                openAlertModal('상품 비교 한도 초과', '비교할 수 있는 상품은 최대 3개입니다.');
                return;
            }

            compareList.push(...addProduct);
            if(ctg === "d"){
                localStorage.setItem('depCompareList', JSON.stringify(compareList));
            } else if(ctg === "i"){
                localStorage.setItem('insCompareList', JSON.stringify(compareList));
            }

            
            console.log('비회원 비교 항목 추가:', compareList);
            closeModal();
            
        }
    };


    /* 정렬 */
    const sortList = (type) => {
        const filtered = filteredProducts;

        if(type === 'spcl'){
            filtered.sort((a, b) => {
                return b.options[b.index].spclRate - a.options[a.index].spclRate;
            });

            setSortType(0);
        }else if(type === 'basic'){
            filtered.sort((a, b) => {
                return b.options[b.index].basicRate - a.options[a.index].basicRate;
            });

            setSortType(1);
        }
        setFilteredProducts(filtered);
    }



    return (
        <div className={styles.compareModal} onClick={handleBackgroundClick}>
        
        {/* Alert 모달창 */}
        {isAlertOpen && (
            <AlertModal
                isOpen={isAlertOpen}
                closeModal={closeAlertModal}
                title={alertContent.title}
                message={
                    <>
                        {alertContent.message}
                    </>
                }
                onCancel={handleCancel}
            />
        )}

        {/* 모달 */}
        <div className={styles.compareModalContent}>
            <h2 className={styles.mainTitle}>{title}</h2>

            {/* 체크박스 */}
            <div className={styles.bankListWrapper}>
            <img src={leftArrow} className={styles.scrollButtonLeft} 
                onClick={() => scrollList('left')}/>

            {/* 은행 체크박스 */}
            <div className={styles.bankList} ref={bankListRef}>

                {banks.map((bank, key) => (
                <div key={key} className={styles.bank}>
                    
                    <label className={styles.checkboxContainer}>
                    <input
                        type='checkbox'
                        value={bank.name}
                        checked={bank.code === null ? checkedBanks.length > 7 : checkedBanks.includes(bank.code)}
                        onChange={handleCheckboxChange}
                        className={styles.checkbox}
                    />

                    <span className={`${styles.customCheckbox} 
                        ${checkedBanks.includes(bank.code) || (bank.code === null && checkedBanks.length > 7) 
                        ? styles.checked : styles.nonChecked}`}>
                        {bank.name}
                    </span>
                    </label>
                </div>
                ))}

            </div>

            <img src={rightArrow} className={styles.scrollButtonRight} 
                onClick={() => scrollList('right')}/>
            </div>
            
            {/* 검색창 */}
            <div className={styles.search}>
                <input type='text' name='search' id='search' 
                    className={styles.inputSearch} 
                    onChange={handleSearch} />
                <img src={searchIcon}/>
            </div>

            {/* 정렬 */}
            <div className={styles.listTitle}>
                <span className={styles.title}>적금 리스트</span>

                <div className={styles.sort}>
                    <span className={`${styles.sortSpcl} 
                                    ${sortType === 0 ? styles.sortSelect : ''}`} 
                                onClick={() => sortList('spcl')}>
                        최고금리순
                    </span>
                    <img src={verticalDividerIcon}/>
                    <span className={`${styles.sortBasic} 
                                    ${sortType === 1 ? styles.sortSelect : ''}`} 
                                onClick={() => sortList('basic')}>
                        기본금리순
                    </span>
                </div>
            </div>

            {/* 상품 리스트 */}
            <div className={styles.list}>
            {filteredProducts.length > 0 ? filteredProducts.map((product, index) => (
                
                // 상품 박스
                <div key={product.product.id} 
                        className={`${styles.product} 
                                    ${addPrdId.includes(product.product.id) ? styles.selected : ''}`}
                        onClick={() => handleAddProduct(product)}>
                    
                    {/* 상품명 */}
                    <div className={styles.productbox}>
                        <img 
                            src={`${PATH.STORAGE_BANK}/${product.product.bankLogo}`} 
                            className={styles.bankLogo} 
                            alt={`${product.product.bankName} Logo`} 
                        />

                        <div className={styles.productTextDiv}>
                            <div className={styles.productText}>
                                <span className={styles.bankName}>{product.product.bankName}</span>
                                <span className={styles.productName}>{product.product.prdName}</span>
                            </div>

                            {/* 금리 */}
                            <div className={styles.rate}>
                                <span className={styles.spclrate}>최고금리 {product.options[product.index].spclRate}%</span>
                                <span className={styles.basicRate}>기본금리 {product.options[product.index].basicRate}%</span>
                            </div>
                        </div>

                    </div>

                </div>
                )) : <span><img src={spinner}/></span>
            }
            </div>

            {/* 추가 상품 */}
            <div className={styles.addPrd}>
                {addProduct.map(product => (
                    <div className={styles.addProduct} key={product.product.id}>
                        <img 
                            src={`${PATH.STORAGE_BANK}/${product.product.bankLogo}`} 
                            className={styles.bankLogo} 
                            alt={`${product.product.bankName} Logo`} 
                        />

                        <div className={styles.productText}>
                            <span className={styles.productName}>{product.product.prdName}</span>
                        </div>
                        
                        <div className={styles.deleteBtn}
                            onClick={() => deletePrd(product)}>X</div>
                    </div>
                ))}
            </div>

            {/* 버튼 */}
            <div className={styles.buttonContainer}>
                <button onClick={() => addComparePrd(addPrdId, addProduct)} 
                        className={styles.compareButton}>추가</button>
                <button onClick={onCancel} 
                        className={styles.cancelButton}>취소</button>
            </div>
        
        </div>
        </div>
    );
};

export default CompareModal;