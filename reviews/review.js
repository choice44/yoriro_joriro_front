import { proxy } from '/proxy.js';


// Spot GET 요청
export async function getSpotDetail(spot_id) {

    const url = `${proxy}/spots/${spot_id}/`;

    const response = await fetch(url, {
        method: "GET",
    });

    const response_json = await response.json();

    return response_json;

}


export async function loadSpotForReview(spot_id) {

    // Spot 정보 가져오기
    const spot = await getSpotDetail(spot_id);

    const spot_detail = document.getElementById("review_create_cardbox");

    const template = document.createElement("div");
    template.setAttribute("class", "fh5co-blog");

    // 디폴트 이미지
    if (!spot.firstimage) {
        spot.firstimage = "/images/place-1.jpg";
    }

    // Spot 카드 생성
    template.innerHTML = `
    <div style="height:200px; overflow:hidden;"><img class="img-responsive" src="${spot.firstimage}"
											alt="이미지" style="height:100%; width:100%; object-fit:cover; margin:auto;"></div>
									<div class="blog-text">
										<div class="prod-title">
											<h3>${spot.title}</h3>
											<span class="price">${spot.addr1}</span>
										</div>
									</div>`;

    spot_detail.appendChild(template);

}


// 리뷰 가져오기
export async function getReview(review_id) {

    const url = `${proxy}/reviews/${review_id}/`
    const response = await fetch(url, {
        method: 'GET'
    })
    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        console.log("잠시 후 다시 시도해주세요")
    }
}
