document.addEventListener('DOMContentLoaded', async function () {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const code = urlParams.get('code')
    const state = urlParams.get('state')

    const response = await fetch(`http://localhost:8000/users/kakao/login/callback?code=${code}`)

    const data = await response.json()
    console.log("성공", data)

    alert("환영합니다.");
})