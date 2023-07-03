import { proxy } from "../../proxy.js"

// 섬네일 확인 함수 항상 호출
setThumbnail()

async function postRecruitment() {
    const title = document.getElementById("title").value
    const place = document.getElementById("place").value
    const dateStart = document.getElementById("date-start").value
    const dateEnd = document.getElementById("date-end").value
    const cost = document.getElementById("cost").value
    const participant = document.getElementById("participant").value
    const content = document.getElementById("content").value
    const image = document.getElementById("image").files[0]

    // 현재 시간 가져오기
    let timeNow = new Date()
    timeNow = `${timeNow.getFullYear()}${('00' + (timeNow.getMonth() + 1)).slice(-2)
        }${('00' + (timeNow.getDate())).slice(-2)}`

    // 저장된 데이터베이스와 같은 형식으로 날짜 변경
    let year = dateStart.split('/')[2]
    let month = dateStart.split('/')[0]
    let day = dateStart.split('/')[1]
    let departure = `${year}-${month}-${day}`
    let departureCompare = year + month + day

    year = dateEnd.split('/')[2]
    month = dateEnd.split('/')[0]
    day = dateEnd.split('/')[1]
    let arrival = `${year}-${month}-${day}`
    let arrivalCompare = year + month + day

    if (departureCompare <= timeNow) {
        alert("오늘 이후 날짜만 설정할 수 있습니다.")
        return
    }

    if (departureCompare > arrivalCompare) {
        alert("출발일이 도착일보다 늦을 수 없습니다.")
        return
    }

    const formdata = new FormData()

    formdata.append("title", title)
    formdata.append("place", place)
    formdata.append("departure", departure)
    formdata.append("arrival", arrival)
    formdata.append("cost", cost)
    formdata.append("participant_max", participant)
    formdata.append("content", content)

    // 사진 최대크기 설정
    let maxSize = 3 * 1024 * 1024

    if (image) {
        if (image.size > maxSize) {
            alert("이미지 용량은 3MB 이내로 등록 가능합니다.")
            return
        }
        formdata.append("image", image)
    }

    let token = localStorage.getItem("access")

    const response = await fetch(`${proxy}/recruitments/`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formdata,
    })

    if (response.status == 201) {
        alert("글작성 완료!")
        window.location.replace(`../index.html`)
    } else if (response.status == 400) {
        alert("필수 항목을 확인하세요")
    } else {
        alert(response.data)
    }
}


// 섬네일 호출 함수
async function setThumbnail() {
    const previewImage = document.getElementById("preview-image")
    const imageInput = document.getElementById("image")
    const formdata = new FormData()

    // input이 있으면 섬네일 변경 및 파일 크기 출력
    imageInput.addEventListener('input', function () {
        // input 되는 사진 가져오기
        const file = imageInput.files[0]
        if (file) {
            // 사진이 있을 경우 previewImage에 사진 가져오기
            const reader = new FileReader()
            reader.onload = function (event) {
                previewImage.src = event.target.result
            }
            reader.readAsDataURL(file)
            formdata.set("image", file)
        } else {
            // 사진이 없을 경우 previewImage 삭제
            previewImage.src = ""
            formdata.delete("image")
        }
        const maxSize = 3 * 1024 * 1024
        const imageSize = document.getElementById("file-size")
        // 소수 둘째자리까지 출력하면서 파일 크기를 MB로 변경
        let MBsize = (file.size / (1024 * 1024)).toFixed(2)
        imageSize.innerText = `${MBsize} MB`

        // 사진이 지정 사이즈가 넘으면 빨간색으로 출력
        if (file.size >= maxSize) {
            imageSize.setAttribute("style", "color:red;")
        } else {
            imageSize.setAttribute("style", "color:black;")
        }
    })
}

window.postRecruitment = postRecruitment