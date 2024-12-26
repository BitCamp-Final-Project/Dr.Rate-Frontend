import React, { useState } from 'react';

const useCheckedBanks = (banks, limit, openAlertModal) => {
    // 체크된 은행
    const [checkedBanks, setCheckedBanks] = useState([]);
    // 추가된 상품
    const [addProduct, setAddProduct] = useState([]);
    // 추가된 상품 코드
    const [addPrdId, setAddPrdId] = useState([]);



    /* 체크박스 CSS 적용 및 리스트에 담기 */
    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;

        // 전체버튼 클릭했을 때
        if (value === '전체') {
            if (checked) {
                setCheckedBanks(banks.filter(bank => bank.code !== null).map(bank => bank.code));
            } else {
                setCheckedBanks([]);
            }
        // 그 외 은행 클릭했을 때
        } else {
            const bank = banks.find(b => b.name === value);
            const bankCo = bank ? bank.code : null;
        
            setCheckedBanks((prev) => {
                if (checked) {
                    return [...prev, bankCo];
                } else {
                    return prev.filter(code => code !== bankCo);
                }
            });
        }
    };

    const handleAddProduct = (product) => {
        if(addPrdId.length === limit &&  !addPrdId.includes(product.product.id)){
            openAlertModal('상품 비교 한도 초과', '최대 3개의 상품만 비교할 수 있습니다.');
            return;
        }

        setAddPrdId((prevProducts) => {
            if (!prevProducts.includes(product.product.id)) {
              return [...prevProducts, product.product.id];
            } else {
                return prevProducts.filter((prd) => prd !== product.product.id);
            }
        });

        setAddProduct((prevProducts) => {
            if (!prevProducts.some((prd) => prd.product.id === product.product.id)) {
              return [...prevProducts, product];
            } else {
                return prevProducts.filter((prd) => prd.product.id !== product.product.id);
            }
        });
    }

    const deletePrd = (product) => {
        setAddPrdId((prevProducts) => {
            if (prevProducts.includes(product.product.id)) {
                return prevProducts.filter((prd) => prd !== product.product.id);
            }
        });

        setAddProduct((prevProducts) => {
            if (prevProducts.some((prd) => prd.product.id === product.product.id)) {
                return prevProducts.filter((prd) => prd.product.id !== product.product.id);
            }
        });
    }

    return {
        checkedBanks,
        handleCheckboxChange,
        handleAddProduct,
        deletePrd,
        addProduct,
        addPrdId
    };
};

export default useCheckedBanks;