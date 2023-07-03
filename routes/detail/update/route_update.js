import { proxy } from "../../../proxy.js";
import { createMarker, new_spotx, new_spoty } from "./update_map.js";


// 관광지 목록
let savedSpots = [];
// 관광지 id 목록
let spotsId = [];

// 주소창에서 id값 도출
const route_id = new URLSearchParams(window.location.search).get('id');

let title = document.getElementById('route-title');
let duration = document.getElementById('route-duration');
let cost = document.getElementById('route-cost');
let area = document.getElementById('route-area');
let sigungu = document.getElementById('route-sigungu');
let image = document.getElementById('route-image');
let image_preview_box = document.getElementById('img-preview-box');
let image_preview = document.getElementById('img-preview');
let content = document.getElementById('route-content');

// 게시글 요청 함수
async function getRouteDetail() {
    try {
        // 백엔드에 GET 요청
        const response = await fetch(`${proxy}/routes/${route_id}`, {
            method: "GET",
        });

        // 게시글 요청 실패 시 에러
        if (!response.ok) {
            throw new Error('여행경로 게시글을 가져오는데 실패했습니다.');
        }

        // 게시글 요청 성공 시 데이터 리턴
        if (response.status == 200) {
            const response_json = await response.json();
            return response_json;

            // ok가 떴는데 200이 아닐 시
        } else {
            throw new Error('예상치 못한 에러가 발생했습니다. 다시 시도해주세요.');
        }

        // 발생한 에러 출력
    } catch (error) {
        console.error('Error:', error);
    }
}

// 수정페이지 진입 시 기존 데이터 기입함수
async function loadRoute() {
    // 해당 게시글 데이터 불러오기
    const route = await getRouteDetail()


    const spots = route.spots


    // 해당 게시글의 목적지데이터 중 목적지 정보만 가져옴 
    spots.forEach(spotObj => {
        savedSpots.push(spotObj.spot);
    });

    title.value = route.title;
    duration.value = route.duration;
    cost.value = route.cost;
    area.value = route.areas[0].area;
    content.value = route.content;

    // 백엔드 요청을 위한 목적지 id 목록에 추가
    for (const spot of savedSpots) {
        spotsId.push(spot.id)
    }

    // 시/도가 선택된 후 시군구가 그에맞춰 바뀌기를 기다려야함
    await changeSigungu(route.areas[0].area);
    sigungu.value = route.areas[0].sigungu;

    // 이미 등록된 사진이 있으면 사진 미리보기
    if (route.image != null) {
        image_preview_box.style.display = 'block';
        image_preview.src = proxy + '/' + route.image
    }

    // 마커 생성하고 목적지 목록 업데이트
    createMarker(savedSpots)
    updateSavedSpots();
}


