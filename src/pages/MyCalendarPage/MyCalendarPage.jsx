//Jotai 및 관련 라이브러리 import
import React, { useRef, useEffect, useState } from 'react';
import { atom, useAtom } from 'jotai';
import FullCalendar from '@fullcalendar/react'; // React용 FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; // 월간 보기
import interactionPlugin from '@fullcalendar/interaction'; // 날짜 클릭
import Modal from 'react-modal'; // 모달
import axios from 'axios';

import MyNav from 'src/components/MyNav'; //MyNav
import AlertModal from 'src/components/Modal/AlertModal/AlertModal'; //AlertModal
import ConfirmModal from 'src/components/Modal/ConfirmModal/ConfirmModal';
import useModal from 'src/hooks/useModal'; //useModal 훅 추가

import { PATH } from "src/utils/path"; //경로
import leftArrowIcon from 'src/assets/icons/leftArrow.svg'; //icon
import rightArrowIcon from 'src/assets/icons/rightArrow.svg';

import styles from './MyCalendarPage.module.scss';

const API_URL = 'http://localhost:8080/api/calendar'; //백 서버

// Jotai 상태 관리
const eventsAtom = atom([]); // 이벤트 목록 저장
const modalIsOpenAtom = atom(false); // 모달 열림 상태
const selectedDateAtom = atom(''); // 선택된 날짜 저장
const savingNameAtom = atom(''); // 상품 이름 저장
const amountAtom = atom(''); // 금액 저장
const logoUrlAtom = atom(''); // 로고 URL 저장
const endDateAtom = atom(''); // 만기일 저장
const isSmallScreenAtom = atom(window.innerWidth <= 1000); //화면 크기 변경 시 상태 업데이트
const expandedDatesAtom = atom({}); // 특정 날짜의 이벤트가 펼쳐졌는지 관리

// 은행 로고 URL 매핑
const bankLogos = {
  국민은행: "kookminLogo.png",
  신한은행: "shinhanLogo.png",
  하나은행: "hanaLogo.png",
  우리은행: "wooriLogo.png",
  카카오뱅크: "kakaoLogo.png",
  농협은행: "nonghyupLogo.png",
  토스뱅크: "tossLogo.png",
  전북은행: "jeonbukLogo.png",
  기업은행: "ibkLogo.png",
  부산은행: "bnkLogo.png",
  대구은행: "imbankLogo.png",
};

// 모달 초기 설정
Modal.setAppElement('#root');

