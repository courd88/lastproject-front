import { Chip, Input } from "@mui/material";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const CourseDay = (props) => {

    const 일정삭제 = props.일정삭제;
    const 일정올리기 = props.일정올리기;
    const 일정내리기 = props.일정내리기;
    const 장소삭제 = props.장소삭제;
    const 데이선택핸들러 = props.데이선택핸들러;
    const 코스소개작성 = props.코스소개작성;
    const arrCourseDay = props.arrCourseDay;
    const day = props.day;
    const dayinfo = props.dayinfo;
    const dayDescription = props.dayDescription;
    const choiceDay = props.choiceDay;

    return (
        <>
            <div className="course-date-pick-choice-btn">
                {choiceDay == day ?
                    <CheckBoxIcon /> :
                    <CheckBoxOutlineBlankIcon onClick={() => 데이선택핸들러(day)} />
                }
            </div>
            <div className="course-date-pick-btns">
                {1 == day ? <div className="course-date-pick-black"></div> :
                    <div className="course-date-pick-up-btn" onClick={() => 일정올리기(day)}><ExpandLessIcon /></div>
                }
                
                {arrCourseDay.length == day ? <div className="course-date-pick-black"></div> :
                    <div className="course-date-pick-down-btn" onClick={() => 일정내리기(day)}><ExpandMoreIcon /></div>
                }
            </div>
            <h2>DAY{day}</h2>
            <div className="course-date-pick-chips">
                {dayinfo &&
                    dayinfo.map(days => (
                        <Chip key={days.placeName} label={days.placeName} onDelete={() => 장소삭제(day, days.placeName)} />
                    ))}
                <div className="course-date-pick-description">
                    <Input placeholder="express this course" value={dayDescription} onChange={(e) => 코스소개작성(day, e.target.value)} />
                </div>
            </div>
            <div>
                <div className="course-date-pick-delete-btn" onClick={() => 일정삭제(day)}><RemoveCircleIcon /></div>
            </div>
        </>
    )
}
export default CourseDay;