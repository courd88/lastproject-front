import React from "react";
import './TriedCategory.css';

const TriedCategory = ({ triedCategoryIdx, setTriedCategoryIdx, order, setOrder, year, setYear }) => {

    const handleClick = (triedCategoryIdx) => {
        setTriedCategoryIdx(triedCategoryIdx);
    }

    return (
        <div className="triedCategory">
            <div className="category-idx">
                <button
                    className={triedCategoryIdx === 1 ? "active" : ""}
                    onClick={() => handleClick(1)}> 음식
                </button>
                <button
                    className={triedCategoryIdx === 2 ? "active" : ""}
                    onClick={() => handleClick(2)}> 장소
                </button>
                <button
                    className={triedCategoryIdx === 3 ? "active" : ""}
                    onClick={() => handleClick(3)}> 문화
                </button>
            </div>
            <div className="category-order-year">
                <div className="category-order">
                    <select value={order}
                        onChange={(e) => setOrder(e.target.value)}>
                        <option value="recent">최신순</option>
                        <option value="rcmd">추천순</option>
                        <option value="count">조회순</option>
                    </select>
                </div>
                <div className="category-year">
                    <select type="number" value={year}
                        onChange={(e) => setYear(e.target.value)} >
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                    </select>
                </div>
            </div>
        </div >
    );
};

export default TriedCategory;