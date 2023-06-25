import { proxy } from "/proxy.js";

async function handleSignup() {
  const email = document.getElementById("email").value;
  const nickname = document.getElementById("nickname").value;
  const password1 = document.getElementById("password1").value;
  const password2 = document.getElementById("password2").value;

  if (!email) {
    return alert("이메일을 입력 해주세요.")
  }
  if (!nickname) {
    return alert("닉네임을 입력 해주세요.")
  }
  if (!password1) {
    return alert("비밀번호를 입력 해주세요.")
  }
  if (!password2) {
    return alert("비밀번호 확인을 입력 해주세요.")
  }
  if (password1 != password2) {
    return alert("비밀번호를 확인 해주세요.")
  }

  const password = password1

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
  } else {
    const response_json = await response.json()
    alert(response_json.message)
  }

}

const signup = document.getElementById('signup-btn');
signup.addEventListener('click', handleSignup);