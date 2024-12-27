//Jotai 및 관련 라이브러리 import
import React, { useRef, useEffect, useState } from 'react';
import { atom, useAtom } from 'jotai';
import FullCalendar from '@fullcalendar/react'; // React용 FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; // 월간 보기
import interactionPlugin from '@fullcalendar/interaction'; // 날짜 클릭
import Modal from 'react-modal'; // 모달
import axiosInstanceAPI from 'src/apis/axiosInstanceAPI'; // axiosInstanceAPI 

import MyNav from 'src/components/MyNav'; //MyNav
import AlertModal from 'src/components/Modal/AlertModal/AlertModal'; //AlertModal
import ConfirmModal from 'src/components/Modal/ConfirmModal/ConfirmModal'; //ConfirmModal
import useModal from 'src/hooks/useModal'; //useModal 훅 추가

import { PATH } from 'src/utils/path'; //경로
import leftArrowIcon from 'src/assets/icons/leftArrow.svg'; //icon
import rightArrowIcon from 'src/assets/icons/rightArrow.svg';

import styles from './MyCalendarPage.module.scss';

const API_URL = `${PATH.SERVER}/api/calendar`;  // API URL

// Jotai 상태 관리
const eventsAtom = atom([]); // 전체 이벤트 리스트
const modalIsOpenAtom = atom(false); // 모달 열림 상태
const selectedDateAtom = atom(''); // 선택된 날짜 
const savingNameAtom = atom(''); // 적금명
const amountAtom = atom(''); // 금액
const logoUrlAtom = atom(''); // 로고 URL 
const endDateAtom = atom(''); // 만기일 
const isSmallScreenAtom = atom(window.innerWidth <= 1000); //화면 크기 변경
const expandedDatesAtom = atom({}); // 특정 날짜의 이벤트가 펼쳐졌는지 관리

// 모달 초기 설정
Modal.setAppElement('#root');

