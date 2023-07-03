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