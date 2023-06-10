import './Webcartoon.css';
import Frame from "../main/Frame";
import WebcartoonList from "./WebcartoonList";
import upperimg from './img/upperimg.jpg';
import Button from '@mui/material/Button';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const Webcartoon = () => {

  return (
    <Frame>
      <div id="webcartoon-main-upperimg">
        <img src={upperimg} />
      </div>
      <div id="webcartoon-main-wrap">
        <div id="webcartoon-main-title">WEB CARTOON</div>
        <div id="webcartoon-main-list-write">
          <Link to="/webcartoon/write">
            <Button variant="contained">WRITE</Button>
          </Link>
        </div>
        <div id="webcartoon-main-list">
          <div id="webcartoon-main-list-img">
            <img src="https://cdn.dtnews24.com/news/photo/201708/112647_431341.jpg"></img>
          </div>
          <div id="webcartoon-main-list-lists">
            <WebcartoonList categoryName="인기" />
            <WebcartoonList categoryName="최신" />
          </div>
        </div>
      </div>


    </Frame>
  )
}

export default Webcartoon;