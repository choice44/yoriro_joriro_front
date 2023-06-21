import { proxy } from "/proxy.js";

window.onload = () => {
    viewRouteList()
    viewRecruitmentList()
    viewReviewList()
}

// Route 리스트 GET 요청
async function getRoutes() {

    const url = `${proxy}/routes/`;
    const response = await fetch(url, {
        method: "GET",
    });

    const response_json = await response.json();

    return response_json;

};

async function viewRouteList() {

    // Route 정보 가져오기
    const routes = await getRoutes();

    const route_list = document.getElementById("main_routes_cardbox");

    routes.results.forEach((route) => {
        const template = document.createElement("div");
        template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours fadeInUp animated");
        template.setAttribute("data-animate-effect", "fadeIn");
        template.setAttribute("style", "cursor:pointer;");

        // 디폴트 이미지
        if (!route.image) {
            route.image = "/images/place-6.jpg";
        };

        // rate 없으면 ""
        // 반올림해서 정수로
        if (!route.rate || route.rate == 0) {
            route.rate = "";
        } else {
            route.rate = Math.round(route.rate) + "점";
        };

        const areas = { 1: "서울", 2: "인천", 3: "대전", 4: "대구", 5: "광주", 6: "부산", 7: "울산", 8: "세종특별자치시", 31: "경기도", 32: "강원도", 33: "충청북도", 34: "충청남도", 35: "경상북도", 36: "경상남도", 37: "전라북도", 38: "전라남도", 39: "제주도" };

        // Route 카드 생성
        template.innerHTML = `
        <div onclick="location.href='/routes/detail/index.html?id=${route.id}'" style="overflow:hidden;"><img src="${route.image}" alt="대표 이미지" class="img-responsive" style="height: 300px; width:100%; object-fit:cover;">
            <div class="desc">
            <div style="margin-bottom:10px;">
                <span style="display:inline;">${areas[route.areas[0].area]}</span>
                <h2 style="color:#F78536; display:inline; float:right; margin-bottom:0; font-size:24px;">${route.rate}</h2>
            </div>
                <h3 style="font-size:26px">${route.title}</h3>
            </div>
        </div>`;

        route_list.appendChild(template);

    });

};


// Recruitment 리스트 GET 요청
async function getRecruitments() {

    const url = `${proxy}/recruitments/`;
    const response = await fetch(url, {
        method: "GET",
    });

    const response_json = await response.json();

    return response_json;

};


async function viewRecruitmentList() {

    // Recruitment 정보 가져오기
    const recruitments = await getRecruitments();

    const recruitment_list = document.getElementById("main_recruitments_cardbox");

    recruitments.results.forEach((recruitment) => {
        const template = document.createElement("div");
        template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours fadeInUp animated");
        template.setAttribute("data-animate-effect", "fadeIn");
        template.setAttribute("style", "cursor:pointer;");

        // 디폴트 이미지
        if (!recruitment.image) {
            recruitment.image = "/images/place-6.jpg";
        };

        const status = { 0: "모집중", 1: "모집완료", 2: "여행중", 3: "여행완료" };

        // Recruitment 카드 생성
        if (recruitment.is_complete == 0) {
            template.innerHTML = `
        <div onclick="location.href='/recruitments/recruitments_detail.html?id=${recruitment.id}'" style="overflow:hidden;"><img src="${recruitment.image}" alt="대표 이미지" class="img-responsive" style="height: 300px; width:100%; object-fit:cover;">
            <div class="desc">
                <h3>${recruitment.place} <span style="display:inline; color:#F78536">${recruitment.participant_max}명 </span><small
                        style="color:red; font-weight:600;">모집중</small>
                </h3>
                <span>${recruitment.title}</span>
            </div>    
        </div>`;
        } else {
            template.innerHTML = `
            <div onclick="location.href='/recruitments/recruitments_detail.html?id=${recruitment.id}'" style="overflow:hidden;"><img src="${recruitment.image}" alt="대표 이미지" class="img-responsive" style="height: 300px; width:100%; object-fit:cover;">
                <div class="desc">
                    <h3>${recruitment.place} <span style="display:inline; color:#F78536">${recruitment.participant_max}명 </span><small
                            >${status[recruitment.is_complete]}</small>
                    </h3>
                    <span>${recruitment.title}</span>
                </div>    
            </div>`;
        };

        recruitment_list.appendChild(template);

    });

};


// Review 리스트 GET 요청
async function getReviews() {

    const url = `${proxy}/reviews/filter/`;
    const response = await fetch(url, {
        method: "GET",
    });

    const response_json = await response.json();

    return response_json;

};


async function viewReviewList() {

    // Review 정보 가져오기
    const reviews = await getReviews();

    const review_list = document.getElementById("main_reviews_cardbox");

    reviews.results.forEach((review) => {
        const template = document.createElement("div");
        template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours fadeInUp animated");
        template.setAttribute("data-animate-effect", "fadeIn");
        template.setAttribute("style", "cursor:pointer;");

        // 디폴트 이미지
        if (!review.image) {
            review.image = "/images/place-6.jpg";
        };

        // Review 카드 생성
        template.innerHTML = `
        <div onclick="location.href='/reviews/detail/index.html?id=${review.id}'" style="overflow:hidden;"><img src="${review.image}" alt="대표 이미지" class="img-responsive" style="height: 300px; width:100%; object-fit:cover;">
            <div class="desc">
                <span>${"⭐".repeat(review.rate)}</span>
                <h3>${review.spot.title}</h3>
                <span>${review.title}</span>
            </div>
        </div>`;

        review_list.appendChild(template);

    });

};
