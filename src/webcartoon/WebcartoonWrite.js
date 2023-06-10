import { DatePicker } from "@mui/x-date-pickers";
import Frame from "../main/Frame";
import { Button, Input } from "@mui/material";

const ariaLabel = { 'aria-label': 'description' };

const WebcartoonWrite = () => {
  return (
      <Frame>
        <div id="accompany-main-write-img">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Bukchon_Hanok_Village_%EB%B6%81%EC%B4%8C_%ED%95%9C%EC%98%A5%EB%A7%88%EC%9D%84_October_1_2020_15.jpg/1280px-Bukchon_Hanok_Village_%EB%B6%81%EC%B4%8C_%ED%95%9C%EC%98%A5%EB%A7%88%EC%9D%84_October_1_2020_15.jpg" />
        </div>
        <div id="accompany-write-wrap">
          <ul id="accompany-write-area-ul">
            <li>서울</li>
            <li>강원도</li>
            <li>제주도</li>
            <li>부산</li>
            <li>경기도</li>
            <li>인천</li>
            <li>충청도</li>
            <li>경상도</li>
            <li>전라도</li>
          </ul>
          <div id="accompany-date-pick">
            <div>시작 날짜</div>
            <DatePicker />
            <div>종료 날짜</div>
            <DatePicker />
          </div>
          <div id="accompany-img">
            <img src="https://hanok.seoul.go.kr/images/sub/hanok_definition1.jpg" />
          </div>
          <div id="accompany-upload-btn">
            <Button variant="contained">IMG UPLOAD</Button>
          </div>
          <div id="accompany-title-write">
            <div>TITLE</div>
            <Input placeholder="Placeholder" inputProps={ariaLabel} />
          </div>
          <div id="accompany-content-write">
            <div>CONTENTS</div>
            <Input placeholder="Placeholder" inputProps={ariaLabel} />
          </div>
          <div id="accompany-write-btn">
            <Button variant="contained">WRITE</Button>
          </div>
        </div>
      </Frame>
  )
}
export default WebcartoonWrite;