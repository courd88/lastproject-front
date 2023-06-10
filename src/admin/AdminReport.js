import Pagination from '@mui/material/Pagination';
import AdminReportedList from './AdminReportedList';
import Style from './AdminReport.module.css';
import { useState } from 'react';

const AdminReport = (props) => {

  const { reportList, pageCount, page, reportedCount, tcList, tccList, trList, trcList, accList, irList, chatList, isReportList } = props;
  const handlerChange = props.handlerChange;
  const handlerSelectReportedUser = props.handlerSelectReportedUser;
  const selectedReportedUser = props.selectedReportedUser;



  return (
    <>
      <div className={Style.reportWrap}>
        <div className={Style.reportList}>
          <div className={Style.reportListTop}>신고현황</div>
          <div className={Style.reportHead}>
            <div className={Style.reportHeadTime}>
              신고일자
            </div >
            <div className={Style.reportHeadReportedUser}>
              피신고자
            </div>
            <div className={Style.reportHeadReporter}>
              신고자
            </div>
            <div className={Style.reportHeadReportReason}>
              신고사유
            </div>
            <div className={Style.reportHeadReportContent}>
              신고세부내용
            </div>
            <div className={Style.reportHeadReportMore}>
              게시글 세부내용
            </div>
          </div>

          {reportList && reportList.map(report => (
            <div className={Style.reportBody}>
              <div className={Style.reportBodyTime}>
                {report.reportTime}
              </div>
              <div className={Style.reportReportedUser}>
                {report.reportReportedUser}
              </div>
              <div className={Style.reportReporter}>
                {report.reportReporter}
              </div>
              <div className={Style.reportReportReason}>
                {report.reportReasonName}
              </div>
              <div className={Style.reportReportContent}>
                {report.reportContent}
              </div>
              <div className={Style.reportBodyReportMore} onClick={() => handlerSelectReportedUser(report.reportReportedUser)}>
                자세히 보기
              </div>
            </div>
          ))}

          <div className={Style.reportPaging}>
            <Pagination count={pageCount} color="primary" page={page} onChange={handlerChange} />
          </div>
          {isReportList &&
            <AdminReportedList
              reportedCount={reportedCount}
              tcList={tcList}
              tccList={tccList}
              trList={trList}
              trcList={trcList}
              accList={accList}
              irList={irList}
              chatList={chatList}
              selectedReportedUser={selectedReportedUser}
            />
          }
          
        </div>
      </div>

    </>
  )
}

export default AdminReport;