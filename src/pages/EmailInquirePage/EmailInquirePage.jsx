import React, { useState } from 'react';
import styles from './EmailInquirePage.module.scss';

const EmailInquirePage = () => {
    const [formData, setFormData] = useState({
      inquiryType: "",
      name: "",
      email: "",
      subject: "",
      message: "",
      file: null,
      agreeToPrivacy: false,
    });
  
    const handleChange = (e) => {
      const { name, value, type, checked, files } = e.target;
      if (type === "checkbox") {
        setFormData({ ...formData, [name]: checked });
      } else if (type === "file") {
        setFormData({ ...formData, file: files[0] });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.agreeToPrivacy) {
        alert("개인정보 수집 및 이용동의에 체크해 주세요.");
        return;
      }
      alert("폼 제출 완료!");
      console.log("Submitted data:", formData);
    };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h1 className={styles.title}>이메일 문의하기</h1>
      <p className={styles.subTitle}>
        빠른 문의 처리는 <a href="/userInquire" className={styles.link}>관리자 1:1 문의</a>를 이용해 주세요.
      </p>

      {/* Inquiry Type Dropdown */}
      <div className={styles.formGroup}>
        <select
          id="inquiryType"
          name="inquiryType"
          value={formData.inquiryType}
          onChange={handleChange}
          className={styles.selectInput}
        >
          <option value="">문의 유형</option>
          <option value="serviceImprovement">서비스 개선 제안</option>
          <option value="systemError">시스템 오류 제보</option>
        </select>
        <br></br>
        <small className={styles.hintInquiryType}>
          • 앱 개선 제안은 '서비스 개선 제안'으로 선택해 주세요
          <br></br>
          • 앱 장애 신고는 '시스템 오류 제보'로 선택해 주세요
        </small>
      </div>

      {/* Name */}
      <div className={styles.formGroup}>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.textInput}
          placeholder="이름"
        />
      </div>

      {/* Email */}
      <div className={styles.formGroup}>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.textInput}
          placeholder="이메일"
        />
      </div>

      {/* Subject */}
      <div className={styles.formGroup}>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={styles.textInput}
          placeholder="제목"
        />
      </div>

      {/* Message */}
      <div className={styles.formGroup}>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={styles.textArea}
          placeholder="문의 내용"
          maxLength="500"
        />
        <br></br>
        <small className={styles.hint}>
          {formData.message.length}자 / 최대 500자
        </small>
      </div>

    <div className={styles.formGroup}>
        <div className={styles.fileUploadWrapper}>
            <input
            type="text"
            readOnly
            value={formData.file ? formData.file.name : ""}
            placeholder=""
            className={styles.fileInputText}
            />
            <label htmlFor="file" className={styles.fileButton}>
            첨부 파일
            </label>
            <input
            type="file"
            id="file"
            name="file"
            onChange={handleChange}
            className={styles.fileInput}
            />
        </div>
    </div>

      {/* Privacy Agreement */}
      <div className={styles.privacyContainer}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="agreeToPrivacy"
            checked={formData.agreeToPrivacy}
            onChange={handleChange}
            className={styles.checkbox}
          />
          개인정보 수집 및 이용동의 <span className={styles.required}>*</span>
        </label>
        <div className={styles.privacyDetails}>
          <p>1. 수집하는 개인정보 항목: 이름, 이메일</p>
          <p>2. 수집 목적: 문의자 확인, 문의에 대한 회신 등의 처리</p>
          <p>3. 보유 기간: 목적 달성 후 파기, 단, 관계법령에 따라 또는 회사 정책에 따른 정보보유사유가 발생하여 보존할 필요가 있는 경우에는 필요한 기간 동안 해당 정보를 보관합니다. 
            전자상거래 등에서의 소비자 보호에 관한 법률, 전자금융거래법, 통신비밀보호법 등 법령에서 일정 기간 정보의 보관을 규정하는 경우, 이 기간 동안 법령의 규정에 따라 개인 정보를 보관하며, 다른 목적으로는 절대 이용하지 않습니다. (개인정보처리방침 참고)</p>
          <p>
            4. 귀하는 회사의 정보수집에 대해 동의하지 않거나 거부할 수 있습니다.
            다만, 이때 원활한 문의 및 서비스 이용 등이 제한될 수 있습니다.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`${styles.submitButton} ${
          !formData.agreeToPrivacy ? styles.disabled : ""
        }`}
        disabled={!formData.agreeToPrivacy}
      >
        제출하기
      </button>
    </form>
  );
};

export default EmailInquirePage;