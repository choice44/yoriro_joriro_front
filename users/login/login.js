import { proxy } from "/proxy.js";
import { SOCIAL_AUTH_NAVER_CLIENT_ID, SOCIAL_AUTH_KAKAO_CLIENT_ID, SOCIAL_AUTH_GOOGLE_CLIENT_ID } from "/secret.js";

checkLogin();

const NAVER_REDIRECT_URI = "https://localhost:5500/users/naverauthcallback/index.html";
const KAKAO_REDIRECT_URI = "https://cdn.bechol.com/users/kakaoauthcallback/index.html";
const GOOGLE_REDIRECT_URI = "https://cdn.bechol.com/users/googleauthcallback/index.html";


window.onload = function () {
    let naver_btn = document.getElementById("naver-btn")
    let kakao_btn = document.getElementById("kakao-btn")
    let google_btn = document.getElementById("google-btn")

    naver_btn.setAttribute("href", `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${SOCIAL_AUTH_NAVER_CLIENT_ID}&state=STATE_STRING&redirect_uri=${NAVER_REDIRECT_URI}`)
    kakao_btn.setAttribute("href", `https://kauth.kakao.com/oauth/authorize?client_id=${SOCIAL_AUTH_KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`)
    google_btn.setAttribute("href", `https://accounts.google.com/o/oauth2/v2/auth?client_id=${SOCIAL_AUTH_GOOGLE_CLIENT_ID}&response_type=code&redirect_uri=${GOOGLE_REDIRECT_URI}&scope=https://www.googleapis.com/auth/userinfo.email`)

};


async function handleLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email) {
        return alert("이메일을 입력 해주세요.")
    }
    if (!password) {
        return alert("비밀번호를 입력 해주세요.")
    }

    const response = await fetch(`${proxy}/users/login/`, {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    });

    if (response.status == 200) {
        const response_json = await response.json();

        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);

        const base64Url = response_json.access.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );

        localStorage.setItem("payload", jsonPayload);
        alert("환영합니다.");
        window.location.replace("/");

    } else {
        alert("회원정보가 일치하지 않습니다.");
    }
}

function checkLogin() {
    const payload = localStorage.getItem("payload");
    if (payload) {
        window.location.replace(`/`);
    }
}

const login = document.getElementById('login-btn');
login.addEventListener('click', handleLogin);