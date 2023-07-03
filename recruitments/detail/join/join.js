import { proxy } from "../../../proxy.js"

const urlParams = new URLSearchParams(window.location.search)
let recruitmentId = urlParams.get('recruitment_id')
let applicantId

window.onload = async function() {    
    const applicantResponse = await getApplicant(recruitmentId)
    console.log(applicantResponse)

    const accessToken = localStorage.getItem('access')
    let userId = getPKFromAccessToken(accessToken)
    
    applicantResponse.forEach((response) => {
        let user_id = response.user.id
        if (userId == user_id) {           
            applicantId = response.id 
            document.getElementById("new-join").value = response.appeal

            const changeButtonEdit = document.getElementById("join-done-button")
            changeButtonEdit.setAttribute("value", "수정 완료")
            changeButtonEdit.setAttribute("onclick", "submitEditJoin()")
        }
    });
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
}


async function submitEditJoin() {
    const joinElement = document.getElementById("new-join")
    const editext = joinElement.value
    const response = await editJoin(applicantId, editext)
    joinElement.value = ""
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
        window.opener.location.reload()
        window.close()
    } else if (response.status == 401) {
        alert("로그인 후 이용할 수 있습니다.")
    } else {
        alert(response_json.message)
    }
}


async function editJoin(applicantId, editext) {
    let token = localStorage.getItem("access")
    const data = {
        appeal: editext
    }
    const response = await fetch(`${proxy}/recruitments/join/${applicantId}/`, {
        method: 'PUT',
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    
    alert("신청 수정 완료!")
    closeTab()
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
        } else {
            alert("권한이 없습니다.")
        }
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


// 토큰 가져오는 부분
function getPKFromAccessToken(accessToken) {
    const tokenParts = accessToken.split('.')  // 토큰 값을 .으로 나눔
    const payloadBase64 = tokenParts[1]    // 나눠진 토큰중 1번 인덱스에 해당하는 값을 저장

    const payload = JSON.parse(atob(payloadBase64))
    let userId = payload.user_id
    return userId
}


// 이 창을 닫을 때 이전 창을 새로고침
async function closeTab() {
    window.opener.location.reload()
    window.close()
}


window.submitJoin = submitJoin
window.submitEditJoin = submitEditJoin
window.postJoin = postJoin
window.deleteJoin = deleteJoin
window.getApplicant = getApplicant
window.editJoin = editJoin
window.getPKFromAccessToken = getPKFromAccessToken
window.closeTab = closeTab