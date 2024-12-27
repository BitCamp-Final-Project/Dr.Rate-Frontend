import styles from './MyInfoPage.module.scss';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstanceAPI from 'src/apis/axiosInstanceAPI';
import MyNav from 'src/components/MyNav';
import { PATH } from 'src/utils/path';
import { useAtom } from 'jotai';
import { userData } from '../../atoms/userData';

const MyInfoPage = () => {
    const navigate = useNavigate();
    const [myData, setMyData] = useAtom(userData); // Jotai Atom 사용

    //데이터 받아오기 (atom에 데이터가 없을 경우)
    useEffect(() => {
        const userDTO = async () => {
            try {
                if(!myData) { // atom에 데이터가 없을경우
                    const response = await axiosInstanceAPI.post(`${PATH.SERVER}/api/myInfo`);
                    setMyData(response.data.result);  // 데이터 업데이트
                }
            } catch (error) {
                console.error('데이터 가져오기 실패:', error);
            }
        };
        userDTO();
    }, [myData, setMyData]);

    //회원정보 수정페이지 이동
    const handleMyEdit = () => {
        navigate(`${PATH.MY_EDIT}`);
    }

    return (
        <main>
            <MyNav />

            <section className={ styles.myInfoSection }>
                {myData? (
                <div className={styles.myInfo}>
                    <div className={`${styles.tagBox}`}>
                        <p className={`${styles.tagName}`}>이름</p>
                        <p className={`${styles.myData}`}>{myData.username || '데이터 없음'}</p>
                    </div>
                    <div className={`${styles.tagBox}`}>
                        <p className={`${styles.tagName}`}>이메일</p>
                        <p className={`${styles.myData}`}>{myData.email || '데이터 없음'}</p>
                    </div>
                    <div className={`${styles.tagBox}`}>
                        <p className={`${styles.tagName}`}>아이디</p>
                        <p className={`${styles.myData}`}>{myData.userId || '데이터 없음'}</p>
                    </div>
                    <div className={`${styles.tagBox}`}>
                        <p className={`${styles.tagName}`}>생년월일</p>
                        <p className={`${styles.myData}`}>{myData.birthdate || '데이터 없음'}</p>
                    </div>
                    <div className={`${styles.buttonBox}`}>
                        <button onClick={handleMyEdit}>회원정보 수정</button>
                    </div>
                </div>
                ) : (<div></div>)}
            </section>
        </main>
    );
};

export default MyInfoPage;