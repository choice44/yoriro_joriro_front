const proxy = 'http://127.0.0.1:8000';

function loadPlace(e) {
    imageDict = {};
    imageDict[1] = 'background-image: url(/images/625.jpg);';
    imageDict[2] = 'background-image: url(/images/haeundae.jpg);';
    imageDict[3] = 'background-image: url(/images/hanra.png);';
    imageDict[4] = 'background-image: url(/images/panmunjeom.JPG);';
    imageDict[5] = 'background-image: url(/images/seokguram.jpeg);';

    sourceDict = {}
    sourceDict[1] = '전쟁기념관(https://www.warmemo.or.kr/)';
    sourceDict[2] = '부산광역시(https://www.busan.go.kr/index)';
    sourceDict[3] = '제주특별자치도청(https://www.jeju.go.kr/index.htm)';
    sourceDict[4] = '경기도(https://www.gg.go.kr/)';
    sourceDict[5] = '경주시청(https://www.gyeongju.go.kr/tour/page.do?listType=&mnu_uid=2349&sortKwd=&code_uid=1044&srchKwd=&area_uid=258&cmd=2&pageNo=1)';



    const selectedBackground = imageDict[e];
    const selectedSource = sourceDict[e];

    const backgroud = document.getElementById("background-image");
    backgroud.style = selectedBackground;

    const existingSourceText = document.getElementById("source-text");

    // 기존에 있는 소스텍스트가 있다면, 먼저 삭제합니다.
    if (existingSourceText) {
        backgroud.removeChild(existingSourceText);
    }

    const sourceText = document.createElement("p")
    sourceText.id = "source-text";
    sourceText.innerText = `본 저작물은 공공누리 제 1 유형에 따라[${selectedSource}]의 공공저작물을 이용하였습니다.`
    sourceText.style.color = 'black';
    backgroud.appendChild(sourceText);
}

async function loadData() {
    const model = document.getElementById("model-select").value;
    if (!model) {
        return alert("모델을 선택해 주세요.");
    };
    const place = document.getElementById("place-select").value;
    if (!place) {
        return alert("여행지를 선택해 주세요.");
    };
    const image = document.getElementById("image-select").files[0];
    if (!image) {
        return alert("내 사진을 선택해 주세요.");
    };

    const formData = new FormData();
    formData.append("model", model);
    formData.append("place", place);
    formData.append("image", image);

    const loader = document.getElementsByClassName("loader")[0];
    loader.style.display = 'block';

    await loadJoriro(formData);

    loader.style.display = 'none';;
}

async function loadJoriro(formData) {
    url = proxy + '/joriro/'

    try {
        // 서버에 POST request 전송
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        console.log("Success:", data);

        appendResult(data);

    } catch (error) {
        console.log("Error:", error);
    }

}

function appendResult(data) {
    const showBox = document.getElementById("result-show");

    const imageSrc = proxy + data.result

    showBox.innerHTML = `

    <img src=${imageSrc} alt="로드 실패" class="img-fluid"></img>
    `

}