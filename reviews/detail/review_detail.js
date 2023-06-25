import { proxy } from '/proxy.js';


window.onload = async function loadReviewDetail() {
    const urlParams = new URLSearchParams(window.location.search).get('id');
    const review = await getReviewDetail(urlParams)
    inputReviewDetail(review)
    checkAuthor(review.user.id, review.id)
}


// 리뷰 불러오기
async function getReviewDetail(review_id) {

    const url = `${proxy}/reviews/${review_id}/`
    const response = await fetch(url, {
        method: 'GET'
    })

    if (response.status == 200) {
        const response_json = await response.json()
        return response_json
    } else {
        alert("잠시 후 다시 시도해주세요")
    }

}


// 리뷰 정보 집어넣기
async function inputReviewDetail(review) {

    /* 카드 상단 */
    // if (review.user.image) {
    //     const author_image = document.getElementById("review_detail_author_image");
    //     author_image.setAttribute("src", `${proxy + review.image}`);
    // };
    const author_nickname = document.getElementById("review_detail_author_nickname");
    author_nickname.innerHTML = review.user.nickname;

    const created_at = document.getElementById("review_detail_created_at");
    created_at.innerHTML = `작성 시각: ${review.created_at}`;

    /* 리뷰 카드 */
    const image_div = document.getElementById("review_detail_image");
    if (review.image) {
        const temp_image = document.createElement("img");
        temp_image.setAttribute("src", `${proxy + review.image}`);
        temp_image.setAttribute("class", "img-responsive");
        temp_image.setAttribute("alt", "대표 이미지");
        temp_image.setAttribute("style", "padding: 0 25% 15px; width:100%;");
        image_div.appendChild(temp_image);
    } else { image_div.remove() };

    const rate = document.getElementById("review_detail_rate");
    rate.innerHTML = "⭐".repeat(review.rate);


    // 로그인 되어있다면 access token에서 id를 얻어 좋아요 여부 확인
    if (localStorage.getItem("access")) {

        // access token에서 my_id 얻기
        const access = localStorage.getItem("access")
        const base64Url = access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const my_id = JSON.parse(jsonPayload).user_id

        review.is_liked = review.likes.includes(my_id);
    }

    const is_liked = document.getElementById("review_detail_like");
    is_liked.setAttribute("class", `${review.is_liked ? "fi fi-ss-heart liked" : "fi fi-ss-heart"}`)

    const like_count = document.getElementById("review_detail_like_count");
    like_count.innerHTML = review.like_count;

    const title = document.getElementById("review_detail_title");
    title.innerHTML = review.title;

    const content = document.getElementById("review_detail_content");
    content.innerHTML = review.content;

    const visited_date = document.getElementById("review_detail_visited_date");
    visited_date.innerHTML = `방문일: ${review.visited_date}`;

    /* 방문지 */
    const spot_card = document.getElementById("review_detail_spot_cardbox");
    spot_card.setAttribute("href", `/spots/index.html?id=${review.spot.id}`)

    if (review.spot.image) {
        const spot_image = document.getElementById("review_detail_spot_image");
        spot_image.setAttribute("src", review.spot.image)
    };
    const spot_title = document.getElementById("review_detail_spot_title");
    spot_title.innerHTML = review.spot.title;

    const spot_addr = document.getElementById("review_detail_spot_addr");
    spot_addr.innerHTML = review.spot.addr;

}


// 리뷰 삭제
async function handleDeleteReview() {

    const review_id = new URLSearchParams(window.location.search).get('id');

    if (confirm("삭제하시겠습니까?")) {
        const response = await fetch(`${proxy}/reviews/${review_id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access"),
                'content-type': 'application/json',
            },
            method: 'DELETE',
        })
        if (response.status === 204) {
            alert("삭제 완료!")
            location.replace('/reviews/list/index.html')
        } else {
            alert("권한이 없습니다.")
        }
    }
}


// 리뷰 작성자만 수정/삭제 버튼 만들어주기
function checkAuthor(author_id, review_id) {
    if (localStorage.getItem("access")) {

        // access token에서 user_id 얻기
        const access = localStorage.getItem("access")
        const base64Url = access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const my_id = JSON.parse(jsonPayload).user_id

        const author_only_buttons = document.getElementById("review_detail_author_only_buttons");

        if (author_id != my_id) {
            author_only_buttons.remove();
        } else {
            const temp_delete_button = document.createElement("input");
            temp_delete_button.setAttribute("type", "button");
            temp_delete_button.setAttribute("class", "btn btn-primary btn-lg");
            temp_delete_button.setAttribute("id", "review_detail_delete_button");
            temp_delete_button.setAttribute("value", "리뷰 삭제하기");
            temp_delete_button.setAttribute("style", "float:right; background-color:#848484; margin-top: 25px;");
            author_only_buttons.appendChild(temp_delete_button);

            const deleteButton = document.getElementById("review_detail_delete_button");
            deleteButton.addEventListener('click', handleDeleteReview);

            const temp_update_button = document.createElement("input");
            temp_update_button.setAttribute("type", "button");
            temp_update_button.setAttribute("class", "btn btn-primary btn-outline btn-lg");
            temp_update_button.setAttribute("value", "리뷰 수정하기");
            temp_update_button.setAttribute("style", "float:right; margin-right:15px; margin-top: 25px;");
            temp_update_button.setAttribute("onclick", `location.href='/reviews/update/index.html?id=${review_id}'`)
            author_only_buttons.appendChild(temp_update_button);

        };
    }
};


// 좋아요 버튼 기능
const review_like_button = document.getElementById("review_detail_like");

review_like_button.addEventListener('click', async function () {
    if (localStorage.getItem("access")) {

        const review_id = new URLSearchParams(window.location.search).get('id');

        const url = `${proxy}/reviews/${review_id}/like/`
        const token = localStorage.getItem("access")

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            method: 'POST',
        })

        if (response.status == 200) {
            review_like_button.classList.toggle('liked');
            const likeCount = document.getElementById("review_detail_like_count");
            const current_like_count = likeCount.innerText
            if (review_like_button.className == "fi fi-ss-heart") {
                likeCount.innerHTML = current_like_count - 1
            } else {
                likeCount.innerHTML = `${Number(current_like_count) + 1}`
            }
        } else {
            alert("잠시 후 다시 시도해주세요")
        }
    } else {
        alert("로그인이 필요합니다.")
        // location.replace('/login/')
    }
});
