import { proxy } from '/proxy.js';

const token = localStorage.getItem('access')


window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search).get('id');
    loadSpotDetail(urlParams);
    loadSpotReviews(urlParams);
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
    if (!spot.addr1) {
        spot.addr1 = "주소 정보 없음";
    }

    if (!spot.addr2) {
        spot.addr2 = "없음";
    }

    if (!spot.tel) {
        spot.tel = "없음";
    }

    // 타입 텍스트 처리
    if (spot.type == 12) {
        spot.type = "관광지";
    } else if (spot.type == 39) {
        spot.type = "맛집";
    } else {
        spot.type = "기타";
    }

    // rate 없으면 null이 아니라 빈칸
    // rate 있으면 무조건 소수점 첫번째 자리까지 표시
    if (!spot.rate) {
        spot.rate = "";
    } else {
        spot.rate = "⭐" + spot.rate.toFixed(1);
    };

    // 상세 정보 카드 생성
    template.innerHTML = `
    <div class="one-1" style="background-image: url(${spot.firstimage});">
    </div>
    <div class="one-4" style="background-color: rgb(0, 0, 0, 0.04);">
        <h3 style="display:inline; color:black;">${spot.title} <h2 style="display:inline; color:#F78536;">${spot.rate}</h2></h3>
        <h3><small>${spot.type}</small><h3>
        <span class="price" style="color:black; margin-bottom:0.7em;">${spot.addr1}</span>
        <span class="price" style="color:black; margin-bottom:0.7em;">상세주소: ${spot.addr2}</span>
        <span class="price" style="color:black;">전화번호: ${spot.tel}</span>
    </div>`;

    spot_detail.appendChild(template);

}


// 버튼 클릭 시 작성페이지로 이동
const writeBtn = document.getElementById("spot_button_create_review");
writeBtn.addEventListener("click", () => {
    const urlParams = new URLSearchParams(window.location.search).get('id');

    // 로그인한 사용자만 리뷰 작성 가능
    if (token) {
        window.location.href = `/reviews/create/index.html?id=${urlParams}`;
    }
    else {
        alert("로그인한 사용자만 작성할 수 있습니다!")
    }
});


// Spot_Reviews GET 요청
async function getSpotReviews(spot_id) {

    const url = `${proxy}/reviews/filter/?search=${spot_id}`;

    const response = await fetch(url, {
        method: "GET",
    });

    const response_json = await response.json();

    return response_json;

}


async function loadSpotReviews(spot_id) {

    // Spot_Reviews 정보 가져오기
    const spot_reviews = await getSpotReviews(spot_id);

    const spot_review_list = document.getElementById("spot_reviews_cardbox");

    if (spot_reviews.results.length == 0) {
        const template = document.createElement("h2");
        template.setAttribute("style", "text-align:center;");
        template.innerText = "아직 리뷰가 없습니다. \n첫 리뷰를 작성해 주세요!";
        spot_review_list.appendChild(template);

    }
    else {
        const template = document.createElement("h3");
        template.innerText = `${spot_reviews.count}개의 리뷰가 있습니다.`;
        spot_review_list.appendChild(template);

        spot_reviews.results.forEach((review) => {

            // 로그인 되어있다면 payload에서 id를 얻어 좋아요 여부 확인
            if (localStorage.getItem("payload")) {
                const my_id = JSON.parse(localStorage.getItem("payload")).user_id;
                review.is_liked = review.likes.includes(my_id);
            }

            const template = document.createElement("div");
            template.setAttribute("style", "border-top: 1px solid #F78536;");
            template.setAttribute("class", "row");

            // 디폴트 이미지
            if (!review.user.image) {
                review.user.image = "/images/logo_64.png";
            } else {
                review.user.image = proxy + review.user.image
            };
            template.innerHTML = `
            <div class="col-md-2" style="width:100px; height:100px; margin-right:3%; padding-top: 1.5em; margin-bottom:1.5em;">
				<a class="image featured-ji" style="display:block; width:100px; height:100px; margin: 0;" href="/users/mypage/index.html?id=${review.user.id}">
					<img src="${review.user.image}" alt="작성자 프로필 이미지" />
				</a>
				<div style="text-align: center; font-size:14px; width:100px;">${review.user.nickname}</div>
			</div>
            <div class="col-md-10" style="padding-top: 1.5em; width:87%; padding-right:0;">
                <span style="float: right; text-align:center;"><a onclick=handleSpotReviewLike(${review.id}) style="cursor:pointer;"><i class="fi fi-ss-heart"
                            id="spot_review_like_${review.id}" style="padding:0;"></i></a><span
                        style="display: block; margin-top:-10px;"
                        id="spot_review_like_count_${review.id}">${review.like_count}</span></span>
                <span>${"⭐".repeat(review.rate)} </span><span>${review.created_at}</span>
                <h3>${review.title}</h3>
                <p id="spot_review_content_${review.id}"
                    style="display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
                    </p>
                <p style="float: right;"><a href="/reviews/detail/index.html?id=${review.id}">상세보기</a></p>
            </div>
            `
            spot_review_list.appendChild(template);

            const temp_content = document.getElementById(`spot_review_content_${review.id}`);
            temp_content.innerText = review.content

            const is_liked = document.getElementById(`spot_review_like_${review.id}`);
            is_liked.setAttribute("class", `${review.is_liked ? "fi fi-ss-heart liked" : "fi fi-ss-heart"}`)

        });

        spot_review_list.lastChild.style = "border-top: 1px solid #F78536; border-bottom: 1px solid #F78536; margin-bottom:1.5em;"

        // 더보기 버튼 생성
        if (spot_reviews.next) {
            const template = document.createElement("div");

            template.setAttribute("id", "spot_review_more_button");
            template.setAttribute("class", "col-md-12 text-center animate-box fadeInUp animated");

            template.innerHTML = `<a class="btn btn-primary btn-outline btn-lg" onclick="viewMoreSpotReviews('${spot_reviews.next}')"><i
                                    class="icon-arrow-down22"></i> 더보기
                                <i class="icon-arrow-down22"></i></a>`;

            spot_review_list.appendChild(template);

        };
    };
};


