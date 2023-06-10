import { Link, useNavigate } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import "./SubMenu.css";
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useEffect, useState } from "react";
import MobileMainMenu from "./MobileMainMenu";
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from "sweetalert2";
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import axios from "axios";
import i18n from "i18next";
import { useTranslation } from 'react-i18next';
import BuildIcon from '@mui/icons-material/Build';

const SubMenu = (props) => {

    const { t } = useTranslation();

    let userId = null;
    let jwtToken = null;
    if (sessionStorage.getItem('token') != null) {
        jwtToken = sessionStorage.getItem('token');
        userId = jwt_decode(jwtToken).sub;
    }

    const header = {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
    };

    const [userNickname, setUserNickname] = useState('');

    const navigate = useNavigate();

    const [state, setState] = useState({
        left: false
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    //
    useEffect(() => {

        if(userId==null){
            return
        }

        const params = {
            userId: userId
        }

        axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/submenu/nickname`, { params: params, headers: header })
            .then((response) => {
                console.log(response);
                setUserNickname(response.data);
            })
            .catch((error) => {
                console.log(error);
                setUserNickname(null);
            })
    }, [userNickname])



    //[로그아웃 핸들러]
    const handlerLogout = () => {
        Swal.fire({
            title: "로그아웃",
            text: "로그아웃 하시겠습니까?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        })
            .then((result) => {
                if (result.isConfirmed) {
                    sessionStorage.clear();
                    navigate("/");
                    window.location.replace("/");
                }
            })
    }

    const handlerMobileMypage = () => {
        navigate("/mobilemypage");
    }

    const handlerMypage = () => {
        navigate("/mypage");
    }

    const handlerAdminpage = () => {
        navigate("/admin");
    }

    const handlerLoginpage = () => {
        navigate("/login");
    }


    return (
        <>
            <div className="submenu-box">
                <div className="mobile-submenu">
                    <MenuIcon onClick={toggleDrawer('left', true)} />
                    <Drawer
                        anchor='left'
                        open={state.left}
                        onClose={toggleDrawer('left', false)}
                    >
                        <MobileMainMenu />
                    </Drawer>
                </div>
                <Link to="/">
                    <img id="submenu-logo" src={process.env.PUBLIC_URL + '/KADA.png'} />
                </Link>
                <div className="mobile-submenu">

                    {userNickname == '' ?
                        <AccountCircleRoundedIcon onClick={handlerLoginpage} />
                        :
                        <AccountCircleRoundedIcon onClick={handlerMobileMypage} />
                    }
                </div>
                <span id="blank-submenu"></span>
                <ul id="submenu-ul">
                    <Link to="/noticelist" ><li className="submenu-li">{t('page:notice')}</li></Link>
                    <Link to="/qnalist"><li className="submenu-li">{t('page:help')}</li></Link>
                    {
                        userNickname == '' ?
                            <>
                                <Link to="/regist">
                                    <li className="submenu-li">{t('page:regist')}</li>
                                </Link>
                                <Link to="/login">
                                    <li className="submenu-li">{t('page:login')}</li>
                                </Link>
                            </>
                            :
                            <>
                                {   userId == "admin"  ? <p onClick={handlerAdminpage}><BuildIcon/></p>
                                    :
                                <p onClick={handlerMypage}><AccountCircleRoundedIcon />{userNickname}</p>
                                }
                                <LogoutIcon id="logout-icon" onClick={handlerLogout} />
                            </>
                    }
                </ul>
            </div>
        </>
    )
}

export default SubMenu;
