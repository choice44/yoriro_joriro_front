const proxy = 'http://127.0.0.1:8000';


// 로드 시 실행
window.onload = () => {
    loadReviewList(12);  // 기본으로 관광지 최신 리뷰 보여주기
}


// Review 리스트 GET 요청
async function getReviewsByType(type) {

    const url = `${proxy}/reviews/filter/?spot__type=${type}`;
    const response = await fetch(url, {
        method: "GET",
    });

    const response_json = await response.json();

    return response_json;

};


async function loadReviewList(type) {

    // Review 가져오기
    const reviews = await getReviewsByType(type);

    const review_list = document.getElementById("tourist_spot_review_list_cardbox");

    console.log("함수 실행 중")

    review_list.innerHTML = '';

    if (reviews.results.length == 0) {

        const template = document.createElement("h2");
        template.setAttribute("style", "text-align:center;");
        template.innerText = "아직 작성된 리뷰가 없습니다.";
        review_list.appendChild(template);

    } else {

        reviews.results.forEach((review) => {
            const template = document.createElement("a");
            template.setAttribute("class", "col-md-12");
            template.setAttribute("href", "/reviews/detail/");

            // // 디폴트 이미지
            if (!review.image) {
                review.image = "/images/place-1.jpg";
            };

            // Review 카드 생성
            template.innerHTML = `<div class="car" style="height:200px;">
            <div class="one-4"
            style="width:70%; background:rgba(0, 0, 0, 0.04); padding:20px; height:200px;">
            <span style="float: right; text-align:center;"><i
                    class="fi fi-ss-heart"
                    style="color: red;"></i><span
                    style="margin-top:-0.8em;"><small
                        style="color:#848484;">${review.like_count}</small></span></span>
            <span class="price">${"⭐".repeat(review.rate)} <small
                    style="color:#848484;">방문일:
                    ${review.visited_date}</small></span>

            <h3 style="color:#F78536; margin-bottom:20px;">
            ${review.spot.title} <small style="color:#848484;">${review.spot.addr}</small></h3>
            <span class="price" style="color:#F78536;">${review.title} <small style="color:#848484;">
            ${review.user.nickname}</small></span>
            <p
                style="color:#F78536; margin-bottom:0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${review.content}
            </p>
        </div>
        <div class="one-1"
            style="background-image: url(${review.image}); width:30%;"></div>
        </div>`;

            review_list.appendChild(template);

        });
    };

    // 더보기 버튼 생성
    if (reviews.next) {
        const template = document.createElement("div");

        template.setAttribute("id", "review_more_button");
        template.setAttribute("class", "col-md-12 text-center");

        template.innerHTML = `<input class="btn btn-primary btn-lg" onclick="viewMoreReviewList('${reviews.next}')"
            value="▼ 더보기 ▼" />`;

        review_list.appendChild(template);

    };

};


async function viewMoreReviewList(next) {

    // http://127.0.0.1:8000 -> proxy
    orignal_next_url = next.split('/')
    new_next_url = proxy + '/' + orignal_next_url[3] + '/' + orignal_next_url[4] + '/' + orignal_next_url[5]

    const more_button = document.getElementById("review_more_button");
    more_button.remove();

    const response = await fetch(`${new_next_url}`, {
        method: "GET",
    });

    const more_reviews = await response.json();

    const review_list = document.getElementById("tourist_spot_review_list_cardbox");

    more_reviews.results.forEach((review) => {
        const template = document.createElement("a");
        template.setAttribute("class", "col-md-12");
        template.setAttribute("href", "/reviews/detail/");

        // 디폴트 이미지
        if (!review.image) {
            review.image = "/images/place-1.jpg";
        };

        // Review 카드 생성
        template.innerHTML = `<div class="car" style="height:200px;">
        <div class="one-4"
        style="width:70%; background:rgba(0, 0, 0, 0.04); padding:20px; height:200px;">
        <span style="float: right; text-align:center;"><i
                class="fi fi-ss-heart"
                style="color: red;"></i><span
                style="margin-top:-0.8em;"><small
                    style="color:#848484;">${review.like_count}</small></span></span>
        <span class="price">${"⭐".repeat(review.rate)} <small
                style="color:#848484;">방문일:
                ${review.visited_date}</small></span>

        <h3 style="color:#F78536; margin-bottom:20px;">
        ${review.spot.title} <small style="color:#848484;">${review.spot.addr}</small></h3>
        <span class="price" style="color:#F78536;">${review.title} <small style="color:#848484;">
        ${review.user.nickname}</small></span>
        <p
            style="color:#F78536; margin-bottom:0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${review.content}
        </p>
    </div>
    <div class="one-1"
        style="background-image: url(${review.image}); width:30%;"></div>
    </div>`;

        review_list.appendChild(template);

    });

    // 더보기 버튼 생성
    if (more_reviews.next) {
        const template = document.createElement("div");

        template.setAttribute("id", "review_more_button");
        template.setAttribute("class", "col-md-12 text-center");

        template.innerHTML = `<input class="btn btn-primary btn-lg" onclick="viewMoreReviewList('${more_reviews.next}')"
        value="▼ 더보기 ▼" />`;

        review_list.appendChild(template);

    };

};
