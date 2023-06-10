import { Input } from "@mui/material";
import Frame from "../main/Frame";
import styles from "./QnaWrite.module.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/joy";
import jwt_decode from 'jwt-decode';

const QnaWrite = () => {

    let nickName = null;
    let userId = null;
    let jwtToken = null;
    if (sessionStorage.getItem('token') != null) {
        jwtToken = sessionStorage.getItem('token');
        userId = jwt_decode(jwtToken).sub;
        nickName = jwt_decode(jwtToken).nickname;
    }

    const header = {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
    };

    useEffect(()=>{
        if (userId == null){
            alert('로그인 후 사용하실 수 있습니다.');
            navigate('/qnalist');
        }
    },[])


    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleSubmit = (e) => {

        e.preventDefault();
        axios.post(`http://${process.env.REACT_APP_JYS_IP}:8080/api/qna/write`,
            { "qnaTitle": title, "qnaContent": content, "userId": userId }, {haeders : header}
        )
            .then(response => {
                console.log(response)
                alert("정상처리 되었습니다");
                navigate('/qnalist')
            })
            .catch(error => {
                console.log(error);
                alert(error.message);
            })

    };

    return (
        <Frame>
            <div className={styles.contentsWrap}>
                <h2 className={styles.qnaTitle}>QNA 문의하기</h2>
                <h3 className={styles.subTitle}>문의 제목</h3>
                <Input placeholder="제목을 적어주세요" id="qnatitle" name="title" value={title} onChange={handleChangeTitle}  style={{ border: "none", borderBottom: "1px solid #5E8FCA", borderRadius: 0, width: "60%" }} />
                <h3 className={styles.subTitle}>문의 내용</h3>
                <div className={styles.editor}>
                    <CKEditor
                        editor={ClassicEditor}
                        data="</br></br></br></br></br></br></br></br></br></br></br></br>"
                        onReady={editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log('Editor is ready to use!', editor);
                        }}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            console.log({ event, editor, data });
                            setContent(data);
                        }}

                    />
                </div>
                <Button onClick={handleSubmit} type="submit">등록하기</Button>
            </div>
        </Frame>
    )
}

export default QnaWrite;