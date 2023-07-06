import { proxy } from "../../proxy.js"

const update = document.getElementById("recruitment-update")
update.addEventListener('click', updateRecruitment)

let response_json
let recruitment_id
setThumbnail()

window.onload = async function getUpdeteRecruitment() {
    recruitment_id = new URLSearchParams(window.location.search).get("id")
    const token = localStorage.getItem('access')
    if (!token) {
        alert("잘못된 접속입니다.")
        location.href = `/recruitments/index.html`
    }    

    const url = `${proxy}/recruitments/${recruitment_id}/`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (response.status == 200) {
        response_json = await response.json()

        // html에 보여지는 날짜 값으로 변경
        const dateStart = response_json.departure
        let year = dateStart.split('-')[0]
        let month = dateStart.split('-')[1]
        let day = dateStart.split('-')[2].split('T')[0]
        const departure = month + "/" + day + "/" + year

        const dateEnd = response_json.arrival
        year = dateEnd.split('-')[0]
        month = dateEnd.split('-')[1]
        day = dateEnd.split('-')[2].split('T')[0]
        const arrival = month + "/" + day + "/" + year

        document.getElementById("title").value = response_json.title
        document.getElementById("place").value = response_json.place
        document.getElementById("date-start").value = departure
        document.getElementById("date-end").value = arrival
        document.getElementById("cost").value = response_json.cost

        const participantSelect = document.getElementById("participant")

        // 설정한 모집 정원에 맞춰 수정 페이지에서 보여지는 값 변경
        for (let i = 0; i <= 8; i++) {
            if (i == response_json.participant_max - 2) {
                participantSelect.selectedIndex = i
                break
            }
        }

        document.getElementById("content").value = response_json.content
        const imageUrl = response_json.image
        // 저장된 이미지가 있으면 preview
        if (imageUrl) {
            document.getElementById("preview-image").src = proxy + imageUrl
        }
        return response_json
    } else {
        alert("잠시 후 다시 시도해주세요")
    }
}


// 게시글 수정 PUT 요청
async function updateRecruitment() {
    const access = localStorage.getItem("access")

    const title = document.getElementById("title").value
    const place = document.getElementById("place").value
    const dateStart = document.getElementById("date-start").value
    const dateEnd = document.getElementById("date-end").value
    const cost = document.getElementById("cost").value
    const participant = document.getElementById("participant").value
    const content = document.getElementById("content").value
    const image = document.getElementById("image").files[0]

    let timeNow = new Date()
    timeNow = `${timeNow.getFullYear()}${('00' + (timeNow.getMonth() + 1)).slice(-2)
        }${('00' + (timeNow.getDate())).slice(-2)}`

    let year = dateStart.split('/')[2]
    let month = dateStart.split('/')[0]
    let day = dateStart.split('/')[1]
    const departure = year + "-" + month + "-" + day
    let departureCompare = year + month + day

    year = dateEnd.split('/')[2]
    month = dateEnd.split('/')[0]
    day = dateEnd.split('/')[1]
    const arrival = year + "-" + month + "-" + day
    let arrivalCompare = year + month + day

    if (departureCompare <= timeNow) {
        alert("오늘 이후 날짜만 설정할 수 있습니다.")
        return
    }

    if (departureCompare > arrivalCompare) {
        alert("출발일이 도착일보다 늦을 수 없습니다.")
        return
    }

    if (!title) {
        alert("제목을 입력해주세요.")
        return
    }
    if (!place) {
        alert("장소를 입역해주세요.")
        return
    }
    
    if (!dateStart) {
        alert("출발일을 입력해주세요.")
        return
    }
    
    if (!dateEnd) {
        alert("도착일을 입력해주세요.")
        return
    }
    
    if (!cost) {
        alert("비용을 입력해주세요. (단위 : 원) ")
        return
    }

    if (!content) {
        alert("내용을 입력해주세요.")
        return
    }

    // 현재 참가자보다 적은 인원으로 모집 정원 변경 불가
    if (participant < response_json.participant_now) {
        alert("현재 참가자보다 적은 모집인원을 설정할 수 없습니다.")
    } else {
        const formdata = new FormData();

        formdata.append("title", title)
        formdata.append("place", place)
        formdata.append("departure", departure)
        formdata.append("arrival", arrival)
        formdata.append("cost", cost)
        formdata.append("participant_max", participant)
        formdata.append("content", content)

        let maxSize = 3 * 1024 * 1024

        if (image) {
            if (image.size > maxSize) {
                alert("이미지 용량은 3MB 이내로 등록 가능합니다.")
                return
            }
            formdata.append("image", image)
        }

        const response = await fetch(`${proxy}/recruitments/${recruitment_id}/`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${access}`
            },
            body: formdata
        })

        if (response.status == 200) {
            alert("수정 완료")
            window.location.replace(`/recruitments/detail/index.html?recruitment_id=${recruitment_id}`)
        } else if (response.status == 400) {
            alert("필수 항목을 확인하세요")
        } else {
            alert(response.data)
        }
    }

}


// 섬네일 호출 함수
async function setThumbnail() {
    const previewImage = document.getElementById("preview-image")
    const imageInput = document.getElementById("image")
    const formdata = new FormData()

    imageInput.addEventListener('input', function () {
        const file = imageInput.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = function (event) {
                previewImage.src = event.target.result
            }
            reader.readAsDataURL(file)
            formdata.set("image", file)
        } else {
            previewImage.src = ""
            formdata.delete("image")
        }

        const maxSize = 3 * 1024 * 1024
        const imageSize = document.getElementById("file-size")
        let MBsize = (file.size / (1024 * 1024)).toFixed(2)
        imageSize.innerText = `${MBsize}MB`

        if (file.size >= maxSize) {
            imageSize.setAttribute("style", "color:red;")
        } else {
            imageSize.setAttribute("style", "color:black;")
        }
    })
}