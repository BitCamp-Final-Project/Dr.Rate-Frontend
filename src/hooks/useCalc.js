import { useState, useEffect } from 'react';
import { atom, useAtom } from 'jotai';

// Jotai 상태 관리
const totalAtom = atom(0);
const spclAtom = atom(0);
const totalPrincipalAtom = atom(0);
const totalInterestAtom = atom(0);
const afterTaxInterestAtom = atom(0);
const totalAmountAtom = atom(0);

const useCalc = ({ basicRate, products, rateType, saveTime, max }) => {

  const [total, setTotal] = useAtom(totalAtom); // 총합계
  const [spcl, setSpcl] = useAtom(spclAtom); // 우대금리

  const [totalPrincipal, setTotalPrincipal] = useAtom(totalPrincipalAtom) // 원금
  const [totalInterest, setTotalInterest] = useAtom(totalInterestAtom); // 세전 이자
  const [afterTaxInterest, setAfterTaxInterest] = useAtom(afterTaxInterestAtom); //세후 이자
  const [totalAmount, setTotalAmount] = useAtom(totalAmountAtom); // 세후 수령액


  const [deposit, setDeposit] = useState(max === null ? 300000 : max); // 입력값
  const [rate, setRate] = useState(basicRate); // 이율
  

  const savemMonth = saveTime; // 기간(개월)
  const saveYear = saveTime / 12; // 년도 변환(12개월 -> 1년)
  const taxRate = 0.154; // 세율 (15.4%)

  let result = 0;

  let totalValue = 0; // 원금
  let interestValue = 0; // 세전 이자
  let afterTaxValue = 0; // 세후 이자

  /******* 적금 *******/
  /* 단리 계산 (적금) */
  const calculateSimpleInterestForSavings = (P, rate, saveYear, saveMonth) => {
    totalValue = P * saveMonth;

    for (let month = 1; month <= savemMonth; month++) {
      let remainingMonths = savemMonth - month + 1;
      interestValue += P * (rate * 0.01) * remainingMonths / 12;
    }

    afterTaxValue =  interestValue * taxRate;

    setTotalPrincipal(totalValue);
    setTotalInterest(interestValue);
    setAfterTaxInterest(afterTaxValue);
    setTotalAmount(totalValue + interestValue - afterTaxValue);
    
    return totalValue + interestValue - afterTaxValue;
  };

  /* 복리 계산 (적금) */
  const calculateCompoundInterestForSavings = (P, rate, saveYear, saveMonth) => {
    const monthlyRate = rate / 100 / 12;

    for (let month = 1; month <= saveMonth; month++) {
        const time = (savemMonth - month + 1) / 12;
        const interestForMonth = P * Math.pow(1 + monthlyRate, time * 12) - P;
        totalValue += P;
        interestValue += interestForMonth;
    }

    afterTaxValue = totalInterest * taxRate;

    setTotalPrincipal(totalValue);
    setTotalInterest(interestValue);
    setAfterTaxInterest(afterTaxValue);
    setTotalAmount(totalValue + interestValue - afterTaxValue);

    return totalValue + interestValue - afterTaxValue; 
  };

  /******* 예금 *******/
  /* 단리 계산 (예금) */
  const calculateSimpleInterestForDeposit = (P, rate, saveYear) => {
    const annualInterest = P * (rate * 0.01) * saveYear;
    afterTaxValue = annualInterest * taxRate;

    setTotalPrincipal(P);
    setTotalInterest(annualInterest);
    setAfterTaxInterest(afterTaxValue);
    setTotalAmount(P + annualInterest - afterTaxValue);

    return P + annualInterest - afterTaxValue;
  };

  /* 복리 계산 (예금) */
  const calculateCompoundInterestForDeposit = (P, rate, saveYear) => {
    const compoundInterest = P * Math.pow(1 + (rate * 0.01) / 12, 12 * saveYear);
    afterTaxValue = (compoundInterest - P) * taxRate;
    
    setTotalPrincipal(P);
    setTotalInterest(compoundInterest);
    setAfterTaxInterest(afterTaxValue);
    setTotalAmount(P + compoundInterest - afterTaxValue);

    return P + compoundInterest - afterTaxValue;
  };

  // 숫자 변형 #,###
  const formatNumber = (num) => Math.floor(num).toLocaleString();



  /* 이자 계산 함수 */
  const calculateInterest = () => {
    // 적금
    if (products.ctg === 'i') {
      if (rateType === 'M') {
        result = calculateCompoundInterestForSavings(deposit, rate, saveYear, savemMonth);
      } else if (rateType === 'S') {
        result = calculateSimpleInterestForSavings(deposit, rate, saveYear, savemMonth);
      }
    // 예금
    }else if (products.ctg === 'd') {
      if (rateType === 'M') {
        result = calculateCompoundInterestForDeposit(deposit, rate, saveYear);
      } else if (rateType === 'S') {
        result = calculateSimpleInterestForDeposit(deposit, rate, saveYear);
      }
    }
    setTotal(result);
  };


  // 월 적립 금액이나 금리가 바뀔 때마다 이자 재계산
  useEffect(() => {
    calculateInterest();
  }, [deposit, rate]);

  const onChangeRateTotal = (e) => {
    const value = parseFloat(e.target.value);

    /* 우대금리 변경 */
    if (e.target.checked) {
      setRate((prevR) => parseFloat((prevR + value).toFixed(2)));
      setSpcl(parseFloat((spcl + value).toFixed(2)));
    } else {
      setRate((prevR) => parseFloat((prevR - value).toFixed(2)));
      setSpcl(parseFloat((spcl - value).toFixed(2)));
    }
  };

  return {
    total,
    spcl,
    rate,
    totalPrincipal, 
    totalInterest, 
    afterTaxInterest, 
    totalAmount,
    deposit,
    setDeposit,
    formatNumber,
    calculateInterest,
    onChangeRateTotal,
  };
};

export default useCalc;