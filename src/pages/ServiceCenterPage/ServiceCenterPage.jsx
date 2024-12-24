import React, { useState } from 'react';
import styles from './ServiceCenterPage.module.scss';
import {  useNavigate } from 'react-router-dom';
import { PATH } from 'src/utils/path';

const categories = [
  { id: "all", name: "전체" },
  { id: "savings", name: "예금 관련" },
  { id: "installments", name: "적금 관련" },
  { id: "custom_products", name: "맞춤 상품 관련" },
  { id: "account", name: "로그인/회원정보" },
  { id: "etc", name: "기타" },
];

const faqData = {
  all: [
    { id: 1, question: "예금 상품에는 어떤 것들이 있나요?", answer: "정기예금, 자유예금 등이 있습니다." },
    { id: 2, question: "적금 추천은 어떻게 진행되나요?", answer: "적금 추천은 사용자의 목표와 금리를 기준으로 진행됩니다." },
    { id: 3, question: "맞춤 상품은 어떻게 이용할 수 있나요?", answer: "맞춤 상품은 사용자의 재무 상태를 기반으로 추천됩니다." },
    { id: 4, question: "비밀번호를 변경하려면 어떻게 해야 하나요?", answer: "마이페이지에서 비밀번호 변경 메뉴를 통해 가능합니다." },
  ],
  savings: [
    { id: 1, question: "예금 상품에는 어떤 것들이 있나요?", answer: "정기예금, 자유예금 등이 있습니다." },
  ],
  installments: [
    { id: 2, question: "적금 추천은 어떻게 진행되나요?", answer: "적금 추천은 사용자의 목표와 금리를 기준으로 진행됩니다." },
  ],
  custom_products: [
    { id: 3, question: "맞춤 상품은 어떻게 이용할 수 있나요?", answer: "맞춤 상품은 사용자의 재무 상태를 기반으로 추천됩니다." },
  ],
  account: [
    { id: 4, question: "비밀번호를 변경하려면 어떻게 해야 하나요?", answer: "마이페이지에서 비밀번호 변경 메뉴를 통해 가능합니다." },
  ],
  etc: [
    { id: 5, question: "금리는 어디에서 확인할 수 있나요?", answer: "상품 상세 페이지에서 금리를 확인할 수 있습니다." },
  ],
};

const fixedQuestions = [
  { id: 1, question: "예금 상품에는 어떤 것들이 있나요?", category: "savings" },
  { id: 2, question: "적금 추천은 어떻게 진행되나요?", category: "installments" },
  { id: 3, question: "맞춤 상품은 어떻게 이용할 수 있나요?", category: "custom_products" },
  { id: 4, question: "비밀번호를 변경하려면 어떻게 해야 하나요?", category: "account" },
];

const ServiceCenterPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedQuestions, setExpandedQuestions] = useState([]);

  const navigate = useNavigate();

  const handleQuestionClick = (id) => {
    setExpandedQuestions((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
    );
  };

  const handleFixedQuestionClick = (item) => {
    setActiveCategory(item.category);
    setExpandedQuestions((prev) => [...prev, item.id]); 
    setTimeout(() => {
      const targetElement = document.getElementById(`faq-${item.id}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  return (
    <main className={styles.serviceCenterMain}>
      {/* 공통 section */}
      <section className={styles.commonSection}>
        <div className={styles.topContainer}>
          <div className={styles.questionSection}>
            <h3 className={styles.heading}>무엇을 도와 드릴까요?</h3>
            <ul className={styles.fixedQuestionList}>
              {fixedQuestions.map((item) => (
                <li key={item.id} className={styles.fixedQuestionItem}>
                  <button
                    className={styles.questionButton}
                    onClick={() => handleFixedQuestionClick(item)}
                  >
                    <span className={styles.icon}>Q</span>
                    {item.question}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.contactSection}>
            <h3 className={styles.subheading}>관리자 문의</h3>
            <ul className={styles.infoList}>
              <li>・ 평일: 전체 문의 상담</li>
              <li>・ 토요일: 이메일 상담</li>
              <li>・ 일요일: 휴무</li>
            </ul>
            <button className={styles.chatButton} onClick={()=>navigate(PATH.USER_INQUIRE)}>
              관리자 1:1 문의하기
              <div className={styles.newAnswerSection}>새 답변</div>
              </button>
            <div className={styles.emailActions}>
              <button className={styles.emailButton} onClick={()=>navigate(PATH.EMAIL_INQUIRE)}>
                이메일 문의하기</button>
              <button className={styles.copyButton}>이메일 주소 복사하기</button>
            </div>
          </div>
        </div>

        <div className={styles.sectionDivider}></div>

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

        <div className={styles.faqContainer}>
          {faqData[activeCategory].map((item) => (
            <div
              id={`faq-${item.id}`}
              key={item.id}
              className={`${styles.faqSection} ${
                expandedQuestions.includes(item.id) ? styles.open : ""
              }`}
            >
              <button
                className={styles.faqQuestionButton}
                onClick={() => handleQuestionClick(item.id)}
              >
                <span className={styles.icon}>Q</span>
                {item.question}
                <span
                  className={`${styles.arrowIcon} ${
                    expandedQuestions.includes(item.id) ? styles.up : ""
                  }`}
                ></span>
              </button>
              <div
                className={styles.answerContainer}
                style={{
                  maxHeight: expandedQuestions.includes(item.id) ? "200px" : "0",
                  opacity: expandedQuestions.includes(item.id) ? "1" : "0",
                }}
              >
                <p className={styles.answer}>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ServiceCenterPage;