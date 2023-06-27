import { proxy } from "../proxy.js"

window.onload = async function () {
    const pageParams = new URLSearchParams(window.location.search)
    let currentPage = pageParams.get('page')
    if (currentPage == null) {
        currentPage = 1
    }

    let recruitments = await getRecruitments(currentPage)

    loadRecruitments(recruitments)
    // pagination(recruitments, parseInt(currentPage))
}


async function loadRecruitments(recruitments) {
    const recruitment_list = document.getElementById("recruitment-list")

    recruitments.results.forEach((recruitment) => {
        const template = document.createElement("div");
        template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours animate-box fadeInUp animated");
        template.setAttribute("data-animate-effect", "fadeIn");

        let imagePath = ""

        // 날짜 부분만 따로 가져오는 부분입니다.
        let departure = recruitment.departure.split('T')[0]
        let arrival = recruitment.arrival.split('T')[0]

        // 저장된 이미지가 있으면 가져오고, 없으면 지정된 파일 가져오기
        if (recruitment.image) {
            imagePath = proxy + recruitment.image;
            // imagePath = imagePath.split("8000")[1];
        } else {
            imagePath = "/images/car-2.jpg"
        }

        const status = { 0: "모집 중", 1: "모집 완료", 2: "여행 중", 3: "여행 완료" };

        // 3항 연사자를 사용해서 출력되는 글씨와 글씨 색을 다르게 설정
        template.innerHTML = `
        <div><img src="${imagePath}" alt="동료 모집 게시글 이미지" class="img-responsive recruitment-image-thumbnail">
            <div class="desc">
                <span></span>
                <h3>${recruitment.title}</h3>
                <span>${recruitment.place}</span>
                <span>${departure + ' ~ ' + arrival}</span>
                <h3 style="color:${recruitment.is_complete == 0 ? 'red' : 'gray'};">${status[recruitment.is_complete]}</h3>
                <span style="color:${recruitment.participant.length == recruitment.participant_max || recruitment.is_complete != 0 ? 'gray;">모집 완료 ' : 'white;">모집 현황 '}
                <h3 style="display:inline; color:${recruitment.participant.length == recruitment.participant_max || recruitment.is_complete != 0 ? 'gray;"' : 'white;"'}>${recruitment.participant.length + '/' + recruitment.participant_max}</h3></span>
                <a class="btn btn-primary btn-outline" href="/recruitments/detail/index.html?recruitment_id=${recruitment.id}">지원하기 <i class="icon-arrow-right22"></i></a>
            </div>
        </div>`
        recruitment_list.appendChild(template)
    })

    if (recruitments.next) {
        const template = document.createElement("div");

        template.setAttribute("id", "recruitment_more_button");
        template.setAttribute("class", "col-md-12 text-center");

        template.innerHTML = `<input type="button" class="btn btn-primary btn-lg" onclick="viewMoreRecruitments('${proxy}/${recruitments.next}')"
            value="▼ 더보기 ▼" />`;

        recruitment_list.appendChild(template)
    }
}


function recruitmentDetail(recruitment_id) {
    window.location.href = `/recruitments/detail/index.html?recruitment_id=${recruitment_id}`
}


// 로그인을 하지 않으면 게시글 생성 불가
function CreateRecruitment() {
    if (localStorage.getItem("access")) {
        window.location.href = `/recruitments/create/index.html`
    } else {
        alert("로그인이 필요합니다.")
    }
}


async function getRecruitments(page) {
    const response = await fetch(`${proxy}/recruitments/?page=${page}`);
    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("failed")
    }
}


async function viewMoreRecruitments(nextURL) {
    try {
        // 데이터 요청함수를 이용하여 다음 페이지의 데이터를 불러옵니다.
        const response = await fetch(nextURL);
        const recruitments_all = await response.json();
        const recruitments = recruitments_all.results;
        const recruitmentsList = document.getElementById("recruitment-list");

        // for문 돌면서 게시글들을 생성
        recruitments.forEach((recruitment) => {
            const template = document.createElement("div");
            template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours animate-box fadeInUp animated");
            template.setAttribute("data-animate-effect", "fadeIn");

            let imagePath = "/images/car-2.jpg"

            // 백엔드 주소 같이 출력되는 것을 제거
            if (recruitment.image) {
                imagePath = proxy + '/' + recruitment.image;
            }

            const status = { 0: "모집 중", 1: "모집 완료", 2: "여행 중", 3: "여행 완료" };
            let departure = recruitment.departure.split('T')[0]
            let arrival = recruitment.arrival.split('T')[0]

            template.innerHTML = `
            <div><img src="${imagePath}" alt="동료 모집 게시글 이미지" class="img-responsive recruitment-image-thumbnail">
                <div class="desc">
                    <span></span>
                    <h3>${recruitment.title}</h3>
                    <span>${recruitment.place}</span>
                    <span>${departure + ' ~ ' + arrival}</span>
                    <h3 style="color:${recruitment.is_complete == 0 ? 'red' : 'gray'};">${status[recruitment.is_complete]}</h3>
                    <span style="color:${recruitment.participant.length == recruitment.participant_max || recruitment.is_complete != 0 ? 'gray;">모집 완료 ' : 'white;">모집 현황 '}
                    <h3 style="display:inline; color:${recruitment.participant.length == recruitment.participant_max || recruitment.is_complete != 0 ? 'gray;"' : 'white;"'}>${recruitment.participant.length + '/' + recruitment.participant_max}</h3></span>
                    <a class="btn btn-primary btn-outline" href="/recruitments/detail/index.html?recruitment_id=${recruitment.id}">지원하기 <i class="icon-arrow-right22"></i></a>
                </div>
            </div>`

            recruitmentsList.appendChild(template);
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

            template.innerHTML = `<input type="button" class="btn btn-primary btn-lg" onclick="viewMoreRecruitments('${proxy}/${recruitments_all.next}')"
                    value="▼ 더보기 ▼" />`;

            recruitmentsList.appendChild(template);
        }

    } catch (error) {
        console.log("에러가 발생했습니다", error);
    }
}


window.recruitmentDetail = recruitmentDetail
window.CreateRecruitment = CreateRecruitment
window.viewMoreRecruitments = viewMoreRecruitments