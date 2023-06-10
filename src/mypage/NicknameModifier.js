import { useState } from "react";
import Modal from "../modal/Modal";
import Input from '@mui/material/Input';
import Swal from "sweetalert2";
import axios from "axios";
import { Button } from "@mui/joy";
import styles from "./NicknameModifier.module.css";

const ariaLabel = { 'aria-label': 'description' };

const NicknameModifier = (props) => {

    const modal = props.modal2;
    const setModal = props.setModal2;
    const userNickname = props.userNickname;

    const { userId, header, jwtToken, nickName } = props;
    const [changeNickname, setChangeNickname] = useState('');
    const [isDuplicate, setIsDuplicate] = useState(true);



    const handlerChange = (e) => {
        setChangeNickname(e.target.value);
    }




    const handlerDuplicateCheck = () => {

        const params = {
            userNickname: changeNickname
        }

        axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/mypage/nickname`, { params: params, headers: header })
            .then((response) => {
                console.log(response);
                if (response.data == '') {
                    setIsDuplicate(false);
                } else {
                    setIsDuplicate(true);
                    alert('중복닉네임이 있습니다.')
                }

            })
            .catch((error) => {
                console.log(error);
            })

    }


    const handlerUpdateNickname = () => {

        Swal.fire({
            title: "닉네임 변경",
            text: "닉네임을 변경하시겠습니까?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '변경',
            cancelButtonText: '취소'
        })
            .then((result) => {
                if (result.isConfirmed) {

                    const data = {
                        userNickname: changeNickname,
                        userId: userId
                    }
                    axios.put(`http://${process.env.REACT_APP_JKS_IP}:8080/api/mypage/nickname`, data, { headers: header })
                        .then((response) => {
                            console.log(response)

                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: '성공적으로 변경되었습니다.',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            window.location.reload(); //새로고침
                        })
                        .catch((error) => {
                            console.log(error);
                            Swal.fire({
                                position: 'center',
                                icon: 'fali',
                                title: '닉네임 변경에 실패했습니다.',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        })
                }
            })
    }


    return (
        <Modal modal={modal} setModal={setModal}>
            <p className={styles.head}>닉네임 변경</p>
            <div className={styles.Nickname}>{userNickname}</div>
            <div className={styles.nicknameInputs}>
                <Input className={styles.changeNicknameInput}
                    placeholder="변경할 닉네임"
                    inputProps={ariaLabel}
                    value={changeNickname}
                    onChange={handlerChange} />
                <div className={styles.duplicateCheckbtn}>
                    <Button  id="duplicateCheck" type='button' variant="contained" onClick={handlerDuplicateCheck}>중복확인</Button>
                </div>
                <div className={styles.nicknameChangebtn}>
                <Button  id="nicknameChangeBtn" type='button' variant="contained" onClick={handlerUpdateNickname} disabled={isDuplicate}>닉네임변경</Button>
                </div>
            </div>
        </Modal>
    )
};
export default NicknameModifier;