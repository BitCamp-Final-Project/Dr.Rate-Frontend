/* src/pages/ListInstallmentPage/ListInstallmentPage.jsx */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ListInstallmentPage.module.scss';
import { PATH } from 'src/utils/path';
import { fullToShort } from 'src/utils/shortNameToFullName.js';
import { useSession } from 'src/hooks/useSession';
import useProductList from 'src/hooks/useProductList';
import useModal from 'src/hooks/useModal';
import ConfirmModal from 'src/components/Modal/ConfirmModal';
import xIcon from 'src/assets/icons/xIcon.svg';
import verticalDividerIcon from 'src/assets/icons/verticalDivider.svg';
import spinner from 'src/assets/icons/spinner.gif';
import { getProductDetails } from 'src/apis/productsAPI';



const ListInstallmentPage = () => {
  const navigate = useNavigate();

  const { isLoggedIn } = useSession();

  const handleCompareClick = async (item) => {
      let addProduct;
  
      const prdId = item.id;
        if(prdId) {
          try {
              const productDetails = await getProductDetails(prdId);
              console.log(productDetails.product)
  
              addProduct = {
                index: productDetails?.optionNum || 0,
                options: productDetails.options,
                product: productDetails.product
              };
  
            } catch (error) {
              if (error.response?.data?.message === "존재하지 않는 상품입니다.") {
                setNoIdMessage("존재하지 않는 상품입니다.");
              } else {
                console.error("Failed to fetch product details:", error);
              }
            }
        }
  
        const compareList = JSON.parse(localStorage.getItem('insCompareList')) || [];
        
        const duplicateProduct = compareList.some(comproduct => comproduct.product.id === prdId);
  
        if (duplicateProduct) {
          console.log("이미추가")
            openConfirmModal('이미 추가된 상품입니다', '비교하기로 이동하시겠습니까?', handleConfirm2, handleCancel);
            return;
        }
  
        if (compareList.length >= 3) {
            openConfirmModal('상품 비교 한도 초과', '비교할 수 있는 상품은 최대 3개입니다', handleConfirm2, handleCancel);
            return;
        }
  
        compareList.push(addProduct);
            
        localStorage.setItem('insCompareList', JSON.stringify(compareList));
      
        openConfirmModal('비교 상품이 등록되었습니다', '비교하기로 이동하시겠습니까?', handleConfirm2, handleCancel);
    };
      
    
    const handleConfirm2 = () => {
      navigate(`${PATH.PRODUCT_COMPARE}/i`);
      closeConfirmModal();
    };




  const {
    loading,
    error,
    productData,
    banks,
    handleBankChange,
    removeBank,
    rate,
    handleRateClick,
    join,
    handleJoinClick,
    age,
    handleAgeChange,
    period,
    handlePeriodChange,
    sort,
    handleSortClick,
    currentPage,
    handlePageChange,
    totalPages,
    paginationRange,
    handlePrevBlock, 
    handleNextBlock, 
  } = useProductList();

  const {
    isConfirmOpen,
    openConfirmModal,
    closeConfirmModal,
    confirmContent,
  } = useModal();

  /* Confirm Modal 로그인 클릭 시 */
  const handleLoginClick = () => {
    closeConfirmModal();
    navigate(PATH.SIGN_IN);
  };

  /* Confirm Modal 확인 클릭 시 */
  const handleConfirm = () => {
    closeConfirmModal();
    navigate(PATH.SIGN_UP);
  };

  /* Confirm Modal 취소 클릭 시 */
  const handleCancel = () => {
    closeConfirmModal();
  };


  const handleOpenConfirmModal = () => {
    const confirmMessage = (
      <>
        회원가입을 하면 나에게 딱 맞는 상품을  <br />
        검색하고, 추천받을 수 있어요! <br />
        이미 회원이세요?
        <span
          onClick={handleLoginClick}
          className={styles.loginLink}
        >
          로그인
        </span>
      </>
    );

    openConfirmModal('회원가입 하시겠습니까?', confirmMessage, handleConfirm, handleCancel);
  };


  return (
    <main>
      {isConfirmOpen && (
      <ConfirmModal
          isOpen={isConfirmOpen}
          closeModal={closeConfirmModal}
          title={confirmContent.title}
          message={confirmContent.message}
          onConfirm={confirmContent.onConfirm}
          onCancel={confirmContent.onCancel}
      />
      )}
      <section className={styles.listSection}>
        <div className={styles.listTitleDiv}>
          적금
        </div>

        <div className={styles.filterDiv}>
          <div className={styles.commonFilterDiv}>
            <div className={styles.bankSelectContainer}>
              <div className={styles.bank}>은행</div>
              <select
                className={styles.bankSelect}
                value={banks.length > 0 ? fullToShort(banks[banks.length - 1]) : ""}
                onChange={handleBankChange}
              >
                <option value="" disabled>
                  은행 선택
                </option>
                <option value="우리은행">우리은행</option>
                <option value="신한은행">신한은행</option>
                <option value="하나은행">하나은행</option>
                <option value="국민은행">국민은행</option>
                <option value="토스뱅크">토스뱅크</option>
                <option value="카카오뱅크">카카오뱅크</option>
                <option value="농협은행">농협은행</option>
              </select>
            </div>

            <div
              className={`${styles.bankSelectedContainer} ${banks.length > 0 ? styles.hasItems : ""
                }`}
            >
              {banks.length > 0 ? (
                banks.map((bank, index) => (
                  <div
                    key={index}
                    className={styles.bankSelectedItemDiv}
                  >
                    <div className={styles.selectedBankItem}>
                      {fullToShort(bank)}
                    </div>
                    <div
                      className={styles.bankSelectedBtn}
                      onClick={() => removeBank(bank)}
                    >
                      <img src={xIcon} alt="x" />
                    </div>
                  </div>
                ))
              ) : null}
            </div>
          </div> {/* commitFilterDiv */}


          {!isLoggedIn ? (
            <>
              <div className={styles.nonMemberFilterContainer}>
                <div className={styles.nonMemberMessage}>
                  나에게 맞는 적금 상품이 궁금하다면?
                  <span onClick={handleOpenConfirmModal} className={styles.click}>Click</span>

                  {/* ConfirmModal */}
                  <ConfirmModal
                    isOpen={isConfirmOpen}
                    closeModal={closeConfirmModal}
                    title={confirmContent.title}
                    message={confirmContent.message}
                    onConfirm={confirmContent.onConfirm}
                    onCancel={confirmContent.onCancel}
                  />
                </div>
              </div> {/* nonMemberFilterContainer */}
            </>
          ) : (
            <>
              <div className={styles.memberFilterContainer}>
                <div className={styles.memberFilterItemDiv}>
                  <div className={styles.memberFilterItem}>나이</div>
                  <input
                    type="number"
                    className={`${styles.memberFilterInput} ${styles.noPointer}`}
                    placeholder="예시 : 28"
                    value={age}
                    onChange={handleAgeChange}
                  />
                </div>
                <div className={styles.memberFilterItemDiv}>
                  <div className={styles.memberFilterItem}>저축 예정 기간</div>
                  <select
                    className={styles.memberFilterInput}
                    value={period}
                    onChange={handlePeriodChange}
                  >
                    <option value="">기간 선택</option>
                    <option value="3">3개월 이상</option>
                    <option value="6">6개월 이상</option>
                    <option value="12">12개월 이상</option>
                  </select>
                </div>
                <div className={styles.memberFilterItemDiv}>
                  <div className={styles.memberFilterItem}>이자 계산 방식</div>
                  <div className={styles.toggleButtonGroup}>
                    <button
                      className={`${styles.toggleButton} ${rate === "단리" ? styles.active : ""
                        }`}
                      onClick={() => handleRateClick("단리")}
                    >
                      단리
                    </button>
                    <button
                      className={`${styles.toggleButton} ${rate === "복리" ? styles.active : ""
                        }`}
                      onClick={() => handleRateClick("복리")}
                    >
                      복리
                    </button>
                  </div>
                </div>
                <div className={styles.memberFilterItemDiv}>
                  <div className={styles.memberFilterItem}>가입 방식</div>
                  <div className={styles.toggleButtonGroup}>
                    <button
                      className={`${styles.toggleButton} ${join === "대면" ? styles.active : ""
                        }`}
                      onClick={() => handleJoinClick("대면")}
                    >
                      대면
                    </button>
                    <button
                      className={`${styles.toggleButton} ${join === "비대면" ? styles.active : ""
                        }`}
                      onClick={() => handleJoinClick("비대면")}
                    >
                      비대면
                    </button>
                  </div>
                </div>
              </div>{/* memberFilterContainer */}
            </>
          )}
        </div>{/* filterDiv */}


        {/* 금리순 정렬 */}
        <div className={styles.rateStandard}>
          <li
            className={`${styles.standardItem} ${sort === "spclRate" ? styles.active : ""
              }`}
            onClick={() => handleSortClick("spclRate")}
          >
            최고 금리순
          </li>
          <li className={styles.standardItem}>
            <img src={verticalDividerIcon} alt="세로 구분선" className={styles.verticalDivider} />
          </li>
          <li
            className={`${styles.standardItem} ${sort === "basicRate" ? styles.active : ""
              }`}
            onClick={() => handleSortClick("basicRate")}
          >
            기본 금리순
          </li>
        </div>{/* rateStandard */}


        {/* 상태에 따라 내부 내용만 바뀜 */}
        {loading &&
          <div className={styles.errorDiv}>
            <img className={styles.loadingImg} src={spinner} alt="loading" />
          </div>}
        {error && <div className={styles.errorDiv}>데이터를 불러오는 중 에러가 발생했습니다.</div>}

        {/* 정상 데이터 로드 */}
        {!loading && !error && (
          <div className={styles.productListDiv}>
            {/* 상품 데이터가 없을 경우 메시지 출력 */}
            {productData.length === 0 ? (
              <div className={styles.noProductList}>
                <h4>상품이 없습니다.</h4>
              </div>
            ) : (
              /* 상품 데이터가 있을 경우 리스트 출력 */
              productData.map((item, index) => (
                <div key={index} className={styles.productList}>
                  <input type="hidden" value={item.id} readOnly />
                  <div className={styles.productLogoDiv}>
                    <img
                      src={`${PATH.STORAGE_BANK}/${item.bankLogo}`}
                      alt={`${item.bankName} 로고`}
                      className={styles.productLogoImg}
                    />
                  </div>
                  <div 
                    className={styles.productInfoDiv}
                    onClick={() => navigate(`${PATH.PRODUCT_DETAIL}/${item.id}`)}
                  >
                    <div className={styles.productBankProDiv}>
                      <div className={styles.productBank}>{item.bankName}</div>
                      <div className={styles.productPro}>{item.prdName}</div>
                    </div>
                    <div className={styles.productRateDiv}>
                      <div className={styles.productHighestRateDiv}>
                        <div className={styles.productHighestRateText}>최고금리</div>
                        <div className={styles.productHighestRatePer}>
                          <span className={styles.spclRate}>
                            {item.spclRate === 0 ? "N/A" : item.spclRate.toFixed(2) + "%"}
                          </span>
                        </div>
                      </div>
                      <div className={styles.productBasicRateDiv}>
                        <div className={styles.productBasicRateText}>기본금리</div>
                        <div className={styles.productBasicRatePer}>
                          <span className={styles.basicRate}>
                            {item.basicRate === 0 ? "N/A" : item.basicRate.toFixed(2) + "%"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.productBtnDiv}>
                    <button
                      className={styles.productCompareBtn}
                      onClick={() => handleCompareClick(item)}
                    >
                      비교<br />담기
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>  /* productListDiv */
        )}

        {/* 페이지네이션 */}
        <div className={styles.pagination}>
          <div className={styles.pageBtn}>
          <button 
            className={styles.navigationBtn} 
            onClick={handlePrevBlock} 
            disabled={paginationRange[0] === 1}
          >
            이전
          </button>
          {paginationRange.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? styles.active : ''}
            >
              {page}
            </button>
          ))}
          <button
            className={styles.navigationBtn} 
            onClick={handleNextBlock}
            disabled={paginationRange[paginationRange.length - 1] === totalPages}
          >
            다음
          </button>
          </div>
        </div>


      </section>
    </main>
  );
};

export default ListInstallmentPage;

