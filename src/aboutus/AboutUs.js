import React, { useEffect, useRef } from 'react';
import './AboutUs.css';
import way from './img/way.gif'
import run from './img/run.gif'
import black from './img/black.jpg'
import gang from './img/gang.gif'
import bok from './img/bok.gif'
import { Link } from 'react-router-dom';

function AboutUs() {
    const sliderRef = useRef(null);
    const overflowRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const op = 1 - (window.pageYOffset / sliderRef.current.offsetHeight);
            sliderRef.current.style.opacity = op;
        };

        const handleResize = () => {
            overflowRef.current.style.top = sliderRef.current.offsetHeight + 'px';
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        handleScroll(); // 초기 렌더링 시에도 적용되도록 호출
        handleResize(); // 초기 렌더링 시에도 적용되도록 호출

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <Link to="/">
                <div className="pic" id="slider" ref={sliderRef}>
                    <img src="https://blog.kakaocdn.net/dn/BLiDh/btrGt2jM9dx/MsTAf6D49dQD0Bjlbollok/img.jpg" alt="Slider" style={{ width: '50%', height: '50%', opacity: 0.5, borderRadius: '30%' }} />
                    <div>인트로페이지를 한번 시도해 보았습니다<br />
                        우리조 이름이 진짜 가자 인가요?<br />
                        어딜 가죠?<br />
                        화양사거리쪽에 <a href="https://www.goodchoice.kr/product/detail?ano=69527" target="_blank">de gaja</a>라는 곳이 있긴 한데....
                    </div>
                </div>
                <div id="overflow" ref={overflowRef} >
                    <div class="container">
                        <img class="box" src={way} alt="Overflow" style={{ borderRadius: '20%' }} />
                        <div class="box1">이렇게 하면은</div>
                    </div>
                    <div class="container">
                        <img class="box3" src={run} alt="Overflow" style={{}} />
                        <div class="box2">어떻게 나올까요</div>
                    </div>
                    <img src={gang} alt="Overflow" style={{ borderRadius: '10%' }} />
                    <img src={black} alt="Overflow" style={{ width: 'auto', height: 'auto', borderRadius: '5%' }} />
                    <img src={bok} alt="Overflow" style={{ borderRadius: '15%' }} />
                </div>
            </Link>
        </>

    );
}

export default AboutUs;