import { loadSpotForReview, } from '/reviews/review.js';
import { proxy } from '/proxy.js';

const token = localStorage.getItem('access')

window.onload = () => {
    if (!token) {
        alert("로그인이 필요한 서비스입니다.")
        window.location.href = "/users/login/index.html"
    }
    const urlParams = new URLSearchParams(window.location.search).get('id');
    loadSpotForReview(urlParams);
}


function handleCreateReview(event) {

    event.preventDefault(); // 제출 버튼을 눌렀을 때 새로고침 방지

    const spot_id = new URLSearchParams(window.location.search).get('id');
    const title = document.getElementById("review_create_title").value;
    const rate = document.getElementById("review_create_rate").value;
    const image = document.getElementById("review_create_thumbnail").files[0];
    const content = document.getElementById("review_create_content").value;
    let visited_date = document.getElementById("date-start").value;

    // 빈칸 확인
    if (!title || !content || !visited_date) {
        alert("빈칸이 있습니다.")
    }

    // 06/16/2023 -> 2023-06-16
    const date_numbers = visited_date.split("/")
    visited_date = date_numbers[2] + "-" + date_numbers[0] + "-" + date_numbers[1]

    // 현재 시간 가져오기
    let timeNow = new Date()
    let timeNow_3 = new Date()
    timeNow = `${timeNow.getFullYear()}-${('00' + (timeNow.getMonth() + 1)).slice(-2)}-${('00' + (timeNow.getDate())).slice(-2)}`
    timeNow_3 = `${Number(timeNow_3.getFullYear()) - 3}-${('00' + (timeNow_3.getMonth() + 1)).slice(-2)}-${('00' + (timeNow_3.getDate())).slice(-2)}`

    // 오늘 날짜까지는 입력 가능. 그 이후 미래 날짜는 입력 불가.
    if (visited_date > timeNow) {
        return alert("날짜를 확인해주세요.");
    } else if (visited_date < timeNow_3) {
        return alert("최근 3년 이내에 방문한 장소만 리뷰를 작성할 수 있습니다.");
    };

    const formData = new FormData();
    formData.append('title', title);
    formData.append('rate', rate);
    formData.append('spot', spot_id);
    formData.append('visited_date', visited_date);
    formData.append('content', content);
    if (image !== undefined) {
        let imgSize = image.size;
        let maxSize = 3 * 1024 * 1024;
        if (imgSize > maxSize) {
            alert("이미지 용량은 3MB 이내로 등록 가능합니다.");
            return;
        };
        formData.append('image', image);
    };

    createReview(formData);
};


async function createReview(formData) {
    try {

        const response = await fetch(`${proxy}/reviews/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('작성에 실패하였습니다.');
        }

        const data = await response.json();

        location.replace('/reviews/list/index.html')

    } catch (error) {
        console.error('Error:', error);
    }
};

const createButton = document.getElementById("review_create_button");
createButton.addEventListener('click', handleCreateReview);
