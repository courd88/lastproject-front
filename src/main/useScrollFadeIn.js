import { useRef, useEffect, useCallback } from 'react';

// 스크롤하면 페이드인 하는 애니메이션
// useScrollFadeIn 이라는 커스텀훅 선언(스크롤에 따라 페이드인 애니메이션을 적용할 로직(directio,duration,delay 라는 세가지 매개변수를 받으며 기본값은 up,1,0))
const useScrollFadeIn = (direction = 'up', duration = 1, delay = 0) => {

  // 해당 컴포넌트 가져오기(애니메이션을 적용할 DOM요소를 참조하기 귀해 사용)
  const dom = useRef();

  // direction(방향) 선택 (방향, 지속시간, 지연시간)
  // direction값을 기반으로 요소의 이동방향을 설정하는 역활
  // name 매개변수에 따른 translate3d 값을 반환
  const handleDirection = (name) => {
    switch (name) {
      case 'up':
        return 'translate3d(0, 50%, 0)';
      case 'down':
        return 'translate3d(0, -50%, 0)';
      case 'left':
        return 'translate3d(50%, 0, 0)';
      case 'right':
        return 'translate3d(-50%, 0, 0)';
      default:
        return;
    };
  };

  // 설정해둔 컴포넌트를 만날때마다 함수가 재실행되도록 callback하기
  // handleScroll 함수는 Intersection Observer 콜백으로 요소의 가시성 여부에 따라 애니메이션을 적용 
  // entry와 observer 매개변수를 받고, current를 통해 현재 요소를 참조
  //요소가 보이는 상태인 경우 애니메이션 효과를 적용하기 위해 스타일을 변경하고 observer.unobserve(current)를 호출하여 관찰을 멈춤
  const handleScroll = useCallback(
    ([entry], observer) => {
      const { current } = dom;
      if (entry.isIntersecting) {
        current.style.transitionProperty = 'all';
        current.style.transitionDuration = `${duration}s`;
        current.style.transitionTimingFunction = 'cubic-bezier(0, 0, 0.2, 1)';
        current.style.transitionDelay = `${delay}s`;
        current.style.opacity = 1;
        current.style.transform = 'translate3d(0, 0, 0)';
        //반복작동되도록
        observer.unobserve(current);
      };
    },
    [delay, duration],
  );

  // intersection-observer로 컴포넌트 위치 observe하기
  // useEffect의 반환 함수에서 observer가 존재하면 관찰을 disconnect(멈춤)
  // 컨포넌트가 언마운트 될 때 관찰을 중지하기 위한 작업
  useEffect(() => {
    let observer;
    // const { current } = dom;

    if (dom.current) {
      observer = new IntersectionObserver(handleScroll, { threshold: 0.12 });
      observer.observe(dom.current);
    }

    return () => observer && observer.disconnect();
  }, [handleScroll]);

  // useScrollFadeIn 훅의 반환 값은 객체 형태로 구성
  // ref 속성은 애니메이션을 적용할 DOM 요소를 참조하기 위한 값으로 dom을 할당
  // style 속성은 초기 스타일을 설정하는 객체로, opacity는 0으로 설정
  // transform은 handleDirection 함수를 통해 결정된 값을 가짐
  return {
    ref: dom,
    style: {
      opacity: 0,
      transform: handleDirection(direction),
    }
  };
};

export default useScrollFadeIn;