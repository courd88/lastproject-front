import styles from './Modal.module.css';
import { useEffect, useRef } from 'react';

function Modal( props ) {
    // 모달 끄기 
    const closeModal = () => {
        props.setModalOpen(false);
    };
    // 모달 외부 클릭시 끄기 처리
    // Modal 창을 useRef로 취득
    const modalRef = useRef < HTMLDivElement > (null);

    useEffect(() => {
        // 이벤트 핸들러 함수
        const handler = () => {
            // mousedown 이벤트가 발생한 영역이 모달창이 아닐 때, 모달창 제거 처리
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setModalOpen(false);
            }
        };

        // 이벤트 핸들러 등록
        document.addEventListener('mousedown', handler);
        // document.addEventListener('touchstart', handler); // 모바일 대응

        return () => {
            // 이벤트 핸들러 해제
            document.removeEventListener('mousedown', handler);
            // document.removeEventListener('touchstart', handler); // 모바일 대응
        };
    });

    return (

        <>
            {/* 모달창을 useRef로 잡아준다. */}
            <div ref={modalRef} className={styles.container}>
                <button className={styles.close} onClick={closeModal}>
                    X
                </button>
                <p>모달창입니다.</p>
            </div>
        </>
    )
}

export default Modal;