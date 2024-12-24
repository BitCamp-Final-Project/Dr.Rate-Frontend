import React, { useState } from 'react';
import styles from './ProductInsListPage.module.scss';

const ProductInsListPage = () => {
  const [selectedBanks, setSelectedBanks] = useState([]); // 선택된 은행 목록

  const handleBankChange = (e) => {
    const selectedBank = e.target.value;
    if (selectedBank && !selectedBanks.includes(selectedBank)) {
      setSelectedBanks([...selectedBanks, selectedBank]); // 새로운 은행 추가
    }
  };

  const handleBankRemove = (bank) => {
    setSelectedBanks(selectedBanks.filter((item) => item !== bank)); // 은행 삭제
  };

  const handleFilterChange = (value) => {
    console.log("필터 변경:", value); // 테스트용
    // 추가 로직 구현
  };

  const handleRateClick = () => {
    console.log("금리 높은 순 버튼 클릭"); // 테스트용
    // 추가 로직 구현
  };

  return (
    <main>
      <section>
        <div className={styles.mainTitle}>
          <h3>적금</h3>
        </div>

        {/* 회원/비회원 공통 보이는 필터 */}
        <div className={styles.main1}>
          <div className={styles.bankselect}>
            <div
              name="bank"
              onChange={handleBankChange}
              style={{ padding: "8px", width: "200px" }}
            >
              <option value="">은행 선택</option>
              <option value="KB 은행">KB 은행</option>
              <option value="우리 은행">우리 은행</option>
              <option value="국민 은행">국민 은행</option>
            </div>
          </div>

          {/* 선택된 은행 표시 */}
          <div className={styles.selectedBanksContainer}>
            {selectedBanks.map((bank, index) => (
              <div key={index} className={styles.selectedBank}>
                <span>{bank}</span>
                <button
                  onClick={() => handleBankRemove(bank)}
                  className={styles.removeBank}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 로그인 후 보이는 필터 */}
        <div className={styles.filterTotal}>
          <div className={styles.filterDiv}>
            <label style={{ marginRight: "10px" }}>나이:</label>
            <input
              type="number"
              name="birth"
              placeholder="나이 입력"
              onChange={handleFilterChange}
              style={{
                padding: "10px",
                width: "30%",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </div>

          <div
            className={styles.filterDiv}
            style={{ display: "flex", alignItems: "center" }}
          >
            <span style={{ fontSize: "16px" }}>저축 예정 기간</span>
            <div
              name="period"
              onChange={handleFilterChange}
              style={{ padding: "8px", width: "200px", marginRight: "10px" }}
            >
              <option value="">저축 예정 기간</option>
              <option value="3개월">3개월</option>
              <option value="6개월">6개월</option>
              <option value="1년">1년</option>
            </div>
          </div>

          <div className={styles.filterDiv}>
            <h4>이자 계산 방식</h4>
            <div className="toggle-buttons">
              <div
                className="toggle-button"
                data-value="단리"
                onClick={() => handleFilterChange("단리")}
              >
                단리
              </div>
              <div
                className="toggle-button"
                data-value="복리"
                onClick={() => handleFilterChange("복리")}
              >
                복리
              </div>
            </div>
          </div>

          <div className={styles.filterDiv}>
            <h4>가입방식</h4>
            <div
              name="type"
              onChange={handleFilterChange}
              style={{ padding: "8px", width: "200px" }}
            >
              <option value="">가입 방식</option>
              <option value="대면">대면</option>
              <option value="비대면">비대면</option>
            </div>
          </div>
        </div>

        {/* <div className={styles.filterDiv}>
          <h4>가입방식</h4>
          <select
            name="type"
            onChange={handleFilterChange}
            style={{ padding: "8px", width: "200px" }}
          >
            <option value="">적립유형</option>
            <option value="대면">자유적립</option>
            <option value="비대면">정액적립</option>
          </select>
        </div>
      </section> */}

        {/* 리스트 */}
        <div className={styles.productListDiv}>
          <div className={styles.productList}>
            <div className={styles.productListLogo}>로고</div>
            <div className={styles.productListInfo}>
              <div>
                <p>국민은행</p>
                <p>청년들을 위한 Kstar 적금</p>
              </div>
              <div>
                <p>최고 4.2%</p>
                <p>기본금리 3.3%</p>
              </div>
            </div>
            <div className={styles.productListBtn}>비교 담기</div>
          </div>

          <div className={styles.productList}>
            <div className={styles.productListLogo}>로고</div>
            <div className={styles.productListInfo}>
              <div>
                <p>국민은행</p>
                <p>청년들을 위한 Kstar 적금</p>
              </div>
              <div>
                <p>최고 4.2%</p>
                <p>기본금리 3.3%</p>
              </div>
            </div>
            <div className={styles.productListBtn}>비교 담기</div>
          </div>

          <div className={styles.productList}>
            <div className={styles.productListLogo}>로고</div>
            <div className={styles.productListInfo}>
              <div>
                <p>우리은행</p>
                <p>청년들을 위한 Kstar 적금</p>
              </div>
              <div>
                <p>최고 4.2%</p>
                <p>기본금리 3.3%</p>
              </div>
            </div>
            <div className={styles.productListBtn}>비교 담기</div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductInsListPage;
