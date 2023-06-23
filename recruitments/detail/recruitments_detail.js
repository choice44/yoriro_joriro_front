import { proxy } from "../../proxy.js"

let recruitmentId
let applicantId

window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search)
    recruitmentId = urlParams.get('recruitment_id')

    await loadRecruitmentDetail(recruitmentId)
    await loadJoin(recruitmentId)
}


async function loadRecruitmentDetail(recruitmentId) {
    const response = await getRecruitment(recruitmentId)
    let imagePath

    if (response.image) {
        imagePath = proxy + response.image;
    } else {
        imagePath = "/images/car-2.jpg"
    }
    const recruitmentImage = document.getElementById("recruitment-image")
    recruitmentImage.innerHTML = `
    <img src="${imagePath}" height="300px" style="object-fit: cover; object-position: center; width: 100%; margin-top:50px;">
    `

    const recruitmentTitle = document.getElementById("recruitment-title")
    recruitmentTitle.setAttribute("style", "margin-top:50px; margin-bottom:30px")
    recruitmentTitle.innerText = `${response.title}`

    const recruitmentLoad = document.getElementById("recruitment")
    recruitmentLoad.innerHTML = ""

    const template = document.createElement("div")
    template.innerHTML = ""
    let departure = response.departure.split('T')[0]
    let arrival = response.arrival.split('T')[0]
    let updated_at = response.updated_at.split('T')[0] + " " + response.updated_at.split('T')[1].split('.')[0]
    const statusIsComplete = { 0: "모집 중", 1: "모집 완료", 2: "여행 중", 3: "여행 완료" };
    template.innerHTML = `
        <table width="100%" style="text-align:center; margin-right:5%; margin-top:5%; border: 1px solid #444444; border-collapse:separate; border-radius:8px;">
            <tr height=60px>
                <td style="text-align:right">장소</td>
                <th style="text-align:center">${response.place}</th>
                <td style="text-align:right">경비</td>
                <th style="text-align:center">${response.cost}원</th>
                <td style="text-align:right">모집 정원</td>
                <th style="text-align:center; color:${response.participant.length == response.participant_max ? 'red' : ''};">${response.participant.length + "/" + response.participant_max}</th>
                <td width=20px></td>
            </tr>
            <tr height=70px>
                <td style="text-align:right">기간</td>
                <th style="text-align:center" colspan="4">${departure + ' ~ ' + arrival}</th>
                <th id="is-complete" style="color:${response.is_complete == 0 ? 'red' : ''};">${statusIsComplete[response.is_complete]}</th>
            </tr>
        </table>
        
        <table width="100%" style="text-align:center; margin-right:5%; margin-top:10%; margin-bottom:10%">
            <tr>
                <td>${response.content}</td>
            </tr>
        </table>

        <div>updated : ${updated_at}
        </div>`


    recruitmentLoad.appendChild(template)

    let gender = response.user.gender
    if (gender == "F") {
        gender = "여성"
    } else if (gender == "M") {
        gender = "남성"
    } else {
        gender = ""
    }

    const recruitmentWriterInfo = document.getElementById("writer-info")
    recruitmentWriterInfo.innerHTML = ""
    recruitmentWriterInfo.innerHTML = `
        <table width="80%" style="margin-top:40%;margin-left:25%;">
            <tr>
                <th colspan="2" style="text-align:center;">${response.user.nickname}</th>
            </tr>
            <tr>
                <td width="30px" style="text-align:center;">나이</td>
                <th width="30px" style="text-align:center;">${response.user.age}</th>
            </tr>
            <tr>
                <td style="text-align:center;">성별</td>
                <th style="text-align:center;">${gender}</th>
            </tr>
        </table>`

    let participant = response.participant

    const participantCard = document.getElementById("participant")
    participantCard.innerHTML = ""
    const participantTable = document.createElement("table")
    participantTable.innerHTML = ""
    participantTable.setAttribute("width", "80%")
    participantTable.setAttribute("style", "margin-top:20%;margin-left:25%;color:black; border-collapse:separate; border-radius:30px; border: 1px solid #444444; ")
    participantTable.innerHTML = `
        <tr><td height="5px"></td>
        </tr>
        <tr>
            <th colspan="3" style="text-align:center;">참가자 : ${participant.length}명</th>
        </tr>
    `
    participant.forEach(user => {
        if (user.gender == "F") {
            user.gender = "여성"
        } else if (user.gender == "M") {
            user.gender = "남성"
        } else {
            user.gender = ""
        }

        participantTable.innerHTML += `
        <tr>
            <th height="30px" rowspan="2" style="text-align:center;">${user.nickname}</th>
            <td style="text-align:center;">${user.age}세</td>
            <td style="text-align:center;">${user.gender}</td>
        </tr>
        `
    })

    participantTable.innerHTML += `
    <tr><td height="10px"></td>
    </tr>    
    `
    participantCard.appendChild(participantTable)

    const result = await checkAuthor(recruitmentId);
    if (result) {
        const recruitmentButton = document.getElementById("recruitment-button")
        recruitmentButton.style.display = "block"
    }
}


