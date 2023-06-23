import { proxy } from "../../proxy.js";
import { createMarker } from "./detail_map.js";

// 주소창에서 가져온 게시글 id
const route_id = new URLSearchParams(window.location.search).get('id');
// 로컬 스토리지에서 유저의 정보를 가지고옴
const userInfo = JSON.parse(localStorage.getItem('payload'));

// 모달창 관련 변수들
const modal = document.getElementById("ratingModal");
const btn = document.getElementById("ratingBtn");
const span = document.getElementsByClassName("close")[0];
const submitRating = document.getElementById("submitRating");
const route_rating = document.getElementById("route-detail-rating")

// 수정하기, 삭제하기
const update_box = document.getElementById("update-box")
const update_href = document.getElementById("route-update-href")

// 게시글 요청 함수
async function getRouteDetail() {
    try {
        // 백엔드에 GET 요청
        const response = await fetch(`${proxy}/routes/${route_id}`, {
            method: "GET",
        });

        // 게시글 요청 실패 시 에러
        if (!response.ok) {
            throw new Error('여행경로 게시글을 가져오는데 실패했습니다.');
        }

        // 게시글 요청 성공 시 데이터 리턴
        if (response.status == 200) {
            const response_json = await response.json();
            return response_json;

            // ok가 떴는데 200이 아닐 시
        } else {
            throw new Error('예상치 못한 에러가 발생했습니다. 다시 시도해주세요.');
        }

        // 발생한 에러 출력
    } catch (error) {
        console.error('Error:', error);
    }
}

// 시/도 요청 함수
async function getRouteArea(area_id) {
    try {
        // 백엔드에 GET 요청
        const response = await fetch(`${proxy}/spots/area/`, {
            method: "GET",
        });

        // 시/도 요청 실패 시 에러
        if (!response.ok) {
            throw new Error('여행경로 게시글을 가져오는데 실패했습니다.');
        }

        // 시/도 요청 성공 시 데이터 리턴
        if (response.status == 200) {
            const response_json = await response.json();

            // filter는 전체를 분석하고 find는 조건에 맞는 걸 찾자마자 종료하기 때문에 하나를 찾을 때 더 효율적임
            const targetArea = response_json.find(area => area.id == area_id);

            // 만약 찾지 못했다면 null 반환
            if (!targetArea) {
                return null;
            }

            // 찾았다면 name을 반환
            return targetArea.name;

        } else {
            throw new Error('예상치 못한 에러가 발생했습니다. 다시 시도해주세요.');
        }

        // 발생한 에러 출력
    } catch (error) {
        console.error('Error:', error);
    }
}

// 시군구 요청 함수
async function getRouteSigungu(area_id, sigungu_id) {
    try {
        // 백엔드에 GET 요청
        const response = await fetch(`${proxy}/spots/area/${area_id}`, {
            method: "GET",
        });

        // 시군구 요청 실패 시 에러
        if (!response.ok) {
            throw new Error('여행경로 게시글을 가져오는데 실패했습니다.');
        }

        // 시군구 요청 성공 시 데이터 리턴
        if (response.status == 200) {
            const response_json = await response.json();

            const targetSigungu = response_json.find(sigungu => sigungu.code == sigungu_id);

            // 만약 찾지 못했다면 null 반환
            if (!targetSigungu) {
                return null;
            }

            // 찾았다면 name을 반환
            return targetSigungu.name;

            // ok가 떴는데 200이 아닐 시
        } else {
            throw new Error('예상치 못한 에러가 발생했습니다. 다시 시도해주세요.');
        }

        // 발생한 에러 출력
    } catch (error) {
        console.error('Error:', error);
    }
}

