import { proxy } from "/proxy.js";
import { loadFollowers } from "./mypage_follow.js";


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
  const user_id = JSON.parse(localStorage.getItem("payload")).user_id;
  const user = await getMypage(user_id)
  inputUserInfo(user)
  loadFollowers()
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



// 회원탈퇴 함수
async function deleteUser() {

  const user_id = JSON.parse(localStorage.getItem("payload")).user_id;

  try {
    const confirmation = confirm('회원 탈퇴하시겠습니까?');

    if (!confirmation) {
      return; // 탈퇴 취소 시 함수 종료
    }

    // 로컬 스토리지에서 엑세스 토큰 가져옴
    const accessToken = localStorage.getItem('access');

    // 백엔드에 회원 탈퇴 요청
    const response = await fetch(`${proxy}/users/mypage/${user_id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('회원 탈퇴에 실패하였습니다.');
    }

    alert('회원 탈퇴가 완료되었습니다.');

    // 로그아웃 함수 가져옴, 로그아웃 시 로그인 페이지로 이동
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("payload");

    location.replace('/')

  } catch (error) {
    console.error('Error:', error);
  }
}


window.deleteUser = deleteUser

