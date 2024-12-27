import { useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstanceAPI from 'src/apis/axiosInstanceAPI';
import {PATH} from 'src/utils/path.js';
import { useSetAtom, useAtom } from "jotai";
import { userData } from '../../atoms/userData';
import { isLoggedInAtom } from 'src/atoms/sessionAtom';

const OAuthCallbackHandlerPage = () => {
    const navigate = useNavigate();
    const setUser = useSetAtom(userData);
    const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);

    useEffect(() => {
        const handleOAuthCallback = async () => {
            // URL에서 Access Token 추출
            const fragment = window.location.hash.substring(1); // # 이후 문자열 추출
            const params = new URLSearchParams(fragment);
            const access = params.get("access");

            if (access) {
                try {
                    // Access Token을 localStorage에 저장
                    localStorage.setItem("Authorization", access);

                    // 사용자 정보 요청
                    const response = await axiosInstanceAPI.post(`${PATH.SERVER}/api/myInfo`);
                    setUser(response.data.result);
                    setIsLoggedIn(true);

                    // 요청 성공 시 메인 페이지로 이동
                    navigate(`${PATH.HOME}`);
                } catch (error) {
                    console.error("사용자 정보 요청 실패: " + error);

                    // 에러 발생 시 로그인 페이지로 이동
                    navigate(`${PATH.SIGN_IN}`);
                }
            } else {
                console.error("Access Token이 존재하지 않습니다.");
                navigate(`${PATH.SIGN_IN}`);
            }
        };

        handleOAuthCallback();
    }, [setUser, navigate]);

    return (
        <main>
            <section>
                <div>로그인 처리 중...</div>
            </section>
        </main>
    );
};

export default OAuthCallbackHandlerPage;