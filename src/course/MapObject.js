import './MapObject.css';
import { Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";


function MapObject(props) {

  const { lat, setLat, lng, setLng, setPlaceName } = props;


  //컴포넌트 마운트 됐을 때 실행하는 함수
  useEffect(() => {
    initMakeMarker();
  }, []);

  //{1. 마커 초기화 }
  function initMakeMarker() {



    //맵 초기화 = ID가 'map'으로 된 엘리먼트 찾아서 위도,경도,줌 체크하고, 로드맵으로 설정.  
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 37.556, lng: 126.979 },
      zoom: 13,
      mapTypeId: 'roadmap',
    });

    //인풋박스로 검색창 설정 ID = 'pac-input', 원래는 map밖에 있는 input창인데
    //아래 searchBox로 map의 검색창으로 변경.
    const input = document.getElementById('pac-input');

    // 검색창 설정.
    const searchBox = new window.google.maps.places.SearchBox(input);


    //검색창 위치 설정.
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);

    //지도에서 검색시 검색영역 변경하는 함수 실행. 
    map.addListener('bounds_changed', () => {
      searchBox.setBounds(map.getBounds());
    });

    //검색 시 마커 등록
    const createMarker = (place) => {

      console.log(place);

      if (!place.geometry || !place.geometry.location) {
        console.log('Returned place contains no geometry');
        return;
      }

      //아이콘 커스텀(검색한 장소만 핀으로 체크)
      const icon = {
        // url: place.icon,
        size: new window.google.maps.Size(71, 71),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(17, 34),
        scaledSize: new window.google.maps.Size(25, 25),
      };

      //마커 
      const marker = new window.google.maps.Marker({
        map,
        icon,
        title: place.name,
        position: place.geometry.location,
      });

      //핀 위치 저장을 어떻게 할까?
      setLat(place.geometry.location.lat());
      setLng(place.geometry.location.lng());
      setPlaceName(place.name);
      console.log(place.name);
      console.log(place.formatted_address);
      console.log(place.geometry.location.lat());
      console.log(place.geometry.location.lng());
      console.log(lat);
      console.log(lng);

      //
      const infoWindow = new window.google.maps.InfoWindow({
        content:
          `
      <div>
        <div>${place.name}</div>
        <div>위도: ${place.geometry.location.lat()}</div>
        <div>경도: ${place.geometry.location.lng()}</div>
      </div>
    `
      });

      //마커를 클릭하면 경위도 말주머니 오픈.
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      return marker;
    };

    //{검색박스에서 장소가 바뀌면 실행되는 함수}.
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      const bounds = new window.google.maps.LatLngBounds();

      let markersArr = places.map((place) => createMarker(place));

      markersArr.forEach((marker) => {
        bounds.extend(marker.getPosition());
      });

      map.fitBounds(bounds);

      // setMarkers({ markersArr });
    });
  };

  return (
    <>
      <div id="map-wrap">
        <input id="pac-input" type="text" placeholder="Search Box" />
        <div id="map"></div>
      </div>
    </>
  );

}

export default MapObject;