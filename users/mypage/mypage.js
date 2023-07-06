import { proxy } from "/proxy.js";

let my_id = null

if (localStorage.getItem("payload")) {
	my_id = JSON.parse(localStorage.getItem("payload")).user_id;
};

const user_id = new URLSearchParams(window.location.search).get("id");
const token = localStorage.getItem('access')
let following_id_list = []


const areaDict = {};
areaDict[1] = '서울'
areaDict[2] = '인천'
areaDict[3] = '대전'
areaDict[4] = '대구'
areaDict[5] = '광주'
areaDict[6] = '부산'
areaDict[7] = '울산'
areaDict[8] = '세종특별자치시'
areaDict[31] = '경기도'
areaDict[32] = '강원도'
areaDict[33] = '충청북도'
areaDict[34] = '충청남도'
areaDict[35] = '경상북도'
areaDict[36] = '경상남도'
areaDict[37] = '전라북도'
areaDict[38] = '전라남도'
areaDict[39] = '제주도'


const sigunguDict = {};
sigunguDict[1] = new Array("선택", "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구");
sigunguDict[2] = new Array("선택", "강화군", "계양구", "미추홀구", "남동구", "동구", "부평구", "서구", "연수구", "옹진군", "중구");
sigunguDict[3] = new Array("선택", "대덕구", "동구", "서구", "유성구", "중구");
sigunguDict[4] = new Array("선택", "남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구");
sigunguDict[5] = new Array("선택", "광산구", "남구", "동구", "북구", "서구");
sigunguDict[6] = new Array("선택", "강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구");
sigunguDict[7] = new Array("선택", "중구", "남구", "동구", "북구", "울주군");
sigunguDict[8] = new Array("선택", "세종특별자치시");
sigunguDict[31] = new Array("선택", "가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시");
sigunguDict[32] = new Array("선택", "강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군");
sigunguDict[33] = new Array("선택", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "진천군", "청원군", "청주시", "충주시", "증평군");
sigunguDict[34] = new Array("선택", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시", "청양군", "태안군", "홍성군", "계룡시");
sigunguDict[35] = new Array("선택", "경산시", "경주시", "고령군", "구미시", "군위군", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시");
sigunguDict[36] = new Array("선택", "거제시", "거창군", "고성군", "김해시", "남해군", "마산시", "밀양시", "사천시", "산청군", "양산시", "의령군", "진주시", "진해시", "창녕군", "창원시", "통영시", "하동군", "함안군", "함양군", "합천군");
sigunguDict[37] = new Array("선택", "고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군");
sigunguDict[38] = new Array("선택", "강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군");
sigunguDict[39] = new Array("선택", "남제주군", "북제주군", "서귀포시", "제주시");


window.onload = async function loadMypage() {
	if (localStorage.getItem("payload")) {
		const my_info = await getMypage(my_id);

		for (const following of my_info.followings) {
			following_id_list.push(following.id);
		};

		if (user_id == my_id) {
			my_info.is_mymypage = true;
			inputUserInfo(my_info);
		} else {
			my_info.is_mymypage = false;
			const user = await getMypage(user_id);
			inputUserInfo(user);
		};
		my_info.is_mymypage ? showEditButtons() : showFollowButton();
	} else {
		const user = await getMypage(user_id);
		inputUserInfo(user);
	};

	loadFollowers();
	viewRouteList();
	viewReviewList();
	viewRecruitmentList()

};


async function getMypage(user_id) {
	const response = await fetch(`${proxy}/users/mypage/${user_id}/`)
	if (response.status == 200) {
		const response_json = await response.json();
		return response_json
	} else {
		alert("불러오는데 실패했습니다")
	}
}


// Route 리스트 GET 요청
async function getRoutes() {

    const url = `${proxy}/users/mypage/${user_id}/routes/`;
    const response = await fetch(url, {
        method: "GET",
    });

    const response_json = await response.json();
    return response_json;

};


async function viewRouteList() {

    // Route 정보 가져오기
    const routes_all = await getRoutes();
	const routes = routes_all.results
    const route_list = document.getElementById("main_routes_cardbox");

    routes.forEach((route) => {
        const template = document.createElement("div");
        template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours fadeInUp animated");
        template.setAttribute("data-animate-effect", "fadeIn");
        template.setAttribute("style", "cursor:pointer;");

        // 디폴트 이미지
        if (!route.image) {
            route.image = "/images/place-6.jpg";
        } else {
            route.image = proxy + route.image
        };

        // rate 없으면 ""
        // 반올림해서 정수로
        if (!route.rate || route.rate == 0) {
            route.rate = "";
        } else {
            route.rate = Math.round(route.rate * 10) / 10 + "점";
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
	
	if (routes_all.next) {
		const template = document.createElement("div");

		template.setAttribute("id", "route_more_button");
		template.setAttribute("class", "col-md-12 text-center");

		template.innerHTML = `<input type=button class="btn btn-primary btn-lg" onclick="viewMoreRouteList('${proxy}/${routes_all.next}')"
			value="▼ 더보기 ▼" />`;
		route_list.appendChild(template);
	}
};


async function viewMoreRouteList(nextURL) {
    try {
        // 데이터 요청함수를 이용하여 다음 페이지의 데이터를 불러옵니다.
        const response = await fetch(nextURL);
        const routes_all = await response.json();
        const routes = routes_all.results;
        const route_list = document.getElementById("main_routes_cardbox");
		const areas = { 1: "서울", 2: "인천", 3: "대전", 4: "대구", 5: "광주", 6: "부산", 7: "울산", 8: "세종특별자치시", 31: "경기도", 32: "강원도", 33: "충청북도", 34: "충청남도", 35: "경상북도", 36: "경상남도", 37: "전라북도", 38: "전라남도", 39: "제주도" };

		// for문 돌면서 게시글들을 생성
        routes.forEach((route) => {
            const template = document.createElement("div");
            template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours animate-box fadeInUp animated");
            template.setAttribute("data-animate-effect", "fadeIn");

			if (!route.image) {
				route.image = "/images/place-6.jpg";
			} else {
				route.image = proxy + route.image
			};

            let imagePath = "/images/place-1.jpg"
            let rate = ""

            // 백엔드 주소 같이 출력되는 것을 제거
            if (route.image) {
                imagePath = proxy + '/' + route.image;
            }

            if (route.rate) {
                rate = route.rate + "점"
			}
		
            template.innerHTML = `
			<div onclick="location.href='/routes/detail/index.html?id=${route.id}'" style="overflow:hidden;"><img src="${route.image}" alt="대표 이미지" class="img-responsive" style="height: 300px; width:100%; object-fit:cover;">
				<div class="desc">
				<div style="margin-bottom:10px;">
					<span style="display:inline;">${areas[route.areas[0].area]}</span>
					<h2 style="color:#F78536; display:inline; float:right; margin-bottom:0; font-size:24px;">${rate}</h2>
				</div>
					<h3 style="font-size:26px">${route.title}</h3>
				</div>
			</div>`;
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

            template.innerHTML = `<input type=button class="btn btn-primary btn-lg" onclick="viewMoreRouteList('${proxy}/${routes_all.next}')"
                value="▼ 더보기 ▼" />`;
            route_list.appendChild(template);
        }
    } catch (error) {
        console.log("에러가 발생했습니다", error);
    }
}


// Review 리스트 GET 요청
async function getReviews() {
    const url = `${proxy}/users/mypage/${user_id}/reviews/`;
    const response = await fetch(url, {
        method: "GET",
    });
    const response_json = await response.json();
    return response_json;
};


async function viewReviewList() {

    // Review 정보 가져오기
	const reviews_all = await getReviews();
	const reviews = reviews_all.results
    const review_list = document.getElementById("main_reviews_cardbox");

    reviews.forEach((review) => {
        const template = document.createElement("div");
        template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours fadeInUp animated");
        template.setAttribute("data-animate-effect", "fadeIn");
        template.setAttribute("style", "cursor:pointer;");

        // 디폴트 이미지
        if (!review.image) {
            review.image = "/images/place-6.jpg";
        } else {
            review.image = proxy + review.image
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
	if (reviews_all.next) {
		const template = document.createElement("div");

		template.setAttribute("id", "review_more_button");
		template.setAttribute("class", "col-md-12 text-center");

		template.innerHTML = `<input type=button class="btn btn-primary btn-lg" onclick="viewMoreReviewList('${proxy}/${reviews_all.next}')"
			value="▼ 더보기 ▼" />`;
		review_list.appendChild(template);
	}
};


async function viewMoreReviewList(nextURL) {
    try {
        // 데이터 요청함수를 이용하여 다음 페이지의 데이터를 불러옵니다.
        const response = await fetch(nextURL);
        const reviews_all = await response.json();
        const reviews = reviews_all.results;
        const review_list = document.getElementById("main_reviews_cardbox");

		// for문 돌면서 게시글들을 생성
        reviews.forEach((review) => {
            const template = document.createElement("div");
            template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours animate-box fadeInUp animated");
            template.setAttribute("data-animate-effect", "fadeIn");

			if (!review.image) {
				review.image = "/images/place-6.jpg";
			} else {
				review.image = proxy + review.image
			};

            let imagePath = "/images/place-1.jpg"
            let rate = ""

            // 백엔드 주소 같이 출력되는 것을 제거
            if (review.image) {
                imagePath = proxy + '/' + review.image;
            }

            if (review.rate) {
                rate = review.rate + "점"
			}
		
            template.innerHTML = `
			<div onclick="location.href='/reviews/detail/index.html?id=${review.id}'" style="overflow:hidden;"><img src="${review.image}" alt="대표 이미지" class="img-responsive" style="height: 300px; width:100%; object-fit:cover;">
				<div class="desc">
					<span>${"⭐".repeat(review.rate)}</span>
					<h3>${review.spot.title}</h3>
					<span>${review.title}</span>
				</div>
			</div>`;
            review_list.appendChild(template);
        })

        // 기존의 '더보기' 버튼을 제거
        const oldButton = document.getElementById("review_more_button");
        if (oldButton) {
            oldButton.remove();
        }

        // 만약 다음 페이지가 있으면, 새로운 '더보기' 버튼을 생성합니다.
        if (reviews_all.next) {
            const template = document.createElement("div");

            template.setAttribute("id", "review_more_button");
            template.setAttribute("class", "col-md-12 text-center");

            template.innerHTML = `<input type=button class="btn btn-primary btn-lg" onclick="viewMoreReviewList('${proxy}/${reviews_all.next}')"
                value="▼ 더보기 ▼" />`;
            review_list.appendChild(template);
        }
    } catch (error) {
        console.log("에러가 발생했습니다", error);
    }
}





// Recruitment 리스트 GET 요청
async function getRecruitments() {

    const url = `${proxy}/users/mypage/${user_id}/recruitments/`;
    const response = await fetch(url, {
        method: "GET",
    });
	const response_json = await response.json();
    return response_json;
	// return await response_json.results.filter(async(node)=> await node.user.id===user_id)
};


async function viewRecruitmentList() {

    // Recruitment 정보 가져오기
    const recruitments_all = await getRecruitments();
	const recruitments = recruitments_all.results
    const recruitment_list = document.getElementById("main_recruitments_cardbox");

    recruitments.forEach((recruitment) => {
        const template = document.createElement("div");
        template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours fadeInUp animated");
        template.setAttribute("data-animate-effect", "fadeIn");
        template.setAttribute("style", "cursor:pointer;");

        // 디폴트 이미지
        if (!recruitment.image) {
            recruitment.image = "/images/place-6.jpg";
        } else {
            recruitment.image = proxy + recruitment.image
        };

        const status = { 0: "모집중", 1: "모집완료", 2: "여행중", 3: "여행완료" };

        // Recruitment 카드 생성
        if (recruitment.is_complete == 0) {
            template.innerHTML = `
        <div onclick="location.href='/recruitments/detail/index.html?recruitment_id=${recruitment.id}'" style="overflow:hidden;"><img src="${recruitment.image}" alt="대표 이미지" class="img-responsive" style="height: 300px; width:100%; object-fit:cover;">
            <div class="desc">
            <span style="color:red; font-weight:500; font-size:20px;">모집중</span>
                <h3>${recruitment.place} <span style="display:inline; color:#F78536">${recruitment.participant.length}</span><small
                        style="display:inline; font-weight:300; font-size:85%; color:white;">/${recruitment.participant_max}</small>
                </h3>
                <span>${recruitment.title}</span>
            </div>    
        </div>`;
        } else {
            template.innerHTML = `
            <div onclick="location.href='/recruitments/detail/index.html?recruitment_id=${recruitment.id}'" style="overflow:hidden;"><img src="${recruitment.image}" alt="대표 이미지" class="img-responsive" style="height: 300px; width:100%; object-fit:cover;">
                <div class="desc">
                    <h3>${recruitment.place} <small><span style="display:inline; font-weight:300;">${recruitment.participant_max}명 </span>${status[recruitment.is_complete]}</small>
                    </h3>
                    <span>${recruitment.title}</span>
                </div>    
            </div>`;
        };
        recruitment_list.appendChild(template);
	});
	if (recruitments_all.next) {
		const template = document.createElement("div");

		template.setAttribute("id", "recruitment_more_button");
		template.setAttribute("class", "col-md-12 text-center");

		template.innerHTML = `<input type=button class="btn btn-primary btn-lg" onclick="viewMoreRecruitmentList('${proxy}/${recruitments_all.next}')"
			value="▼ 더보기 ▼" />`;
		recruitment_list.appendChild(template);
	}
};


async function viewMoreRecruitmentList(nextURL) {
    try {
        // 데이터 요청함수를 이용하여 다음 페이지의 데이터를 불러옵니다.
        const response = await fetch(nextURL);
        const recruitments_all = await response.json();
        const recruitments = recruitments_all.results;
        const recruitment_list = document.getElementById("main_recruitments_cardbox");

		// for문 돌면서 게시글들을 생성
        recruitments.forEach((recruitment) => {
            const template = document.createElement("div");
            template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours animate-box fadeInUp animated");
            template.setAttribute("data-animate-effect", "fadeIn");

			if (!recruitment.image) {
				recruitment.image = "/images/place-6.jpg";
			} else {
				recruitment.image = proxy + recruitment.image
			};

            let imagePath = "/images/place-1.jpg"
            let rate = ""

            // 백엔드 주소 같이 출력되는 것을 제거
            if (recruitment.image) {
                imagePath = proxy + '/' + recruitment.image;
            }

            if (recruitment.rate) {
                rate = recruitment.rate + "점"
			}
		if (recruitment.is_complete == 0) {
            template.innerHTML = `
			<div onclick="location.href='/recruitments/detail/index.html?recruitment_id=${recruitment.id}'" style="overflow:hidden;"><img src="${recruitment.image}" alt="대표 이미지" class="img-responsive" style="height: 300px; width:100%; object-fit:cover;">
				<div class="desc">
				<span style="color:red; font-weight:500; font-size:20px;">모집중</span>
					<h3>${recruitment.place} <span style="display:inline; color:#F78536">${recruitment.participant.length}</span><small
                        style="display:inline; font-weight:300; font-size:85%; color:white;">/${recruitment.participant_max}</small>
					</h3>
					<span>${recruitment.title}</span>
				</div>    
			</div>`;
			} else {
				template.innerHTML = `
				<div onclick="location.href='/recruitments/detail/index.html?recruitment_id=${recruitment.id}'" style="overflow:hidden;"><img src="${recruitment.image}" alt="대표 이미지" class="img-responsive" style="height: 300px; width:100%; object-fit:cover;">
					<div class="desc">
						<h3>${recruitment.place} <small><span style="display:inline; font-weight:300;">${recruitment.participant_max}명 </span>${status[recruitment.is_complete]}</small>
						</h3>
						<span>${recruitment.title}</span>
					</div>    
				</div>`;
			};
            recruitment_list.appendChild(template);
        })

        // 기존의 '더보기' 버튼을 제거
        const oldButton = document.getElementById("recruitment_more_button");
        if (oldButton) {
            oldButton.remove();
        }

        // 만약 다음 페이지가 있으면, 새로운 '더보기' 버튼을 생성합니다.
        if (recruitments_all.next) {
            const template = document.createElement("div");

            template.setAttribute("id", "recruitment_more_button");
            template.setAttribute("class", "col-md-12 text-center");

            template.innerHTML = `<input type=button class="btn btn-primary btn-lg" onclick="viewMoreRecruitmentList('${proxy}/${recruitments_all.next}')"
                value="▼ 더보기 ▼" />`;
			recruitment_list.appendChild(template);
        }
    } catch (error) {
        console.log("에러가 발생했습니다", error);
    }
}


function convertGender(gender) {
	if (gender === "F") {
		return "여성";
	} else if (gender === "M") {
		return "남성";
	} else {
		return "";
	}
}


// 유저 정보 집어넣기
async function inputUserInfo(user) {
	const user_nickname = document.getElementById("mypage_nickname")
	user_nickname.innerHTML = `${user.nickname}<span class="subtext">${user.email}</span>`
	const user_bio = document.getElementById("mypage_bio")
	user_bio.innerText = user.bio
	const user_gender = document.getElementById("mypage_gender");
	user_gender.innerHTML = convertGender(user.gender)
	const user_age = document.getElementById("mypage_age")

	let age_group
	if (user.age) {
		age_group = parseInt(user.age / 10) * 10
		if (age_group >= 80) {
			age_group = "80대 이상";
		} else if (age_group >= 10) {
			age_group = age_group + "대";
		} else {
			age_group = "9세 이하";
		};
	} else {
		age_group = null
	};

	user_age.innerHTML = age_group
	const user_followers = document.getElementById("mypage_followers")
	user_followers.innerHTML = "팔로워 " + user.followers_count;
	const user_followings = document.getElementById("mypage_followings")
	user_followings.innerHTML = "팔로잉 " + user.followings_count

	const user_image = document.getElementById("mypage_image");
	if (user.image) {
		user_image.setAttribute("src", proxy + user.image);
	};
	const user_area = document.getElementById("mypage_area")
	if (user.area) {
		user_area.innerHTML = areaDict[user.area]
	}
	const user_sigungu = document.getElementById("mypage_sigungu")
	if (user.sigungu) {
		user_sigungu.innerHTML = sigunguDict[user.area][user.sigungu]
	}
}


async function loadFollowings() {

	const userProfile = await getMypage(user_id)

	const followingElement = document.getElementById("mypage_follow_list");

	followingElement.innerHTML = "";

	for (const following of userProfile.followings) {
		// 디폴트 이미지
		if (!following.image) {
			following.image = "/images/logo_64.png";
		} else {
			following.image = proxy + "/media/" + following.image
		};
		following.is_following = following_id_list.includes(following.id);
		// 자기 자신일 경우 팔로우/언팔로우 버튼 없음
		if (following.id == my_id || !localStorage.getItem("payload")) {
			followingElement.innerHTML += `
			<div class="col-md-2" style="height:80px;">
			<a class="image featured-ji" style="display:block; width:70px; height:70px; margin: 0;" href="/users/mypage/index.html?id=${following.id}">
				<img src="${following.image}" alt="팔로워 이미지" />
			</a>
				</div>
  <div class="col-md-7" style="height:80px;">
	  <h3 class="price"
		  style="color:#F78536; margin-bottom:3px; margin-top:12px; cursor:pointer;" onclick="location.href='/users/mypage/index.html?id=${following.id}'">
		  ${following.nickname}</h3>
		  <span>${following.email}</span>
		  </div>
		  <div class="col-md-3" style="height:80px;"></div>
      `} else { // 팔로우하고 있는 사람의 경우 언팔로우 버튼
			if (following.is_following) {
				followingElement.innerHTML += `
				<div class="col-md-2" style="height:80px;">
					<a class="image featured-ji" style="display:block; width:70px; height:70px; margin: 0;" href="/users/mypage/index.html?id=${following.id}">
						<img src="${following.image}" alt="팔로워 이미지" />
					</a>
				</div>
      			<div class="col-md-7" style="height:80px;">
          			<h3 class="price"
              		style="color:#F78536; margin-bottom:3px; margin-top:12px; cursor:pointer;" onclick="location.href='/users/mypage/index.html?id=${following.id}'">
              		${following.nickname}</h3>
			  		<span>${following.email}</span>
			  	</div>
			  	<div class="col-md-3" style="height:80px;">
              		<input type="button" value="언팔로우"
              		class="btn-ji btn-primary btn-lg"
              		style="float:right; margin:16px 0; background-color:#848484; width:116px;"
              		onclick="handleFollow(${following.id}); changeMypageFollowButton(this);">
      			</div>
      `} else { // 아니면 팔로우 버튼
				followingElement.innerHTML += `
				<div class="col-md-2" style="height:80px;">
					<a class="image featured-ji" style="display:block; width:70px; height:70px; margin: 0;" href="/users/mypage/index.html?id=${following.id}">
						<img src="${following.image}" alt="팔로워 이미지" />
					</a>
				</div>
      			<div class="col-md-7" style="height:80px;">
          			<h3 class="price"
              		style="color:#F78536; margin-bottom:3px; margin-top:12px; cursor:pointer;" onclick="location.href='/users/mypage/index.html?id=${following.id}'">
              		${following.nickname}</h3>
			  		<span>${following.email}</span>
			  	</div>
			  	<div class="col-md-3" style="height:80px;">
          			<input type="button" value="팔로우"
              		class="btn-ji btn-primary btn-lg"
              		style="float:right; margin:16px 0; width:116px;"
              		onclick="handleFollow(${following.id}); changeMypageFollowButton(this);">
      			</div>
      `}
		};
	};
};


async function loadFollowers() {

	const userProfile = await getMypage(user_id);

	const followerElement = document.getElementById("mypage_follow_list");

	followerElement.innerHTML = "";

	// 팔로워 표시
	for (const follower of userProfile.followers) {
		// 디폴트 이미지
		if (!follower.image) {
			follower.image = "/images/logo_64.png";
		} else {
			follower.image = proxy + "/media/" + follower.image
		};
		follower.is_following = following_id_list.includes(follower.id);
		// 자기 자신일 경우 팔로우/언팔로우 버튼 없음
		if (follower.id == my_id || !localStorage.getItem("payload")) {
			followerElement.innerHTML += `
			<div class="col-md-2" style="height:80px;">
				<a class="image featured-ji" style="display:block; width:70px; height:70px; margin: 0;" href="/users/mypage/index.html?id=${follower.id}">
					<img src="${follower.image}" alt="팔로워 이미지" />
				</a>
			</div>
  			<div class="col-md-7" style="height:80px;">
	  			<h3 class="price"
		  		style="color:#F78536; margin-bottom:3px; margin-top:12px; cursor:pointer;" onclick="location.href='/users/mypage/index.html?id=${follower.id}'">
		  		${follower.nickname}</h3>
		  		<span>${follower.email}</span>
		  	</div>
		  	<div class="col-md-3" style="height:80px;"></div>
      `} else {
			// 팔로우하고 있는 사람의 경우 언팔로우 버튼
			if (follower.is_following) {
				followerElement.innerHTML += `
				<div class="col-md-2" style="height:80px;">
					<a class="image featured-ji" style="display:block; width:70px; height:70px; margin: 0;" href="/users/mypage/index.html?id=${follower.id}">
						<img src="${follower.image}" alt="팔로워 이미지" />
					</a>
				</div>
      			<div class="col-md-7" style="height:80px;">
          			<h3 class="price"
              		style="color:#F78536; margin-bottom:3px; margin-top:12px; cursor:pointer;" onclick="location.href='/users/mypage/index.html?id=${follower.id}'">
              		${follower.nickname}</h3>
			  		<span>${follower.email}</span>
			  	</div>
			  	<div class="col-md-3" style="height:80px;">
              		<input type="button" value="언팔로우"
              		class="btn-ji btn-primary btn-lg"
              		style="float:right; margin:16px 0; background-color:#848484; width:116px;"
              		onclick="handleFollow(${follower.id}); changeMypageFollowButton(this);">
      			</div>
      `} else { // 아니면 팔로우 버튼
				followerElement.innerHTML += `
				<div class="col-md-2" style="height:80px;">
					<a class="image featured-ji" style="display:block; width:70px; height:70px; margin: 0;" href="/users/mypage/index.html?id=${follower.id}">
						<img src="${follower.image}" alt="팔로워 이미지" />
					</a>
				</div>
      			<div class="col-md-7" style="height:80px;">
          			<h3 class="price"
              		style="color:#F78536; margin-bottom:3px; margin-top:12px; cursor:pointer;" onclick="location.href='/users/mypage/index.html?id=${follower.id}'">
              		${follower.nickname}</h3>
			  		<span>${follower.email}</span>
			  	</div>
			  	<div class="col-md-3" style="height:80px;">
          			<input type="button" value="팔로우"
              		class="btn-ji btn-primary btn-lg"
              		style="float:right; margin:16px 0; width:116px;"
              		onclick="handleFollow(${follower.id}); changeMypageFollowButton(this);">
      			</div>
				`};
		};
	};
};

// 팔로우
async function handleFollow(id) {

	const response = await fetch(`${proxy}/users/follow/${id}/`, {
		headers: {
			"content-type": "application/json",
			"Authorization": "Bearer " + token
		},
		method: "POST"
	});

	if (following_id_list.includes(id)) {
		following_id_list = following_id_list.filter(followingId => followingId !== id);
	} else {
		following_id_list.push(id);
	};
};

// 팔로우/언팔로우 버튼 바꿔주는 함수
function changeMypageFollowButton(el) {
	const my_id = JSON.parse(localStorage.getItem("payload")).user_id;
	if (el.value == "팔로우") {
		el.setAttribute("value", "언팔로우");
		el.setAttribute("style", "float:right; margin:16px 0; background-color:#848484; width:116px;")
		if (user_id == my_id) {
			const user_followings = document.getElementById("mypage_followings")
			const user_followings_number = document.getElementById("mypage_followings").innerText.slice(4)
			user_followings.innerHTML = `팔로잉 ${Number(user_followings_number) + 1}`
		};
	} else {
		el.setAttribute("value", "팔로우");
		el.setAttribute("style", "float:right; margin:16px 0; width:116px;")
		if (user_id == my_id) {
			const user_followings = document.getElementById("mypage_followings")
			const user_followings_number = document.getElementById("mypage_followings").innerText.slice(4)
			user_followings.innerHTML = `팔로잉 ${user_followings_number - 1}`
		};
	};
}


// 회원탈퇴 함수
async function deleteUser() {

	try {
		const confirmation = confirm('회원 탈퇴하시겠습니까?');

		if (!confirmation) {
			return; // 탈퇴 취소 시 함수 종료
		}

		// 백엔드에 회원 탈퇴 요청
		const response = await fetch(`${proxy}/users/mypage/${my_id}/`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		if (!response.ok) {
			throw new Error('회원 탈퇴에 실패하였습니다.');
		}

		alert('회원 탈퇴가 완료되었습니다.');

		// 회원 탈퇴 후 메인페이지로 이동
		localStorage.removeItem("access");
		localStorage.removeItem("refresh");
		localStorage.removeItem("payload");

		location.replace('/')

	} catch (error) {
		console.error('Error:', error);
	}
}


window.deleteUser = deleteUser
window.loadFollowings = loadFollowings
window.loadFollowers = loadFollowers
window.handleFollow = handleFollow
window.changeMypageFollowButton = changeMypageFollowButton
window.viewMoreRouteList = viewMoreRouteList
window.viewMoreReviewList = viewMoreReviewList
window.viewMoreRecruitmentList = viewMoreRecruitmentList

// 본인인 경우 수정 버튼과 삭제 버튼을 보이도록 처리하는 함수
function showEditButtons() {
	const my_buttons = document.getElementById("mypage_my_buttons");

	const temp_update_button = document.createElement("input");
	temp_update_button.setAttribute("type", "button");
	temp_update_button.setAttribute("class", "btn btn-primary btn-outline btn-lg");
	temp_update_button.setAttribute("value", "수정하기");
	temp_update_button.setAttribute("style", "margin-right:15px; margin-top: 25px;");
	temp_update_button.setAttribute("onclick", "location.href='/users/mypage/update/index.html'")
	my_buttons.appendChild(temp_update_button);

	const temp_delete_button = document.createElement("input");
	temp_delete_button.setAttribute("type", "button");
	temp_delete_button.setAttribute("class", "btn btn-primary btn-lg");
	temp_delete_button.setAttribute("id", "mypage_delete_button");
	temp_delete_button.setAttribute("value", "탈퇴하기");
	temp_delete_button.setAttribute("style", "background-color:#848484; margin-top: 25px;");
	my_buttons.appendChild(temp_delete_button);

	const deleteButton = document.getElementById("mypage_delete_button");
	deleteButton.addEventListener('click', deleteUser);

}

// 타인인 경우 팔로우 또는 언팔로우 버튼을 보여주는 함수
function showFollowButton() {

	const my_buttons = document.getElementById("mypage_my_buttons");

	if (following_id_list.includes(Number(user_id)) == true) {
		const temp_unfollow_button = document.createElement("input");
		temp_unfollow_button.setAttribute("type", "button");
		temp_unfollow_button.setAttribute("class", "btn-ji btn-primary btn-lg");
		temp_unfollow_button.setAttribute("value", "언팔로우");
		temp_unfollow_button.setAttribute("style", "margin: 16px 0; background-color:#848484; width:116px; float:right;");
		temp_unfollow_button.setAttribute("onclick", `handleFollow(${user_id}); changeMypageFollowButton(this);`);
		my_buttons.appendChild(temp_unfollow_button);
	} else {
		const temp_follow_button = document.createElement("input");
		temp_follow_button.setAttribute("type", "button");
		temp_follow_button.setAttribute("class", "btn-ji btn-primary btn-lg");
		temp_follow_button.setAttribute("value", "팔로우");
		temp_follow_button.setAttribute("style", "margin: 16px 0; width:116px; float:right;");
		temp_follow_button.setAttribute("onclick", `handleFollow(${user_id}); changeMypageFollowButton(this);`);
		my_buttons.appendChild(temp_follow_button);
	};
};
