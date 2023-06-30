import { proxy } from "../../proxy.js"

const urlParams = new URLSearchParams(window.location.search)
let recruitmentId = urlParams.get('recruitment_id')


window.onload = async function () {
    await loadRecruitmentDetail(recruitmentId)
    await loadJoin(recruitmentId)
}


async function loadRecruitmentDetail(recruitmentId) {
    const response = await getRecruitment(recruitmentId)
    let imagePath

    // 이미지 값이 있으면 이미지 출력, 없으면 기본 이미지 출력
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
    // 게시글 생성 부분
    template.innerHTML = `
        <table width="100%" style="text-align:center; margin-right:5%; margin-top:5%; border: 1px solid #444444; border-collapse:separate; border-radius:8px;">
            <tr height=60px>
                <td style="text-align:right">장소</td>
                <th style="text-align:center">${response.place}</th>
                <td style="text-align:right">경비</td>
                <th style="text-align:center">${response.cost.toLocaleString()}원</th>
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

    // F일때 여성, M일때 남성, 없을때 빈 문자열 출력
    let gender = response.user.gender
    if (gender == "F") {
        gender = "여성"
    } else if (gender == "M") {
        gender = "남성"
    } else {
        gender = ""
    }

    let ageGroup
    if (response.user.age) {
        ageGroup = parseInt(response.user.age / 10) * 10
        if (ageGroup != 0) {
            ageGroup = ageGroup + '대'
        } else {
            ageGroup = "10대 미만"
        }
    } else {
        ageGroup = "?"
    }

    // 게시글 작성자 정보
    const recruitmentWriterInfo = document.getElementById("writer-info")
    recruitmentWriterInfo.innerHTML = ""
    recruitmentWriterInfo.innerHTML = `
        <table width="80%" style="margin-top:40%;margin-left:25%;">
            <tr>
                <th colspan="2" style="text-align:center;"><a href="/users/mypage/index.html?id=${response.user.id}">${response.user.nickname}</a></th>
            </tr>
            <tr>
                <td width="30px" style="text-align:center;">연령대</td>
                <th width="30px" style="text-align:center;">${ageGroup}</th>
            </tr>
            <tr>
                <td style="text-align:center;">성별</td>
                <th style="text-align:center;">${(gender) ? gender : "?"}</th>
            </tr>
        </table>`

    let participant = response.participant

    // 참가자 정보
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
            <th colspan="3" style="text-align:center;">모집된 동료 : ${participant.length}명</th>
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

        let ageGroup
        if (user.age) {
            ageGroup = '00' + user.age
            if (ageGroup[2] != 0) {
                ageGroup = ageGroup[2] + '0대'
            } else {
                ageGroup = "10대 미만"
            }
        } else {
            ageGroup = "?"
        }

        participantTable.innerHTML += `
        <tr>
            <th height="30px" rowspan="2" style="text-align:center;"><a href="/users/mypage/index.html?id=${user.id}">${(user.nickname) ? user.nickname : "?"}</a></th>
            <td style="text-align:center;">${ageGroup}</td>
            <td style="text-align:center;">${(user.gender) ? user.gender : "?"}</td>
        </tr>
        `
    })

    participantTable.innerHTML += `
    <tr><td height="10px"></td>
    </tr>    
    `
    participantCard.appendChild(participantTable)

    // 게시글 작성자가 아니면 수정, 삭제버튼이 보이지 않음
    const result = await checkAuthor(recruitmentId);
    if (result) {
        const recruitmentButton = document.getElementById("recruitment-button")
        recruitmentButton.style.display = "block"
    }
}


async function getRecruitment(recruitmentId) {
    const response = await fetch(`${proxy}/recruitments/${recruitmentId}/`)

    if (response.status == 200) {
        let response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
}


async function getApplicant(recruitmentId) {
    const response = await fetch(`${proxy}/recruitments/${recruitmentId}/join/`)

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
}


// 신청자 명단 확인 창
async function popupApplicant() {
    const result = await checkAuthor(recruitmentId);
    if (result) {
        window.open(`/recruitments/detail/applicant/applicant_list.html?recruitment_id=${recruitmentId}`, "applicant list", 'width=500, height=600')
    } else {
        alert("글 작성자만 확인할 수 있습니다.")
    }
}


// 지원자 호출 함수
async function loadJoin(recruitmentId) {
    const applicantResponse = await getApplicant(recruitmentId);

    const applicantCountPrint = document.getElementById("applicant-check-button")
    let acceptenceZero = 0

    // 로그인 유저 id 가져오기
    const accessToken = localStorage.getItem('access')
    let userId = getPKFromAccessToken(accessToken)

    const result = await checkAuthor(recruitmentId);
    const joinReset = document.getElementById("applicant");

    // 게시글 작성자가 로그인하면 신청칸과 버튼 보이지 않게 설정
    const applicantJoinCreate = document.getElementById("applicant-join")
    if (result) {
        applicantJoinCreate.style.display = "none";
    } else {
        applicantJoinCreate.style.display = "block";
    }

    const applicantList = document.getElementById("applicant-list")
    applicantList.innerHTML = ""

    applicantResponse.forEach(applicant => {
        // applicant에 있는 정보들이 user = applicant.user, appeal = applicant.appeal, acceptence = applicant.acceptence, id = applicant.id 에 각각 담아줌
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
            acceptencePrint = "수락 대기중"
        } else if (acceptence == 1) {
            acceptencePrint = "거절됨"
        } else {
            acceptencePrint = "수락됨"
        }

        // 나이를 연령대로 변경하는 코드
        let ageGroup
        if (age) {
            ageGroup = parseInt(age / 10) * 10
            if (ageGroup != 0) {
                ageGroup = ageGroup + '대'
            } else {
                ageGroup = "10대 미만"
            }
        } else {
            ageGroup = "?"
        }

        // 3항 연산자를 사용해서 게시글 작성자가 로그인 하면 수락, 거절버튼이 보이고, 신청 작성자가 로그인하면 신청 수정, 삭제 버튼이 보인다.
        const tableHTML = `
        <div id="applicant-${id}">
            <table class="col-md-12">
                <tr>
                    <th><a href="/users/mypage/index.html?id=${user.id}">${(nickname) ? nickname : "?"}</a></th>
                    <td width="4%" style="text-align:right">${ageGroup}</td>
                    <td width="8%" style="text-align:right">${(genderPrint) ? genderPrint : "?"}</td>
                    <td width="13%" style="text-align:right">${acceptencePrint}</td>
                    <td width="60"></td>
                </tr>
            </table>
            <div style="margin-bottom:5%">
                <div width="100%" colspan="5" id="appeal-${id}">${appeal}</div>
                <div style="display: flex; flex-direction: row;"">
                    <input type="button" value="수정" id="edit-appeal-button-${id}" onclick="editJoin(${id})" style="margin-bottom: 5px; display: ${user.id == userId ? 'block' : 'none'}">
                    <input type="button" value="수락" id="accept-appeal-button" onclick="acceptApplicant(${id})" style="margin-bottom: 5px; display: ${acceptence == 0 && result ? 'block' : 'none'}">
                    <input type="button" value="삭제" id="delete-appeal-button" onclick="deleteJoin(${id})" style="margin-bottom: 5px; display: ${user.id == userId ? 'block' : 'none'}">
                    <input type="button" value="거절" id="reject-appeal-button" onclick="rejectApplicant(${id})" style="margin-bottom: 5px; display: ${acceptence == 0 && result ? 'block' : 'none'}">
                </div>
            </div>
        </div>`

        applicantList.innerHTML += tableHTML
        const applicantCheck = document.getElementById(`applicant-${id}`)
        if (user.id == userId) {
            applicantCheck.setAttribute("style", "display:block;")
        } else {
            applicantCheck.setAttribute("style", "display:none;")
        }

        // 아직 수락 대기중인 사람들 수 카운트
        if (acceptence == 0) {
            acceptenceZero++
        }
    });

    // 수락 대기중인 사람들 수 출력
    applicantCountPrint.setAttribute("value", `대기자: ${acceptenceZero}명 / 신청자: ${applicantResponse.length}명`)
}


async function getJoin(recruitmentId) {
    const response = await fetch(`${proxy}/recruitments/${recruitmentId}/join/`)

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
    if (newJoin == "") {
        alert("어필을 작성하여주세요.")
        return
    }

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

    const response_json = await response.json()

    if (response.status == 201) {
        alert("신청 완료! 작성자 수락을 기다려주세요")
    } else if (response.status == 401) {
        alert("로그인 후 이용할 수 있습니다.")
    } else {
        alert(response_json.message)
    }
}


// 로그인 확인 함수
async function isLoggedIn() {
    const accessToken = localStorage.getItem('access')
    return accessToken !== null
}


// 로그인을 한 사용자가 게시글 작성자인지 확인, 작성자이면 true, 아니면 false값 리턴
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


// 토큰 가져오는 부분
function getPKFromAccessToken(accessToken) {
    const tokenParts = accessToken.split('.')  // 토큰 값을 .으로 나눔
    const payloadBase64 = tokenParts[1]    // 나눠진 토큰중 1번 인덱스에 해당하는 값을 저장

    const payload = JSON.parse(atob(payloadBase64))
    let userId = payload.user_id
    return userId
}


// 동료모집 글 수정 페이지 호출
async function recruitmentEdit() {
    location.href = `/recruitments/update/index.html?id=${recruitmentId}`
}


// 동료모집 글 삭제
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


// 신청 수정
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
        alert("신청 수정 완료!")
    })

    joinCard.appendChild(saveButton)
}


// 신청 삭제
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


window.submitJoin = submitJoin
window.getJoin = getJoin
window.editJoin = editJoin
window.deleteJoin = deleteJoin
window.recruitmentEdit = recruitmentEdit
window.recruitmentDelete = recruitmentDelete
window.popupApplicant = popupApplicant