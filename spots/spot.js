import { proxy } from '/proxy.js';
// const proxy = 'http://127.0.0.1:8000';
// const proxy = 'https://api.bechol.com';
const token = localStorage.getItem('access')


window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search).get('id');
    loadSpotDetail(urlParams);
}

// Spot GET 요청
async function getSpotDetail(spot_id) {

    const url = `${proxy}/spots/${spot_id}/`;

    const response = await fetch(url, {
        method: "GET",
    });

    const response_json = await response.json();

    return response_json;

}


async function loadSpotDetail(spot_id) {

    // Spot 정보 가져오기
    const spot = await getSpotDetail(spot_id);

    const spot_detail = document.getElementById("spot_detail_cardbox");

    const template = document.createElement("div");
    template.setAttribute("class", "car");
    template.setAttribute("style", "height:400px");

    // 디폴트 이미지
    if (!spot.firstimage) {
        spot.firstimage = "/images/place-1.jpg";
    }

    // null 처리
    if (!spot.addr2) {
        spot.addr2 = "없음";
    }

    if (!spot.tel) {
        spot.tel = "없음";
    }

    // 타입 텍스트 처리
    if (spot.type == 12) {
        spot.type = "관광지";
    } else {
        spot.type = "맛집";
    }

    // rate 없으면 null이 아니라 빈칸
    // rate 있으면 무조건 소수점 첫번째 자리까지 표시
    if (!spot.rate) {
        spot.rate = "";
    } else {
        spot.rate = spot.rate.toFixed(1);
    };

    // 상세 정보 카드 생성
    template.innerHTML = `
    <div class="one-1" style="background-image: url(${spot.firstimage});">
    </div>
    <div class="one-4">
        <h3 style="display:inline;">${spot.title} <small>${spot.type}</small><h2>${spot.rate}</h2></h3>
        <span class="price">${spot.addr1}</span>
        <span class="price">상세주소: ${spot.addr2}</span>
        <span class="price">전화번호: ${spot.tel}</span>
    </div>`;

    spot_detail.appendChild(template);

}


// 버튼 클릭 시 작성페이지로 이동
const writeBtn = document.getElementById("spot_button_create_review");
writeBtn.addEventListener("click", () => {
    const urlParams = new URLSearchParams(window.location.search).get('id');

    // 로그인한 사용자만 리뷰 작성 가능
    if (token) {
        window.location.href = `/reviews/create/?id=${urlParams}`;
    }
    else {
        alert("로그인한 사용자만 작성할 수 있습니다!")
    }
});
