export const isAdmin = () => {
    const token = localStorage.getItem("Authorization"); // JWT 토큰 가져오기
    if (!token) return false;

    const payload = parseJwt(token);
    return payload?.role === "ROLE_ADMIN"; 
};