const proxy = 'http://127.0.0.1:8000';


var cnt = new Array();
cnt[0] = new Array("전체");
cnt[1] = new Array("전체", "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구");
cnt[2] = new Array("전체", "강화군", "계양구", "미추홀구", "남동구", "동구", "부평구", "서구", "연수구", "옹진군", "중구");
cnt[3] = new Array("전체", "대덕구", "동구", "서구", "유성구", "중구");
cnt[4] = new Array("전체", "남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구");
cnt[5] = new Array("전체", "광산구", "남구", "동구", "북구", "서구");
cnt[6] = new Array("전체", "강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구");
cnt[7] = new Array("전체", "중구", "남구", "동구", "북구", "울주군");
cnt[8] = new Array("전체", "세종특별자치시");
cnt[9] = new Array("전체", "가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시");
cnt[10] = new Array("전체", "강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군");
cnt[11] = new Array("전체", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "진천군", "청원군", "청주시", "충주시", "증평군");
cnt[12] = new Array("전체", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시", "청양군", "태안군", "홍성군", "계룡시");
cnt[13] = new Array("전체", "경산시", "경주시", "고령군", "구미시", "군위군", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시");
cnt[14] = new Array("전체", "거제시", "거창군", "고성군", "김해시", "남해군", "마산시", "밀양시", "사천시", "산청군", "양산시", "의령군", "진주시", "진해시", "창녕군", "창원시", "통영시", "하동군", "함안군", "함양군", "합천군");
cnt[15] = new Array("전체", "고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군");
cnt[16] = new Array("전체", "강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군");
cnt[17] = new Array("전체", "남제주군", "북제주군", "서귀포시", "제주시");

function change(add) {

    const sel = document.getElementById("search_select_sigungu");
    /* 옵션메뉴삭제 */
    for (i = sel.length - 1; i > 0; i--) {
        sel.options[i] = null
    }
    /* 옵션박스추가 */
    for (i = 1; i < cnt[add].length; i++) {
        sel.options[i] = new Option(cnt[add][i], i);
    }

}


// Spot 리스트 GET 요청
async function getSpot() {

    const type = document.getElementById("search_select_type").value
    const area = document.getElementById("search_select_area").value
    const sigungu = document.getElementById("search_select_sigungu").value
    const keyword = document.getElementById("form-place").value

    const url = `${proxy}/spots/?type=${type}&area=${area}&sigungu=${sigungu}&search=${keyword}`;
    const response = await fetch(url, {
        method: "GET",
    });

    const response_json = await response.json();
    console.log(response_json.results)
    return response_json.results

}


async function viewSpotList() {

    // Spot 정보 가져오기
    const spots = await getSpot();

    const spot_list = document.getElementById("search_spot_cardbox");

    spot_list.innerHTML = ''

    spots.forEach((spot) => {
        const template = document.createElement("div");
        template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours animate-box fadeInUp animated");
        template.setAttribute("data-animate-effect", "fadeIn");
        template.setAttribute("style", "cursor:pointer;");

        // // 디폴트 이미지
        if (!spot.firstimage) {
            spot.firstimage = "/images/place-1.jpg";
        }

        // Spot 카드 생성
        template.innerHTML = `
        <div onclick="location.href='/spots/?id=${spot.id}'" style="overflow:hidden;"><img src="${spot.firstimage}" alt="대표 이미지" class="img-responsive" style="height: 250px; width:100%; object-fit:cover;">
            <div class="desc" style="cursor: pointer;">
                <h3>${spot.title}</h3>
                <span>${spot.addr1}</span>
            </div>
        </div>`;

        spot_list.appendChild(template);
    })

    /* 게시글 미리보기 엔터 연타 방지 */
    const pTags = document.querySelectorAll("p");
    for (let i = 0; i < pTags.length; i++) {
        if (pTags[i].childElementCount === 0) {
            pTags[i].parentNode.removeChild(pTags[i]);
        }
    }

}