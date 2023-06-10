import './KoreapriceEachItem.css';

const KoreapriceEachItem = (props) => {

  const item = props.item;
  const handlerSetNameAndPrice = props.handlerSetNameAndPrice;

  return (
    <div className="koreaprice-item-wrap">
      <div className="koreaprice-item-pic">
        <img src={item.img}
          onClick={() => handlerSetNameAndPrice(
            item.koreapriceProduct,
            item.koreapricePrice,
            item.koreapriceCapacity)} />
      </div>
      <div className="koreaprice-item-info">
        {item.koreapriceProduct}
      </div>
    </div>
  )
}
export default KoreapriceEachItem;