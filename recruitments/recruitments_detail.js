const proxy = "http://127.0.0.1:8000"
const front_proxy = "http://127.0.0.1:5500"

let recruitmentId

window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search)
    recruitmentId = urlParams.get('recruitment_id')
    console.log(recruitmentId)

    await loadRecruitmentDetail(recruitmentId)
    await loadJoin(recruitmentId)
}


async function loadRecruitmentDetail(recruitmentId) {
    const response = await getRecruitment(recruitmentId)
    console.log(response)

    const recruitmentWriter = document.getElementById("writer-info")
    recruitmentWriter.innerText = response.user
    console.log("userinfo : ", response.user)
    nickname = response.user.nickname
    age = response.user.age
    gender = response.user.gender
    if (gender == "F") {
        gender = "여성"
    } else if (gender == "M") {
        gender = "남성"
    } else {
        gender = "설정하지 않음"
    }

    recruitmentWriter.innerText = nickname + " / " + age + " / " + gender

    const recruitmentTitle = document.getElementById("recruitment-title")
    const recruitmentPlace = document.getElementById("recruitment-place")
    const recruitmentImage = document.getElementById("recruitment-image")
    const recruitmentContent = document.getElementById("recruitment-content")
    const recruitmentPeriod = document.getElementById("recruitment-period")
    const recruitmentCost = document.getElementById("recruitment-cost")
    const recruitmentParticipant = document.getElementById("recruitment-participant")

    recruitmentTitle.innerText = response.title
    recruitmentPlace.innerText = response.place

    const newImage = document.createElement("img")

    if (response.image != null) {
        newImage.setAttribute("src", `${proxy}${response.image}`)
    } else {
        newImage.setAttribute("src", `../images/car-2.jpg`)
    }

    newImage.setAttribute("class", "col-sm-12 col-md-12")
    console.log(response.image)
    recruitmentImage.appendChild(newImage)

    recruitmentContent.innerText = response.content

    departure = response.departure.split('T')[0]
    arrival = response.arrival.split('T')[0]
    recruitmentPeriod.innerText = departure + " ~ " + arrival

    recruitmentCost.innerText = response.cost + "원"
    recruitmentParticipant.innerText = response.participant.length + "/" + response.participant_max

    console.log(response.participant)
    participant = response.participant
    const participantCount = document.getElementById("participant-count")
    const participantList = document.getElementById("participant-list")

    participantCount.innerText = "참가자 수 : " + participant.length

    participant.forEach(user => {
        console.log(user)

        const participantNickname = document.createElement("div")
        participantNickname.innerText = user.nickname

        const participantAge = document.createElement("div")
        participantAge.innerText = user.age

        const pariticipantGender = document.createElement("div")
        pariticipantGender.innerText = user.gender

        participantList.appendChild(participantNickname)
        participantList.appendChild(participantAge)
        participantList.appendChild(pariticipantGender)
    })
}


async function getRecruitment(recruitmentId) {
    const response = await fetch(`${proxy}/recruitments/${recruitmentId}/`)

    if (response.status == 200) {
        response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
}


async function getApplicant(recruitmentId) {
    const response = await fetch(`${proxy}/recruitments/${recruitmentId}/join/`)

    if (response.status == 200) {
        response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
}


async function loadJoin(recruitmentId) {
    const applicantResponse = await getApplicant(recruitmentId)
    console.log(applicantResponse)

    const applicantCount = document.getElementById("applicant-count")
    const applicantList = document.getElementById("applicant-list")
    applicantList.innerHTML = ""

    applicantCount.innerText = "신청자 수 : " + applicantResponse.length

    applicantResponse.forEach(applicant => {
        nickname = applicant.user.nickname
        age = applicant.user.age
        gender = applicant.user.gender
        appeal = applicant.appeal
        acceptence = applicant.acceptence

        const applicantNickname = document.createElement("div")
        applicantNickname.innerText = nickname

        const applicantAppeal = document.createElement("div")
        applicantAppeal.innerText = appeal

        const applicantAge = document.createElement("div")
        applicantAge.innerText = age

        const applicantGender = document.createElement("div")
        applicantGender.innerText = gender

        const applicantAcceptence = document.createElement("div")
        applicantAcceptence.innerText = acceptence

        if (acceptence == 0) {
            applicantAcceptence.innerText = "대기중"
        } else if (acceptence == 1) {
            applicantAcceptence.innerText = "거절"
        } else {
            applicantAcceptence.innerText = "수락"
        }

        applicantList.appendChild(applicantNickname)
        applicantList.appendChild(applicantAppeal)
        applicantList.appendChild(applicantAge)
        applicantList.appendChild(applicantGender)
        applicantList.appendChild(applicantAcceptence)
    });
}


async function getJoin(recruitmentId) {
    const response = await fetch(`${proxy}/recruitments/${recruitmentId}/join/`,
    )

    if (response.status == 200) {
        response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
}


async function submitJoin() {
    const joinElement = document.getElementById("new-join")
    const newJoin = joinElement.value
    const response = await postJoin(recruitmentId, newJoin)
    console.log(response)

    joinElement.value = ""
    loadJoin(recruitmentId)
}


async function postJoin(recruitmentId, newJoin) {
    let token = localStorage.getItem("access")

    const response = await fetch(`${proxy}/recruitments/${recruitmentId}/join/`, {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            "appeal": newJoin,
        })
    })

    if (response.status == 200) {
        response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
}

