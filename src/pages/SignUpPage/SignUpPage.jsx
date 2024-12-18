import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../../components/modal/AlertModal';  // AlertModal import
import styles from './SignUpPage.module.scss';

import googleIcon from 'src/assets/socialIcons/Google-Icon.png';
import kakaoIcon from 'src/assets/socialIcons/Kakao-Icon.png';
import naverIcon from 'src/assets/socialIcons/Naver-Icon.png';
import {PATH} from "../../utils/path.js";

const SignUpPage = () => {
    const navigate = useNavigate();

    /* 상태 관리 */
    const [user_id, setUserId] = useState('');
    const [user_pwd, setUserPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [user_email, setUserEmail] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPwdError, setConfirmPwdError] = useState('');
    const [showModal, setShowModal] = useState(false); // 모달 표시 상태 관리
    const [modalTitle, setModalTitle] = useState(''); // 모달 제목
    const [modalMessage, setModalMessage] = useState(''); // 모달 메시지

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
        return regex.test(password);
    };

    const handlePasswordBlur = () => {
        if (!validatePassword(user_pwd)) {
            setPasswordError("비밀번호는 8~12자 영문, 숫자, 특수문자를 포함해야 합니다.");
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPwdBlur = () => {
        if (user_pwd !== confirmPwd) {
            setConfirmPwdError("비밀번호가 일치하지 않습니다.");
        } else {
            setConfirmPwdError('');
        }
    };

    // 메일 인증 처리 함수
    const handleEmailVerification = async () => {
        try {
            await axios.post('http://localhost:8080/api/email/verify', { email: user_email });
            // 인증 성공 시
            setModalTitle("메일 인증 성공");
            setModalMessage("인증 메일이 전송되었습니다.");
            setShowModal(true);
        } catch (error) {
            console.error("메일 인증 오류:", error);
            // 인증 실패 시
            setModalTitle("메일 인증 실패");
            setModalMessage("메일 인증 중 오류가 발생했습니다.");
            setShowModal(true);
        }
    };

    // 회원가입 처리 함수
    const handleSignUp = async () => {
        if (passwordError || confirmPwdError || !user_pwd || !confirmPwd) {
            setModalTitle("회원가입 오류");
            setModalMessage("입력 정보를 확인해주세요.");
            setShowModal(true);
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/api/signup', {
                user_id,
                user_pwd,
                user_email,
            });

            if (response.data.success) {
                setModalTitle("회원가입 성공");
                setModalMessage("회원가입이 완료되었습니다.");
                setShowModal(true);
                setTimeout(() => {
                    window.location.href = `${PATH.SIGN_IN}`; // 로그인 페이지로 이동
                }, 2000);
            }
        } catch (error) {
            console.error("회원가입 오류:", error);
            setModalTitle("회원가입 실패");
            setModalMessage("회원가입 중 오류가 발생했습니다.");
            setShowModal(true);
        }
    };

    // 소셜로그인 후 JWT 처리 함수
    const handleOAuthLogin = async (provider) => {
        window.location.href=`http://localhost:8080/login/${provider}`;
    };

    // 로그인 타이틀 클릭시 로그인 페이지로 이동
    const handleTitleClick = () => {
        navigate(`${PATH.SIGN_IN}`);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <main>
            <section className={styles.signUpPage}>
                <div className={styles.title}>
                    <h4 onClick={handleTitleClick} className={styles.signinText}>로그인&nbsp;&nbsp;&nbsp;/</h4>
                    <h4>&nbsp;&nbsp;&nbsp;회원가입</h4>
                </div>

                <div className={styles.signUpForm}>
                    <form>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="user_id"
                                id="user_id"
                                placeholder="아이디"
                                value={user_id}
                                onChange={(e) => setUserId(e.target.value)}
                            />
                            <label htmlFor="user_id">아이디</label>
                        </div>

                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                name="user_email"
                                id="user_email"
                                placeholder="이메일"
                                value={user_email}
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                            <label htmlFor="user_email">이메일</label>
                            <button
                                type="button"
                                onClick={handleEmailVerification}
                                className={styles.verifyButton}
                            >
                                인증 메일 전송
                            </button>
                        </div>

                        <div className={styles.inputWrapper}>
                            <input
                                type="password"
                                name="user_pwd"
                                id="user_pwd"
                                placeholder="비밀번호"
                                value={user_pwd}
                                onChange={(e) => setUserPwd(e.target.value)}
                                onBlur={handlePasswordBlur}
                            />
                            <label htmlFor="user_pwd">비밀번호</label>
                        </div>
                        {passwordError && <p className={styles.errorText}>{passwordError}</p>}


                        <div className={styles.inputWrapper}>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                placeholder="비밀번호 확인"
                                value={confirmPwd}
                                onChange={(e) => setConfirmPwd(e.target.value)}
                                onBlur={handleConfirmPwdBlur}
                            />
                            <label htmlFor="confirmPassword">비밀번호 확인</label>
                        </div>
                        {confirmPwdError && <p className={styles.errorText}>{confirmPwdError}</p>}
                    </form>
                </div>

                <button onClick={handleSignUp}>회원가입</button>

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

export default SignUpPage;
