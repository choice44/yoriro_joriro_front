import { proxy } from "/proxy.js";

console.log("로드 완료")

window.onload = async function loadMypage() {
  const user_id = JSON.parse(localStorage.getItem("payload")).user_id;
  const user = await getMypage(user_id)
  inputUserInfo(user)
  console.log(user)
}

async function getMypage(user_id) {
    const response = await fetch(`${proxy}/users/mypage/${user_id}/`)
    if (response.status == 200) {
        const response_json = await response.json();
      return response_json
    } else {
        alert("불러오는데 실패했습니다")
    }
}

function convertGender(gender) {
  if (gender === "F") {
    return "여성";
  } else if (gender === "M") {
    return "남성";
  } else {
    return "성별 정보 없음";
  }
}

// 유저 정보 집어넣기
async function inputUserInfo(user) {
  const user_nickname = document.getElementById("mypage_nickname")
  user_nickname.innerHTML = user.nickname
  const user_bio = document.getElementById("mypage_bio")
  user_bio.innerHTML = user.bio
  const user_gender = document.getElementById("mypage_gender");
  user_gender.innerHTML = convertGender(user.gender)
  const user_age = document.getElementById("mypage_age")
  user_age.innerHTML = user.age
  const user_followers = document.getElementById("mypage_followers")
  user_followers.innerHTML = "팔로워 " + user.followers_count;
  const user_followings = document.getElementById("mypage_followings")
  user_followings.innerHTML = "팔로잉 " + user.followings_count
  // // 이미지 URL 가져오기
  // const user_image_url = user.image;

  // // 이미지 요소 생성
  // const user_image = document.getElementById("mypage_image");
  // const imgElement = document.createElement("img");
  // imgElement.src = user_image_url;

  // // 이미지를 프론트엔드에 표시
  // user_image.appendChild(imgElement);
}