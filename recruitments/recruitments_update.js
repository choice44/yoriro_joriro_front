const proxy = "http://127.0.0.1:8000"
// const proxy = "https://api.bechol.com"
const front_proxy = "http://127.0.0.1:5500"


const update = document.getElementById("recruitment-update")
update.addEventListener('click', updateRecruitment)

let response_json
let recruitment_id
setThumbnail()

// export async function getUpdeteRecruitment() {
window.onload = async function getUpdeteRecruitment() {
    recruitment_id = new URLSearchParams(window.location.search).get("id")
    const token = localStorage.getItem('access')

    const url = `${proxy}/recruitments/${recruitment_id}/`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (response.status == 200) {
        response_json = await response.json()
        console.log(response_json)

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
        document.getElementById("participant").value = response_json.participant_max

        // const participantSelect = document.getElementById("participant");
        // const participantOptions = participantSelect.options;
        // console.log(participantOptions)

        // for (let i = 0; i < participantOptions.length; i++) {
        //     if (participantOptions[i].value === response_json.participant_max) {
        //         participantOptions[i].selected = true;
        //         break;
        //     }
        // }

        document.getElementById("content").value = response_json.content
        const imageUrl = response_json.image
        if (imageUrl) {
            document.getElementById("preview-image").src = proxy + imageUrl
        }
        return response_json
    } else {
        console.log("잠시 후 다시 시도해주세요")
    }
}


// 게시글 수정 PUT 요청
export async function updateRecruitment() {
    const access = localStorage.getItem("access")

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
    const departure = year + "-" + month + "-" + day

    year = dateEnd.split('/')[2]
    month = dateEnd.split('/')[0]
    day = dateEnd.split('/')[1]
    const arrival = year + "-" + month + "-" + day

    console.log(title, place, departure, arrival, cost, participant, content, image)
    console.log(participant)

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
        formdata.append("image", image)

        const response = await fetch(`${proxy}/recruitments/${recruitment_id}/`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${access}`
            },
            body: formdata
        })

        if (response.status == 200) {
            alert("수정 완료")
            window.location.replace(`recruitments_detail.html?recruitment_id=${recruitment_id}`)
        }
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
    })
}