async function getRecruitment(recruitmentId) {
    const token = localStorage.getItem('access')
    const response = await fetch(`${proxy}/recruitments/${recruitmentId}/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (response.status == 200) {
        let response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
}


async function getApplicant(recruitmentId) {
    const token = localStorage.getItem('access')
    const response = await fetch(`${proxy}/recruitments/${recruitmentId}/join`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
}


async function loadJoin(recruitmentId) {
    const applicantResponse = await getApplicant(recruitmentId);
    const accessToken = localStorage.getItem('access')
    let userId = getPKFromAccessToken(accessToken)

    const result = await checkAuthor(recruitmentId)
    const joinReset = document.getElementById("applicant")

    const applicantJoinCreate = document.getElementById("applicant-join")
    if (!isLoggedIn()) {
        applicantJoinCreate.style.display = "none"
    } else {
        applicantJoinCreate.style.display = "block"
    }

    const applicantCount = document.getElementById("applicant-count")
    const applicantList = document.getElementById("applicant-list")
    applicantList.innerHTML = ""

    applicantResponse.forEach(applicant => {
        const { user, appeal, acceptence, id } = applicant
        const { nickname, age, gender } = user

        let genderPrint = ""
        let acceptencePrint = ""

        if (gender == "M") {
            genderPrint = "남성"
        } else if (gender == "F") {
            genderPrint = "여성"
        } else {
            genderPrint = ""
        }

        if (acceptence == 0) {
            acceptencePrint = "대기중"
        } else if (acceptence == 1) {
            acceptencePrint = "거절됨"
        } else {
            acceptencePrint = "수락됨"
        }

        const tableHTML = `
        <table class="col-md-12">
            <tr>
                <th>${nickname}</th>
                <td width="4%" style="text-align:right">${age}</td>
                <td width="8%" style="text-align:right">${genderPrint}</td>
                <td width="80"></td>
            </tr>
        </table>
        <div style="margin-bottom:5%">
            <div width="100%" colspan="4" id="appeal-${id}">${appeal}</div>
            <div style="display: flex; flex-direction: row;"">
                <input type="button" value="수정" id="edit-appeal-button-${id}" onclick="editJoin(${id})" style="margin-bottom: 5px; display: ${user.id == userId ? 'block' : 'none'}">
                <input type="button" value="수락" id="accept-appeal-button" onclick="acceptApplicant(${id})" style="margin-bottom: 5px; display: ${acceptence == 0 && result ? 'block' : 'none'}">
                <input type="button" value="삭제" id="delete-appeal-button" onclick="deleteJoin(${id})" style="margin-bottom: 5px; display: ${user.id == userId ? 'block' : 'none'}">
                <input type="button" value="거절" id="reject-appeal-button" onclick="rejectApplicant(${id})" style="margin-bottom: 5px; display: ${acceptence == 0 && result ? 'block' : 'none'}">
            </div>
        </div>`

        applicantList.innerHTML += tableHTML
    });
}


async function getJoin(recruitmentId) {
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
    return accessToken !== null
}


async function checkAuthor(recruitmentId) {
    const response = await getRecruitment(recruitmentId)

    const accessToken = localStorage.getItem('access')
    let userId = getPKFromAccessToken(accessToken);

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
    let userId = payload.user_id
    return userId
}


async function recruitmentEdit() {
    location.href = `/recruitments/update/index.html?id=${recruitmentId}`
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
            location.replace('../index.html')
        } else {
            alert("권한이 없습니다.")
        }
    }
}


async function acceptApplicant(applicantId) {
    let token = localStorage.getItem("access")

    const response = await fetch(`${proxy}/recruitments/join/${applicantId}/accept/`, {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })

    if (response.status == 200) {
        let response_json = await response.json()
        loadRecruitmentDetail(recruitmentId)
        loadJoin(recruitmentId)
        return response_json
    } else {
        alert(response.status)
    }
}


async function rejectApplicant(applicantId) {
    let token = localStorage.getItem("access")

    const response = await fetch(`${proxy}/recruitments/join/${applicantId}/reject/`, {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })

    if (response.status == 200) {
        let response_json = await response.json()
        loadRecruitmentDetail(recruitmentId)
        loadJoin(recruitmentId)
        return response_json
    } else {
        alert(response.status)
    }
}


async function editJoin(applicantId) {
    let token = localStorage.getItem("access")
    const hideEditButton = document.getElementById(`edit-appeal-button-${applicantId}`)

    const joinCard = document.getElementById(`appeal-${applicantId}`)
    const textBox = document.createElement("input")
    textBox.setAttribute("type", "text")
    textBox.value = joinCard.innerText.trim()
    joinCard.innerHTML = ""
    joinCard.appendChild(textBox)

    const saveButton = document.createElement("input")
    saveButton.setAttribute("type", "button")
    saveButton.setAttribute("value", "저장")
    saveButton.setAttribute("class", "btn btn-primary")
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
        } else {
            alert("권한이 없습니다.")
        }
    }
}


window.acceptApplicant = acceptApplicant
window.rejectApplicant = rejectApplicant
window.submitJoin = submitJoin
window.getJoin = getJoin
window.editJoin = editJoin
window.deleteJoin = deleteJoin
window.recruitmentEdit = recruitmentEdit
window.recruitmentDelete = recruitmentDelete