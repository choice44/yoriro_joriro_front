const proxy = "http://127.0.0.1:8000"
const front_proxy = "http://127.0.0.1:5500"


window.onload = async function () {
    const pageParams = new URLSearchParams(window.location.search)
    currentPage = pageParams.get('page')
    if (currentPage == null) {
        currentPage = 1
    }

    recruitments = await getRecruitments(currentPage)
    console.log(recruitments)

    loadRecruitments(recruitments)
    pagination(recruitments, parseInt(currentPage))
}


async function loadRecruitments(recruitments) {
    const recruitment_list = document.getElementById("recruitment-list")

    recruitments.results.forEach((recruitment) => {
        const newCard = document.createElement("div")
        newCard.setAttribute("class", "col-lg-4 col-md-4 col-sm-6")
        newCard.setAttribute("onclick", `recruitmentDetail(${recruitment.id})`)

        const newCard_01 = document.createElement("div")
        newCard_01.setAttribute("class", "fh5co-blog animate-box")

        newCard.appendChild(newCard_01)

        const recruitmentUser = document.createElement("h3")
        recruitmentUser.innerText = recruitment.user.nickname
        newCard.appendChild(recruitmentUser)

        const recruitmentPeriod = document.createElement("h4")
        recruitmentPeriod.setAttribute("align", "left")
        departure = recruitment.departure.split('T')[0]
        arrival = recruitment.arrival.split('T')[0]
        recruitmentPeriod.innerText = departure + ' ~ ' + arrival
        newCard.appendChild(recruitmentPeriod)

        const participantCount = document.createElement("h4")
        participantCount.setAttribute("align", "right")
        participant_max = recruitment.participant_max
        participantCount.innerText = recruitment.participant.length + '/' + participant_max
        newCard.appendChild(participantCount)

        const recruitmentImage = document.createElement("img")
        if (recruitment.image != null) {
            recruitmentImage.setAttribute("src", `${recruitment.image}`)
        } else {
            recruitmentImage.setAttribute("src", `../images/car-2.jpg`)
        }
        recruitmentImage.setAttribute("class", "img-responsive")
        newCard.appendChild(recruitmentImage)

        const newCard_02 = document.createElement("div")
        newCard_02.setAttribute("class", "blog-text")
        newCard.appendChild(newCard_02)

        const newCard_03 = document.createElement("div")
        newCard_03.setAttribute("class", "prod-title")
        newCard_02.appendChild(newCard_03)

        const newCardTitle = document.createElement("h3")
        newCardTitle.setAttribute("class", "card-title")
        newCardTitle.innerText = recruitment.title
        newCard_03.appendChild(newCardTitle)

        const postDate = document.createElement("span")
        postDate.setAttribute("class", "posted_by")
        created_at = recruitment.created_at.split('T')
        created_date = created_at[0]
        created_time = created_at[1].split('.')[0]
        postDate.innerText = created_date + ', ' + created_time
        newCard_03.appendChild(postDate)

        const content = document.createElement("p")
        content.innerText = recruitment.content
        newCard_03.appendChild(content)

        recruitment_list.appendChild(newCard)
    })
}


function recruitmentDetail(recruitment_id) {
    console.log(recruitment_id)
    window.location.href = `${front_proxy}/recruitments/recruitments_detail.html?recruitment_id=${recruitment_id}`
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
    const buttons = document.createElement("div")

    const previousButton = document.createElement("button")
    previousButton.innerText = "이전 페이지"

    if (recruitments.previous != null) {
        previousButton.addEventListener("click", function () {
            const prevPage = currentPage - 1
            window.location.href = `recruitments.html?page=${prevPage}`
        });
    } else {
        previousButton.disabled = true;
    }

    const currentPageShow = document.createElement("button")
    currentPageShow.innerText = currentPage
    currentPageShow.disabled = true;

    const nextButton = document.createElement("button")
    nextButton.innerText = "다음 페이지"

    if (recruitments.next != null) {
        nextButton.addEventListener("click", function () {
            const nextPage = currentPage + 1
            window.location.href = `recruitments.html?page=${nextPage}`
        });
    } else {
        nextButton.disabled = true;
    }

    buttons.appendChild(previousButton)
    buttons.appendChild(currentPageShow)
    buttons.appendChild(nextButton)
    pageButton.appendChild(buttons)
}

