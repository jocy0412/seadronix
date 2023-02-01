import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
    const mapElement = useRef(null);
    const { naver } = window;

    // 지도에 표시할 위치의 위도와 경도 좌표를 파라미터로 넣어줍니다.
    const [center, setCenter] = useState(new naver.maps.LatLng(33.4591429, 126.5353436));

    useEffect(() => {
        if (!mapElement.current || !naver) return;

        const mapOptions = {
            center: center,
            zoom: 11,
            zoomControl: true,
            zoomControlOptions: {
                position: naver.maps.Position.TOP_RIGHT,
            },
        };

        const map = new naver.maps.Map(mapElement.current, mapOptions);

        const markers = [];

        const icon = {
            url: "http://localhost:3000/sp_pins_spot_v3.png",
            size: new naver.maps.Size(24, 37),
            anchor: new naver.maps.Point(12, 37),
            // origin: new naver.maps.Point(24 * 29, 150),
        };

        const otherMarkers = new naver.maps.Marker({
            position: center,
            map,
            icon,
        });

        markers.push(otherMarkers);
    }, [center]);

    const mapStyle = {
        width: "100%",
        height: "400px",
        margin: "0px",
    };

    return (
        <div className="App">
            <div ref={mapElement} style={mapStyle}></div>
        </div>
    );
}

export default App;