const MyCalendarPage = () => {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom); // 선택날짜저장
  const [modalIsOpen, setModalIsOpen] = useAtom(modalIsOpenAtom); // 모달열림
  const [savingName, setSavingName] = useAtom(savingNameAtom); // 적금명
  const [logoUrl, setLogoUrl] = useAtom(logoUrlAtom); // 은행로고URL
  const [endDate, setEndDate] = useAtom(endDateAtom); // 만기일
  const [amount, setAmount] = useAtom(amountAtom); // 금액
  const [events, setEvents] = useAtom(eventsAtom); // 이벤트목록
  const [isSmallScreen, setIsSmallScreen] = useAtom(isSmallScreenAtom); // 화면크기
  const [expandedDates, setExpandedDates] = useAtom(expandedDatesAtom); // + , - 버튼 
  const [animatingDates, setAnimatingDates] = useState({}); //애니메이션 효과
  const [selectedEventId, setSelectedEventId] = useState(null); // 이벤트ID 저장
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // ConfirmModal 열림 상태
  const [confirmContent, setConfirmContent] = useState({}); // ConfirmModal의 제목, 메시지, onConfirm 함수
  const [banks, setBanks] = useState([]); // 은행 목록
  const [selectedBank, setSelectedBank] = useState(''); // 선택된 은행명
  const [products, setProducts] = useState([]); // 선택된 은행의 적금명 저장

  // Confirm 모달
  const openConfirmModal = (title, message, onConfirm) => {
    setConfirmContent({ title, message, onConfirm });
    setIsConfirmOpen(true); //열기
  };

  const closeConfirmModal = () => {
    setIsConfirmOpen(false); //닫기
  };

  // 캘린더 참조
  const calendarRef = useRef(null);

  //useModal 훅
  const { isAlertOpen, openAlertModal, closeAlertModal, alertContent } = useModal();

  // 화면크기 상태 (반응형)
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1000); // 화면 크기 업데이트
    };
    window.addEventListener('resize', handleResize); // resize 화면크기 에 따라 작업 수행
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsSmallScreen]);

  // 작은 화면에서는 각 날짜의 첫 번째 이벤트만 표시
  const filteredEvents = isSmallScreen
    ?
    events.filter(
      (event, index, self) =>
        self.findIndex((e) => e.date === event.date) === index
    )
    :
    events;

  // 날짜별 확장상태 필터링
  const smallScreenFilteredEvents = events.filter((event) => {
    if (isSmallScreen) {
      return (
        expandedDates[event.date] || // 확장된 날짜면 모든 이벤트 표시
        events.findIndex((e) => e.date === event.date) ===
        events.indexOf(event) // 아니면 첫 번째 이벤트만 표시
      );
    }
    return true; // 큰 화면에서는 모든 이벤트 표시
  });

  // 로고 클릭 핸들러
  const handleLogoClick = (date) => {
    // 이미 애니메이션이 진행 중이면 무시
    if (animatingDates[date]) return;

    // 기존 이벤트 흐림 처리
    setAnimatingDates((prev) => ({
      ...prev,
      [date]: true, // 애니메이션 시작
    }));

    // 애니메이션이 끝난 후에 확장 상태 변경
    setTimeout(() => {
      setExpandedDates((prev) => ({
        ...prev,
        [date]: !prev[date], // 클릭한 날짜의 확장 상태를 토글
      }));

      // 애니메이션 종료 후 기존 이벤트 밝기 복구
      setTimeout(() => {
        setAnimatingDates((prev) => ({
          ...prev,
          [date]: false, // 애니메이션 종료
        }));
      }, 500); // 애니메이션 시간과 맞춰야 함
    }, 500); // 0.5초 후에 실행
  };

  // 모달 초기화
  const resetModal = () => {
    setLogoUrl(''); // 로고
    setSelectedBank(''); // 선택된 은행 
    setProducts([]); // 은행별 적금명
    setSavingName(''); // 적금명
    setEndDate(''); // 만기일
    setAmount(''); // 금액
    setModalIsOpen(false); //모달 닫기
    setSelectedEventId(null); // 선택된 이벤트
  };

  // 날짜 클릭 시 모달 열기
  const handleDateClick = (info) => {
    //이벤트 개수 확인
    const selectedDateEventsCount = events.filter(
      (event) => event.date === info.dateStr
    ).length;

    //3개까지 허용
    if (selectedDateEventsCount >= 3) {
      openAlertModal('실패', '하루에 최대 3개의 상품만 추가할 수 있습니다!');
      return;
    }
    resetModal(); // 상태 초기화
    setSelectedDate(info.dateStr); // 클릭한 날짜 저장
    setModalIsOpen(true); // 모달 열기
    setSelectedEventId(null); // 선택된 이벤트 ID 초기화
  };

  // 은행 데이터 가져오기
  useEffect(() => {
    const fetchBanks = async () => {
      const response = await axiosInstanceAPI.get(`${API_URL}/banks`);
      const result = response.data.result; // ApiResponse에서 result 가져오기
      setBanks(result || []); // 결과 배열 설정 (없으면 빈 배열)
    };
    fetchBanks();
  }, []);

  // 이벤트 목록 가져오기
  const fetchEvents = async () => {
    const response = await axiosInstanceAPI.get(`${API_URL}/events`);

    // 데이터를 result 필드에서 추출
    const eventsFromServer = response.data.result;

    // 형식 반환
    const formattedEvents = eventsFromServer.map(event => ({
      id: event.id,
      title: `${event.installment_name} - ${event.amount.toLocaleString()}원`,
      date: event.start_date, // 이벤트의 시작 날짜
      extendedProps: {
        bank_logo: event.bank_logo,
        bank_name: event.bank_name,
        installment_name: event.installment_name,
        end_date: event.end_date,
        amount: event.amount,
        fixedStartDate: event.fixedStartDate, // 최초 시작일
      },
    }));
    setEvents(formattedEvents);
  };

  // 이벤트 저장
  const saveEvent = async () => {
    // 필수 입력 사항 확인
    if (!savingName || !amount || !selectedDate || !endDate || !logoUrl) {
      openAlertModal('작성 불가', '모든 정보를 입력해주세요!');
      return;
    }

    // 하루 최대 3개 이벤트 제한 확인
    const eventsForDate = events.filter((event) => event.date === selectedDate);
    if (eventsForDate.length >= 3) {
      openAlertModal('작성 불가', '하루에 최대 3개의 이벤트만 추가할 수 있습니다!');
      return;
    }

    const numericAmount = parseInt(amount.replace(/,/g, ''), 10); // 쉼표 제거 후 숫자로 변환
    const finalDate = new Date(endDate); // 종료 날짜 Date객체로
    const newEventData = []; // 백엔드로 전송할 데이터 리스트
    let currentDate = new Date(selectedDate); // 반복일정 시작날짜

    // 시작 날짜의 "일" 값 저장
    const fixedDay = currentDate.getDate();

    // Date객체를 문자열로 반환 (YYYY-MM-DD)
    function formatDateToLocalString(date) {
      const year = date.getFullYear(); // 연도
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
      const day = String(date.getDate()).padStart(2, '0'); // 일 한자리 숫자 0 추가
      return `${year}-${month}-${day}`;
    }

    // 반복 일정 데이터 생성
    while (currentDate <= finalDate) {
      newEventData.push({
        bank_name: logoUrl,
        installment_name: savingName,
        amount: numericAmount,
        start_date: formatDateToLocalString(currentDate),
        end_date: formatDateToLocalString(finalDate),
      });

      // 다음 달로 이동
      const nextMonth = currentDate.getMonth() + 1;
      const nextYear = currentDate.getFullYear();

      // 다음 달의 첫 날로 초기화
      currentDate = new Date(nextYear, nextMonth, 1);

      // 다음 달 말일 계산
      const lastDayOfNextMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();

      // 말일 처리
      if (fixedDay > lastDayOfNextMonth) {
        // 고정된 날짜가 말일보다 큰 경우, 말일로 설정
        currentDate.setDate(lastDayOfNextMonth);
      } else {
        // 고정된 날짜로 설정
        currentDate.setDate(fixedDay);
      }
    }
    // 모든 이벤트 백엔드로
    await axiosInstanceAPI.post(`${PATH.SERVER}/api/calendar/save`, newEventData);

    // 이벤트 목록을 다시 불러와 최신 상태로 반영
    await fetchEvents();
    resetModal();

    // 입력 필드 및 모달 초기화
    setModalIsOpen(false);
    setSavingName('');
    setAmount('');
    setLogoUrl('');
    setSelectedDate('');
    setEndDate('');
  };

  // 은행 선택 시 적금명 가져오기
  const handleBankChange = async (bankName) => {
    setSelectedBank(bankName); // 은행명 저장
    setLogoUrl(''); // 기존 로고 초기화

    // 적금명 목록 가져오기
    const response = await axiosInstanceAPI.get(`${API_URL}/banks/${bankName}/products`);
    console.log(response.data);
    setProducts(response.data.result || []);

    // 로고 업데이트
    const selectedBank = banks.find((bank) => bank.bankName === bankName);
    if (selectedBank) {
      setLogoUrl(selectedBank.bankLogo); // 은행 로고 업데이트
    } else {
      setLogoUrl('remainLogo.png'); // 기본 로고
    }
  }

  // 수정 기능
  const updateEvent = async () => {
    const numericAmount = parseInt(amount.replace(/,/g, ''), 10);
    const finalDate = new Date(endDate);
    const updatedEvents = [];
    let currentDate = new Date(selectedDate);

    const fixedDay = currentDate.getDate();

    function formatDateToLocalString(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    while (currentDate <= finalDate) {
      updatedEvents.push({
        bank_name: logoUrl,
        installment_name: savingName,
        amount: numericAmount,
        start_date: formatDateToLocalString(currentDate),
        end_date: formatDateToLocalString(finalDate),
      });

      const nextMonth = currentDate.getMonth() + 1;
      const nextYear = currentDate.getFullYear();

      currentDate = new Date(nextYear, nextMonth, 1);

      const lastDayOfNextMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();

      if (fixedDay > lastDayOfNextMonth) {
        currentDate.setDate(lastDayOfNextMonth);
      } else {
        currentDate.setDate(fixedDay);
      }
    }
    // 기존 그룹 데이터 삭제
    await axiosInstanceAPI.delete(`${PATH.SERVER}/api/calendar/delete/group/${selectedEventId}`);
    // 수정된 이벤트 서버에 저장
    await axiosInstanceAPI.post(`${PATH.SERVER}/api/calendar/save`, updatedEvents);
    // 최신 이벤트 데이터 가져오기
    await fetchEvents();
    resetModal();
  }

  // 삭제 기능
  const deleteEvent = async () => {
    await axiosInstanceAPI.delete(`${PATH.SERVER}/api/calendar/delete/group/${selectedEventId}`); // 그룹 삭제 호출
    await fetchEvents(); // 업데이트된 이벤트 목록 가져오기
    resetModal();
  }

  const handleEventClick = async (info) => {
    const { extendedProps } = info.event;

    const startDateToSet = extendedProps.fixedStartDate || info.event.startStr; // 기본값 설정

    setSelectedEventId(info.event.id); // 이벤트 ID 설정
    setSelectedDate(startDateToSet); // 고정된 시작일 설정
    setEndDate(extendedProps.end_date || ''); // 만기일 설정
    setAmount(extendedProps.amount ? extendedProps.amount.toString() : ''); // 금액 설정

    // 로고로 선택이벤트 확인
    const bankName = banks.find((bank) => bank.bankLogo === extendedProps.bank_name)?.bankName || '';
    setSelectedBank(bankName);

    // 은행 데이터에서 은행 로고 찾기
    const selectedBankData = banks.find((bank) => bank.bankName === bankName);
    if (selectedBankData) {
      setLogoUrl(selectedBankData.bankLogo); // 은행 로고 설정
    } else {
      setLogoUrl('remainLogo.png');
    }

    // 적금명 리스트 가져오기
    if (bankName) {
      const response = await axiosInstanceAPI.get(`${API_URL}/banks/${bankName}/products`);
      const productList = response.data.result || []; // 적금명 리스트 가져오기
      setProducts(productList); // 상태에 적금명 리스트 업데이트

      // 적금명이 응답 리스트에 존재하는 경우 상태 업데이트
      const matchedProduct = productList.find((product) => product === extendedProps.installment_name);
      if (matchedProduct) {
        setSavingName(matchedProduct); // 적금명 상태 업데이트
      } else {
        setSavingName(''); // 적금명을 찾지 못하면 기본값
      }
      setProducts([]);
      setSavingName('');
    }
    setModalIsOpen(true); // 모달 열기
  };

  // 이벤트 목록을 백엔드(API)에서 가져옵니다
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <main>
      <MyNav />
      <section>
        <AlertModal
          isOpen={isAlertOpen} closeModal={closeAlertModal} title={alertContent.title} message={alertContent.message}
        />
        <ConfirmModal
          isOpen={isConfirmOpen}
          closeModal={closeConfirmModal}
          title={confirmContent.title}
          message={confirmContent.message}
          onConfirm={confirmContent.onConfirm}
          onCancel={closeConfirmModal}
        />
        <div
          className={`${styles.calendar} ${modalIsOpen ? styles.calendarBlur : ''}`} // 흐림효과 추가
        >
          <FullCalendar
            ref={calendarRef}
            locale="ko" // 한글
            plugins={[dayGridPlugin, interactionPlugin]} // 월간보기, 날짜클릭
            initialView="dayGridMonth" // 초기화면 (월간보기)
            eventOrder="" // 이벤트 순서
            headerToolbar={{
              left: 'title',
              center: '',
              right: 'prev,today,next',
            }}
            buttonText={{
              today: '오늘',
              prev: '',
              next: '',
            }}
            titleFormat={{ year: 'numeric', month: 'long' }}
            events={isSmallScreen ? smallScreenFilteredEvents : filteredEvents} //이벤트목록
            contentHeight="auto" // 달력 주 고정된 높이
            dateClick={handleDateClick} // 날짜클릭
            eventClick={handleEventClick}
            dayCellClassNames={({ date }) => {
              const today = new Date(); //오늘날짜
              const isToday =
                date.getFullYear() === today.getFullYear() && // 일치여부
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate();
              if (isToday) return styles.today; // 오늘 날짜
              const day = date.getUTCDay();
              if (day === 6) return styles.sunday; // 일요일
              if (day === 5) return styles.saturday; // 토요일
            }}
            dayCellDidMount={(info) => {
              info.el.classList.add(styles.mycellstyle);
              if (info.isToday) {
                info.el.classList.add(styles.today); // 오늘 날짜
              }
            }}
            eventDidMount={(info) => {
              info.el.classList.add(styles.eventStyle); // 이벤트 스타일
            }}
            dayCellContent={({ date }) => {
              const day = date.getDate(); //날짜 가져오기
              const formattedDay = day < 10 ? `0${day}` : `${day}`; //한 자릿수면 앞에 0 추가
              return <span>{formattedDay}</span>; //날짜 표시
            }}
            datesSet={() => {
              const frames = document.querySelectorAll('.fc-daygrid-day-frame');
              frames.forEach((frame) => {
                frame.classList.add(styles.expandedPadding); // 각 셀 크기
              });

              const titleElement = document.querySelector('.fc-toolbar-title');
              if (titleElement) {
                titleElement.classList.add(styles.title); // 날짜타이틀 css
              }

              const tableElement = document.querySelector('.fc-scrollgrid');
              if (tableElement) {
                tableElement.classList.add(styles.noBorderTop); // 달력 윗선 제거
              }

              const prevButton = document.querySelector('.fc-prev-button'); //이전버튼
              const nextButton = document.querySelector('.fc-next-button'); //다음버튼

              const defaultIcons = document.querySelectorAll('.fc-icon'); //기본 icon요소
              defaultIcons.forEach((icon) => (icon.style.display = 'none')); //숨기기          

              //이전 버튼에 커스텀 아이콘 추가
              if (prevButton && !prevButton.querySelector('img')) {
                const prevImg = document.createElement('img');
                prevImg.src = leftArrowIcon;
                prevImg.alt = '이전';
                prevButton.className = styles.transparentButton;
                prevButton.appendChild(prevImg);
              }

              if (nextButton && !nextButton.querySelector('img')) {
                const nextImg = document.createElement('img');
                nextImg.src = rightArrowIcon;
                nextImg.alt = '다음';
                nextButton.className = styles.transparentButton;
                nextButton.appendChild(nextImg);
              }

              const todayButton = document.querySelector('.fc-today-button');
              if (todayButton) {
                todayButton.classList.add(styles.transparentButton); // 오늘버튼
              }
            }}
            eventContent={(eventInfo) => {
              const logoFileName = eventInfo.event.extendedProps.bank_name; // 파일명만 가져옴
              const logoUrl = `${PATH.STORAGE_BANK}/${logoFileName}`; // 경로 결합
              const date = eventInfo.event.startStr; // 이벤트 시작 날짜

              const eventsForDate = events.filter((event) => event.date === date); // 같은 날짜의 이벤트
              const isFirstEvent = eventsForDate.length > 0 && eventsForDate[0].title === eventInfo.event.title; // 첫번째 이벤트인지 확인
              const isExpanded = expandedDates[date]; // 확장(펼쳐짐) 되었는지 확인
              const isAnimating = animatingDates[date]; // 확장, 줄어듬 애니메이션

              // 길게 누르기 관련 변수
              let pressTimer;
              let isLongPress = false; // 길게 누른 상태인지 여부

              return (
                <div
                  className={`${styles.eventContainer}`}
                  style={{
                    opacity: isAnimating ? 0.5 : 1, // 애니메이션 동안 흐림 효과
                    transition: 'opacity 1s ease-in-out',
                  }}
                >
                  {logoFileName && (
                    <div
                      className={styles.logoWrapper}
                      // 길게 클릭 이벤트
                      onMouseDown={(e) => {
                        e.stopPropagation(); // 상위 클릭 이벤트 막기
                        isLongPress = false; // 초기화
                        pressTimer = setTimeout(() => {
                          isLongPress = true; // 길게 누른 상태로 전환
                          handleEventClick({ event: eventInfo.event }); // 길게 누르면 + / -
                        }, 1500); // 1.5초 이후에 길게 누르기로 인식
                      }}
                      onMouseUp={(e) => {
                        clearTimeout(pressTimer); // 길게 누르기 타이머 정리
                        if (!isLongPress) {
                          e.stopPropagation(); // 클릭 이벤트 전파 막기
                          handleLogoClick(date); // 클릭 시 모달
                        }
                      }}
                      onMouseLeave={(e) => {
                        clearTimeout(pressTimer); // 마우스를 벗어나면 타이머 취소
                      }}
                    >
                      <img
                        src={logoUrl} // 완전한 URL
                        alt="Bank Logo"
                        className={styles.eventLogo}
                        style={{
                          visibility: 'visible',
                          opacity: 1,
                          transition: 'opacity 1s ease-in-out',
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // 부모의 eventClick 이벤트 막기
                          handleEventClick({ event: eventInfo.event }); // 로고 클릭 시 모달 열기
                        }}
                      />
                      {isSmallScreen && isFirstEvent && (
                        <button
                          className={`${styles.expandButton} ${styles.hoverOnly}`}
                          onClick={(e) => {
                            e.stopPropagation(); // 부모의 eventClick 이벤트 막기
                            handleLogoClick(date); //이벤트 확장
                          }}
                        >
                          {isExpanded ? '－' : '＋'}
                        </button>
                      )}
                    </div>
                  )}
                  {(isExpanded || !isSmallScreen) && (
                    <div>
                      <div className={styles.eventTitleContainer}>
                        <div className={styles.eventTitle}>
                          {eventInfo.event.title.split(' - ')[0]}
                        </div>
                        <div className={styles.tooltip}>
                          {eventInfo.event.title.split(' - ')[0]}
                        </div>
                      </div>
                      <div className={styles.eventAmount}>
                        {eventInfo.event.title.split(' - ')[1]}
                      </div>
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>
      </section>

      {/* 모달 */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={resetModal}
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
      >
        {/* 로고 이미지 출력 */}
        {logoUrl && (
          <img
            src={`${PATH.STORAGE_BANK}/${logoUrl}`} // 로고 URL 설정
            alt="Bank Logo"
            className={styles.logoImage}
            onError={(e) => {
              e.target.src = `${PATH.STORAGE_BANK}/remainLogo.png`; // 기본 로고로 대체
            }}
          />
        )}
        <label className={styles.modalLabel}>은행</label>
        <select
          value={selectedBank}
          onChange={(e) => handleBankChange(e.target.value)}
          className={styles.modalSelect}
        >
        <option value="">은행 선택</option>
        {Array.isArray(banks) &&
          banks.map((bank) => (
            <option key={bank.bankName} value={bank.bankName}>
              {bank.bankName}
            </option>
          ))}
        </select>
        <label className={styles.modalLabel}>적금명</label>
        <select
          value={savingName}
          onChange={(e) => setSavingName(e.target.value)}
          className={styles.modalSelect}
        >
        <option value="">적금명 선택</option>
        {Array.isArray(products) &&
          products.map((product, index) => (
            <option key={index} value={product}>
              {product}
            </option>
          ))}
        </select>
        <label className={styles.modalLabel}>시작 날짜</label>
        <input
          type="date"
          value={selectedDate}
          disabled
          className={styles.modalInput}
        />
        <label className={styles.modalLabel}>만기일</label>
        <input
          type="date"
          value={endDate}
          min={selectedDate || undefined} // 시작일 이후로만 선택 가능
          onChange={(e) => setEndDate(e.target.value)}
          onInput={(e) => {
            const value = e.target.value;
            const parts = value.split('-'); // 날짜를 연도-월-일로 분리
            if (parts[0]?.length > 4) {
              parts[0] = parts[0].slice(0, 4); // 연도 부분을 4자리로 제한
              e.target.value = parts.join('-');
            }
          }}
          className={styles.modalInput}
        />
        <label className={styles.modalLabel}>금액</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.modalInput}
        />
        {selectedEventId ? (
          <>
            <div className={styles.buttonContainer}>
              <button
                onClick={() =>
                  openConfirmModal(
                    '수정 확인',
                    '이벤트를 수정하시겠습니까?',
                    async () => {
                      await updateEvent();
                      closeConfirmModal();
                      resetModal();
                    }
                  )
                }
                className={styles.updateButton}
              >
                수정
              </button>
              <button
                onClick={() =>
                  openConfirmModal(
                    '삭제 확인',
                    '정말로 삭제하시겠습니까?',
                    async () => {
                      await deleteEvent();
                      closeConfirmModal();
                      resetModal();
                    }
                  )
                }
                className={styles.deleteButton}
              >
                삭제
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={saveEvent}
            className={styles.modalButton}
          >
            저장
          </button>
        )}
      </Modal>
    </main>
  );
};

export default MyCalendarPage;