// 게시글 수정 데이터 가져오기
function handleUpdateRoute(event) {
    event.preventDefault(); // 제출 버튼을 눌렀을 때 새로고침 방지

    title = document.getElementById('route-title').value;
    duration = document.getElementById('route-duration').value;
    cost = document.getElementById('route-cost').value;
    area = document.getElementById('route-area').value;
    sigungu = document.getElementById('route-sigungu').value;
    image = document.getElementById('route-image').files[0];
    content = document.getElementById('route-content').value;

    if (!title) {
        alert("여행 제목을 입력해주세요");
        return;
    }

    // duration과 cost는 숫자로만 받아야함
    // 소수 예외를 두기 위해 parseFloat로 변환
    const durationValue = parseFloat(duration);
    const costValue = parseFloat(cost);

    // duration과 cost는 양의 정수만 받아야함
    if (!duration) {
        alert("여행 일수를 입력해주세요");
        return;
    } else if (isNaN(durationValue) || Math.floor(durationValue) !== durationValue || durationValue < 1) {
        alert("여행일수는 1이상의 정수만 기재할 수 있습니다");
        return;
    }

    // duration과 cost는 양의 정수만 받아야함
    if (!cost) {
        alert("여행 비용을 입력해주세요");
        return;
    } else if (isNaN(costValue) || Math.floor(costValue) !== costValue || costValue < 1) {
        alert("여행비용은 0이상의 정수만 기재할 수 있습니다");
        return;
    }

    if (!area) {
        alert("시/도를 입력해주세요");
        return;
    }

    if (!sigungu) {
        alert("시/군/구를 입력해주세요");
        return;
    }

    if (!content) {
        alert("본문 내용을 입력해주세요");
        return;
    }

    if (spotsId.length === 0) {
        alert("목적지를 입력해주세요");
        return;
    }

    // areas는 딕셔너리 형태이기 때문에 formData로 전송시 형변환이 필요
    const areas = JSON.stringify({ area: area, sigungu: sigungu });

    // FormData를 사용하면 header에 "application/json"을 담지 않아도 됨
    const formData = new FormData();
    formData.append('title', title);
    formData.append('duration', duration);
    formData.append('cost', cost);
    formData.append('areas', areas);
    formData.append('content', content);

    // 목적지를 순차적으로 기입
    let spots = [];
    let order = 1;

    for (let i = 0; i < spotsId.length; i++) {
        let spotInfo = { spot: spotsId[i], order: order++, day: 1 };
        spots.push(spotInfo);
    }
    formData.append('spots', JSON.stringify(spots));

    // 이미지가 있는 경우에만 formdata에 기입
    if (image) {
        formData.append('image', image);
    } else if (!image_preview) {
        formData.append('image', "");
    }

    updateRoute(formData);
}


