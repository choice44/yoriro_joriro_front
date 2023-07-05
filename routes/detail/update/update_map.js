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
export var new_addr = ''

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

        // 정보창에 들어갈 기본주소와 기본이미지 설정
        let imagePath = "/images/place-1.jpg"
        let positon_addr = "상세주소가 없습니다."

        if (position.firstimage) {
            imagePath = position.firstimage
        }
        if (position.addr1) {
            positon_addr = position.addr1
        }

        // 정보창에 들어갈 정보
        var content = '<div class="wrap">' +
            '    <div class="info">' +
            '        <div class="title">' +
            position.title +
            '            <div class="close" title="닫기"></div>' +
            '        </div>' +
            '        <div class="body">' +
            '            <div class="img">' +
            '                <img src="' + imagePath + '" width="73" height="70">' +
            '           </div>' +
            '            <div class="desc">' +
            '                <div class="ellipsis">' + positon_addr + '</div>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>';

        marker.setMap(map); // 마커를 지도에 표시

        // 정보창 생성
        var infowindow = new kakao.maps.InfoWindow({
            content: content
        });

        // marker와 infowindow의 이벤트 연결
        (function (marker, infowindow) {
            kakao.maps.event.addListener(marker, 'mouseover', function () {
                infowindow.open(map, marker);
            });

            kakao.maps.event.addListener(marker, 'mouseout', function () {
                infowindow.close();
            });
        })(marker, infowindow);// 방금 정의된 함수를 호출, 이 호출로 각 마커들은 자신만의 함수 스코프를 가지게됨

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
    // 주소-좌표 변환 객체 생성
    var geocoder = new kakao.maps.services.Geocoder();

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
    // 좌표를 주소로 변환
    geocoder.coord2Address(new_spotx, new_spoty, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
            var detailAddr = !!result[0].road_address ? result[0].road_address.address_name : '';
            detailAddr += ' ' + result[0].address.address_name;

            new_addr = detailAddr
        }
    });

    var resultDiv = document.getElementById('create-name-box');
    resultDiv.style.display = 'block';
});