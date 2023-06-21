import { proxy } from "../../proxy.js";
import { createMarker } from "./detail_map.js";

const route_id = new URLSearchParams(window.location.search).get('id');

// 모달창 관련 변수들
const modal = document.getElementById("ratingModal");
const btn = document.getElementById("ratingBtn");
const span = document.getElementsByClassName("close")[0];
const submitRating = document.getElementById("submitRating");
const route_rating = document.getElementById("route-detail-rating")

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

// 시/도 요청 함수
async function getRouteArea(area_id) {
    try {
        // 백엔드에 GET 요청
        const response = await fetch(`${proxy}/spots/area/`, {
            method: "GET",
        });

        // 시/도 요청 실패 시 에러
        if (!response.ok) {
            throw new Error('여행경로 게시글을 가져오는데 실패했습니다.');
        }

        // 시/도 요청 성공 시 데이터 리턴
        if (response.status == 200) {
            const response_json = await response.json();

            // filter는 전체를 분석하고 find는 조건에 맞는 걸 찾자마자 종료하기 때문에 하나를 찾을 때 더 효율적임
            const targetArea = response_json.find(area => area.id == area_id);

            // 만약 찾지 못했다면 null 반환
            if (!targetArea) {
                return null;
            }

            // 찾았다면 name을 반환
            return targetArea.name;

        } else {
            throw new Error('예상치 못한 에러가 발생했습니다. 다시 시도해주세요.');
        }

        // 발생한 에러 출력
    } catch (error) {
        console.error('Error:', error);
    }
}

// 시군구 요청 함수
async function getRouteSigungu(area_id, sigungu_id) {
    try {
        // 백엔드에 GET 요청
        const response = await fetch(`${proxy}/spots/area/${area_id}`, {
            method: "GET",
        });

        // 시군구 요청 실패 시 에러
        if (!response.ok) {
            throw new Error('여행경로 게시글을 가져오는데 실패했습니다.');
        }

        // 시군구 요청 성공 시 데이터 리턴
        if (response.status == 200) {
            const response_json = await response.json();

            const targetSigungu = response_json.find(sigungu => sigungu.code == sigungu_id);

            // 만약 찾지 못했다면 null 반환
            if (!targetSigungu) {
                return null;
            }

            // 찾았다면 name을 반환
            return targetSigungu.name;

            // ok가 떴는데 200이 아닐 시
        } else {
            throw new Error('예상치 못한 에러가 발생했습니다. 다시 시도해주세요.');
        }

        // 발생한 에러 출력
    } catch (error) {
        console.error('Error:', error);
    }
}

async function routeRating(route_id) {
    try {
        const accessToken = localStorage.getItem('access');
        const rating = route_rating.value;

        if (rating === "") {
            return alert("평점을 입력해주세요")
        }

        const response = await fetch(`${proxy}/routes/${route_id}/rate/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ "rate": rating })
        });

        if (!response.ok) {
            throw new Error('평점 등록에 실패했습니다.');
        }

        alert("평점 등록이 완료되었습니다.")

        modal.style.display = "none";
        location.reload();

    } catch (error) {
        console.error('Error:', error);
    }
}

async function viewRouteDetail() {
    const route = await getRouteDetail();   // 해당 여행 루트 게시글의 데이터

    const area_id = route.areas[0].area // route의 시/도 id 
    const sigungu_id = route.areas[0].sigungu   // route의 시군구 id
    const spot_ids = route.spots

    const area = await getRouteArea(area_id);   // 시/도의 이름
    const sigungu = await getRouteSigungu(area_id, sigungu_id)  // 시군구의 이름

    const route_title = document.getElementById("route-detail-title")
    const route_image = document.getElementById("route-detail-image")
    const route_area = document.getElementById("route-detail-area")
    const route_sigungu = document.getElementById("route-detail-sigungu")
    const route_duration = document.getElementById("route-detail-duration")
    const route_cost = document.getElementById("route-detail-cost")
    const route_spots = document.getElementById("route-detail-spots")
    const route_rate = document.getElementById("route-detail-rate")
    const route_content = document.getElementById("route-detail-content")


    route_title.innerText = route.title
    route_image.setAttribute("src", proxy + route.image)
    route_area.innerText = area
    route_sigungu.innerText = sigungu
    route_duration.innerText = route.duration + `일`
    route_cost.innerText = route.cost + `원`
    route_spots.innerHTML = ''
    route_rate.innerText = route.rate + `점`
    route_content.innerText = route.content

    for (let spot of spot_ids) {
        route_spots.innerHTML += `<p>${spot.title}</p>`
    }
    if (route.rate === null) {
        route_rate.innerText = "평점이 없습니다"
    }
    if (route.image === null) {
        route_image.style.display = "none"
    }
    createMarker(spot_ids)
}

window.onload = () => {
    viewRouteDetail()
}


// 모달 관련 js
btn.onclick = function () {
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

submitRating.onclick = function () {
    routeRating(route_id)
}