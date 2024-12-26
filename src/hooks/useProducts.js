import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PATH } from 'src/utils/path';

import { getProductDetails } from 'src/apis/productsAPI';

const useProducts = (prdId) => {
    const [products, setProducts] = useState({
        optionNum: null,
        options: [],
        product: null,
        conditions: []
    });

    // 옵션 번호
    const [i, setI] = useState(0);

    const [noIdMessage, setNoIdMessage] = useState(null);

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

                    setI(productDetails?.optionNum || 0);
                    // console.log(productDetails);
                } catch (error) {
                    if (error.response?.data?.message === "존재하지 않는 상품입니다.") {
                        setNoIdMessage("존재하지 않는 상품입니다.");
                    } else {
                        console.error("Failed to fetch product details:", error);
                    }
                }
            }
        };
    
        fetchProductDetails();
    }, [prdId]);
    

    /* 객체 변환 */
    const optionNum = products.optionNum;
    const options = products?.options || null;
    const product = options?.[i]?.products || {};
    const conditions = products.conditions;

    return {
        i,
        setI,
        products,
        optionNum,
        options,
        product,
        conditions,
        noIdMessage,
    };
};

export default useProducts;