import { proxy } from "/proxy.js";

async function handleSignup() {
  const email = document.getElementById("email").value;
  const nickname = document.getElementById("nickname").value;
  const password = document.getElementById("password").value;
  console.log(email, nickname, password);

  const response = await fetch(`${proxy}/users/signup/`, {
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

  if (response.status == 201) {
    alert("회원가입을 축하합니다!");
    window.location.replace(`/users/login/`);
  }

}

const signup = document.getElementById('signup-btn');
signup.addEventListener('click', handleSignup);