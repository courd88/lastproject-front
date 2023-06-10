import { useEffect } from "react";
import './Modal.css';
import ClearIcon from '@mui/icons-material/Clear';

const Modal = (props) => {

    useEffect(() => {
        document.body.style.cssText = `
        
        top: -${window.scrollY}px;
        overflow-y: scroll;
        width: 100%;`;
    }, []);
    // position: fixed;

    const modalClose = () => {
        props.setModal(false);
    }

    return (
        <>
            <div className="modal" onClick={modalClose}>
                <div className="modalBody" onClick={(e) => e.stopPropagation()}>
                    <ClearIcon id="modalCloseBtn" onClick={modalClose}/>
                    {props.children}
                </div>
            </div>
        </>
    )
}
export default Modal;
