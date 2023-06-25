import { proxy } from "../proxy.js";

// 여행경로 게시글 GET 요청
async function getRoutes() {
    try {
        // 백엔드에 GET 요청
        const response = await fetch(`${proxy}/routes/`, {
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

// 여행경로 게시글 리스트 조회
async function viewRouteList() {
    try {
        // 데이터 요청함수와 route-list라는 id를 가진 태그를 각각 변수에 할당
        const routes_all = await getRoutes();
        const routes = routes_all.results
        const route_list = document.getElementById("route-list");

        routes.forEach((route) => {
            const template = document.createElement("div");
            template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours animate-box fadeInUp animated");
            template.setAttribute("data-animate-effect", "fadeIn");

            let imagePath = "/images/place-1.jpg"
            let rate = "아직 평점이 없습니다"

            // 백엔드 주소 같이 출력되는 것을 제거
            if (route.image) {
                imagePath = proxy + '/' + route.image
            }

            if (route.rate) {
                let rate_halfup = Math.round(route.rate * 10) / 10;
                rate = rate_halfup + "점";
            }

            template.innerHTML = `
            <div href="#"><img src="${imagePath}" alt="여행루트 게시글 이미지" class="img-responsive">
				<div class="desc">
					<span></span>
					<h3>${route.title}</h3>
					<span>${route.duration}일</span>
                    <span>댓글 수: ${route.comment_count}</span>
                    <span>${route.user.nickname}</span>
                    <span style="font-size: 23px;">${rate}</span>
					<a class="btn btn-primary btn-outline" href="detail/index.html?id=${route.id}">상세보기 <i class="icon-arrow-right22"></i></a>
				</div>
            </div>
            `;
            route_list.appendChild(template)

        })
        // 더보기 버튼 생성
        if (routes_all.next) {
            const template = document.createElement("div");

            template.setAttribute("id", "route_more_button");
            template.setAttribute("class", "col-md-12 text-center");

            template.innerHTML = `<input type=button class="btn btn-primary btn-lg" onclick="viewMoreRouteList('${proxy}/${routes_all.next}')"
                value="▼ 더보기 ▼" />`;

            route_list.appendChild(template);
        }

    } catch (error) {
        console.log("에러가 발생했습니다", error);
    }
}

async function viewMoreRouteList(nextURL) {
    try {
        // 데이터 요청함수를 이용하여 다음 페이지의 데이터를 불러옵니다.
        const response = await fetch(nextURL);
        const routes_all = await response.json();
        const routes = routes_all.results;
        const route_list = document.getElementById("route-list");

        // for문 돌면서 게시글들을 생성
        routes.forEach((route) => {
            const template = document.createElement("div");
            template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours animate-box fadeInUp animated");
            template.setAttribute("data-animate-effect", "fadeIn");

            let imagePath = "/images/place-1.jpg"
            let rate = "아직 평점이 없습니다"

            // 백엔드 주소 같이 출력되는 것을 제거
            if (route.image) {
                imagePath = proxy + '/' + route.image;
            }

            if (route.rate) {
                rate = route.rate + "점"
            }

            template.innerHTML = `
            <div href="#"><img src="${imagePath}" alt="여행루트 게시글 이미지" class="img-responsive">
				<div class="desc">
					<span></span>
					<h3>${route.title}</h3>
					<span>${route.duration}일</span>
                    <span>댓글 수: ${route.comment_count}</span>
                    <span>${route.user.nickname}</span>
                    <span style="font-size: 23px;">${rate}</span>
					<a class="btn btn-primary btn-outline" href="detail/index.html?id=${route.id}">상세보기 <i class="icon-arrow-right22"></i></a>
				</div>
            </div>
            `;
            route_list.appendChild(template);
        })

        // 기존의 '더보기' 버튼을 제거
        const oldButton = document.getElementById("route_more_button");
        if (oldButton) {
            oldButton.remove();
        }

        // 만약 다음 페이지가 있으면, 새로운 '더보기' 버튼을 생성합니다.
        if (routes_all.next) {
            const template = document.createElement("div");

            template.setAttribute("id", "route_more_button");
            template.setAttribute("class", "col-md-12 text-center");

            template.innerHTML = `<input class="btn btn-primary btn-lg" onclick="viewMoreRouteList('${proxy}/${routes_all.next}')"
                value="▼ 더보기 ▼" />`;

            route_list.appendChild(template);
        }

    } catch (error) {
        console.log("에러가 발생했습니다", error);
    }
}

window.viewMoreRouteList = viewMoreRouteList

viewRouteList()