// const proxy = "https://api.bechol.com"
const proxy = "http://127.0.0.1:8000";


document.addEventListener('DOMContentLoaded', async function () {

  const profile = document.querySelector('#profile')

  if (localStorage.getItem("payload")) {
    const my_id = JSON.parse(localStorage.getItem("payload")).user_id;
    profile.innerHTML = `
        <li><a href="/users/mypage/index.html?id=${my_id}">마이페이지</a></li>
        <li><a onclick="handleLogout()">로그아웃</a></li>
      `
  }

  tokenRefresh()
})


function handleLogout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("payload");

  location.reload();
}

async function tokenRefresh() {
  const refresh = localStorage.getItem("refresh")

  if (refresh) {
    const response = await fetch(`${proxy}/users/api/token/refresh/`, {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        refresh: refresh
      })
    });

    if (response.status == 200) {
      const response_json = await response.json();
      localStorage.setItem("access", response_json.access);
    } else {
      handleLogout()
    }
  }
}
