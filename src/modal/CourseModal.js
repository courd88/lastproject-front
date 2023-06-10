import { useEffect } from "react";
import './CourseModal.css';
import ClearIcon from '@mui/icons-material/Clear';

const CourseModal = (props) => {

    const modal = props.modal;
    const modalStateClose = props.modalStateClose;

    useEffect(() => {
        document.body.style.cssText = `
        
        overflow: hidden;
        touch-action: none;
        height: 100%;
        top: -${window.scrollY}px;
        width: 100%;`;
    }, []);
    // position: fixed;
    // top: -${window.scrollY}px;
    // overflow-y: scroll;
    // overflow: hidden;

    // const modalClose = () => {
    //     props.setModal(false);
    //     document.body.style.cssText = `
    //     position: static;`
    // }

    return (
        <>
            <div className="course-modal" onClick={modalStateClose}>
                <div className="course-modalBody" onClick={(e) => e.stopPropagation()}>
                    <ClearIcon id="course-modalCloseBtn" onClick={modalStateClose} />
                    {props.children}
                </div>
            </div>
        </>
    )
}
export default CourseModal;