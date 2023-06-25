import { proxy } from "../proxy.js"

window.onload = async function () {
    const pageParams = new URLSearchParams(window.location.search)
    let currentPage = pageParams.get('page')
    if (currentPage == null) {
        currentPage = 1
    }

    let recruitments = await getRecruitments(currentPage)

    loadRecruitments(recruitments)
    pagination(recruitments, parseInt(currentPage))
}


async function loadRecruitments(recruitments) {
    const recruitment_list = document.getElementById("recruitment-list")

    recruitments.results.forEach((recruitment) => {
        const template = document.createElement("div");
        template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours animate-box fadeInUp animated");
        template.setAttribute("data-animate-effect", "fadeIn");
        template.setAttribute("onclick", `recruitmentDetail(${recruitment.id})`)

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
                <a class="btn btn-primary btn-outline" href="#">지원하기 <i class="icon-arrow-right22"></i></a>
            </div>
        </div>`
        recruitment_list.appendChild(template)
    })
}


// 로그인을 하지 않으면 상세 페이지 접속 불가
function recruitmentDetail(recruitment_id) {
    if (localStorage.getItem("access")) {
        window.location.href = `/recruitments/detail/index.html?recruitment_id=${recruitment_id}`
    } else {
        alert("로그인이 필요합니다.")
    }
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


// 페이지네이션
async function pagination(recruitments, currentPage) {
    const pageButton = document.getElementById("pagination")

    const previousButton = document.createElement("a")
    previousButton.setAttribute("class", "btn btn-primary btn-outline")
    previousButton.innerText = "이전 페이지"

    // 클릭이 되면 이전 페이지로 이동
    previousButton.addEventListener("click", function () {
        const prevPage = currentPage - 1
        window.location.href = `index.html?page=${prevPage}`
    });

    // 이전 페이지가 없으면 버튼 보이지 않게 설정
    if (recruitments.previous == null) {
        previousButton.style.display = "none"
    }

    const nextButton = document.createElement("a")
    nextButton.setAttribute("class", "btn btn-primary btn-outline")
    nextButton.innerText = "다음 페이지"

    // 클릭이 되면 다음 페이지로 이동
    nextButton.addEventListener("click", function () {
        const nextPage = currentPage + 1
        window.location.href = `index.html?page=${nextPage}`
    });

    // 다음페이지가 없으면 버튼 보이지 않게 설정
    if (recruitments.next == null) {
        nextButton.style.display = "none"
    }

    // 버튼 가운데에 현재 페이지를 보여주는 버튼 추가
    // 클릭 불가능
    const currentPageShow = document.createElement("button")
    currentPageShow.setAttribute("id", "current-page")
    currentPageShow.setAttribute("class", "btn")
    currentPageShow.innerText = currentPage
    currentPageShow.disabled = true;

    pageButton.appendChild(previousButton)
    pageButton.appendChild(currentPageShow)
    pageButton.appendChild(nextButton)
}


window.recruitmentDetail = recruitmentDetail
window.CreateRecruitment = CreateRecruitment