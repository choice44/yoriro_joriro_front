var mapContainer = document.getElementById('map'), // 지도를 표시할 div  
    mapOption = {
        center: new kakao.maps.LatLng(37.498000, 127.037974), // 지도의 중심좌표
        level: 7 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 마커 이미지 주소
var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

// 마커, 선분 생성
export function createMarker(positions) {

    const markers = []; // 마커 배열 초기화
    const lines = []; // 선분 배열 초기화

    // 인자로 받은 positions는 관광지 목록
    for (const position of positions) {
        var markerPosition = new kakao.maps.LatLng(position.mapy, position.mapx); // 관광지의 좌표

        // 마커 생성
        var marker = new kakao.maps.Marker({
            position: markerPosition,   // 마커의 위치
            image: new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(24, 35)) // 마커 이미지 설정
        });

        marker.setMap(map); // 마커를 지도에 표시
        markers.push(marker); // 마커 배열에 추가

        // 선분 생성
        if (markers.length > 1) {   // 마커가 2개 이상이라면
            var linePath = [markers[markers.length - 2].getPosition(), markerPosition];// 첫번째 마커와 두번째 마커

            // 선분 생성, 생김새
            var line = new kakao.maps.Polyline({
                path: linePath,
                strokeWeight: 2,
                strokeColor: '#FF0000',
                strokeOpacity: 0.7,
                strokeStyle: 'solid'
            });

            line.setMap(map);
            lines.push(line);
        }

        map.setCenter(markerPosition); // 해당 위치로 지도 이동
    }
}