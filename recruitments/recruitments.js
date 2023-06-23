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

        let imagePath = "/images/place-1.jpg"
        let departure = recruitment.departure.split('T')[0]
        let arrival = recruitment.arrival.split('T')[0]

        if (recruitment.image) {
            imagePath = proxy + recruitment.image;
            // imagePath = imagePath.split("8000")[1];
        } else {
            imagePath = "/images/car-2.jpg"
        }

        const status = { 0: "모집 중", 1: "모집 완료", 2: "여행 중", 3: "여행 완료" };

        template.innerHTML = `
        <div><img src="${imagePath}" alt="동료 모집 게시글 이미지" class="img-responsive recruitment-image-thumbnail">
            <div class="desc">
                <span></span>
                <h3>${recruitment.title}</h3>
                <span>${recruitment.place}</span>
                <span>${departure + ' ~ ' + arrival}</span>
                <span id="is-complete" style="color:${recruitment.is_complete == 0 ? 'red' : 'gray'};">${status[recruitment.is_complete]}</span>
                <span style="color:${recruitment.participant.length == recruitment.participant_max || recruitment.is_complete != 0 ? 'gray;">모집 완료' : 'white;">모집 현황'}
                <h3 style="display:inline; color:${recruitment.participant.length == recruitment.participant_max || recruitment.is_complete != 0 ? 'gray;"' : 'white;"'}>${recruitment.participant.length + '/' + recruitment.participant_max}</h3></span>
                <a class="btn btn-primary btn-outline" href="#">지원하기 <i class="icon-arrow-right22"></i></a>
            </div>
        </div>`
        recruitment_list.appendChild(template)
    })
}


function recruitmentDetail(recruitment_id) {
    if (localStorage.getItem("access")) {
        window.location.href = `/recruitments/detail/index.html?recruitment_id=${recruitment_id}`
    } else {
        alert("로그인이 필요합니다.")
    }
}


function CreateRecruitment() {
    if (localStorage.getItem("access")) {
        ``
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


async function pagination(recruitments, currentPage) {
    const pageButton = document.getElementById("pagination")

    const previousButton = document.createElement("a")
    previousButton.setAttribute("class", "btn btn-primary btn-outline")
    previousButton.innerText = "이전 페이지"

    previousButton.addEventListener("click", function () {
        const prevPage = currentPage - 1
        window.location.href = `index.html?page=${prevPage}`
    });

    if (recruitments.previous == null) {
        previousButton.style.display = "none"
    }

    const nextButton = document.createElement("a")
    nextButton.setAttribute("class", "btn btn-primary btn-outline")
    nextButton.innerText = "다음 페이지"

    nextButton.addEventListener("click", function () {
        const nextPage = currentPage + 1
        window.location.href = `index.html?page=${nextPage}`
    });

    if (recruitments.next == null) {
        nextButton.style.display = "none"
    }

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