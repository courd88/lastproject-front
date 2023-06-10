import './CourseWrite.css';
import React, { useState } from "react";
import { Chip, Input } from "@mui/material";
import CourseDay from './CourseDay';



function CourseWrite(props) {

    const choiceDay = props.choiceDay;
    const arrCourseDay = props.arrCourseDay;
    const 코스소개작성 = props.코스소개작성;
    const 데이선택핸들러 = props.데이선택핸들러;
    const 장소삭제 = props.장소삭제;
    const 일정삭제 = props.일정삭제;
    const 일정올리기 = props.일정올리기;
    const 일정내리기 = props.일정내리기;
    



    return (
        <>
            {arrCourseDay &&
                arrCourseDay.map(day => (

                    choiceDay === day.day? 
                    <div className="course-date-pick-wrap-choice"> 
                        {/* map으로 CourseDay뿌려줌 */}
                            <CourseDay
                                key={day.day}
                                arrCourseDay={arrCourseDay}
                                day={day.day}
                                dayinfo={day.dayinfo}
                                dayDescription={day.dayDescription}

                                choiceDay={choiceDay}
                                코스소개작성={코스소개작성}
                                데이선택핸들러={데이선택핸들러} 
                                장소삭제={장소삭제}
                                일정삭제={일정삭제}
                                일정올리기={일정올리기}
                                일정내리기={일정내리기}/>
                    </div>
                    :
                    <div className="course-date-pick-wrap"> 
                        {/* map으로 CourseDay뿌려줌 */}
                            <CourseDay
                                key={day.day}
                                arrCourseDay={arrCourseDay}
                                day={day.day}
                                dayinfo={day.dayinfo}
                                choiceDay={choiceDay}
                                
                                코스소개작성={코스소개작성}
                                데이선택핸들러={데이선택핸들러} 
                                장소삭제={장소삭제}
                                일정삭제={일정삭제}
                                일정올리기={일정올리기}
                                일정내리기={일정내리기}/>
                    </div>
                ))}
        </>
    );
}

export default CourseWrite;