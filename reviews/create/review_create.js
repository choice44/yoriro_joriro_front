import { loadSpotForReview, } from '/reviews/review.js';
import { proxy } from '/proxy.js';

const token = localStorage.getItem('access')

window.onload = () => {
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

    const formData = new FormData();
    formData.append('title', title);
    formData.append('rate', rate);
    formData.append('spot', spot_id);
    formData.append('visited_date', visited_date);
    formData.append('content', content);
    if (image !== undefined) {
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
        console.log(data[0]["message"]);
        location.replace('/reviews/list/index.html')

    } catch (error) {
        console.error('Error:', error);
    }
};

const createButton = document.getElementById("review_create_button");
createButton.addEventListener('click', handleCreateReview);
