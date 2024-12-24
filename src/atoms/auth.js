// atoms/auth.js
import { atom } from 'jotai';
import { parseJwt } from 'src/utils/jwt.js';

export const tokenAtom = atom(localStorage.getItem("Authorization") || null); // JWT 토큰 상태
export const userAtom = atom((get) => {
    const token = get(tokenAtom);
    return token ? parseJwt(token) : null; 
});
export const isAdminAtom = atom((get) => {
    const user = get(userAtom);
    return user?.role === "ROLE_ADMIN"; 
});