// 평점 등록 함수
async function routeRating(route_id) {
    try {
        const accessToken = localStorage.getItem('access');
        const rating = route_rating.value;

        // 평점을 등록하지 않았을 때
        if (rating === "") {
            return alert("평점을 입력해주세요")
        }

        const response = await fetch(`${proxy}/routes/${route_id}/rate/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ "rate": rating })
        });

        if (!response.ok) {
            throw new Error('평점 등록에 실패했습니다.');
        }

        alert("평점 등록이 완료되었습니다.")

        // 평점이 등록되면 모달창을 숨기고 새로고침
        modal.style.display = "none";
        location.reload();

    } catch (error) {
        console.error('Error:', error);
    }
}

// 여행루트 상세 페이지 로드 함수
async function viewRouteDetail() {
    const route = await getRouteDetail();   // 해당 여행 루트 게시글의 데이터

    const area_id = route.areas[0].area // route의 시/도 id 
    const sigungu_id = route.areas[0].sigungu   // route의 시군구 id
    const spot_ids = route.spots

    const area = await getRouteArea(area_id);   // 시/도의 이름
    const sigungu = await getRouteSigungu(area_id, sigungu_id)  // 시군구의 이름

    const route_title = document.getElementById("route-detail-title")
    const route_image = document.getElementById("route-detail-image")
    const route_area = document.getElementById("route-detail-area")
    const route_sigungu = document.getElementById("route-detail-sigungu")
    const route_duration = document.getElementById("route-detail-duration")
    const route_cost = document.getElementById("route-detail-cost")
    const route_spots = document.getElementById("route-detail-spots")
    const route_rate = document.getElementById("route-detail-rate")
    const route_content = document.getElementById("route-detail-content")

    route_title.innerText = route.title
    route_image.setAttribute("src", proxy + route.image)
    route_area.innerText = area
    route_sigungu.innerText = sigungu
    route_duration.innerText = route.duration + `일`
    route_cost.innerText = route.cost + `원`
    route_spots.innerHTML = ''
    route_rate.innerText = route.rate + `점`
    route_content.innerText = route.content

    // 수정버튼 수정페이지 링크 부여
    const route_user_id = route.user.id;


    if (userInfo.user_id === route_user_id) {
        update_box.style.display = 'block';
        update_href.setAttribute("href", `/routes/detail/update/index.html?id=${route_id}`)
    } else {
        update_box.style.display = 'none';
    }

    // 목적지 목록에 목적지 순차 부여
    let spotCount = 1
    for (let spot of spot_ids) {

        route_spots.innerHTML += `<p style="font-size: 20px">${spotCount}. ${spot.title}</p>`
        spotCount += 1
    }

    // 평점이 하나도 없을 시
    if (route.rate === null) {
        route_rate.innerText = "평점이 없습니다"
    }

    // 이미지가 없을 시 이미지 박스 숨김
    if (route.image === null) {
        route_image.style.display = "none"
    }
    createMarker(spot_ids)
}

// 여행루트 삭제 함수
export async function routeDelete() {
    if (confirm("삭제하시겠습니까?")) {
        const accessToken = localStorage.getItem('access');
        const response = await fetch(`${proxy}/routes/${route_id}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                'content-type': 'application/json',
            },
            method: 'DELETE',
        })
        if (response.status === 204) {
            alert("삭제 완료!")
            location.replace('../')
        } else {
            alert("권한이 없습니다.")
        }
    }
}

// 댓글 작성 함수
async function routeComment() {
    const comment = document.getElementById("route-comment").value
    const accessToken = localStorage.getItem('access');

    const response = await fetch(`${proxy}/routes/${route_id}/comments/`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "content-type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify({
            "content": comment,
        })
    })

    if (response.status == 201) {
        alert("댓글 작성 완료")
        location.reload();
    } else if (comment == '') {
        alert("댓글을 입력해 주세요.")
    }

}

