import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertModal from 'src/components/Modal/AlertModal'; // AlertModal import
import styles from './SignUpPage.module.scss';
import { PATH } from 'src/utils/path.js';

// API 호출 함수들 import
import {
    validatePassword,
    validateUserId,
    validateEmail,
    checkIdAvailability,
    sendEmailVerification,
    confirmEmailVerification,
    signUpUser,
    handleOAuthLogin,
} from 'src/apis/signUpAPI.js';

import googleIcon from 'src/assets/socialIcons/Google-Icon.png';
import kakaoIcon from 'src/assets/socialIcons/Kakao-Icon.png';
import naverIcon from 'src/assets/socialIcons/Naver-Icon.png';

const SignUpPage = () => {
    const navigate = useNavigate();

    /* 상태 관리 */
    const [user_name, setUserName] = useState('');
    const [user_id, setUserId] = useState('');
    const [user_pwd, setUserPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [user_email, setUserEmail] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [idError, setIdError] = useState(''); // 아이디 중복 오류 메시지 상태 추가
    const [emailError, setEmailError] = useState(''); // 이메일 오류 메시지 상태 추가
    const [passwordError, setPasswordError] = useState('');
    const [confirmPwdError, setConfirmPwdError] = useState('');
    const [showModal, setShowModal] = useState(false); // 모달 표시 상태 관리
    const [modalTitle, setModalTitle] = useState(''); // 모달 제목
    const [modalMessage, setModalMessage] = useState(''); // 모달 메시지
    const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 여부 상태 추가

    // 비밀번호 검증
    const handlePasswordBlur = () => {
        if (!validatePassword(user_pwd)) {
            setPasswordError("비밀번호는 8~12자 영문, 숫자, 특수문자를 포함해야 합니다.");
        } else {
            setPasswordError('');
        }
    };

    // 비밀번호 확인 검증
    const handleConfirmPwdBlur = () => {
        if (user_pwd !== confirmPwd) {
            setConfirmPwdError("비밀번호가 일치하지 않습니다.");
        } else {
            setConfirmPwdError('');
        }
    };

    // 아이디 중복 체크
    const handleIdBlur = async () => {
        if (!user_id) {
            setIdError('');
            return;
        }
        if (!validateUserId(user_id)) {
            setIdError("아이디는 5~15자의 영문과 숫자만 사용할 수 있습니다.");
            return;
        }

        const result = await checkIdAvailability(user_id);
        setIdError(result.message);
    };

    // 이메일 인증 처리
    const handleEmailVerification = async () => {
        if (!validateEmail(user_email)) {
            setEmailError("올바른 이메일 형식이 아닙니다.");
            return;
        }
        setEmailError('');

        const result = await sendEmailVerification(user_email);
        setModalTitle("메일 전송");
        setModalMessage(result.message);
        setShowModal(true);
    };

    // 이메일 인증 코드 확인
    const handleEmailConfirmation = async () => {
        const result = await confirmEmailVerification(user_email, authCode);
        setModalTitle(result.success ? "인증 성공" : "인증 실패");
        setModalMessage(result.message);
        setShowModal(true);
        if (result.success) setIsEmailVerified(true);
    };

    // 회원가입 처리
    const handleSignUp = async () => {
        // 유효성 검사
        if (!user_name || !user_id || !user_pwd || !confirmPwd || !user_email) {
            setModalTitle("회원가입 오류");
            setModalMessage("회원 정보를 입력해주세요.");
            setShowModal(true);
            return;
        }

        if (!isEmailVerified) {
            setModalTitle("이메일 인증 오류");
            setModalMessage("이메일 인증을 해주세요");
            setShowModal(true);
            return;
        }

        if (passwordError || confirmPwdError || !user_pwd || !confirmPwd) {
            setModalTitle("회원가입 오류");
            setModalMessage("입력 정보를 확인해주세요.");
            setShowModal(true);
            return;
        }

        if (idError === '이미 가입된 아이디입니다.') {
            setModalTitle("아이디 중복 오류");
            setModalMessage("이미 사용 중인 아이디입니다.");
            setShowModal(true);
            return;
        }

        const result = await signUpUser(user_name, user_id, user_pwd, user_email);

        setModalTitle(result.success ? "회원가입 성공" : "회원가입 실패");
        setModalMessage(result.message);
        setShowModal(true);

        if (result.success) {
            setUserName('');
            setUserId('');
            setUserPwd('');
            setConfirmPwd('');
            setUserEmail('');
            setAuthCode('');
            setIsEmailVerified(false);

            setTimeout(() => {
                navigate(PATH.SIGN_IN);
            }, 2000);
        }
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
                                name="user_name"
                                id="user_name"
                                placeholder="이름"
                                value={user_name}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            <label htmlFor="user_name">이름</label>
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="user_id"
                                id="user_id"
                                placeholder="아이디"
                                value={user_id}
                                onChange={(e) => setUserId(e.target.value)}
                                onBlur={handleIdBlur}
                            />
                            <label htmlFor="user_id">아이디</label>
                        </div>
                        {idError && (
                            <p
                                className={`${styles.errorText} ${idError === '사용 가능한 아이디입니다.' ? styles.success : styles.failure}`}
                            >
                                {idError}
                            </p>
                        )}

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
                        {emailError && <p className={styles.errorText}>{emailError}</p>}

                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                name="auth_code"
                                id="auth_code"
                                placeholder="인증 코드"
                                value={authCode}
                                onChange={(e) => setAuthCode(e.target.value)}
                            />
                            <label htmlFor="auth_code">인증 코드</label>
                            <button
                                type="button"
                                onClick={handleEmailConfirmation}
                                className={styles.verifyButton}
                            >
                                인증 코드 확인
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
                isOpen={showModal}
                closeModal={handleCloseModal}
                title={modalTitle}
                message={modalMessage}
            />
        </main>
    );
};

export default SignUpPage;
