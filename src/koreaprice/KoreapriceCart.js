import { useState } from "react";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

const KoreapriceCart = (props) => {

  //koreaprice->상태변수 전달.
  const { nameAndPrice } = props;
  const { setNameAndPrice } = props;
  const { sum } = props;
  const { setSum } = props;

  const [count, setCount] = useState(0);

  //해당 품목 카운트 + 1
  const plusOne = (cnt, index) => {
    let 복사본 = [...nameAndPrice];
    console.log(복사본);
    console.log(cnt);
    console.log(index);
    복사본[index].count = cnt + 1;
    setNameAndPrice(복사본);
  };

  //해당 품목 카운트 - 1
  const minusOne = (cnt, index) => {
    let 복사본 = [...nameAndPrice];
    console.log(복사본);
    console.log(cnt);
    console.log(index);
    if (cnt == 0) {
    } else {
      복사본[index].count = cnt - 1;
      setNameAndPrice(복사본);
    }
  };

  // List에서 삭제 
  const clickDelete = (index) => {
    const 복사본 = nameAndPrice.filter((_, i) => i !== index);
    if (복사본.length === 0) {
      setNameAndPrice([{ price: 0 }]); // 배열이 비어있는 경우 빈 배열로 업데이트
    } else {
      setNameAndPrice(복사본);
    }
  };

  const [priceTotal, setPriceTotal] = useState(0);

  let tempSum = 0;
  tempSum = nameAndPrice.reduce((accumulator, nap) => {
    return accumulator + nap.price * nap.count;
  }, 0)
  setSum(tempSum);

  function 소수점표시(숫자) {
    return 숫자.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <>
      <div id="koreaprice-cart">
        <div id="koreaprice-cart-coltitle">
          <span className='koreaprice-cart-coltitle-1'>상품명</span>
          <span className='koreaprice-cart-coltitle-2'>수량</span>
          <span className='koreaprice-cart-coltitle-3'>단위</span>
          <span className='koreaprice-cart-coltitle-3'>단가</span>
          <span className='koreaprice-cart-coltitle-4'>금액</span>
        </div>

        <div className='koreaprice-cart-col-products-wrap'>
          {nameAndPrice[0].price != 0 ? <>
            {
              nameAndPrice.map((nameAndPrice, index) => (
                <div className='koreaprice-cart-col-products'>
                  <span className='koreaprice-cart-1'>{nameAndPrice.name}</span>
                  <span className='koreaprice-cart-2'>{nameAndPrice.count}</span>
                  <AddIcon onClick={() => plusOne(nameAndPrice.count, index)} />
                  <RemoveIcon onClick={() => minusOne(nameAndPrice.count, index)} />
                  <span className='koreaprice-cart-3'>{nameAndPrice.capacity}</span>
                  <span className='koreaprice-cart-4'>{소수점표시(nameAndPrice.price)}</span>
                  <span className='koreaprice-cart-5'>{소수점표시(nameAndPrice.price * nameAndPrice.count)}</span>
                  <span className='koreaprice-cart-6'>
                    <DisabledByDefaultIcon onClick={() => clickDelete(index)} />
                  </span>
                </div>
              ))
            }
          </>
            : (
              "")}
        </div>

      </div>
      <div id="koreaprice-cart-mobile">
        <div id="koreaprice-cart-coltitle">
          <span className='koreaprice-cart-coltitle-1'>상품명</span>
          <span className='koreaprice-cart-coltitle-2'>수량</span>
          <span className='koreaprice-cart-coltitle-3'>단위</span>
          <span className='koreaprice-cart-coltitle-3'>단가</span>
          <span className='koreaprice-cart-coltitle-4'>금액</span>
        </div>

        <div className='koreaprice-cart-col-products-wrap'>
          {nameAndPrice[0].price != 0 ? (<>
            {nameAndPrice.map((nameAndPrice, index) => (
              <div className='koreaprice-cart-col-products'>
                <span className='koreaprice-cart-1'>{nameAndPrice.name}</span>
                <span className='koreaprice-cart-2'>{nameAndPrice.count}</span>
                <AddIcon onClick={() => plusOne(nameAndPrice.count, index)} />
                <RemoveIcon onClick={() => minusOne(nameAndPrice.count, index)} />
                <span className='koreaprice-cart-3'>{nameAndPrice.capacity}</span>
                <span className='koreaprice-cart-4'>{소수점표시(nameAndPrice.price)}</span>
                <span className='koreaprice-cart-5'>{소수점표시(nameAndPrice.price * nameAndPrice.count)}</span>
                <span className='koreaprice-cart-6'>
                  <DisabledByDefaultIcon onClick={() => clickDelete(index)} />
                </span>
              </div>
            ))}
          </>
          ) : (
            "")}
        </div>

      </div>

    </>
  )
}
export default KoreapriceCart;