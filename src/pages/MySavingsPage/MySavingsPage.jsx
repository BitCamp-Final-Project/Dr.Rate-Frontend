// src/pages/MySavingsPage/MySavingsPage.jsx

import styles from './MySavingsPage.module.scss';

import React from 'react';
import MyNav from 'src/components/MyNav'; 

function MySavingsPage() {
    return (
        <main>
            <MyNav />
            <section>
                <h1>예금 즐겨찾기 페이지</h1>
                <h3>Test 문단: 예금 금리 상승, 소비자 유치 경쟁 치열</h3>
                <p>
                    최근 은행들이 예금 금리를 잇달아 인상하며 소비자 유치 경쟁이 치열해지고 있다. 
                    주요 시중은행은 정기예금 상품의 금리를 최대 0.5%p 인상하며 고객의 관심을 끌고 있다.
                </p>
                <p>
                    전문가들은 "기준금리 인상 기조에 따라 예금 금리도 추가 상승 가능성이 있다"며 
                    "고객들은 금리 변동 추이를 주의 깊게 살펴볼 필요가 있다"고 조언했다.
                </p>
                <br/>
                <p>When you have some text, how can you choose a typeface? Many people—professional designers included—go through an app’s font menu until we find one we like. But the aim of this Google Fonts Knowledge module is to show that there are many considerations that can improve our type choices. By setting some useful constraints to aid our type selection, we can also develop a critical eye for analyzing type along the way.</p>
            </section>
        </main>
    );
}

export default MySavingsPage;
