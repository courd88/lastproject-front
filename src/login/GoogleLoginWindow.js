import Modal from "../modal/Modal";
import GoogleLoginButton from "./GoogleLoginButton";
import './GoogleLoginWindow.css';

const GoogleLoginWindow = (props) => {

    const setModal = props.setGoogleLoginModal;

    return (
        <Modal setModal={setModal}>
            <div id="google-modal-wrap">
                <div id="title">
                    <h2>GooGle Login</h2>
                </div>
                <GoogleLoginButton />
            </div>
        </Modal>
    )
}
export default GoogleLoginWindow;