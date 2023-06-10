import './example.css';

const Example = () => {
  return (
    <>
      <div className="background">
        <img src={process.env.PUBLIC_URL + '/KADA-back.png'} />
        <div className='shin-img'>
          <img src={process.env.PUBLIC_URL + './신윤복 월하정인.png'}/>
        </div>
        <div className='shin-img2'>
          <img src={process.env.PUBLIC_URL + './김홍도 씨름.png'}/>
        </div>
        <div className='shin-img3'>
          <img src={process.env.PUBLIC_URL + './김홍도 그림감상.png'}/>
        </div>
        <div className='shin-img4'>
          <img src={process.env.PUBLIC_URL + './송하맹호도.png'}/>
        </div>
      </div>


    </>
  )
}
export default Example