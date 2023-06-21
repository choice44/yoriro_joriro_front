import { proxy } from "/proxy.js";

document.addEventListener('DOMContentLoaded', async function () {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const code = urlParams.get('code')

    const response = await fetch(`${proxy}/users/google/login/callback?code=${code}`)

    if (response.status == 200 || 201) {
        const response_json = await response.json();
        console.log(response);
        console.log(response_json);

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
})