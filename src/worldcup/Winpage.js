import './Winpage.css';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import Frame from '../main/Frame';


const Winpage = () => {

  let jwtToken = null;
  if (sessionStorage.getItem("token") != null) {
    jwtToken = sessionStorage.getItem("token");
  }

  const header = {
    Authorization: `Bearer ${jwtToken}`
  };

  const { rawinfoIdx, triedCategoryIdx } = useParams();
  const [rawinfo, setRawinfo] = useState({});
  const [totalWincnt, setTotalWincnt] = useState(0);
  const [data, setData] = useState([]);
  const [rawinfoDescription, setRawinfoDescription] = useState([]);
  const [rawinfoImg, setRawinfoImg] = useState([]);
  const [rawinfoName, setRawinforName] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF7042',
    '#FB1042', '#9370db', '#b0e0e6', '#0000ff',
    '#808000', '#808080', '#deb887', '#7fff00',
    '#006400', '#8fbc8f', '#2f4f4f', '#4b0082',
  ];

  const RADIAN = Math.PI / 180;

  useEffect(() => {
    console.log(rawinfoIdx);

    //우승 품목의 로우정보(설명)    
    axios.get(`http://localhost:8080/api/idealworldcupwin/${rawinfoIdx}`, { headers: header })
      .then(response => {
        console.log(response);
        setRawinfo(response.data);
        setRawinfoDescription(response.data.rawinfoDescription);
        setRawinfoImg(response.data.rawinfoImg);
        setRawinforName(response.data.rawinfoName);
      })
      .catch((error) => {
        console.log(error);
      })

    //해당 카테고리 로우데이터(우승 통계에 사용 예정)
    // axios.get(`http://localhost:8080/api/rawinfo/${triedCategoryIdx}`)
    //     .then(response => {
    //         console.log(response);
    //         let tempData = response.data;

    //         tempData.map(temp => {
    //             data.push({
    //                 name: temp.rawinfoName, 
    //                 wincnt: temp.idealworldcupWincnt
    //             })
    //         })
    //         console.log(data);
    //         // setRawinfoStatic(response.data);    
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     })

    //chatgpt(카테고리 로우데이터 우승통계 가지고 오기)
    axios.get(`http://localhost:8080/api/rawinfo/${triedCategoryIdx}`, { headers: header })
      .then(response => {
        console.log(response);

        const rawData = response.data;
        const updatedData = rawData.map(item => ({
          name: item.rawinfoName,
          wincnt: item.idealworldcupWincnt,
          description: item.rawinfoDescription,
        }));

        setData(updatedData);
      })
      .catch(error => {
        console.log(error);
      });

    //해당 카테고리의 로우데이터 총 우승횟수
    axios.get(`http://localhost:8080/api/idealworldcuptotalwincnt/${triedCategoryIdx}`, { headers: header })
      .then(response => {
        console.log(response);
        setTotalWincnt(response.data);
      })
      .catch(error => {
        console.log(error);
      })
  },
    [])

  //차트 라이브러리 코드
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Frame>
      <div className='win'>우승</div>
      <div className='img-st'>
        <img className="w-img" src={rawinfoImg} />
      </div>
      <div className="w-name">{rawinfoName}</div>

      <div className="w-detail">{rawinfoDescription}</div>
      <div style={{ height: 50 }} />
      <div className='win'>우승통계</div>
      <div style={{ height: 800 }}>
        <ResponsiveContainer width="100%" height="100%"  >
          <PieChart width={800} height={800}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={window.innerWidth > 1000 ? window.innerWidth * 0.15 : window.innerWidth * 0.4}
              fill="#8884d8"
              dataKey="wincnt"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />

          </PieChart>
        </ResponsiveContainer>
      </div>
      
    </Frame>
  );
}
export default Winpage;