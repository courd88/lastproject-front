import './AccompanyEach.css';
import DateRangeIcon from '@mui/icons-material/DateRange';

const AccompanyEach = () => {
    return(
        <>
            <div id="accompany-each">
                <div id="accompany-each-title">
                    <span id="accompany-each-area">dkaldkfja</span>
                    <span id="accompany-each-duration">asdfasdf</span>
                    <span id="accompany-each-date"><DateRangeIcon fontSize='small'/>asdfasdf</span>
                </div>
                <div id="accompany-each-img">
                    <img src="https://i.pinimg.com/564x/30/dc/f9/30dcf99d076e79e55e519ad4240d2f6c.jpg" />
                </div>
                <div id="accompany-each-content">
                    동행글자 15자 이후 ...잘라야할 듯 까먹었다.
                </div>
            </div>
        </>
    )
}
export default AccompanyEach;