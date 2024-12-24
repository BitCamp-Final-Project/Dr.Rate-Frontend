import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PATH } from 'src/utils/path';

const useProducts = (id) => {
    const [products, setProducts] = useState({
        optionNum: null,
        options: [],
        product: null,
        conditions: []
    });

    const [noIdMessage, setNoIdMessage] = useState(null);

    useEffect(() => {
        if (id) {
            axios.get(`${PATH.SERVER}/product/getOneProduct/${id}`)
                .then((res) => {
                    setProducts({
                        optionNum: res.data.optionNum,
                        options: res.data.options,
                        product: res.data.product,
                        conditions: res.data.conditions
                    });
                    setNoIdMessage(null);
                    console.log(res.data);
                })
                .catch((error) => {
                    if (error.response?.data?.message === "존재하지 않는 상품입니다.") {
                        setNoIdMessage("존재하지 않는 상품입니다."); // 에러 메시지 저장
                    } else {
                        console.error("Failed to fetch product details:", error);
                    }
                });
        }
    }, [id]);

    // 객체 변환 로직
    const optionNum = products.optionNum;
    const options = products.options;
    const product = options.length > 0 ? options[optionNum].products : "null";
    const conditions = products.conditions;

    return {
        products,
        optionNum,
        options,
        product,
        conditions,
        noIdMessage,
    };
};

export default useProducts;