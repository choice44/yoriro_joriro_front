import { proxy } from "../../proxy.js"

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

    let year = dateStart.split('/')[2]
    let month = dateStart.split('/')[0]
    let day = dateStart.split('/')[1]
    let departure = `${year}-${month}-${day}`

    year = dateEnd.split('/')[2]
    month = dateEnd.split('/')[0]
    day = dateEnd.split('/')[1]
    let arrival = `${year}-${month}-${day}`

    const formdata = new FormData()

    formdata.append("title", title)
    formdata.append("place", place)
    formdata.append("departure", departure)
    formdata.append("arrival", arrival)
    formdata.append("cost", cost)
    formdata.append("participant_max", participant)
    formdata.append("content", content)

    let maxSize = 3 * 1024 * 1024
    if (image.size > maxSize) {
        alert("이미지 용량은 3MB 이내로 등록 가능합니다.")
        return
    }

    if (image) {
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
    } else {
        alert(response.data)
    }
}


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

window.postRecruitment = postRecruitment