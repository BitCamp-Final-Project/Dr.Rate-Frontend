import React, { useEffect, useState } from 'react';
import styles from 'src/components/CompareNav/CompareNav.module.scss';
import leftIcon from 'src/assets/icons/leftArrow.svg';
import rightIcon from 'src/assets/icons/rightArrow.svg';

import { PATH } from "src/utils/path";

const CompareNav = ({ctg, handleCancel}) => {
    
    const [navDepProducts, setNavDepProducts] = useState([]);
    const [navInsProducts, setNavInsProducts] = useState([]);

    const [isDepOpen, setIsDepOpen] = useState(false);
    const [isInsOpen, setIsInsOpen] = useState(false); 

    /* 상품 불러오기 */
    useEffect(() => {
        let depCompareList = JSON.parse(localStorage.getItem('depCompareList')) || [];
        setNavDepProducts(depCompareList);

        let insCompareList = JSON.parse(localStorage.getItem('insCompareList')) || [];
        setNavInsProducts(insCompareList);

        if(ctg === 'd'){
            setIsDepOpen(true);
            setIsInsOpen(false);
        } else if(ctg === 'i'){
            setIsInsOpen(true);
            setIsDepOpen(false);
        }
    }, [ctg, handleCancel])





    /* 화살표시  */
    const toggleDepProducts = () => {
        setIsDepOpen((prev) => !prev);
        setIsInsOpen((prev) => !prev);
    };

    const toggleInsProducts = () => {
        setIsInsOpen((prev) => !prev);
        setIsDepOpen((prev) => !prev);
    };

    const [isNavOpen, setIsNavOpen] = useState(true);

    const handleCloseNav = () => {
        setIsNavOpen((prev) => !prev);
    }


    /* 비교 상품 삭제 */
    const handleDeleteCom = (delProduct) => {

        if(delProduct.ctg === "d"){
            
            setNavDepProducts((prevProducts) => {
                const updatedProducts = prevProducts.filter(product => product.product.id !== delProduct.id)
                localStorage.setItem('depCompareList', JSON.stringify(updatedProducts));
                return updatedProducts;
            });
        } else if(delProduct.ctg === "i"){
            setNavInsProducts((prevProducts) => {
                const updatedProducts = prevProducts.filter(product => product.product.id !== delProduct.id)
                localStorage.setItem('insCompareList', JSON.stringify(updatedProducts));
                return updatedProducts;
            });
        }
    }

    return (
        <div className={styles.compareNavDiv}>
            <div className={`${styles.comparePrd} ${isNavOpen ? styles.navOpen : styles.navClose}`}>
            {navDepProducts.length === 0 && navInsProducts.length === 0 ? (
                <div></div>
            ) : (
                <>
            {/* 예금 */}
                <div className={`${styles.productList} ${isDepOpen ? styles.open : ''}`} >
                    <div className={styles.toggletitle}>예금비교</div>
                    {navDepProducts.length === 0 ? (
                        <p>등록된 상품이 없습니다.</p>
                    ) : (
                        navDepProducts.map((item) => (
                            <div key={item.product.id} className={styles.productItem}>
                                 <img src={`${PATH.STORAGE_BANK}/${item.product?.bankLogo || 'remainLogo.png'} `} />
                                <span className={styles.prdName}>{item.product.prdName}</span>
                                <span onClick={() => handleDeleteCom(item.product)}>X</span>
                            </div>
                        ))
                    )}
                    <div className={styles.toggleBtn} onClick={toggleDepProducts}><img src={rightIcon}/></div>
                </div>

            {/* 적금 */}
                <div className={`${styles.productList} ${isInsOpen ? styles.open : ''}`} >
                    <div className={styles.toggletitle}>적금비교</div>
                    {navInsProducts.length === 0 ? (
                        <p>등록된 상품이 없습니다.</p>
                    ) : (
                        navInsProducts.map((item) => (
                            <div key={item.product.id} className={styles.productItem}>
                                <img src={`${PATH.STORAGE_BANK}/${item.product?.bankLogo || 'remainLogo.png'} `} />
                                <span className={styles.prdName}>{item.product.prdName}</span>
                                <span onClick={() => handleDeleteCom(item.product)}>X</span>
                            </div>
                        ))
                    )}
                    <div className={styles.toggleBtn} onClick={toggleInsProducts}><img src={rightIcon}/></div>
                </div>
                </>
                )}
            </div>

            <div className={`${styles.closeNav} ${isNavOpen ? styles.navOpenIcon : ''}`} onClick={handleCloseNav}>
                {isNavOpen &&
                <>
                    <span>접기</span>
                    <img src={rightIcon} className={styles.rightIcon}/>
                    <img src={rightIcon}/>
                </>
                }

                {isNavOpen ||
                <>
                    <img src={leftIcon}/>
                    <img src={leftIcon} className={styles.leftIcon}/>
                    <span>예/적금 비교담기</span>
                </>
                }
            </div>
        </div>
    );
};

export default CompareNav;