// 게시글 검사 및 저장
async function updateRoute(formData) {
    try {
        // 다음 데이터들 중 기재되지 않은 항목이 있는지
        if (
            !formData.get('title') ||
            !formData.get('duration') ||
            !formData.get('cost') ||
            !formData.get('areas') ||
            !formData.get('spots') ||
            !formData.get('content')
        ) {
            alert("입력되지 않은 칸이 있는지 확인해주세요")
            return;
        }

        const duration = parseInt(formData.get('duration'));
        const cost = parseInt(formData.get('cost'));

        // duration과 cost는 숫자로만 받아야함
        if (
            !Number.isInteger(duration) ||
            !Number.isInteger(cost)
        ) {
            alert("여행일수와 여행비용은 숫자만 기재할 수 있습니다")
            return;
        }

        // 로컬스토리지에서 엑세스 토큰 가져옴
        const accessToken = localStorage.getItem('access');

        //헤더에 토큰을 싣고 백엔드에 post 요청
        const response = await fetch(`${proxy}/routes/${route_id}/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            method: 'PUT',
            body: formData
        });

        // 정상작동하지 못했을 때 에러
        if (!response.ok) {
            throw new Error('게시글 작성에 실패하였습니다.');
        }

        //여행루트 수정 후 메인 페이지로 이동
        window.location.href = `../index.html?id=${route_id}`

    } catch (error) {
        console.error('Error:', error);
    }
}


// 시/도 불러오기
async function getArea() {
    const select = document.getElementById('route-area');

    try {
        const response = await fetch(`${proxy}/spots/area/`);
        const data = await response.json();

        // 해당 태그에 전체를 제외한 요소 삭제
        select.innerHTML = `<option value="" selected>전체</option>`;

        // option태그를 붙혀서 시/도 삽입
        for (const area of data) {
            const option = document.createElement('option');
            option.value = area.id;
            option.textContent = area.name;
            select.appendChild(option);
        }

    } catch {
        console.log('시/도를 가져오는데 에러가 발생했습니다:', error);
    }
}

// 시/군/구 불러오기
async function changeSigungu(selectedArea) {
    const selectSigungu = document.getElementById('route-sigungu');

    try {
        selectSigungu.innerHTML = '<option value="" selected>전체</option>';

        // 사용자가 시/도에서 전체를 클릭하면 시군구는 검색하지 않고 초기상태로 유지
        if (!selectedArea) {
            return;
        }

        const response = await fetch(`${proxy}/spots/area/${selectedArea}`);
        const data = await response.json();

        for (const sigungu of data) {
            const option = document.createElement('option');
            option.value = sigungu.code;
            option.textContent = sigungu.name;
            selectSigungu.appendChild(option);
        }

    } catch (error) {
        console.log('시/군/구를 가져오는데 에러가 발생했습니다:', error);
    }
}


// 관광지 검색, 관광지 목록에 저장
async function searchSpot() {
    const input = document.getElementById('route-spot');
    const query = input.value.trim(); //앞뒤 공백제거

    // 비어있는 경우 검색 결과 영역 숨기기
    if (query === '') {
        document.getElementById('spot-results').innerHTML = '';
        return;
    }

    try {
        //백엔드에 데이터 요청
        const response = await fetch(`${proxy}/spots/?search=${query}`);
        const data = await response.json();

        // id로 태그 찾은다음 할당
        const resultsContainer = document.getElementById('spot-results');
        resultsContainer.innerHTML = '';

        // 데이터가 하나라도 있는 경우
        if (data.results.length > 0) {
            // for문을 이용 하나씩 관광지를 불러옴
            for (const spot of data.results) {
                const resultElement = document.createElement('div');// div 생성
                resultElement.textContent = spot.title; // 관광지명 채우기
                resultElement.classList.add('form-control');   // class 삽입
                resultElement.addEventListener('click', () => {
                    input.value = ''; // 검색결과를 클릭하면 검색창 비우기
                    resultsContainer.innerHTML = ''; // 드롭다운 영역 숨기기

                    // 검색결과를 클릭했을때 관광지 목록에 저장
                    savedSpots.push(spot)
                    // 관광지 id목록에 저장
                    spotsId.push(spot.id)
                    // 관광지 목록 업데이트
                    updateSavedSpots();
                    // 마커 생성
                    createMarker(savedSpots)
                });
                resultsContainer.appendChild(resultElement);
            }
            resultsContainer.style.display = 'block'; // 드롭다운 영역 보이기
        } else {
            //데이터가 없는 경우 결과없다고 공지
            resultsContainer.style.display = 'block';
            resultsContainer.innerHTML = `<p>검색된 결과가 없습니다.<p>`
        }
    } catch (error) {
        console.error(error);
    }
}

// 저장된 관광지 목록 업데이트
function updateSavedSpots() {
    const spotSavedBox = document.getElementById('spot-saved-box');
    const savedSpotsContainer = document.getElementById('spot-saved');

    savedSpotsContainer.innerHTML = '';

    if (savedSpots.length === 0) {
        spotSavedBox.style.display = 'none';
    } else {
        spotSavedBox.style.display = 'block';


        for (const spot of savedSpots) {
            const spotElement = document.createElement('div');
            spotElement.textContent = spot.title;

            // 삭제 버튼 생성
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '삭제';  // 텍스트 추가
            deleteButton.style.marginLeft = '100px';    // 글과 어느정도 거리 벌림
            deleteButton.addEventListener('click', () => {  // 버튼 클릭했을 때 함수 실행
                // 관광지 제거 함수
                removeSpot(spot);
            });

            spotElement.appendChild(deleteButton);
            savedSpotsContainer.appendChild(spotElement);
        }
    }
}

// 저장된 관광지 제거
function removeSpot(spot) {

    // indexOf는 특정 문자열의 index를 리턴해줌
    // 찾는 문자가 없으면 -1을 리턴
    const index = savedSpots.indexOf(spot);

    // 찾는 문자가 있다면
    if (index !== -1) {
        // 관광지 저장목록에서 해당 관광지 제거
        // splice(index, n)는 해당 index부터 n번 삭제
        savedSpots.splice(index, 1);

        // spotsId에서도 제거
        const spotIdIndex = spotsId.indexOf(spot.id);
        if (spotIdIndex !== -1) {
            spotsId.splice(spotIdIndex, 1);
        }

        // 관광지 목록 재업데이트
        updateSavedSpots();
        // 마커 재생성
        createMarker(savedSpots)

    } else {
        console.log("목적지를 찾을 수 없습니다.")
    }
}

// 관광지 생성
async function createSpot() {
    // 생성할 관광지명 가져옴
    const newSpot = document.getElementById('create-name').value;
    const newSpotbox = document.getElementById('create-name-box');

    // formData를 생성하고 항목들을 차례대로 추가
    let formData = new FormData();
    formData.append('title', newSpot);
    formData.append('type', 99);    // 사용자가 생성한 관광지는 타입이 99로 고정
    formData.append('mapx', new_spotx); // map.js에서 가져옴
    formData.append('mapy', new_spoty); // map.js에서 가져옴

    try {
        // 제목이 비어있을 때
        if (!formData.get('title')) {
            alert("클릭한 목적지의 이름을 입력해주세요");
            return;
        }

        // 다른 항목이 비어있을 때
        if (
            !formData.get('type') ||
            !formData.get('mapx') ||
            !formData.get('mapy')
        ) {
            alert("클릭한 목적지의 좌표를 불러올 수 없습니다.");
            return;
        }

        const accessToken = localStorage.getItem('access');

        const response = await fetch(`${proxy}/routes/spots/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('목적지 생성에 실패하였습니다.');
        }

        const data = await response.json();
        const spot = data[1]

        // 관광지의 정보를 관광지 목록에 추가
        savedSpots.push(spot)
        // 관광지 id목록에 저장
        spotsId.push(spot.id)
        // 관광지 목록 업데이트
        updateSavedSpots();
        // 마커 생성
        createMarker(savedSpots)
        // 입력이 끝났으면 입력창 숨기기
        newSpotbox.style.display = 'none'

    } catch (error) {
        console.error('Error:', error);
    }
}

