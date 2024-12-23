import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PATH } from "src/utils/path";
import styles from "./ProductDepListPage.module.scss";
import verticalDividerIcon from "src/assets/icons/verticalDivider.svg";
import AlertModal from "src/components/Modal/AlertModal";
import ConfirmModal from "src/components/Modal/ConfirmModal";
import useModal from "../../hooks/useModal";
import { useSession } from 'src/hooks/useSession';



const ProductDepListPage = () => {
  const [selectedBanks, setSelectedBanks] = useState([]); // 선택된 은행 목록
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [sortType, setSortType] = useState("highRate"); // 초기값: 최고금리순
  const [active, setActive] = useState(""); //단리 디폴트
  const [joinType, setJoinType] = useState(""); //비대면 디폴트
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [itemsPerPage, setItemsPerPage] = useState(5); // 페이지당 항목 수
  const [pageNumbers, setPageNumbers] = useState([]);
  
  
  const navigate = useNavigate();
  const { isLoggedIn, clearSession } = useSession();
 

  const paginateProducts = (products) => {
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    return products.slice(indexOfFirstProduct, indexOfLastProduct);
  };

  useEffect(() => {
    const filteredProducts = filterProducts(allProducts);
    setProducts(paginateProducts(filteredProducts));
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const maxPagesToShow = 5; // 한 번에 보여줄 최대 페이지 수
    const startPage =
      Math.floor((currentPage - 1) / maxPagesToShow) * maxPagesToShow + 1;
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    // 현재 그룹의 페이지 번호들 생성
    const newPageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
    setPageNumbers(newPageNumbers);
  }, [
    currentPage,
    allProducts,
    active,
    joinType,
    itemsPerPage,
    sortType,
    selectedBanks,
  ]); // 모든 의존성 추가

  //241218 전체 상품 리스트
  useEffect(() => {
    //fetchProductsByCtg("d"); // 초기에는 "d" 카테고리 데이터 가져오기
    fetchAllProducts(); // 모든 제품 가져오기
  }, []); // 빈 배열로 한 번만 호출

  //241219 전체 상품 리스트
  useEffect(() => {
    handleFilterByBank(); // selectedBanks가 변경될 때마다 자동으로 필터 적용
  }, [selectedBanks]); // selectedBanks 의존성 추가

  //241217 - 비교담기버튼 클릭
  const handleClick = () => {
    window.location.href = PATH.PRODUCT_COMPARE;
    //navigate(PATH.PRODUCT_COMPARE);
    //window.location.href = "http://localhost:5173/product/compare/d";
    console.log("비교담기");
  };

  // 카테고리별 상품을 가져오고 필터 적용
  // const fetchProductsByCtg = async (ctg) => {
  //   try {
  //     const response = await axios.get(`http://localhost:8080/product/getProductsByCtg/${ctg}`);
  //     const filtered = response.data.filter((product) => {
  //       return product.prdName.includes("예금") && product.option && product.option[0].rateTypeKo === active;
  //     });
  //     setProducts(filtered); // 필터링된 예금 제품만 상태에 반영
  //   } catch (error) {
  //     console.error("Error fetching products by category:", error);
  //   }
  // };

  // 241217 필터 반영항목 테스트
  useEffect(() => {
    console.log("콘솔 : products 필터로그:", products);
  }, [products]);

  // 모든 상품가지고 오기
  const fetchAllProducts = async (type) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/product/getAllProducts`
      );
      let sortedProducts = response.data;

      // 정렬 타입에 따라 정렬
      sortedProducts.sort((a, b) => {
        const aRate = a.options && a.options[0] ? a.options[0].spclRate : 0; // 기본값 0
        const bRate = b.options && b.options[0] ? b.options[0].spclRate : 0; // 기본값 0

        if (type === "highRate") {
          // 최고 금리 순으로 정렬
          return bRate - aRate; // 내림차순 정렬
        } else if (type === "baseRate") {
          // 기본 금리로 정렬
          const aBaseRate =
            a.options && a.options[0] ? a.options[0].basicRate : 0; // 기본값 0
          const bBaseRate =
            b.options && b.options[0] ? b.options[0].basicRate : 0; // 기본값 0
          return bBaseRate - aBaseRate; // 오름차순 정렬
        }

        return 0; // 정렬 필요 없음
      });

      setAllProducts(sortedProducts); // 정렬된 모든 상품 데이터를 설정
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // 최고 금리로 정렬
  const handleSortByHighRate = () => {
    setSortType("highRate"); // 정렬 타입 설정
    fetchAllProducts("highRate"); // 최고 금리로 정렬된 제품 다시 가져오기
  };

  // 기본 금리로 정렬
  const handleSortByBaseRate = () => {
    setSortType("baseRate"); // 정렬 타입 설정
    fetchAllProducts("baseRate"); // 기본 금리로 정렬된 제품 다시 가져오기
  };

  //------------------------------------------------------------------------------------------------

  const filterProducts = (allProducts) => {
    return allProducts.filter((product) => {
      // 조건: active에 따라 rateType 필터링
      const meetsRateType = active
        ? product.options && product.options[0].rateTypeKo === active
        : true;

      // 대면/비대면 필터링
      const meetsJoinType = joinType
        ? joinType === "대면"
          ? product.product.joinWay &&
            product.product.joinWay.includes("영업점")
          : true
        : true;

      // 예금 이름을 포함하고, rateType 및 joinType 조건을 모두 만족해야 함
      return (
        product.product.prdName.includes("예금") &&
        meetsRateType &&
        meetsJoinType
      );
    });
  };

  //-----------------------------------------------------------------------------------------------

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    handleFilterByBank(); // 페이지 변경 시 필터 재적용
  };

  const handleBankChange = (e) => {
    const selectedBank = e.target.value;
    if (selectedBank && !selectedBanks.includes(selectedBank)) {
      setSelectedBanks([...selectedBanks, selectedBank]); // 새로운 은행 추가
    } else if (!selectedBank) {
      setSelectedBanks([]); // 선택이 해제될 경우 모든 선택 해제
    }
    //handleFilterByBank(); // 은행 선택 후 자동으로 필터 적용
  };
  const handleBankRemove = (bank) => {
    setSelectedBanks(selectedBanks.filter((item) => item !== bank)); // 은행 삭제
  };
  //1219----------------==-=-=-=-=-=========================================================================

  const handleFilterByBank = () => {
    let filteredProducts;

    // 선택된 은행이 있을 경우
    if (selectedBanks.length > 0) {
      filteredProducts = allProducts.filter(
        (product) =>
          selectedBanks.some((bank) =>
            product.product.bankName.includes(bank)
          ) && product.product.prdName.includes("예금") // 예금 상품만 필터링
      );
    } else {
      // 선택된 은행이 없을 경우 모든 예금 상품을 보여줌
      filteredProducts = allProducts.filter((product) =>
        product.product.prdName.includes("예금")
      );
    }

    //정렬 추가
    filteredProducts.sort((a, b) => b.product.spclRate - a.product.spclRate);

    // 페이징 처리
    const paginatedProducts = paginateProducts(filteredProducts);
    setProducts(paginatedProducts); // 현재 페이지에 맞는 상품만 설정

    // 페이지 번호 업데이트
    setPageNumbers(
      Array.from(
        { length: Math.ceil(filteredProducts.length / itemsPerPage) },
        (_, i) => i + 1
      )
    );
  };

  // 이자계산방식 const
  const handleFilterChange = (value) => {
    setActive(value); // active 값을 변경
    console.log("필터 변경:", value);
    // 필터링 함수는 useEffect에서 처리되므로 handleFilterChange에서 호출하지 않아도 됩니다.
  };

  //가입방식 변경 const
  const handleJoinTypeChange = (value) => {
    setJoinType(value);
    console.log("가입 방식 변경:", value);
  };

  // const handleRateClick = () => {
  //   console.log("금리 높은 순 버튼 클릭"); // 테스트용
  //   // 추가 로직 구현
  // };

  //모달 const
  const {
    isConfirmOpen,
    openConfirmModal,
    closeConfirmModal,
    confirmContent,
    isAlertOpen,
    openAlertModal,
    closeAlertModal,
    alertContent,
  } = useModal();

  // Confirm Modal 로그인 클릭 시
  const handleLoginClick = () => {
    closeConfirmModal();
    navigate(PATH.SIGN_IN);
  };

  // Confirm Modal 확인 클릭 시
  const handleConfirm = () => {
    closeConfirmModal();
    navigate(PATH.SIGN_UP);
  };

  // Confirm Modal 취소 클릭 시
  const handleCancel = () => {
    closeConfirmModal();
  };

  // 최고 금리순 일반금리순 적용 - 241218
  // const handleSortByRate = (type) => {
  //   const sortedProducts = [...products];
  //   if (type === "highRate") {
  //     sortedProducts.sort((a, b) => b.options[0].spclRate - a.options[0].spclRate); // 최고 금리 순
  //   } else if (type === "baseRate") {
  //     sortedProducts.sort((a, b) => b.options[0].basicRate - a.options[0].basicRate); // 기본 금리 순
  //   }
  //   setSortType(type);
  //   setProducts(sortedProducts);
  // };

  // ---------------------------------------------------------------------------------------------------------------
  return (
    <main className={styles.productListMain}>
      <section>
        <div className={styles.mainTitle}>
          <h3>예금</h3>
        </div>
        

        {/* 회원/비회원 공통 보이는 필터 */}
        <div className={styles.commonFilter}>
          <div className={styles.bankSelectTitle}>은행</div>
          <div className={styles.bankSelectDiv}>
            <select className={styles.bankSelect} onChange={handleBankChange}>
              <option value="">은행 선택</option>
              <option value="국민은행">KB국민 은행</option>
              <option value="농협은행">NH농협 은행</option>
              <option value="신한은행">신한 은행</option>
            </select>
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
          {/* 필터 버튼 -----------------------------------------------------------------------------*/}
          {/* <button onClick={handleFilterByBank} className={styles.filterButton}>
            필터 적용
          </button> */}
        </div>
        {/* -----------------------------비회원 보이는 배너 ----------------------------- */}
        {/* 241217 - 모달 적용 */}
        <div className={styles.nonMemberBanner}>
          <div
            className={styles.banner}
            onClick={() =>
              openConfirmModal(
                "회원가입 하시겠습니까?",
                <>
                  <span>
                    <li>회원가입을 하면 나에게 딱 맞는 상품을</li>검색하고,
                    추천받을 수 있어요!
                  </span>
                  <br />
                  이미 회원이에요 <span className={styles.arrow}>&gt;&gt;</span>
                  <span
                    className={styles.modalLogin}
                    onClick={handleLoginClick}
                  >
                    로그인
                  </span>
                </>,
                handleConfirm,
                handleCancel
              )
            }
          >
            <h3>
              나에게 맞는 예금 상품이 궁금하다면? <span>Click</span>
            </h3>
          </div>

          {/* Alert Modal */}
          {isAlertOpen && (
            <AlertModal
              isOpen={isAlertOpen}
              closeModal={closeAlertModal}
              title={alertContent.title}
              message={alertContent.message}
            />
          )}
          {/* Confirm Modal */}
          {isConfirmOpen && (
            <ConfirmModal
              isOpen={isConfirmOpen}
              closeModal={closeConfirmModal}
              title={confirmContent.title}
              message={confirmContent.message}
              // onConfirm={handleCancel}
              // onCancel={handleConfirm}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          )}
        </div>
        {/* ----------------------------- 로그인 후 보이는 필터  -----------------------------*/}
        
        <div className={styles.filterTotalDiv}>
          <div className={styles.filterDiv}>
            {/*1216 필터 test 시작 ------------------------*/}
            <div className={styles.filterDiv}>
              <h4>이자 계산 방식</h4>
              <div className={styles.toggle}>
                <button
                  className={`${active === "단리" ? styles.active : ""}`}
                  data-value="단리"
                  onClick={() => handleFilterChange("단리")}
                >
                  단리
                </button>
                <button
                  className={`${active === "복리" ? styles.active : ""}`}
                  data-value="복리"
                  onClick={() => handleFilterChange("복리")}
                >
                  복리
                </button>
              </div>
            </div>

            <div className={styles.filterDiv}>
              <h4>가입방식</h4>
              <div className={styles.toggle}>
                <button
                  className={`${joinType === "대면" ? styles.active : ""}`}
                  data-value="대면"
                  onClick={() => handleJoinTypeChange("대면")}
                >
                  대면
                </button>
                <button
                  className={`${joinType === "비대면" ? styles.active : ""}`}
                  data-value="비대면"
                  onClick={() => handleJoinTypeChange("비대면")}
                >
                  비대면
                </button>
              </div>
            </div>
          </div>

          {isLoggedIn && (
    <div className={styles.loggedInArea}>
      로그인 하면 보이는 영역
    </div>
  )}

          {/*test 필터 끝 ------------------------*/}
          {/*버튼 hidden*/}
          {/* <button
        onClick={handleRateClick}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          backgroundColor: "#407BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        조회
      </button> */}
        </div>
        {/* 금리순 정렬  */}
        <div className={styles.rateStandard}>
          <span
            className={styles.textItem}
            onClick={handleSortByHighRate}
            style={{
              cursor: "pointer",
              fontWeight: sortType === "highRate" ? "bold" : "normal",
            }}
          >
            최고 금리순
          </span>
          <li className={styles.userMenuItem}>
            <img
              src={verticalDividerIcon}
              alt="세로 구분선"
              className={styles.verticalDivider}
            />
          </li>
          <span
            className={styles.textItem}
            onClick={handleSortByBaseRate}
            style={{
              cursor: "pointer",
              fontWeight: sortType === "baseRate" ? "bold" : "normal",
            }}
          >
            기본 금리순
          </span>
        </div>
        {/* -----------------------------리스트 ------------------------------------------------*/}
        {/** db 연동 상품 리스트  */}
        <div className={styles.productListDiv}>
          {allProducts.length === 0 ? (
            <p>표시할 데이터가 없습니다.</p>
          ) : (
            products.map((product, index) => (
              <div
                key={index}
                className={styles.productList}
                onClick={() =>
                  navigate(`/product/detail/${product.product.id}`)
                }
                style={{ cursor: "pointer" }}
              >
                <div className={styles.image}>
                  <img
                    src={`${PATH.STORAGE_BANK}/${product.product.bankLogo}`}
                    className={styles.productListLogo}
                  />
                </div>
                <div className={styles.productListInfo}>
                  <div>
                    <div className={styles.Bank}>
                      <p>{product.product.bankName}</p>
                    </div>
                    <p>{product.product.prdName}</p>
                  </div>
                  <div className={styles.RateDiv}>
                    <div className={styles.HighestRateDiv}>
                      <p>최고금리</p>
                      <div className={styles.HighestRatePer}>
                        {product.options[0].spclRate}%{" "}
                      </div>
                    </div>
                    <div className={styles.BaseRateDiv}>
                      <p>기본금리</p>
                      <div className={styles.BaseRatePer}>
                        {product.options[0].basicRate}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className={styles.productListBtn}><li>비교</li> 담기</div> */}
                <div
                  className={styles.productListBtn}
                  onClick={() => handleClick()}
                >
                  <li>비교</li> 담기
                </div>
              </div>
            ))
          )}

          {/* ---------------------------페이징처리 ---------------------------------*/}
          <div className={styles.pagination}>
            <div className={styles.pageBtn}>
              {/* 이전 페이지 버튼 */}
              <button
                onClick={() => setCurrentPage(pageNumbers[0] - 1)}
                disabled={pageNumbers[0] === 1}
              >
                이전
              </button>

              {/* 현재 페이지 그룹의 번호들 */}
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => handlePageClick(number)}
                  className={currentPage === number ? styles.activePage : ""}
                >
                  {number}
                </button>
              ))}

              {/* 다음 페이지 그룹 이동 버튼 */}
              <button onClick={() =>
                  setCurrentPage(pageNumbers[pageNumbers.length - 1] + 1)
                }
                disabled={
                  pageNumbers[pageNumbers.length - 1] ===
                  Math.ceil(allProducts.length / itemsPerPage)
                }
              >
                다음
              </button>
            </div>
          </div>
          {/* ---------------------------페이징처리끝---------------------------------*/}
        </div>
      </section>
    </main>
  );
};

export default ProductDepListPage;
