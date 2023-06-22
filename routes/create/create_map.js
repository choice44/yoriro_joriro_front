var mapContainer = document.getElementById('map'), // 지도를 표시할 div  
    mapOption = {
        center: new kakao.maps.LatLng(37.498000, 127.037974), // 지도의 중심좌표
        level: 8 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 마커 이미지 주소
var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

var markers = [];   // 마커를 담을 배열
var marker = '';    // 클릭 이벤트로 생기는 마커 저장용
var lines = [];     // 선분을 담을 배열 

export var new_spotx = ''
export var new_spoty = ''

// 마커, 선분 생성 / route_create.js에서 사용
export function createMarker(positions) {

    // 기존 마커 모두 제거
    // 관광지 삭제했을 때 마커를 재생성시키기 위해 추가
    for (const marker of markers) {
        marker.setMap(null); // 지도에 있는 마커 제거
    }

    // 기존 선분 모두 제거
    // 관광지를 삭제했을 때 선분을 재생성시키기 위해 추가
    for (const line of lines) {
        line.setMap(null);
    }

    markers = []; // 마커 배열 초기화
    lines = []; // 선분 배열 초기화

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