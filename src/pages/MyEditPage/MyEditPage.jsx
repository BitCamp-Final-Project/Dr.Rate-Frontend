import styles from './MyEditPage.module.scss';
import React from 'react';
import MyNav from 'src/components/MyNav';

const MyEditPage = () => {
    //회원 데이터
    const [myData, setMyData] = useState({
        username: '',
        email: '',
        password: '',
        userId: '',
        birthdate: ''
    });

    //데이터 받아오기
    useEffect(() => {
        const userData = async () => {
            try {
                const response = await axiosInstanceAPI.post(`${PATH.SERVER}/api/myInfo`);
                setMyData(response.data);  // 데이터 업데이트
            } catch (error) {
                console.error('데이터 가져오기 실패:', error);
            }
        };
        userData();
    }, []);

    return (
        <main>
            <MyNav />

            <section className={ styles.myEditSection }>
                {myData?.result ? (
                <div className={styles.myInfoEdit}>
                    <div className={`${styles.tagBox}`}>
                        <p className={`${styles.tagName}`}>이름</p>
                        <input type="text" className={`${styles.myData}`}>{myData.result.username || '데이터 없음'}</input>
                    </div>
                    <div className={`${styles.tagBox}`}>
                        <p className={`${styles.tagName}`}>이메일</p>
                        <input type="text" className={`${styles.myData}`}>{myData.result.email || '데이터 없음'}</input>
                    </div>
                    <div className={`${styles.tagBox}`}>
                        <p className={`${styles.tagName}`}>아이디</p>
                        <input type="text" className={`${styles.myData}`}>{myData.result.userId || '데이터 없음'}</input>
                    </div>
                    <div className={`${styles.tagBox}`}>
                        <p className={`${styles.tagName}`}>비밀번호</p>
                        <input type="password" className={`${styles.myData}`}>{myData.result.password || '데이터 없음'}</input>
                    </div>
                    <div className={`${styles.tagBox}`}>
                        <p className={`${styles.tagName}`}>비밀번호 재입력</p>
                        <input type="password" className={`${styles.myData}`}>{myData.result.password || '데이터 없음'}</input>
                    </div>
                    <div className={`${styles.tagBox}`}>
                        <p className={`${styles.tagName}`}>생년월일</p>
                        <input type="text" className={`${styles.myData}`}>{myData.birthdate || '데이터 없음'}</input>
                    </div>
                    <div className={`${styles.buttonBox}`}>
                        <div>
                            <p onclick={c}>회원탈퇴<img src="src/assets/icons/rightArrow.svg"></img></p>
                        </div>
                        <div>
                            <button onClick={a}>수정하기</button>
                            <button onClick={b}>초기화</button>
                        </div>
                    </div>
                </div>
                ) : (<div></div>)}
            </section>
        
        
        </main>
    );
};

export default MyEditPage;