import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // useNavigate 추가
import AlertModal from 'src/components/Modal/AlertModal'; // AlertModal import
import styles from './SignInPage.module.scss';

import { useAtom } from 'jotai';
import { userData } from '../../atoms/userData';

import googleIcon from 'src/assets/socialIcons/Google-Icon.png';
import kakaoIcon from 'src/assets/socialIcons/Kakao-Icon.png';
import naverIcon from 'src/assets/socialIcons/Naver-Icon.png';
import { PATH } from 'src/utils/path';

const SignInPage = () => {
    const navigate = useNavigate();  // navigate 훅 사용
    const [, setMyData] = useAtom(userData); // Jotai Atom 사용

    // 모달 상태 관리
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    // 일반 로그인 상태 관리
    const [userId, setUserId] = useState('');
    const [userPwd, setUserPwd] = useState('');

    // 로그인 후 JWT 처리 함수
    const handleOAuthLogin = async (provider) => {
        window.location.href=`${PATH.SERVER}/api/signIn/${provider}`;
    };

    // 일반 로그인 처리 함수
    const handleLogin = async () => {
        try {
            const response = await axios.post(`${PATH.SERVER}/api/signIn`, {
                user_id: userId,
                user_pwd: userPwd,
            });

            const { token } = response.data;
            if (token) {
                console.log("Received JWT:", token);
                localStorage.setItem("accessToken", token); // JWT를 localStorage에 저장
                //조타이 추가
                const response = await axiosInstanceAPI.post(`${PATH.SERVER}/api/myInfo`);
                setMyData(response.data.result);  // 데이터 업데이트
                console.log("데이터 가져옴");

                window.location.href = `${PATH.HOME}`; // 메인 페이지로 이동
            } else {
                // 로그인 실패 시 모달 띄우기
                setModalTitle("로그인 실패");
                setModalMessage("아이디 또는 비밀번호가 잘못되었습니다.");
                setShowModal(true);
            }
        } catch (error) {
            console.error("로그인 오류:", error);
            // 로그인 오류 시 모달 띄우기
            setModalTitle("로그인 실패");
            setModalMessage("로그인 중 오류가 발생했습니다.");
            setShowModal(true);
        }
    };

    // 회원가입 페이지로 이동
    const handleSignUpClick = () => {
        navigate(`${PATH.SIGN_UP}`);  // 회원가입 페이지로 이동
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <main>
            <section className={styles.signinPage}>
                <div className={styles.title}>
                    <h4>로그인&nbsp;&nbsp;&nbsp;/</h4>
                    <h4 className={styles.signupText} onClick={handleSignUpClick}>&nbsp;&nbsp;&nbsp;회원가입</h4>
                </div>

                <div className={styles.loginForm}>
                    <form>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="user_id"
                                id="user_id"
                                placeholder="아이디"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)} // 아이디 상태 관리
                            />
                            <label htmlFor="user_id">아이디</label>
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="password"
                                name="user_pwd"
                                id="user_pwd"
                                placeholder="비밀번호"
                                value={userPwd}
                                onChange={(e) => setUserPwd(e.target.value)} // 비밀번호 상태 관리
                            />
                            <label htmlFor="user_pwd">비밀번호</label>
                        </div>
                    </form>
                </div>

                <button onClick={handleLogin}>로그인</button>

                <div className={styles.icons}>
                    <img
                        src={naverIcon}
                        alt="Naver Login"
                        onClick={() => handleOAuthLogin('naver')}
                    />
                    <img
                        src={kakaoIcon}
                        alt="Kakao Login"
                        onClick={() => handleOAuthLogin('kakao')}
                    />
                    <img
                        src={googleIcon}
                        alt="Google Login"
                        onClick={() => handleOAuthLogin('google')}
                    />
                </div>
                <div className={styles.findUser}>
                    <p>아이디 찾기</p>/<p>비밀번호 찾기</p>
                </div>
            </section>

            {/* 모달 표시 */}
            <AlertModal
                isOpen={showModal} // 모달 표시 여부
                closeModal={handleCloseModal} // 모달 닫기
                title={modalTitle} // 모달 제목
                message={modalMessage} // 모달 메시지
            />
        </main>
    );
};

export default SignInPage;
