document.addEventListener('DOMContentLoaded', function () {

  const profile = document.querySelector('#profile')

  if (localStorage.getItem("payload")) {

    profile.innerHTML = `
        <li><a href="/index.html">마이페이지</a></li>
        <li><a onclick="handleLogout()">로그아웃</a></li>
      `
  }
})


function handleLogout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("payload");

  location.reload();
}
