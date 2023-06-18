var mapContainer = document.getElementById('map'), // 지도를 표시할 div  
    mapOption = {
        center: new kakao.maps.LatLng(37.498000, 127.037974), // 지도의 중심좌표
        level: 8 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

var drawingFlag = false; // 선이 그려지고 있는 상태를 가지고 있을 변수입니다
var moveLine; // 선이 그려지고 있을때 마우스 움직임에 따라 그려질 선 객체 입니다
var clickLine // 마우스로 클릭한 좌표로 그려질 선 객체입니다
var distanceOverlay; // 선의 거리정보를 표시할 커스텀오버레이 입니다
var dots = {}; // 선이 그려지고 있을때 클릭할 때마다 클릭 지점과 거리를 표시하는 커스텀 오버레이 배열입니다.

// 마커 이미지 주소
var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

// 마커를 담을 배열
var markers = [];
var marker = '';

export var new_spotx = ''
export var new_spoty = ''

// 마커 생성, route_create.js에서 사용
export function createMarker(positions) {

    // 기존 마커 모두 제거
    // 관광지 삭제했을 때 마커를 재생성시키기 위해 추가함
    for (const marker of markers) {
        marker.setMap(null); // 지도에 있는 마커 제거
    }
    markers = []; // 마커 배열 초기화

    // 인자로 받은 positions는 관광지 목록
    for (const position of positions) {
        var markerPosition = new kakao.maps.LatLng(position.mapy, position.mapx); // 관광지의 좌표

        // 마커 생성
        var marker = new kakao.maps.Marker({
            position: markerPosition,
            image: new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(24, 35)) // 마커 이미지 설정
        });

        marker.setMap(map); // 마커를 지도에 표시
        markers.push(marker); // 마커 배열에 추가
        map.setCenter(markerPosition); // 해당 위치로 지도 이동
    }
}

// 클릭 이벤트
kakao.maps.event.addListener(map, 'click', function (mouseEvent) {

    // 클릭한 장소의 위도, 경도 가져옴
    var latlng = mouseEvent.latLng;

    // x좌표와 y좌표를 입력, route_create.js에서 사용
    new_spotx = latlng.getLng()
    new_spoty = latlng.getLat()

    var markerPosition = new kakao.maps.LatLng(new_spoty, new_spotx); // 관광지의 좌표

    // 이전에 생성한 마커가 있다면 위치를 업데이트하고, 없다면 새로 생성
    if (marker) {
        marker.setPosition(markerPosition); // 마커 위치 업데이트
    } else {
        // 마커 생성
        marker = new kakao.maps.Marker({
            position: markerPosition,
            image: new kakao.maps.MarkerImage(imageSrc, new kakao.maps.Size(24, 35)) // 마커 이미지 설정
        });

        marker.setMap(map); // 마커를 지도에 표시
    }

    var resultDiv = document.getElementById('create-name-box');
    resultDiv.style.display = 'block';
});