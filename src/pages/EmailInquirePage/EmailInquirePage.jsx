import React, { useEffect, useState } from 'react';
import styles from './EmailInquirePage.module.scss';
import { PATH } from 'src/utils/path';
import { useNavigate } from 'react-router-dom';
import axiosInstanceAPI from 'src/apis/axiosInstanceAPI';

import { useAtom } from 'jotai';
import { userData } from '../../atoms/userData';

const EmailInquirePage = () => {
  const navigate = useNavigate();
  const [myData, setMyData] = useAtom(userData); // Jotai Atom 사용

  const [formData, setFormData] = useState({
    inquireCtg: "", //inquiryType
    inquireUser: "", //name
    inquireEmail: "", // email
    inquireTitle: "", // subject
    inquireContent: "", // message
    fileUuid: null, // fileUuid(Back)
    agreeToPrivacy: false,
  });

  //데이터 
  useEffect(() => {
    const userDTO = async () => {
      try {
        if(myData) {
          setFormData((prev) => ({
            ...prev,
            inquireUser: myData.username,
            inquireEmail: myData.email,
          }));
        }
      } catch (error) {
        console.error(error);
      }
    }
    userDTO();
  }, [myData, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, fileUuid: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmitInquire = async () => {
    try {
      const formDataToSend = new FormData();

      // 보내는 폼 데이터에 추가
      formDataToSend.append("inquireCtg", formData.inquireCtg);
      formDataToSend.append("inquireUser", formData.inquireUser);
      formDataToSend.append("inquireEmail", formData.inquireEmail);
      formDataToSend.append("inquireTitle", formData.inquireTitle);
      formDataToSend.append("inquireContent", formData.inquireContent);
      formDataToSend.append("agreeToPrivacy", formData.agreeToPrivacy);

      // 폼데이터에 파일추가
      if (formData.fileUuid) {
        formDataToSend.append("fileUuid", formData.fileUuid); // 파일 추가
      }

      const response = await axiosInstanceAPI.post(`${PATH.SERVER}/api/emailinquire/save`, 
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // 중요!
          },
        }
      );
      console.log("이메일 전송 = " + response.data);
    } catch(error) {
      console.log(error);
    }
  }

  return (
    <form className={styles.formContainer}>
      <h1 className={styles.title}>이메일 문의하기</h1>
      <p className={styles.subTitle}>
        빠른 문의 처리는 <a href="/userInquire" className={styles.link}>관리자 1:1 문의</a>를 이용해 주세요.
      </p>

      {/* Inquiry Type Dropdown */}
      <div className={styles.formGroup}>
        <select
          id="inquiryType"
          name="inquireCtg"
          value={formData.inquireCtg}
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
          name="inquireUser"
          value={formData.inquireUser || ""}
          onChange={handleChange}
          className={styles.textInput}
          placeholder="이름"
          readOnly
        />
      </div>

      {/* Email */}
      <div className={styles.formGroup}>
        <input
          type="email"
          id="email"
          name="inquireEmail"
          value={formData.inquireEmail}
          onChange={handleChange}
          className={styles.textInput}
          placeholder="이메일"
          readOnly
        />
      </div>

      {/* Subject */}
      <div className={styles.formGroup}>
        <input
          type="text"
          id="subject"
          name="inquireTitle"
          value={formData.inquireTitle}
          onChange={handleChange}
          className={styles.textInput}
          placeholder="제목"
        />
      </div>

      {/* Message */}
      <div className={styles.formGroup}>
        <textarea
          id="message"
          name="inquireContent"
          value={formData.inquireContent}
          onChange={handleChange}
          className={styles.textArea}
          placeholder="문의 내용"
          maxLength="500"
        />
        <br></br>
        <small className={styles.hint}>
          {formData.inquireContent.length}자 / 최대 500자
        </small>
      </div>

    <div className={styles.formGroup}>
        <div className={styles.fileUploadWrapper}>
            <input
            type="text"
            readOnly
            value={formData.fileUuid ? formData.fileUuid.name : ""}
            placeholder=""
            className={styles.fileInputText}
            />
            <label htmlFor="file" className={styles.fileButton}>
            첨부 파일
            </label>
            <input
            type="file"
            id="file"
            name="fileUuid"
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
        type="button"
        className={`${styles.submitButton} ${
          !formData.agreeToPrivacy ? styles.disabled : ""
        }`}
        disabled={!formData.agreeToPrivacy}
        onClick={handleSubmitInquire}
      >
        제출하기
      </button>
    </form>
  );
};

export default EmailInquirePage;