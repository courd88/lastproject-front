import './WebcartoonList.css';
import AddIcon from '@mui/icons-material/Add';


const WebcartoonList = (props) => {

  const arrWebcartoonList = [1, 2, 3, 4, 5];

  const categoryName = props.categoryName;
  //5개 정도 받아와서 인기순, 최신순으로 뿌려줌

  return (
    <>
      <div id="webcartoon-list-wrap">
        <div id="webcartoon-list-head">
          <div id="webcartoon-list-title">
            {categoryName}
          </div>
          <div id="webcartoon-list-more">
            <AddIcon />
          </div>
        </div>
        <div id="webcartoon-list-lists">
          {arrWebcartoonList.map((item, key) => {
            return (
              <div className="webcartoon-list-lists-wrap">
                <div className="webcartoon-lists-title">웹애니 글제목으로 남산에서 생긴 일{item}</div>
                <div className="webcartoon-lists-etc">
                  <div className='webcartoon-lists-nickname'>작성자닉네임</div>
                  <div className='webcartoon-lists-date'>2023.04.11</div>
                  <div className='webcartoon-lists-cnt'>조회수 {10 * item}</div>
                  <div className='webcartoon-lists-rcmd'>추천수 {20 * item}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div >

    </>
  )
}

export default WebcartoonList;