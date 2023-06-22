import { proxy } from "../../proxy.js";

console.log("로드 완료")

window.onload = async function loadMypage() {
    const user_id = JSON.parse(localStorage.getItem("payload")).user_id;
    const user = await getMypage(user_id)
    console.log(user)
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