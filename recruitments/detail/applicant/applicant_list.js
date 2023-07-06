import { proxy } from "../../../proxy.js"

let recruitmentId

window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search)
    recruitmentId = urlParams.get('recruitment_id')

    const result = await checkAuthor(recruitmentId);
    if (!result) {
        alert("잘못된 접근입니다.")
        location.href = `/recruitments/index.html`        
    }
    
    loadJoin(recruitmentId)
}

// 지원자 호출 함수
async function loadJoin(recruitmentId) {
    const applicantResponse = await getApplicant(recruitmentId);
    // 로그인 유저 id 가져오기
    const accessToken = localStorage.getItem('access')
    let userId = getPKFromAccessToken(accessToken)

    const applicantCount = document.getElementById("applicant-count")
    applicantCount.setAttribute("style", "margin-bottom:5%")
    applicantCount.innerText = `신청자 수 : ${applicantResponse.length}`
    const applicantList = document.getElementById("applicant-list")
    applicantList.innerHTML = ""

    for (const applicant of applicantResponse) {
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

        let ageGroup
        if (age) {
            ageGroup = parseInt(age / 10) * 10
            if (ageGroup != 0 && ageGroup<80) {
                ageGroup = ageGroup + '대'
            } else if (ageGroup >= 80){
                ageGroup = '80대 이상'
            } else {
                ageGroup = "9세 이하"
            }
        } else {
            ageGroup = "?"
        }

        let profileImage = await user.image
        if (!profileImage) {
            profileImage = "/images/logo_64.png"
        } else {
            profileImage = proxy+profileImage
        }

        // 3항 연산자를 사용해서 게시글 작성자가 로그인 하면 수락, 거절버튼이 보이고, 신청 작성자가 로그인하면 신청 수정, 삭제 버튼이 보인다.
        const tableHTML = `
        <div style="border-collapse:separate; border-radius:30px; border: 1px solid #444444; margin-bottom:5%">
            <table style="width:450px; height:50px">
                <tr>
                    <td>
                        <div style="align-items: center; width: 40px; height: 40px; border-radius: 50%; overflow: hidden; margin-left:10%">
                            <img src=${profileImage} style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    </td>
                    <th style="text-align:center">${(nickname) ? nickname : "?"}</th>
                    <td width="20%" style="text-align:center">${ageGroup}</td>
                    <td width="8%" style="text-align:right">${(genderPrint) ? genderPrint : "?"}</td>
                    <td width="30%"></td>
                    <td width="20%" style="text-align:right">${acceptencePrint}</td>
                </tr>
            </table>
            <div style="margin-bottom:5%;>
                <div width="100%" colspan="5" id="appeal-${id}"></div>
                <div style="display: flex; flex-direction: row; justify-content: center;">
                    <input type="button" value="수락" id="accept-appeal-button" onclick="acceptApplicant(${id})" style="display: ${acceptence == 0 ? 'block' : 'none'}; text-align:center;">
                    <input type="button" value="거절" id="reject-appeal-button" onclick="rejectApplicant(${id})" style="display: ${acceptence == 0 ? 'block' : 'none'}; text-align:center;">
                    <div style="display: ${acceptence != 0 ? 'block' : 'none'};>${acceptencePrint}<div>
                </div>
            </div>
        </div>`
        applicantList.innerHTML += tableHTML

        const applicantAppeal = document.getElementById(`appeal-${id}`)
        applicantAppeal.innerText = `${appeal}`
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


async function getJoin(recruitmentId) {
    const response = await fetch(`${proxy}/recruitments/${recruitmentId}/join/`)

    if (response.status == 200) {
        response_json = await response.json()
        return response_json
    } else {
        alert(response.status)
    }
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


// 신청 수락
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
        alert("신청 수락 완료!")
        loadJoin(recruitmentId)
        return response_json
    } else {
        const response_json = await response.json()
        alert(response_json.message)
    }
}


// 신청 거절
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
        alert("신청 거절 완료!")
        loadJoin(recruitmentId)
        return response_json
    } else {
        alert(response.status)
    }
}


// 이 창을 닫을 때 이전 창을 새로고침
async function closeTab() {
    window.opener.location.reload()
    window.close()
}


window.loadJoin = loadJoin
window.getJoin = getJoin
window.getPKFromAccessToken = getPKFromAccessToken
window.checkAuthor = checkAuthor
window.getApplicant = getApplicant
window.getRecruitment = getRecruitment
window.acceptApplicant = acceptApplicant
window.rejectApplicant = rejectApplicant
window.closeTab = closeTab