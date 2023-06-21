const frontend_base_url = "http://127.0.0.1:5500";
const backend_base_url = "http://127.0.0.1:8000";

window.onload = () => {
  console.log("로딩되었음");
};
  
async function handleSignup() {
    const email = document.getElementById("email").value;
    const nickname = document.getElementById("nickname").value;
    const password = document.getElementById("password").value;
    console.log(email, nickname, password);
  
    const response = await fetch(`${backend_base_url}/users/signup/`, {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: email,
        nickname: nickname,
        password: password,
      }),
    });
  
    return response;
}
  
async function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  console.log(email, password)
  const response = await fetch(`${backend_base_url}/users/login/`, {
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
    window.location.replace(`${frontend_base_url}/index.html`);
  
  } else {
    alert("회원정보가 일치하지 않습니다.");
  }
}


async function handleLogout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("payload");

  location.reload();
}

function checkLogin() {
  const payload = localStorage.getItem("payload");
  if (payload) {
    window.location.replace(`${frontend_base_url}/`);
  }
}