async function viewMoreSpotReviews(next) {

    const new_next_url = proxy + next;

    const more_button = document.getElementById("spot_review_more_button");
    more_button.remove();

    const response = await fetch(`${new_next_url}`, {
        method: "GET",
    });

    const more_spot_reviews = await response.json();

    const spot_review_list = document.getElementById("spot_reviews_cardbox");

    spot_review_list.lastChild.style = "border-top: 1px solid #F78536;"

    more_spot_reviews.results.forEach((review) => {
        const template = document.createElement("div");
        template.setAttribute("style", "border-top: 1px solid #F78536;");
        template.setAttribute("class", "row");

        // 디폴트 이미지
        if (!review.user.image) {
            review.user.image = "/images/logo_64.png";
        } else {
            review.user.image = proxy + review.user.image
        };
        template.innerHTML = `
            <div class="col-md-2" style="width:100px; height:100px; margin-right:3%; padding-top: 1.5em; margin-bottom:1.5em;">
				<a class="image featured-ji" style="display:block; width:100px; height:100px;" href="/users/mypage/index.html?id=${review.user.id}">
					<img src="${review.user.image}" alt="작성자 프로필 이미지" />
				</a>
				<div style="text-align: center; font-size:14px; width:100px;">${review.user.nickname}</div>
			</div>
            <div class="col-md-10" style="padding-top: 1.5em; width:87%; padding-right:0;">
                <span style="float: right; text-align:center;"><a onclick=handleSpotReviewLike(${review.id}) style="cursor:pointer;"><i class="fi fi-ss-heart"
                            id="spot_review_like_${review.id}" style="padding:0;"></i></a><span
                        style="display: block; margin-top:-10px;"
                        id="spot_review_like_count_${review.id}">${review.like_count}</span></span>
                <span>${"⭐".repeat(review.rate)} </span><span>${review.created_at}</span>
                <h3>${review.title}</h3>
                <p id="spot_review_content_${review.id}"
                    style="display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
                    </p>
                <p style="float: right;"><a href="/reviews/detail/index.html?id=${review.id}">상세보기</a></p>
            </div>
            `
        spot_review_list.appendChild(template);
        const temp_content = document.getElementById(`spot_review_content_${review.id}`);
        temp_content.innerText = review.content
    });

    spot_review_list.lastChild.style = "border-top: 1px solid #F78536; border-bottom: 1px solid #F78536; margin-bottom:1.5em;"

    // 더보기 버튼 생성
    if (more_spot_reviews.next) {
        const template = document.createElement("div");

        template.setAttribute("id", "spot_review_more_button");
        template.setAttribute("class", "col-md-12 text-center animate-box fadeInUp animated");

        template.innerHTML = `<a class="btn btn-primary btn-outline btn-lg" onclick="viewMoreSpotReviews('${more_spot_reviews.next}')"><i
                                    class="icon-arrow-down22"></i> 더보기
                                <i class="icon-arrow-down22"></i></a>`;

        spot_review_list.appendChild(template);

    };
};


// 좋아요 버튼 기능
async function handleSpotReviewLike(review_id) {
    const review_like_button = document.getElementById(`spot_review_like_${review_id}`);

    if (localStorage.getItem("access")) {

        const url = `${proxy}/reviews/${review_id}/like/`
        const token = localStorage.getItem("access")

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: 'POST',
        })

        if (response.status == 200) {
            review_like_button.classList.toggle('liked');
            const likeCount = document.getElementById(`spot_review_like_count_${review_id}`);
            const current_like_count = likeCount.innerText
            if (review_like_button.className == "fi fi-ss-heart") {
                likeCount.innerHTML = current_like_count - 1
            } else {
                likeCount.innerHTML = `${Number(current_like_count) + 1}`
            }
        } else {
            alert("잠시 후 다시 시도해주세요")
        }
    } else {
        alert("로그인이 필요합니다.")
    }
};

window.viewMoreSpotReviews = viewMoreSpotReviews
window.handleSpotReviewLike = handleSpotReviewLike
