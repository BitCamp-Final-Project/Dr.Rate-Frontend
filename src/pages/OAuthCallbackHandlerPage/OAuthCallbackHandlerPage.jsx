import { useEffect } from "react";
import React from 'react';
import { useNavigate } from "react-router-dom";
import {PATH} from "../../utils/path.js";

const OAuthCallbackHandlerPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // URL에서 Access Token 추출
        const fragment = window.location.hash.substring(1); // # 이후 문자열 추출
        const params = new URLSearchParams(fragment);
        const access = params.get("access");

        if (access) {
            // Access Token을 localStorage에 저장
            localStorage.setItem("access", access);

            // 메인 페이지로 이동
            navigate(`${PATH.HOME}`);
        } else {
            console.error("Access Token이 존재하지 않습니다.");
            navigate(`${PATH.SIGN_IN}`);
        }
    }, [navigate]);

    return (
        <main>
            <section>
                <div>로그인 처리 중...</div>
            </section>
        </main>
    );
};

export default OAuthCallbackHandlerPage;