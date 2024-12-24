/* src/atoms/sessionAtom.js */

import { atom } from 'jotai';

// Authorization 키가 로컬 스토리지에 있는지 확인하여 초기값 설정
const isLoggedInAtom = atom(!!localStorage.getItem('Authorization'));

export { isLoggedInAtom };