//관광지 입력 필드에 입력이 변경되면 검색 함수 호출
document.getElementById('route-spot').addEventListener('input', searchSpot);

// 클릭 이벤트가 발생한 곳 이외의 영역을 클릭하면 드롭다운 숨기기
document.addEventListener('click', (event) => {
    const resultsContainer = document.getElementById('spot-results');
    if (!event.target.closest('.input-field')) {
        resultsContainer.style.display = 'none';
    }
});

// 버튼 클릭 시 게시글 수정 함수 호출
const createButton = document.getElementById("route-button");
createButton.addEventListener('click', handleUpdateRoute);

// 버튼 클릭 시 목적지 생성 함수 호출
const createSpotButton = document.getElementById("create-name-button");
createSpotButton.addEventListener('click', createSpot);

// getArea가 먼저 끝나야하기 때문에 완료를 기다림
window.onload = async function () {
    await getArea();
    loadRoute();
};
window.changeSigungu = changeSigungu

// 이미지가 변경되었을 때 미리보기 기능
image.addEventListener('change', function (e) {
    var reader = new FileReader();  // fileReader함수를 사용

    const maxSize = 3 * 1024 * 1024;   // 3MB

    // 선택된 파일이 없을 경우 아무것도 하지 않음
    // this는 이벤트 핸들러가 바인딩한 파일입력 요소
    // files는 파일들의 목록을 배열형태로 만듬 -> this.files는 사용자가 선택한 파일의 목록
    if (!this.files || this.files.length === 0) {
        return;
    }

    const file = this.files[0];

    // 파일 크기가 3MB를 초과할 경우 경고 메시지를 표시
    if (file.size > maxSize) {
        alert("3MB 이하의 이미지만 업로드 가능합니다.");
        // 선택한 파일을 초기화
        this.value = '';
    }

    //reader의 로드가 끝나면 미리보기의 src를 할당
    reader.onloadend = function () {
        image_preview.src = reader.result;
    }

    // 첨부파일란에 변화가 생겼을 때, 파일이 존재한다면
    // 미리보기에 사진을 넣고 미리보기 박스를 보여줌
    if (file) {
        reader.readAsDataURL(file);
        image_preview_box.style.display = 'block'
    } else {    // 파일이 없으면 미리보기를 비우고 박스를 숨김
        image_preview.src = "";
        image_preview_box.style.display = 'none'
    }
});