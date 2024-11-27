import React, { useState } from "react";
import styles from "./ServiceCenterPage.module.scss";

const categories = [
  { id: "all", name: "전체" },
  { id: "savings", name: "예금 관련" },
  { id: "installments", name: "적금 관련" },
  { id: "custom_products", name: "맞춤 상품 관련" },
  { id: "account", name: "로그인/회원정보" },
];

const faqData = {
  all: [
    { id: 1, question: "예금 상품에는 어떤 것들이 있나요?", answer: "정기예금, 자유예금 등이 있습니다." },
    { id: 2, question: "적금 추천은 어떻게 진행되나요?", answer: "적금 추천은 사용자의 목표와 금리를 기준으로 진행됩니다." },
    { id: 3, question: "맞춤 상품은 어떻게 이용할 수 있나요?", answer: "맞춤 상품은 사용자의 재무 상태를 기반으로 추천됩니다." },
    { id: 4, question: "비밀번호를 변경하려면 어떻게 해야 하나요?", answer: "마이페이지에서 비밀번호 변경 메뉴를 통해 가능합니다." },
    { id: 5, question: "금리는 어디에서 확인할 수 있나요?", answer: "상품 상세 페이지에서 금리를 확인할 수 있습니다." },
  ],
  savings: [
    { id: 1, question: "예금 상품에는 어떤 것들이 있나요?", answer: "정기예금, 자유예금 등이 있습니다." },
    { id: 2, question: "예금 금리는 어떻게 정해지나요?", answer: "예금 금리는 시장 금리와 금융 기관 정책에 따라 정해집니다." },
  ],
  installments: [
    { id: 3, question: "적금 추천은 어떻게 진행되나요?", answer: "적금 추천은 사용자의 목표와 금리를 기준으로 진행됩니다." },
  ],
  custom_products: [
    { id: 4, question: "맞춤 상품은 어떻게 이용할 수 있나요?", answer: "맞춤 상품은 사용자의 재무 상태를 기반으로 추천됩니다." },
  ],
  account: [
    { id: 5, question: "비밀번호를 변경하려면 어떻게 해야 하나요?", answer: "마이페이지에서 비밀번호 변경 메뉴를 통해 가능합니다." },
  ],
};

const fixedQuestions = [
  { id: 1, question: "예금 상품에는 어떤 것들이 있나요?", category: "savings" },
  { id: 2, question: "적금 추천은 어떻게 진행되나요?", category: "installments" },
  { id: 3, question: "맞춤 상품은 어떻게 이용할 수 있나요?", category: "custom_products" },
  { id: 4, question: "비밀번호 변경은 어떻게 하나요?", category: "account" },
  { id: 5, question: "금리는 어디에서 확인할 수 있나요?", category: "all" },
];

const ServiceCenterPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  const handleQuestionClick = (id) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  return (
    <main className={styles.main}>
      {/* 질문 섹션 + 관리자 문의 섹션 */}
      <div className={styles.topContainer}>
        <section className={styles.questionSection}>
          <h3 className={styles.heading}>무엇을 도와 드릴까요?</h3>
          <br></br>
          <ul className={styles.fixedQuestionList}>
            {fixedQuestions.map((item) => (
              <li key={item.id} className={styles.fixedQuestionItem}>
                <button
                  className={styles.questionButton}
                  onClick={() => setActiveCategory(item.category)}
                >
                  <span className={styles.icon}>Q</span>
                  {item.question}
                </button>
              </li>
            ))}
          </ul>
        </section>
        <aside className={styles.contactSection}>
          <h3 className={styles.subheading}>관리자 문의</h3>
          <ul className={styles.infoList}>
            <li>・평일: 전체 문의 상담</li>
            <br></br>
            <li>・토요일: 이메일 상담</li>
            <br></br>
            <li>・일요일: 휴무</li>
            <br></br>
          </ul>
          <button className={styles.chatButton}>관리자 1:1 문의하기</button>
          <div className={styles.emailActions}>
            <button className={styles.emailButton}>이메일 문의하기</button>
            <button className={styles.copyButton}>이메일 주소 복사하기</button>
          </div>
        </aside>
      </div>

      {/* 기준선 추가 */}
      <div className={styles.sectionDivider}></div>

      {/* 카테고리 섹션 */}
      <nav className={styles.navBar}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.navButton} ${
              activeCategory === category.id ? styles.active : ""
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </nav>

      {/* FAQ 섹션 */}
      <div className={styles.faqContainer}>
        {faqData[activeCategory].map((item) => (
          <section
            key={item.id}
            className={`${styles.faqSection} ${
              expandedQuestionId === item.id ? styles.open : ""
            }`}
          >
            <button
              className={styles.questionButton}
              onClick={() => handleQuestionClick(item.id)}
            >
              <span className={styles.icon}>Q</span>
              {item.question}
              <span
                className={`${styles.arrowIcon} ${
                  expandedQuestionId === item.id ? styles.up : ""
                }`}
              ></span>
            </button>
            <div
              className={styles.answerContainer}
              style={{
                maxHeight: expandedQuestionId === item.id ? "200px" : "0",
                opacity: expandedQuestionId === item.id ? "1" : "0",
              }}
            >
              <p className={styles.answer}>{item.answer}</p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};

export default ServiceCenterPage;