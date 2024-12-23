import styles from './MyEditPage.module.scss';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyNav from 'src/components/MyNav';
import axiosInstanceAPI from 'src/apis/axiosInstanceAPI';
import AlertModal from 'src/components/modal/AlertModal'; // AlertModal import
import { PATH } from 'src/utils/path';

// API 호출 함수들 import
import {
    validatePassword,
    validateEmail,
    sendEmailVerification,
    confirmEmailVerification,
} from 'src/apis/signUpAPI.js';

const MyEditPage = () => {
    const navigate = useNavigate();
    /* 상태 관리 */
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [email, setEmail] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [idError, setIdError] = useState(''); // 아이디 중복 오류 메시지 상태 추가
    const [emailError, setEmailError] = useState(''); // 이메일 오류 메시지 상태 추가
    const [passwordError, setPasswordError] = useState('');
    const [confirmPwdError, setConfirmPwdError] = useState('');
    const [showModal, setShowModal] = useState(false); // 모달 표시 상태 관리
    const [modalTitle, setModalTitle] = useState(''); // 모달 제목
    const [modalMessage, setModalMessage] = useState(''); // 모달 메시지
    const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 여부 상태 추가

    const myInfoEdit = async (username, email, password) => {
        try {
            const response = await axiosInstanceAPI.post(`${PATH.SERVER}/api/myInfoEdit`, {
                username: username,
                userId: userId,
                password: password,
                email: email,
            });
            if (response.data.success) {
                return { success: true, message: '회원정보 수정이 완료되었습니다.' };
            } else {
                return { success: false, message: '회원정보 수정 중 오류가 발생했습니다.' };
            }
        } catch {
            return { success: false, message: '회원정보 수정 중 오류가 발생했습니다.' };
        }
    }
    //초기화 데이터
    const [initialData, setInitialData] = useState(null);
    //데이터 받아오기
    useEffect(() => {
        const userData = async () => {
            try {
                const response = await axiosInstanceAPI.post(`${PATH.SERVER}/api/myInfo`);
                if(response.data.result.social !== null) {
                    setModalTitle("소셜 로그인 접근");
                    setModalMessage("소셜 로그인은 회원 정보를 수정할 수 없습니다.");
                    setShowModal(true);
                    return;
                }
                setUsername(response.data.result.username);
                setEmail(response.data.result.email);
                setUserId(response.data.result.userId);
                setBirthdate(response.data.result.birthdate);
                setInitialData(response.data); // 초기 상태 저장
            } catch (error) {
                console.error('데이터 가져오기 실패:', error);
            }
        };
        userData();
    }, []);

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

        if (idError === '이미 가입된 아이디입니다.') {
            setModalTitle("아이디 중복 오류");
            setModalMessage("이미 사용 중인 아이디입니다.");
            setShowModal(true);
            return;
        }

        const result = await myInfoEdit(username, userId, password, email);

        setModalTitle(result.success ? "정보 수정 성공" : "정보 수정 실패");
        setModalMessage(result.message);
        setShowModal(true);

        if (result.success) {
            setUsername('');
            setUserId('');
            setPassword('');
            setConfirmPwd('');
            setEmail('');
            setAuthCode('');
            setIsEmailVerified(false);

            setTimeout(() => {
                navigate(`${PATH.MY_EDIT}`);
            }, 2000);
        }
    };

    //초기화 버튼 클릭
    const handleReset = () => {
        if (initialData) {
            setMyData(initialData);
            setUsername(initialData.username || '');
            setUserId(initialData.userId || '');
            setPassword(initialData.password || '');
            setConfirmPwd('');
            setEmail(initialData.email || '');
            setBirthdate(initialData.birthdate || '');
            setAuthCode(''); // 인증 코드는 초기화
            setPasswordError('');
            setConfirmPwdError('');
            setEmailError('');
        }
    }

    const [isEmailChanged, setIsEmailChanged] = useState(false); // 이메일 변경 상태

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setIsEmailChanged(newEmail !== (initialData?.email || '')); // 초기 이메일과 비교
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <main>
            <MyNav />

            <section className={ styles.myEditSection }>
                {initialData?.result ? (
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
                        {idError && (
                            <p className={`${styles.errorText} ${idError === '사용 가능한 아이디입니다.' ? styles.success : styles.failure}`}>
                                {idError}
                            </p>
                        )}

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
                            <div className={`${styles.deleteUser}`}>
                                <p>회원탈퇴&nbsp;&gt;</p>
                            </div>
                            <div className={`${styles.editandreset}`}>
                                <button onClick={handleMyInfoEdit}>수정하기</button>
                                <button onClick={handleReset} className={`${styles.resetButton}`}>초기화</button>
                            </div>
                        </div>
                    </form>
                </div>
                ) : (<div></div>)}
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