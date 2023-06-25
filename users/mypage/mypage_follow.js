import { proxy } from "/proxy.js";

const user_id = JSON.parse(localStorage.getItem("payload")).user_id;
const token = localStorage.getItem('access')
const following_id_list = []

window.onload = async function loadMypage() {
    loadFollowers()
}


async function getMypage(user_id) {
    const response = await fetch(`${proxy}/users/mypage/${user_id}/`)
    if (response.status == 200) {
        const response_json = await response.json();
        for (const following of response_json.followings) {
            following_id_list.push(following.id)
        }
        return response_json
    } else {
        alert("불러오는데 실패했습니다")
    }
}


async function loadFollowings() {

    const userProfile = await getMypage(user_id)

    const followingElement = document.getElementById("mypage_follow_list");

    followingElement.innerHTML = "";

    for (const following of userProfile.followings) {

        followingElement.innerHTML += `
        <div class="col-md-12" style="height:80px; line-height:80px;">
            <h3 class="price"
                style="color:#F78536; display:inline; line-height:80px; cursor:pointer;" onclick="location.href='/users/mypage/index.html?id=${following.id}'">
                ${following.email}</h3>
            <input type="button" value="언팔로우"
                class="btn btn-primary btn-lg"
                style="float:right; margin:16px 0; background-color:#848484;"
                onclick="handleFollow(${following.id})">
        </div>
        `
    };
};


async function loadFollowers() {

    const userProfile = await getMypage(user_id)

    const followerElement = document.getElementById("mypage_follow_list");

    followerElement.innerHTML = "";

    // 팔로워 표시, 받은 id값을 for문으로 하나씩 백엔드에 요청
    for (const follower of userProfile.followers) {
        follower.is_following = following_id_list.includes(follower.id);
        if (follower.is_following) {
            followerElement.innerHTML += `
        <div class="col-md-12" style="height:80px; line-height:80px;">
            <h3 class="price"
                style="color:#F78536; display:inline; line-height:80px; cursor:pointer;" onclick="location.href='/users/mypage/index.html?id=${follower.id}'">
                ${follower.email}</h3>
        </div>
        `
        } else {
            followerElement.innerHTML += `
        <div class="col-md-12" style="height:80px; line-height:80px;">
            <h3 class="price"
                style="color:#F78536; display:inline; line-height:80px; cursor:pointer;" onclick="location.href='/users/mypage/index.html?id=${follower.id}'">
                ${follower.email}</h3>
            <input type="button" value="팔로우"
                class="btn btn-primary btn-outline btn-lg"
                style="float:right; margin:16px 0;"
                onclick="handleFollow(${follower.id})">
        </div>
        `
        };
    };
};


async function handleFollow(id) {

    const response = await fetch(`${proxy}/users/follow/${id}/`, {
        headers: {
            "content-type": "application/json",
            "Authorization": "Bearer " + token
        },
        method: "POST"
    })

    window.location.href = "/users/mypage/index.html"

}


window.loadFollowings = loadFollowings
window.loadFollowers = loadFollowers
window.handleFollow = handleFollow
