import { proxy } from "/proxy.js";
const token = localStorage.getItem('access')


var cnt = new Array();
cnt[0] = new Array("선택");
cnt[1] = new Array("선택", "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구");
cnt[2] = new Array("선택", "강화군", "계양구", "미추홀구", "남동구", "동구", "부평구", "서구", "연수구", "옹진군", "중구");
cnt[3] = new Array("선택", "대덕구", "동구", "서구", "유성구", "중구");
cnt[4] = new Array("선택", "남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구");
cnt[5] = new Array("선택", "광산구", "남구", "동구", "북구", "서구");
cnt[6] = new Array("선택", "강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구");
cnt[7] = new Array("선택", "중구", "남구", "동구", "북구", "울주군");
cnt[8] = new Array("선택", "세종특별자치시");
cnt[9] = new Array("선택", "가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시");
cnt[10] = new Array("선택", "강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군");
cnt[11] = new Array("선택", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "진천군", "청원군", "청주시", "충주시", "증평군");
cnt[12] = new Array("선택", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시", "청양군", "태안군", "홍성군", "계룡시");
cnt[13] = new Array("선택", "경산시", "경주시", "고령군", "구미시", "군위군", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시");
cnt[14] = new Array("선택", "거제시", "거창군", "고성군", "김해시", "남해군", "마산시", "밀양시", "사천시", "산청군", "양산시", "의령군", "진주시", "진해시", "창녕군", "창원시", "통영시", "하동군", "함안군", "함양군", "합천군");
cnt[15] = new Array("선택", "고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군");
cnt[16] = new Array("선택", "강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군");
cnt[17] = new Array("선택", "남제주군", "북제주군", "서귀포시", "제주시");

function changeSigunguForMypageUpdate(add) {

    const sel = document.getElementById("mypage_update_sigungu");
    /* 옵션메뉴삭제 */
    for (let i = sel.length - 1; i > 0; i--) {
        sel.options[i] = null;
    };
    /* 옵션박스추가 */
    for (let i = 1; i < cnt[add].length; i++) {
        sel.options[i] = new Option(cnt[add][i], i);
    };
};


window.changeSigunguForMypageUpdate = changeSigunguForMypageUpdate


// 사용자 데이터를 가져오는 함수
async function getMyProfile() {
    try {

        // payload에서 user_id 가져오기 
        const my_id = JSON.parse(localStorage.getItem('payload')).user_id

        // 헤더에 토큰정보를 싣고 백엔드에 get요청
        const response = await fetch(`${proxy}/users/mypage/${my_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('프로필 정보를 가져오는데 실패하였습니다.');
        }

        // 요청성공하면 받은데이터를 json으로 변환
        const userProfile = await response.json();

        inputMyProfile(userProfile);

    } catch (error) {
        console.error('Error:', error);
    }
}


function inputMyProfile(profile) {
    const nicknameInput = document.getElementById("mypage_update_nickname");
    const ageInput = document.getElementById("mypage_update_age");
    const genderInput = document.getElementById("mypage_update_gender");
    const areaInput = document.getElementById("mypage_update_area");
    const sigunguInput = document.getElementById("mypage_update_sigungu");
    const imageInput = document.getElementById("mypage_update_old_image");
    const emailInput = document.getElementById("mypage_update_email");
    const bioInput = document.getElementById("mypage_update_bio");

    // 입력창에 기존 정보 채우기
    nicknameInput.value = profile.nickname;
    ageInput.value = profile.age;
    emailInput.innerText = profile.email;
    bioInput.value = profile.bio;

    if (profile.gender == "F") {
        genderInput.options[1].selected = true
    } else if (profile.gender == "M") {
        genderInput.options[2].selected = true
    }

    if (profile.area) {
        for (let i = 1; i <= 17; i++) {
            //select box의 option value가 입력 받은 value의 값과 일치할 경우 selected
            if (areaInput.options[i].value == profile.area) {
                areaInput.options[i].selected = true;
                changeSigunguForMypageUpdate(i);
            }
        }
        if (profile.sigungu) {
            sigunguInput.options[profile.sigungu].selected = true;
        };
    };

    if (!profile.image) {
        imageInput.remove();
    } else {
        const temp_image = document.createElement("img");
        temp_image.setAttribute("src", `${proxy + profile.image}`);
        temp_image.setAttribute("class", "img-responsive");
        temp_image.setAttribute("alt", "기존 프로필 사진");
        temp_image.setAttribute("style", "height:100%; width:100%; object-fit:cover;");
        imageInput.appendChild(temp_image);
    };
}


window.onload = () => {
    getMyProfile();
}

async function handleUpdateProfile() {
    try {
        const nickname = document.getElementById("mypage_update_nickname").value;
        const age = document.getElementById("mypage_update_age").value;
        const gender = document.getElementById("mypage_update_gender").value;
        const area = document.getElementById("mypage_update_area").value;
        const sigungu = document.getElementById("mypage_update_sigungu").value;
        const image = document.getElementById("mypage_update_image").files[0];
        const bio = document.getElementById("mypage_update_bio").value;
        const password1 = document.getElementById("mypage_update_password1").value;
        const password2 = document.getElementById("mypage_update_password2").value;



        const formData = new FormData();

        if (image !== undefined) {
            let maxSize = 3 * 1024 * 1024;
            if (image.size > maxSize) {
                return alert("이미지 용량은 3MB 이내로 등록 가능합니다.");
            };
            formData.append("image", image);
        };

        formData.append("nickname", nickname);
        formData.append("age", age);
        formData.append("gender", gender);
        formData.append("area", area);
        formData.append("sigungu", sigungu);
        formData.append("bio", bio);

        if ((password1 && !password2) || (!password1 && password2)) {
            return alert("비밀번호를 변경하시려면 비밀번호와 비밀번호 확인을 모두 입력 해주세요.")
        }
        if (password1 != password2) {
            return alert("비밀번호를 확인 해주세요.")
        }

        if (password1) {
            formData.append("password", password1);
        };

        const my_id = JSON.parse(localStorage.getItem('payload')).user_id

        const response = await fetch(`${proxy}/users/mypage/${my_id}/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('프로필 수정 요청이 실패하였습니다.');
        }

        window.location.href = `/users/mypage/index.html?id=${my_id}`;

    } catch (error) {
        console.error('Error:', error);
    }
}

// 수정 버튼을 클릭 시 handleUpdateProfile 호출
const updateBtn = document.getElementById("mypage_update_button");
updateBtn.addEventListener("click", handleUpdateProfile);
