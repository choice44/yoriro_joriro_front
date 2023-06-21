const proxy = "http://127.0.0.1:8000"
// const proxy = "https://api.bechol.com"
const front_proxy = "http://127.0.0.1:5500"

let recruitmentId
// let applicantId

window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search)
    recruitmentId = urlParams.get('recruitment_id')
    console.log(recruitmentId)

    await loadRecruitmentDetail(recruitmentId)
    await loadJoin(recruitmentId)
    await loadParticipant(recruitmentId)
    console.log("loadJoin에 들어가는 recruitmentId", recruitmentId)
}


async function loadRecruitmentDetail(recruitmentId) {
    const response = await getRecruitment(recruitmentId)
    const recruitmentReset = document.getElementById("recruitment")
    recruitmentReset.value = ""

    const recruitmentButtons = document.getElementById("recruitment-buttons")
    if (await checkAuthor(recruitmentId) == true) {
        recruitmentButtons.style.display = "block"
    } else {
        recruitmentButtons.style.display = "none"
    }

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
    recruitmentImage.innerHTML = ""
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
}


async function loadParticipant(recruitmentId) {
    const response = await getRecruitment(recruitmentId)

    console.log("test", response.participant)
    participant = response.participant
    const participantCount = document.getElementById("participant-count")
    participantCount.innerText = ""
    const participantList = document.getElementById("participant-list")
    participantList.innerText = ""

    participantCount.innerText = "참가자 수 : " + participant.length

    participant.forEach(user => {
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
    // const response = await fetch(`${proxy}/recruitments/${recruitmentId}/`)
    const token = localStorage.getItem('access');
    const response = await fetch(`${proxy}/recruitments/${recruitmentId}/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.status == 200) {
        response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
}


async function getApplicant(recruitmentId) {
    // const response = await fetch(`${proxy}/recruitments/${recruitmentId}/join`)
    const token = localStorage.getItem('access');
    const response = await fetch(`${proxy}/recruitments/${recruitmentId}/join`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
}


async function loadJoin(recruitmentId) {
    const applicantResponse = await getApplicant(recruitmentId)
    const result = await checkAuthor(recruitmentId)
    const joinReset = document.getElementById("applicant")
    joinReset.value = ""

    const applicantJoinCreate = document.getElementById("applicant-join")
    if (!isLoggedIn()) {
        applicantJoinCreate.style.display = "none"
    } else {
        applicantJoinCreate.style.display = "block"
    }

    const applicantCount = document.getElementById("applicant-count")
    const applicantList = document.getElementById("applicant-list")
    applicantList.innerHTML = ""

    applicantCount.innerText = "신청자 수 : " + applicantResponse.length

    applicantResponse.forEach(async applicant => {
        nickname = applicant.user.nickname
        age = applicant.user.age
        gender = applicant.user.gender
        appeal = applicant.appeal
        acceptence = applicant.acceptence
        applicantId = applicant.id

        const applicantNickname = document.createElement("div")
        applicantNickname.innerText = nickname

        const applicantAppeal = document.createElement("div")
        applicantAppeal.setAttribute('id', `appeal-${applicantId}`)
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

        if (applicant.user.id == userId) {
            const editButton = document.createElement("button")
            editButton.setAttribute("id", 'edit-appeal-button')
            editButton.setAttribute("onclick", `editJoin(${applicantId})`)
            editButton.innerText = "수정"
            applicantList.appendChild(editButton)

            const deleteButton = document.createElement("button")
            deleteButton.setAttribute("id", 'delete-appeal-button')
            deleteButton.setAttribute("onclick", `deleteJoin(${applicantId})`)
            deleteButton.innerText = "삭제"
            applicantList.appendChild(deleteButton)
        }

        applicantList.appendChild(applicantAge)
        applicantList.appendChild(applicantGender)
        applicantList.appendChild(applicantAcceptence)

        const accessToken = localStorage.getItem('access')
        userId = getPKFromAccessToken(accessToken)
        console.log("userId", userId)
        console.log("recruitment.user", applicant.user.id)

        if (acceptence == 0) {
            if (result == true) {
                const applicantButton = document.createElement("div")
                const accept = document.createElement("button")
                accept.setAttribute("onclick", `acceptApplicant(${applicant.id})`)
                accept.innerText = "수락"
                const reject = document.createElement("button")
                reject.setAttribute("onclick", `rejectApplicant(${applicant.id})`)
                reject.innerText = "거절"
                applicantButton.appendChild(accept)
                applicantButton.appendChild(reject)
                applicantList.appendChild(applicantButton)
            }
        }
    })
}


async function getJoin(recruitmentId) {
    // const response = await fetch(`${proxy}/recruitments/${recruitmentId}/join/`)
    const token = localStorage.getItem('access');
    const response = await fetch(`${proxy}/recruitments/${recruitmentId}/join/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

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


async function isLoggedIn() {
    const accessToken = localStorage.getItem('access')
    console.log('Access Token:', accessToken)
    return accessToken !== null
}


async function checkAuthor(recruitmentId) {
    const response = await getRecruitment(recruitmentId)

    const accessToken = localStorage.getItem('access')
    userId = getPKFromAccessToken(accessToken);

    if (userId == response.user.id) {
        return true
    } else {
        return false
    }
}


function getPKFromAccessToken(accessToken) {
    const tokenParts = accessToken.split('.')  // 토큰 값을 .으로 나눔
    const payloadBase64 = tokenParts[1]    // 나눠진 토큰중 1번 인덱스에 해당하는 값을 저장

    const payload = JSON.parse(atob(payloadBase64))
    userId = payload.user_id
    return userId
}


async function recruitmentEdit() {
    window.location.href = `recruitments_update.html?id=${recruitmentId}`
}


async function recruitmentDelete() {
    if (confirm("삭제하시겠습니까?")) {
        const response = await fetch(`${proxy}/recruitments/${recruitmentId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access"),
                'content-type': 'application/json',
            },
            method: 'DELETE',
        })
        if (response.status === 204) {
            alert("삭제 완료!")
            location.replace('recruitments.html')
        } else {
            alert("권한이 없습니다.")
        }
    }
}


async function acceptApplicant(applicantId) {
    console.log("test", applicantId)
    let token = localStorage.getItem("access")

    const response = await fetch(`${proxy}/recruitments/join/${applicantId}/accept/`, {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })

    if (response.status == 200) {
        response_json = await response.json()
        loadRecruitmentDetail(recruitmentId)
        loadJoin(recruitmentId)
        loadParticipant(recruitmentId)
        return response_json
    } else {
        alert(response.status)
    }
}


async function rejectApplicant(applicantId) {
    console.log("test", applicantId)
    let token = localStorage.getItem("access")

    const response = await fetch(`${proxy}/recruitments/join/${applicantId}/reject/`, {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })

    if (response.status == 200) {
        response_json = await response.json()
        loadRecruitmentDetail(recruitmentId)
        loadJoin(recruitmentId)
        loadParticipant(recruitmentId)
        return response_json
    } else {
        alert(response.status)
    }
}


async function editJoin(applicantId) {
    let token = localStorage.getItem("access")
    const hideEditButton = document.getElementById("edit-appeal-button")
    hideEditButton.style.display = "none"

    const joinCard = document.getElementById(`appeal-${applicantId}`)
    const textBox = document.createElement("input")
    textBox.setAttribute("type", "text")
    textBox.value = joinCard.innerText.trim()
    joinCard.innerHTML = ""
    joinCard.appendChild(textBox)

    const saveButton = document.createElement("button")
    saveButton.innerText = "저장"
    saveButton.addEventListener("click", async () => {
        const updatedAppeal = textBox.value
        joinCard.innerHTML = updatedAppeal

        const data = {
            appeal: updatedAppeal
        }

        const response = await fetch(`${proxy}/recruitments/join/${applicantId}/`, {
            method: 'PUT',
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        hideEditButton.style.display = "block"
    })

    joinCard.appendChild(saveButton)
}


async function deleteJoin(applicantId) {
    if (confirm("삭제하시겠습니까?")) {
        const response = await fetch(`${proxy}/recruitments/join/${applicantId}/`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access"),
                'content-type': 'application/json',
            },
            method: 'DELETE',
        })
        if (response.status === 204) {
            alert("삭제 완료!")
            loadRecruitmentDetail(recruitmentId)
            loadJoin(recruitmentId)
            loadParticipant(recruitmentId)
            // location.replace(`recruitments_detail.html??recruitment_id=${recruitment_id}`)
        } else {
            alert("권한이 없습니다.")
        }
    }
}