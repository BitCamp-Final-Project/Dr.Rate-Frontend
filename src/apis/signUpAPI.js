import axios from 'axios';
import { PATH } from 'src/utils/path';


// 비밀번호 정규 표현식 (영문, 숫자, 특수문자를 포함한 8~12자)
export const validatePassword = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
    return regex.test(password);
};

// 아이디 정규 표현식
export const validateUserId = (id) => {
    const regex = /^[a-zA-Z0-9]{5,15}$/; // 알파벳과 숫자 조합, 5~15자
    return regex.test(id);
};

// 이메일 정규 표현식
export const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};

export const checkIdAvailability = async (user_id) => {
    try {
        const response = await axios.get(`${PATH.SERVER}/api/signUp/existId?userId=${user_id}`);

        if (response.status === 200 && response.data.success) {
            return { success: true, message: '사용 가능한 아이디입니다.' };
        }

        // 응답이 있지만 실패한 경우
        if (response.status === 200 && !response.data.success) {
            return { success: false, message: '이미 가입된 아이디입니다.' };
        }

        // 서버 응답이 예상과 다를 때
        throw new Error('아이디 중복 확인에 실패했습니다.');

    } catch (error) {
        // 오류가 발생한 경우
        if (error.response) {
            // 서버에서 받은 오류 코드가 있을 때
            if (error.response.status === 400) {
                return { success: false, message: '이미 가입된 아이디입니다.' };
            } else {
                return { success: false, message: '아이디 중복 확인에 실패했습니다.' };
            }
        }

        // 네트워크 오류나 서버 연결 실패 시
        return { success: false, message: '아이디 중복 확인에 실패했습니다.' };
    }
};

// 이메일 인증 요청 API 호출
export const sendEmailVerification = async (user_email) => {
    try {
        const response = await axios.post(`${PATH.SERVER}/api/email/verify?email=${user_email}`);
        const { success, code, message } = response.data;
        if (success) {
            return { success: true, message: '인증 메일이 전송되었습니다.' };
        } else {
            if (code === "USER401") {
                return { success: false, message: '이미 가입된 이메일입니다.' };
            } else if (code === "USER500") {
                return { success: false, message: '메일 전송 실패' };
            } else {
                return { success: false, message: message || '알 수 없는 오류 발생' };
            }
        }
    } catch {
        return { success: false, message: '서버와의 통신 중 오류가 발생했습니다.' };
    }
};

// 이메일 인증 코드 확인 API 호출
export const confirmEmailVerification = async (user_email, authCode) => {
    try {
        const response = await axios.get(`${PATH.SERVER}/api/email/verifications?email=${user_email}&code=${authCode}`);
        if (response.data.success) {
            return { success: true, message: '이메일 인증이 완료되었습니다.' };
        } else {
            return { success: false, message: '인증 코드가 올바르지 않습니다.' };
        }
    } catch {
        return { success: false, message: '인증 확인 중 오류 발생' };
    }
};

// 회원가입 API 호출
export const signUpUser = async (user_name, user_id, user_pwd, user_email) => {
    try {
        const response = await axios.post(`${PATH.SERVER}/api/signUp`, {
            username: user_name,
            userId: user_id,
            password: user_pwd,
            email: user_email,
        });
        if (response.data.success) {
            return { success: true, message: '회원가입이 완료되었습니다.' };
        } else {
            return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
        }
    } catch {
        return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
    }
};

// 소셜 로그인 처리
export const handleOAuthLogin = (provider) => {
    window.location.href = `${PATH.SERVER}/api/signIn/${provider}`;
};
