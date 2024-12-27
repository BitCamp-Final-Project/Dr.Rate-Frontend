import styles from './MyEditPage.module.scss';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyNav from 'src/components/MyNav';
import axiosInstanceAPI from 'src/apis/axiosInstanceAPI';
import AlertModal from 'src/components/modal/AlertModal'; // AlertModal import
import { PATH } from 'src/utils/path';

import { useAtom } from 'jotai';
import { userData } from '../../atoms/userData';

// API 호출 함수들 import
import {
    validatePassword,
    validateEmail,
    sendEmailVerification,
    confirmEmailVerification,
} from 'src/apis/signUpAPI.js';

const MyEditPage = () => {
    const navigate = useNavigate();
    const [myData, setMyData] = useAtom(userData); // Jotai Atom 사용
    /* 상태 관리 */
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [email, setEmail] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [emailError, setEmailError] = useState(''); // 이메일 오류 메시지 상태 추가
    const [passwordError, setPasswordError] = useState('');
    const [confirmPwdError, setConfirmPwdError] = useState('');
    const [showModal, setShowModal] = useState(false); // 모달 표시 상태 관리
    const [modalTitle, setModalTitle] = useState(''); // 모달 제목
    const [modalMessage, setModalMessage] = useState(''); // 모달 메시지
    const [isEmailVerified, setIsEmailVerified] = useState(true); // 이메일 인증 여부 상태 추가

    //데이터 받아오기
    useEffect(() => {
        if (myData) {
            setUsername(myData.username || '');
            setUserId(myData.userId || '');
            setEmail(myData.email || '');
            setBirthdate(myData.birthdate || '');
        } else {
            navigate(`${PATH.SIGN_IN}`); // 사용자 데이터가 없으면 로그인 페이지로 리다이렉트
        }
    }, [myData, navigate]);

    // 비밀번호 검증
    const handlePasswordBlur = () => {
        if (!validatePassword(password)) {
            setPasswordError("비밀번호는 8~12자 영문, 숫자, 특수문자를 포함해야 합니다.");
        } else {
            setPasswordError('');
        }
    };

    // 비밀번호 확인 검증
    const handleConfirmPwdBlur = () => {
        if (password !== confirmPwd) {
            setConfirmPwdError("비밀번호가 일치하지 않습니다.");
        } else {
            setConfirmPwdError('');
        }
    };

    // 이메일 인증 처리
    const handleEmailVerification = async () => {
        if (!validateEmail(email)) {
            setEmailError("올바른 이메일 형식이 아닙니다.");
            return;
        }
        setEmailError('');

        const result = await sendEmailVerification(email);
        setModalTitle("메일 전송");
        setModalMessage(result.message);
        setShowModal(true);
    };

    // 이메일 인증 코드 확인
    const handleEmailConfirmation = async () => {
        const result = await confirmEmailVerification(email, authCode);
        setModalTitle(result.success ? "인증 성공" : "인증 실패");
        setModalMessage(result.message);
        setShowModal(true);
        if (result.success) setIsEmailVerified(true);
    };
    
    // 사용자 정보 수정 처리
    const handleMyInfoEdit = async () => {
        // 유효성 검사
        if (!username || !userId || !password || !confirmPwd || !email) {
            setModalTitle("정보 수정 오류");
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

        if (passwordError || confirmPwdError || !password || !confirmPwd) {
            setModalTitle("정보 수정 오류");
            setModalMessage("입력 정보를 확인해주세요.");
            setShowModal(true);
            return;
        }

        try {
            const response = await axiosInstanceAPI.post(`${PATH.SERVER}/api/myInfoEdit`, {
                username,
                userId,
                password,
                email,
            });
            if (response.data.success) {
                setMyData({ ...myData, username, email }); // Jotai Atom 업데이트
                setModalTitle('정보 수정 성공');
                setModalMessage('회원정보가 성공적으로 수정되었습니다.');
                setShowModal(true);

                setTimeout(() => {
                    navigate(`${PATH.MY_EDIT}`);
                }, 2000);
            } else {
                throw new Error('회원정보 수정 중 오류 발생');
            }
        } catch (error) {
            setModalTitle('정보 수정 실패');
            setModalMessage('회원정보 수정 중 문제가 발생했습니다.');
            setShowModal(true);
        }
    };

    //초기화 버튼 클릭
    const handleReset = () => {
        if (myData) {
            setUsername(myData.username || '');
            setUserId(myData.userId || '');
            setPassword(myData.password || '');
            setConfirmPwd('');
            setEmail(myData.email || '');
            setBirthdate(myData.birthdate || '');
            setAuthCode('');
            setPasswordError('');
            setConfirmPwdError('');
            setEmailError('');
        }
    }

    const [isEmailChanged, setIsEmailChanged] = useState(false); // 이메일 변경 상태

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setIsEmailChanged(newEmail !== (myData?.email || '')); // 초기 이메일과 비교
        setIsEmailVerified(false);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <main>
            <MyNav />

            <section className={ styles.myEditSection }>
                <div className={styles.myInfoEdit}>
                    <form>
                        <div className={`${styles.tagBox}`}>
                            <p className={`${styles.tagName}`}>이름</p>
                            <input type="text" className={`${styles.myData}`} 
                                    value={username}
                                    placeholder="이름입력" 
                                    onChange={(e) => setUsername(e.target.value)} />
                        </div>

                        <div className={`${styles.tagBox} ${styles.emailBox}`}>
                            <p className={`${styles.tagName}`}>이메일</p>
                            <input type="text" className={`${styles.myData}`} 
                            value={email}
                            placeholder="이메일입력"
                            onChange={handleEmailChange} />
                            {isEmailChanged && (
                            <button type="button"
                                onClick={handleEmailVerification}
                                className={styles.verifyButton}
                            >
                                인증 메일 전송
                            </button>
                            )}
                        </div>

                        {isEmailChanged && (
                        <div className={`${styles.tagBox}`}>
                            <p className={`${styles.tagName}`}>인증 코드</p>
                            <input type="text" className={`${styles.myData}`}
                                name="auth_code"
                                id="auth_code"
                                placeholder="인증 코드"
                                value={authCode}
                                onChange={(e) => setAuthCode(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={handleEmailConfirmation}
                                className={styles.verifyButton}
                            >
                                인증 코드 확인
                            </button>
                        </div>
                        )}

                        {emailError && <p className={styles.errorText}>{emailError}</p>}
                        <div className={`${styles.tagBox}`}>
                            <p className={`${styles.tagName}`}>아이디</p>
                            <input type="text" className={`${styles.myData}`} 
                                    value={userId} 
                                    readOnly />
                        </div>

                        <div className={`${styles.tagBox}`}>
                            <p className={`${styles.tagName}`}>비밀번호</p>
                            <input type="password" className={`${styles.myData}`} 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    onBlur={handlePasswordBlur} />
                        </div>
                        {passwordError && <p className={styles.errorText}>{passwordError}</p>}

                        <div className={`${styles.tagBox}`}>
                            <p className={`${styles.tagName}`}>비밀번호 재입력</p>
                            <input type="password" className={`${styles.myData}`} 
                                    value={confirmPwd}
                                    onChange={(e) => setConfirmPwd(e.target.value)}
                                    onBlur={handleConfirmPwdBlur} />
                        </div>
                        {confirmPwdError && <p className={styles.errorText}>{confirmPwdError}</p>}

                        <div className={`${styles.tagBox}`}>
                            <p className={`${styles.tagName}`}>생년월일</p>
                            <input type="text" className={`${styles.myData}`} 
                                    value={birthdate || '데이터 없음'}
                                    readOnly />
                        </div>

                        <div className={`${styles.buttonBox}`}>
                            <div className={`${styles.editandreset}`}>
                                <button onClick={handleMyInfoEdit}>수정하기</button>
                                <button onClick={handleReset} className={`${styles.resetButton}`}>초기화</button>
                            </div>
                        </div>
                    </form>
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

export default MyEditPage;