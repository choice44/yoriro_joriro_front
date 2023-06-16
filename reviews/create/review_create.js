const proxy = 'http://127.0.0.1:8000';


window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search).get('id');
    loadSpotForReviewCreate(urlParams);
}

// Spot GET 요청
async function getSpotDetail(spot_id) {

    const url = `${proxy}/spots/${spot_id}/`;

    const response = await fetch(url, {
        method: "GET",
    });

    const response_json = await response.json();

    return response_json;

}

async function loadSpotForReviewCreate(spot_id) {

    // Spot 정보 가져오기
    const spot = await getSpotDetail(spot_id);

    const spot_detail = document.getElementById("review_create_cardbox");

    const template = document.createElement("div");
    template.setAttribute("class", "fh5co-blog");

    // 디폴트 이미지
    if (!spot.firstimage) {
        spot.firstimage = "/images/place-1.jpg";
    }

    // Spot 카드 생성
    template.innerHTML = `
    <div style="height:200px; overflow:hidden;"><img class="img-responsive" src="${spot.firstimage}"
											alt="이미지" style="height:100%; width:100%; object-fit:cover; margin:auto;"></div>
									<div class="blog-text">
										<div class="prod-title">
											<h3>${spot.title}</h3>
											<span class="price">${spot.addr1}</span>
										</div>
									</div>`;

    spot_detail.appendChild(template);

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
    formData.append('rate', visited_date);
    formData.append('content', content);
    if (image !== undefined) {
        formData.append('image', image["name"]);
        console.log(title, rate, visited_date, image["name"], content, spot_id)
    } else { console.log(title, rate, visited_date, content, spot_id) }

    // createReview(formData);
};

async function createReview(formData) {
    try {

        const token = localStorage.getItem('access');

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
        console.log(data.message);

    } catch (error) {
        console.error('Error:', error);
    }
};

const createButton = document.getElementById("review_create_button");
createButton.addEventListener('click', handleCreateReview);
