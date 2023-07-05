import { loadSpotForReview, getReview } from '/reviews/review.js';
import { proxy } from '/proxy.js';

const token = localStorage.getItem('access')


window.onload = () => {

    if (!token) {
        alert("로그인이 필요한 서비스입니다.")
        window.location.href = "/users/login/index.html"
    }

    const urlParams = new URLSearchParams(window.location.search).get('id');
    loadReviewForUpdate(urlParams)
}


// 기존 평점 selected로 만들어주기
function findSelectedRate(rate) {
    let review_rate = document.getElementById("review_update_rate");

    for (var i = 0, j = 5; i < j; i++) {
        if (review_rate.options[i].value == rate) {
            review_rate[i].selected = true;
            break;
        }
    }
}


// 기존 리뷰 정보 화면에 채워주기
async function loadReviewForUpdate(review_id) {

    const review = await getReview(review_id)

    if (JSON.parse(localStorage.getItem("payload")).user_id !== review.user.id) {
        alert("글을 수정할 권한이 없습니다.")
        window.location.href = "/"
    }

    loadSpotForReview(review.spot.id);
    findSelectedRate(review.rate);

    // 2023-06-20 -> 06/20/2023
    const date_numbers = review.visited_date.split("-")
    const formatted_date = date_numbers[1] + "/" + date_numbers[2] + "/" + date_numbers[0]

    const current_visited_date = document.querySelector("#date-start");
    current_visited_date.value = formatted_date;

    if (review.image != null) {
        const filename = document.getElementById("review_update_image_name");
        filename.innerText = `현재 이미지: ${review.image.slice(29)}`;
    }

    const currnet_title = document.querySelector("#review_update_title");
    currnet_title.value = review.title;

    const currnet_content = document.querySelector("#review_update_content");
    currnet_content.value = review.content;
}


// 리뷰 수정 PUT 요청
async function handleUpdateReview() {

    const review_id = new URLSearchParams(window.location.search).get("id");

    const new_title = document.getElementById("review_update_title").value;
    const new_rate = document.getElementById("review_update_rate").value;
    const new_image = document.getElementById("review_update_thumbnail").files[0];
    const new_content = document.getElementById("review_update_content").value;
    let new_visited_date = document.getElementById("date-start").value;

    // 빈칸 확인
    if (!new_title || !new_content || !new_visited_date) {
        alert("빈칸이 있습니다.")
    }

    // 06/16/2023 -> 2023-06-16
    const date_numbers = new_visited_date.split("/")
    new_visited_date = date_numbers[2] + "-" + date_numbers[0] + "-" + date_numbers[1]

    // 현재 시간 가져오기
    let timeNow = new Date()
    let timeNow_3 = new Date()
    timeNow = `${timeNow.getFullYear()}-${('00' + (timeNow.getMonth() + 1)).slice(-2)}-${('00' + (timeNow.getDate())).slice(-2)}`
    timeNow_3 = `${Number(timeNow_3.getFullYear()) - 3}-${('00' + (timeNow_3.getMonth() + 1)).slice(-2)}-${('00' + (timeNow_3.getDate())).slice(-2)}`

    // 오늘 날짜까지는 입력 가능. 그 이후 미래 날짜는 입력 불가.
    if (new_visited_date > timeNow) {
        return alert("날짜를 확인해주세요.");
    } else if (new_visited_date < timeNow_3) {
        return alert("최근 3년 이내에 방문한 장소만 리뷰를 작성할 수 있습니다.");
    };

    const formData = new FormData();
    formData.append('title', new_title);
    formData.append('rate', new_rate);
    formData.append('visited_date', new_visited_date);
    formData.append('content', new_content);
    if (new_image !== undefined) {
        let imgSize = new_image.size;
        let maxSize = 3 * 1024 * 1024;
        if (imgSize > maxSize) {
            alert("이미지 용량은 3MB 이내로 등록 가능합니다.");
            return;
        };
        formData.append('image', new_image);
    };

    const url = `${proxy}/reviews/${review_id}/`
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    })

    if (response.status == 200) {
        alert("수정 완료");
        window.location.replace(`/reviews/list/index.html`);
    }
}


// 수정 버튼을 클릭 시 handleUpdateButtonClick 호출
const updateBtn = document.getElementById("review_update_button");
updateBtn.addEventListener("click", handleUpdateReview);
