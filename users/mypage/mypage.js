import { proxy } from "/proxy.js";

const my_id = JSON.parse(localStorage.getItem("payload")).user_id;
const user_id = new URLSearchParams(window.location.search).get("id");
const token = localStorage.getItem('access')
let following_id_list = []


const areaDict = {};
areaDict[1] = '서울'
areaDict[2] = '인천'
areaDict[3] = '대전'
areaDict[4] = '대구'
areaDict[5] = '광주'
areaDict[6] = '부산'
areaDict[7] = '울산'
areaDict[8] = '세종특별자치시'
areaDict[31] = '경기도'
areaDict[32] = '강원도'
areaDict[33] = '충청북도'
areaDict[34] = '충청남도'
areaDict[35] = '경상북도'
areaDict[36] = '경상남도'
areaDict[37] = '전라북도'
areaDict[38] = '전라남도'
areaDict[39] = '제주도'


const sigunguDict = {};
sigunguDict[1] = new Array("선택", "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구");
sigunguDict[2] = new Array("선택", "강화군", "계양구", "미추홀구", "남동구", "동구", "부평구", "서구", "연수구", "옹진군", "중구");
sigunguDict[3] = new Array("선택", "대덕구", "동구", "서구", "유성구", "중구");
sigunguDict[4] = new Array("선택", "남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구");
sigunguDict[5] = new Array("선택", "광산구", "남구", "동구", "북구", "서구");
sigunguDict[6] = new Array("선택", "강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구");
sigunguDict[7] = new Array("선택", "중구", "남구", "동구", "북구", "울주군");
sigunguDict[8] = new Array("선택", "세종특별자치시");
sigunguDict[31] = new Array("선택", "가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시");
sigunguDict[32] = new Array("선택", "강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군");
sigunguDict[33] = new Array("선택", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "진천군", "청원군", "청주시", "충주시", "증평군");
sigunguDict[34] = new Array("선택", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시", "청양군", "태안군", "홍성군", "계룡시");
sigunguDict[35] = new Array("선택", "경산시", "경주시", "고령군", "구미시", "군위군", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시");
sigunguDict[36] = new Array("선택", "거제시", "거창군", "고성군", "김해시", "남해군", "마산시", "밀양시", "사천시", "산청군", "양산시", "의령군", "진주시", "진해시", "창녕군", "창원시", "통영시", "하동군", "함안군", "함양군", "합천군");
sigunguDict[37] = new Array("선택", "고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군");
sigunguDict[38] = new Array("선택", "강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군");
sigunguDict[39] = new Array("선택", "남제주군", "북제주군", "서귀포시", "제주시");


window.onload = async function loadMypage() {

	const my_info = await getMypage(my_id)

	for (const following of my_info.followings) {
		following_id_list.push(following.id)
	}

	if (user_id == my_id) {
		my_info.is_mymypage = true
		inputUserInfo(my_info)
	} else {
		my_info.is_mymypage = false
		const user = await getMypage(user_id)
		inputUserInfo(user)
	}

	loadFollowers()
	my_info.is_mymypage ? showEditButtons() : showFollowButton()
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
		return "";
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

	const user_image = document.getElementById("mypage_image");
	if (user.image) {
		user_image.setAttribute("src", proxy + user.image);
	};
	const user_area = document.getElementById("mypage_area")
	if (user.area) {
		user_area.innerHTML = areaDict[user.area]
	}
	const user_sigungu = document.getElementById("mypage_sigungu")
	if (user.sigungu) {
		user_sigungu.innerHTML = sigunguDict[user.area][user.sigungu]
	}
}


async function loadFollowings() {

	const userProfile = await getMypage(user_id)

	const followingElement = document.getElementById("mypage_follow_list");

	followingElement.innerHTML = "";

	for (const following of userProfile.followings) {
		following.is_following = following_id_list.includes(following.id);
		// 자기 자신일 경우 팔로우/언팔로우 버튼 없음
		if (following.id == my_id) {
			followingElement.innerHTML += `
      <div class="col-md-12" style="height:80px; line-height:80px;">
          <h3 class="price"
              style="color:#F78536; display:inline; line-height:80px; cursor:pointer;" onclick="location.href='/users/mypage/index.html?id=${following.id}'">
              ${following.email}</h3>
      </div>
      `} else { // 팔로우하고 있는 사람의 경우 언팔로우 버튼
			if (following.is_following) {
				followingElement.innerHTML += `
      <div class="col-md-12" style="height:80px; line-height:80px;">
          <h3 class="price"
              style="color:#F78536; display:inline; line-height:80px; cursor:pointer;" onclick="location.href='/users/mypage/index.html?id=${following.id}'">
              ${following.email}</h3>
          <input type="button" value="언팔로우"
              class="btn btn-primary btn-lg"
              style="float:right; margin:16px 0; background-color:#848484; width:116px;"
              onclick="handleFollow(${following.id}); changeMypageFollowButton(this);">
      </div>
      `} else { // 아니면 팔로우 버튼
				followingElement.innerHTML += `
      <div class="col-md-12" style="height:80px; line-height:80px;">
          <h3 class="price"
              style="color:#F78536; display:inline; line-height:80px; cursor:pointer;" onclick="location.href='/users/mypage/index.html?id=${following.id}'">
              ${following.email}</h3>
          <input type="button" value="팔로우"
              class="btn btn-primary btn-lg"
              style="float:right; margin:16px 0; width:116px;"
              onclick="handleFollow(${following.id}); changeMypageFollowButton(this);">
      </div>
      `}
		};
	};
};


async function loadFollowers() {

	const userProfile = await getMypage(user_id);

	const followerElement = document.getElementById("mypage_follow_list");

	followerElement.innerHTML = "";

	// 팔로워 표시
	for (const follower of userProfile.followers) {
		follower.is_following = following_id_list.includes(follower.id);
		// 자기 자신일 경우 팔로우/언팔로우 버튼 없음
		if (follower.id == my_id) {
			followerElement.innerHTML += `
      <div class="col-md-12" style="height:80px; line-height:80px;">
          <h3 class="price"
              style="color:#F78536; display:inline; line-height:80px; cursor:pointer;" onclick="location.href='/users/mypage/index.html?id=${follower.id}'">
              ${follower.email}</h3>
      </div>
      `} else {
			// 팔로우하고 있는 사람의 경우 언팔로우 버튼
			if (follower.is_following) {
				followerElement.innerHTML += `
      <div class="col-md-12" style="height:80px; line-height:80px;">
          <h3 class="price"
              style="color:#F78536; display:inline; line-height:80px; cursor:pointer;" onclick="location.href='/users/mypage/index.html?id=${follower.id}'">
              ${follower.email}</h3>
              <input type="button" value="언팔로우"
              class="btn btn-primary btn-lg"
              style="float:right; margin:16px 0; background-color:#848484; width:116px;"
              onclick="handleFollow(${follower.id}); changeMypageFollowButton(this);">
      </div>
      </div>
      `} else { // 아니면 팔로우 버튼
				followerElement.innerHTML += `
      <div class="col-md-12" style="height:80px; line-height:80px;">
          <h3 class="price"
              style="color:#F78536; display:inline; line-height:80px; cursor:pointer;" onclick="location.href='/users/mypage/index.html?id=${follower.id}'">
              ${follower.email}</h3>
          <input type="button" value="팔로우"
              class="btn btn-primary btn-lg"
              style="float:right; margin:16px 0; width:116px;"
              onclick="handleFollow(${follower.id}); changeMypageFollowButton(this);">
      </div>
      `};
		};
	};
};

// 팔로우
async function handleFollow(id) {

	const response = await fetch(`${proxy}/users/follow/${id}/`, {
		headers: {
			"content-type": "application/json",
			"Authorization": "Bearer " + token
		},
		method: "POST"
	});

	if (following_id_list.includes(id)) {
		following_id_list = following_id_list.filter(followingId => followingId !== id);
	} else {
		following_id_list.push(id);
	};
};

// 팔로우/언팔로우 버튼 바꿔주는 함수
function changeMypageFollowButton(el) {
	const my_id = JSON.parse(localStorage.getItem("payload")).user_id;
	if (el.value == "팔로우") {
		el.setAttribute("value", "언팔로우");
		el.setAttribute("style", "float:right; margin:16px 0; background-color:#848484; width:116px;")
		if (user_id == my_id) {
			const user_followings = document.getElementById("mypage_followings")
			const user_followings_number = document.getElementById("mypage_followings").innerText.slice(4)
			user_followings.innerHTML = `팔로잉 ${Number(user_followings_number) + 1}`
		};
	} else {
		el.setAttribute("value", "팔로우");
		el.setAttribute("style", "float:right; margin:16px 0; width:116px;")
		if (user_id == my_id) {
			const user_followings = document.getElementById("mypage_followings")
			const user_followings_number = document.getElementById("mypage_followings").innerText.slice(4)
			user_followings.innerHTML = `팔로잉 ${user_followings_number - 1}`
		};
	};
}


// 회원탈퇴 함수
async function deleteUser() {

	try {
		const confirmation = confirm('회원 탈퇴하시겠습니까?');

		if (!confirmation) {
			return; // 탈퇴 취소 시 함수 종료
		}

		// 백엔드에 회원 탈퇴 요청
		const response = await fetch(`${proxy}/users/mypage/${my_id}/`, {
			method: 'DELETE',
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});

		if (!response.ok) {
			throw new Error('회원 탈퇴에 실패하였습니다.');
		}

		alert('회원 탈퇴가 완료되었습니다.');

		// 회원 탈퇴 후 메인페이지로 이동
		localStorage.removeItem("access");
		localStorage.removeItem("refresh");
		localStorage.removeItem("payload");

		location.replace('/')

	} catch (error) {
		console.error('Error:', error);
	}
}


window.deleteUser = deleteUser
window.loadFollowings = loadFollowings
window.loadFollowers = loadFollowers
window.handleFollow = handleFollow
window.changeMypageFollowButton = changeMypageFollowButton


// 본인인 경우 수정 버튼과 삭제 버튼을 보이도록 처리하는 함수
function showEditButtons() {
	const my_buttons = document.getElementById("mypage_my_buttons");

	const temp_update_button = document.createElement("input");
	temp_update_button.setAttribute("type", "button");
	temp_update_button.setAttribute("class", "btn btn-primary btn-outline btn-lg");
	temp_update_button.setAttribute("value", "수정하기");
	temp_update_button.setAttribute("style", "margin-right:15px; margin-top: 25px;");
	temp_update_button.setAttribute("onclick", "location.href='/users/mypage/update/index.html'")
	my_buttons.appendChild(temp_update_button);

	const temp_delete_button = document.createElement("input");
	temp_delete_button.setAttribute("type", "button");
	temp_delete_button.setAttribute("class", "btn btn-primary btn-lg");
	temp_delete_button.setAttribute("id", "mypage_delete_button");
	temp_delete_button.setAttribute("value", "탈퇴하기");
	temp_delete_button.setAttribute("style", "background-color:#848484; margin-top: 25px;");
	my_buttons.appendChild(temp_delete_button);

	const deleteButton = document.getElementById("mypage_delete_button");
	deleteButton.addEventListener('click', deleteUser);

}

// 타인인 경우 팔로우 또는 언팔로우 버튼을 보여주는 함수
function showFollowButton() {

	const my_buttons = document.getElementById("mypage_my_buttons");

	if (following_id_list.includes(Number(user_id)) == true) {
		const temp_unfollow_button = document.createElement("input");
		temp_unfollow_button.setAttribute("type", "button");
		temp_unfollow_button.setAttribute("class", "btn btn-primary btn-lg");
		temp_unfollow_button.setAttribute("value", "언팔로우");
		temp_unfollow_button.setAttribute("style", "margin-top: 25px; background-color:#848484; width:116px; float:right;");
		temp_unfollow_button.setAttribute("onclick", `handleFollow(${user_id}); changeMypageFollowButton(this);`);
		my_buttons.appendChild(temp_unfollow_button);
	} else {
		const temp_follow_button = document.createElement("input");
		temp_follow_button.setAttribute("type", "button");
		temp_follow_button.setAttribute("class", "btn btn-primary btn-lg");
		temp_follow_button.setAttribute("value", "팔로우");
		temp_follow_button.setAttribute("style", "margin-top: 25px; width:116px; float:right;");
		temp_follow_button.setAttribute("onclick", `handleFollow(${user_id}); changeMypageFollowButton(this);`);
		my_buttons.appendChild(temp_follow_button);
	};
};