const MyCalendarPage = () => {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom); // 선택날짜저장
  const [modalIsOpen, setModalIsOpen] = useAtom(modalIsOpenAtom); // 모달열림
  const [savingName, setSavingName] = useAtom(savingNameAtom); // 적금명
  const [logoUrl, setLogoUrl] = useAtom(logoUrlAtom); // 은행로고URL
  const [logoFileName, setLogoFileName] = useState('remainLogo.png'); // 로고 파일명 저장
  const [endDate, setEndDate] = useAtom(endDateAtom); // 만기일
  const [amount, setAmount] = useAtom(amountAtom); // 금액
  const [events, setEvents] = useAtom(eventsAtom); // 이벤트목록
  const [isSmallScreen, setIsSmallScreen] = useAtom(isSmallScreenAtom); // 화면크기
  const [expandedDates, setExpandedDates] = useAtom(expandedDatesAtom); // + , - 버튼 
  const [animatingDates, setAnimatingDates] = useState({}); //애니메이션 효과
  const [selectedEventId, setSelectedEventId] = useState(null); // 이벤트ID 저장
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // ConfirmModal 열림 상태
  const [confirmContent, setConfirmContent] = useState({}); // ConfirmModal의 제목, 메시지, onConfirm 함수

  const openConfirmModal = (title, message, onConfirm) => {
    setConfirmContent({ title, message, onConfirm });
    setIsConfirmOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmOpen(false);
  };

  const calendarRef = useRef(null); // 캘린더 참조

  //useModal 훅
  const { isAlertOpen, openAlertModal, closeAlertModal, alertContent } = useModal();

  // 오늘 날짜로 이동
  const goToToday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
  };

  // 화면크기 상태 (반응형)
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1000); // 화면 크기 변경 시 상태 업데이트
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
    : // 큰 화면에서는 모든 이벤트 표시
    events;

  // 이벤트 필터링 로직
  const smallScreenFilteredEvents = events.filter((event) => {
    if (isSmallScreen) {
      return (
        expandedDates[event.date] || // 확장된 날짜면 모든 이벤트 표시
        events.findIndex((e) => e.date === event.date) ===
        events.indexOf(event) // 아니면 첫 번째 이벤트만 표시
      );
    }
    return true; // 전체 화면에서는 모든 이벤트 표시
  });

  // 로고 클릭 핸들러
  const handleLogoClick = (date) => {
    // 이미 애니메이션이 진행 중이면 새로운 클릭을 막습니다.
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
    setEndDate('');
    setSavingName('');
    setAmount('');
    setLogoUrl('');
    setLogoFileName('remainLogo.png');
    setSelectedEventId(null);
    setModalIsOpen(false);
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
    setSelectedDate(info.dateStr);
    resetModal();
    setModalIsOpen(true);
    setSelectedEventId(null); // 선택된 이벤트 ID 초기화
  };

  //서버에서 이벤트 데이터를 가져오는 함수
  const fetchEvents = async () => {
    const response = await axios.get(`${API_URL}/events`);
    const formattedEvents = response.data.map(event => ({
      id: event.id, // 이벤트 ID 추가
      title: `${event.installment_name} - ${event.amount.toLocaleString()}원`,
      date: event.start_date,
      extendedProps: {
        bank_name: event.bank_name,
        end_date: event.end_date,
        installment_name: event.installment_name,
        amount: event.amount,
        logoUrl: bankLogos[event.bank_name] || 'remainLogo.png', // 로고 URL 매핑
      },
    }));
    setEvents(formattedEvents);
  };

  // 이벤트 저장
  const saveEvent = async () => {
    // 모든 정보가 입력되지 않은 경우 경고창 띄우기
    if (!savingName || !amount || !selectedDate || !endDate || !logoUrl) {
      openAlertModal('작성 불가', '모든 정보를 입력해주세요!');
      return; // 중단
    }

    const eventsForDate = events.filter((event) => event.date === selectedDate);
    if (eventsForDate.length >= 3) {
      openAlertModal('작성 불가', '하루에 최대 3개의 이벤트만 추가할 수 있습니다!');
      return;
    }

    const startDate = new Date(selectedDate);
    const finalDate = new Date(endDate);

    const numericAmount = parseInt(amount.replace(/,/g, ''), 10); // 쉼표 제거 후 숫자로 변환
    const formattedAmount = numericAmount.toLocaleString(); // 쉼표 추가

    const newEvents = []; // 새로운 이벤트 리스트
    while (startDate <= finalDate) {
      newEvents.push({
        title: `${savingName} - ${formattedAmount}원`,
        date: startDate.toISOString().split('T')[0],
        extendedProps: {
          logoUrl: logoFileName || 'remainLogo.png', // 파일명만 저장
          amount: numericAmount, // 금액
        },
      });

      // 매월 같은 날짜 반복
      const currentDay = startDate.getDate();
      startDate.setMonth(startDate.getMonth() + 1);
      if (startDate.getDate() !== currentDay) {
        startDate.setDate(0); // 말일로 설정
      }
    }

    // 백엔드에 데이터 저장 (POST 요청)
    await axios.post(`${API_URL}/save`, {
      cal_user_id: 1, // 임시 사용자 ID
      installment_name: savingName,
      bank_name: logoUrl,
      amount: parseInt(amount, 10),
      start_date: selectedDate,
      end_date: endDate,
    });

    // 이벤트 목록을 다시 불러와 최신 상태로 반영
    await fetchEvents(); // 이벤트 저장 후 최신 데이터 불러오기

    // 입력 필드 및 모달 초기화
    setModalIsOpen(false); // 창닫기
    setSavingName(''); // 적금명
    setAmount(''); // 금액
    setLogoUrl(''); // 은행명
    setLogoFileName('remainLogo.png'); // 기본 로고 이미지 리셋
    setSelectedDate('');
    setEndDate('');
  };

  // 수정 기능
  const updateEvent = async () => {
    const payload = {
      installment_name: savingName,
      bank_name: logoUrl,
      amount: parseInt(amount.replace(/,/g, ''), 10),
      start_date: selectedDate,
      end_date: endDate,
    };
    await axios.put(`${API_URL}/update/${selectedEventId}`, payload);
    await fetchEvents();
    resetModal();
  };

  // 삭제 기능
  const deleteEvent = async () => {
    await axios.delete(`${API_URL}/delete/${selectedEventId}`);
    await fetchEvents();
    resetModal();
  };

  const handleEventClick = (info) => {
    const { extendedProps } = info.event;

    setSelectedEventId(info.event.id); // 이벤트 ID 설정
    setSelectedDate(info.event.startStr);
    setEndDate(extendedProps.end_date || ''); // 만기일 가져오기
    setSavingName(extendedProps.installment_name || ''); // 적금명 가져오기
    setAmount(extendedProps.amount ? extendedProps.amount.toString() : ''); // 금액 가져오기
    setLogoUrl(extendedProps.bank_name || ''); // 은행명 가져오기
    setLogoFileName(extendedProps.logoUrl || 'remainLogo.png'); // 로고 파일명 설정
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
              const logoFileName = eventInfo.event.extendedProps.logoUrl; // 파일명만 가져옴
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
        onRequestClose={() => {
          setModalIsOpen(false);
          resetModal();
        }}
        className={styles.modalContent} // 모달 스타일
        overlayClassName={styles.modalOverlay} // 배경
      >
        {/* 로고 이미지 출력 */}
        {logoFileName && (
          <img
            src={`${PATH.STORAGE_BANK}/${logoFileName}`}
            alt="Bank Logo"
            className={styles.logoImage}
          />
        )}
        <label className={styles.modalLabel}>은행</label>
        <input
          type="text"
          value={logoUrl}
          onChange={(e) => {
            const inputValue = e.target.value.trim(); // 입력값에서 공백 제거
            setLogoUrl(inputValue); // 사용자가 입력한 은행명을 저장

            // 은행명과 일치하는 항목을 찾는다
            const matchedBank = Object.entries(bankLogos).find(([bankName, logo]) =>
              bankName.includes(inputValue) // 일부분 일치 검사
            );

            // 매칭이 없으면 기본 로고로
            const logoFileName = matchedBank ? matchedBank[1] : 'remainLogo.png';
            setLogoFileName(logoFileName); // 파일명만 저장
          }}
          className={styles.modalInput}
        />

        <label className={styles.modalLabel}>적금명</label>
        <input
          type="text"
          value={savingName}
          onChange={(e) => setSavingName(e.target.value)}
          className={styles.modalInput}
        />

        <label className={styles.modalLabel}>시작 날짜</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={styles.modalInput}
        />
        <label className={styles.modalLabel}>만기일</label>
        <input
          type="date"
          value={endDate}
          min={selectedDate || undefined} // 시작일 이후로만 선택 가능
          onChange={(e) => setEndDate(e.target.value)}
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

