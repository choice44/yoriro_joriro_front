var mapContainer = document.getElementById('map'), // 지도를 표시할 div  
    mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

var drawingFlag = false; // 선이 그려지고 있는 상태를 가지고 있을 변수입니다
var moveLine; // 선이 그려지고 있을때 마우스 움직임에 따라 그려질 선 객체 입니다
var clickLine // 마우스로 클릭한 좌표로 그려질 선 객체입니다
var distanceOverlay; // 선의 거리정보를 표시할 커스텀오버레이 입니다
var dots = {}; // 선이 그려지고 있을때 클릭할 때마다 클릭 지점과 거리를 표시하는 커스텀 오버레이 배열입니다.

// 마커 이미지 주소
var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

// 마커 생성
export function createMarker(positions) {
    for (const position of positions) {
        var markerPosition = new kakao.maps.LatLng(position.mapy, position.mapx); // 관광지의 좌표

        var marker = new kakao.maps.Marker({
            position: markerPosition,
            image: new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(24, 35)) // 마커 이미지 설정
        });

        marker.setMap(map); // 마커를 지도에 표시
    }
}