async function getComments(route_id) {
    const response = await fetch(`${proxy}/routes/${route_id}/comments/`);
    const comments = await response.json();

    // JS에서 제공하는 시간 날짜 설정 객체
    const formatter = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });


    comments.forEach((comment, index) => {
        const commentList = document.getElementById('comment-list');
        const date = new Date(comment.created_at);
        const formattedDate = formatter.format(date);   // 날짜 포멧
        const isCommentOwner = (userInfo.user_id === comment.user.id); // 본인이 작성한 댓글인지 확인

        commentList.insertAdjacentHTML('beforeend', `
        <div id="comment-${comment.id}" class="card mb-3 text-start" style="${index !== 0 ? 'border-top: 1px solid #000;' : ''}"> <!-- 첫 번째 댓글을 제외하고 모든 댓글에 상단 경계선 추가 -->
            <div class="row g-3">
                <div class="col-md-1">
                    <div class="card-body">
                        <p class="card-text"><b>${comment.user.nickname}</b></p>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <p class="card-text" id="comment-content-${comment.id}">${comment.content}</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card-body d-flex justify-content-end" style="overflow: hidden; text-overflow: ellipsis;">
                        <p class="card-text"><small class="text-muted">${formattedDate}</small></p>
                    </div>
                </div>
            </div>
            ${isCommentOwner ? ` <!-- 본인이 작성한 댓글일 경우에만 수정 및 삭제 버튼 표시 -->
            <div class="row g-0">
                <div class="col-md-10"></div>
                <div class="col-md-2">
                    <div class="comment-update-box">
                        <a href="#" onclick="event.preventDefault(); editComment(${comment.id})">댓글수정</a>
                        <a href="#" onclick="event.preventDefault(); CommentDelete(${comment.id})">댓글삭제</a>
                    </div>
                </div>
            </div>
            ` : ''} <!-- 본인이 작성한 댓글이 아닐 경우 버튼을 빈 문자열로 대체 -->
        </div>
        `);
    });
}

// 댓글 수정 함수
async function editComment(commentId) {
    // 댓글 내용을 가져오기
    const commentContent = document.getElementById(`comment-content-${commentId}`).textContent;

    // 댓글 수정 폼 생성
    const editForm = document.createElement('form');
    editForm.innerHTML = `
      <input type="text" id="edit-comment-${commentId}" value="${commentContent}">
      <button type="button" onclick="updateComment(${commentId})">Submit</button>
    `;

    // 댓글 수정 폼 표시
    const commentDiv = document.getElementById(`comment-${commentId}`);
    commentDiv.innerHTML = '';
    commentDiv.appendChild(editForm);
}

// 수정 댓글 저장 함수
async function updateComment(commentId) {
    // 수정된 댓글 내용 가져오기
    const editedContent = document.getElementById(`edit-comment-${commentId}`).value;

    // 수정된 댓글 내용을 서버에 전송
    const accessToken = localStorage.getItem('access');
    const response = await fetch(`${proxy}/routes/comments/${commentId}/`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "content-type": "application/json",
        },
        body: JSON.stringify({ content: editedContent })
    });

    if (response.ok) {
        // 댓글 목록 다시 불러오기
        alert("수정 완료!")
        location.reload()
    }
}

// 댓글 삭제
async function CommentDelete(comment_id) {
    if (confirm("삭제하시겠습니까?")) {
        const accessToken = localStorage.getItem('access');
        const response = await fetch(`${proxy}/routes/comments/${comment_id}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                'content-type': 'application/json',
            },
            method: 'DELETE',
        })
        if (response.status === 204) {
            alert("삭제 완료!")
            location.reload();
        } else {
            alert("권한이 없습니다.")
        }
    }
}

// 페이지 로드가 완료되면 상세페이지 로드함수 호출
window.onload = async function () {
    await viewRouteDetail();
    getComments(route_id);
}
window.routeDelete = routeDelete
window.routeComment = routeComment
window.editComment = editComment
window.updateComment = updateComment
window.CommentDelete = CommentDelete


// 모달 관련 js
btn.onclick = function () {
    modal.style.display = "block";
}
span.onclick = function () {
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
submitRating.onclick = function () {
    routeRating(route_id)
}