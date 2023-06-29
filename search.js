import { proxy } from "/proxy.js";


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

function changeSigunguForSpotSearch(add) {

    const sel = document.getElementById("search_select_sigungu");
    /* 옵션메뉴삭제 */
    for (let i = sel.length - 1; i > 0; i--) {
        sel.options[i] = null;
    };
    /* 옵션박스추가 */
    for (let i = 1; i < cnt[add].length; i++) {
        sel.options[i] = new Option(cnt[add][i], i);
    };

};


// Spot 리스트 GET 요청
async function getSpot() {

    const type = document.getElementById("search_select_type").value;
    const area = document.getElementById("search_select_area").value;
    const sigungu = document.getElementById("search_select_sigungu").value;
    const keyword = document.getElementById("form-place").value;

    const url = `${proxy}/spots/?type=${type}&area=${area}&sigungu=${sigungu}&search=${keyword}`;
    const response = await fetch(url, {
        method: "GET",
    });

    const response_json = await response.json();

    return response_json;

};


async function viewSpotList() {

    // Spot 정보 가져오기
    const spots = await getSpot();

    const spot_list = document.getElementById("search_spot_cardbox");

    spot_list.innerHTML = '';

    if (spots.results.length == 0) {
        const template = document.createElement("h2");
        template.setAttribute("style", "text-align:center;");
        template.innerText = "검색 결과가 없습니다.";
        spot_list.appendChild(template);

    } else {

        const template = document.createElement("h3");
        template.setAttribute("style", "padding-left:15px;");
        template.innerText = `검색 결과: 총 ${spots.count}개`;
        spot_list.appendChild(template);

        spots.results.forEach((spot) => {
            const template = document.createElement("div");
            template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours fadeInUp animated");
            template.setAttribute("data-animate-effect", "fadeIn");
            template.setAttribute("style", "cursor:pointer;");

            // 디폴트 이미지
            if (!spot.firstimage) {
                spot.firstimage = "/images/place-1.jpg";
            };

            // rate 없으면 null이 아니라 빈칸
            // rate 있으면 무조건 소수점 첫번째 자리까지 표시
            if (!spot.rate) {
                spot.rate = "";
            } else {
                spot.rate = "⭐" + spot.rate.toFixed(1);
            };

            // Spot 카드 생성
            template.innerHTML = `
        <div onclick="location.href='/spots/index.html?id=${spot.id}'" style="overflow:hidden;"><img src="${spot.firstimage}" alt="대표 이미지" class="img-responsive" style="height: 300px; width:100%; object-fit:cover;">
            <div class="desc" style="padding:10px;">
                <h3>${spot.title} <span style="display:inline; color:#F78536">${spot.rate}</span></h3>
                <span>${spot.addr1}</span>
            </div>
        </div>`;

            spot_list.appendChild(template);

        });
    };

    // 더보기 버튼 생성
    if (spots.next) {
        const template = document.createElement("div");

        template.setAttribute("id", "spot_search_more_button");
        template.setAttribute("class", "col-md-12 text-center animate-box fadeInUp animated");

        template.innerHTML = `<a class="btn btn-primary btn-outline btn-lg" onclick="viewMoreSpotList('${spots.next}')"><i
        class="icon-arrow-down22"></i> 더보기
    <i class="icon-arrow-down22"></i></a>`;

        spot_list.appendChild(template);

    };

};


async function viewMoreSpotList(next) {

    const new_next_url = proxy + next;

    const more_button = document.getElementById("spot_search_more_button");
    more_button.remove();

    const response = await fetch(`${new_next_url}`, {
        method: "GET",
    });

    const more_spots = await response.json();

    const spot_list = document.getElementById("search_spot_cardbox");

    more_spots.results.forEach((spot) => {
        const template = document.createElement("div");
        template.setAttribute("class", "col-md-4 col-sm-6 fh5co-tours fadeInUp animated");
        template.setAttribute("data-animate-effect", "fadeIn");
        template.setAttribute("style", "cursor:pointer;");

        // 디폴트 이미지
        if (!spot.firstimage) {
            spot.firstimage = "/images/place-1.jpg";
        };

        // rate 없으면 null이 아니라 빈칸
        // rate 있으면 무조건 소수점 첫번째 자리까지 표시
        if (!spot.rate) {
            spot.rate = "";
        } else {
            spot.rate = spot.rate.toFixed(1);
        };

        // Spot 카드 생성
        template.innerHTML = `
        <div onclick="location.href='/spots/index.html?id=${spot.id}'" style="overflow:hidden;"><img src="${spot.firstimage}" alt="대표 이미지" class="img-responsive" style="height: 300px; width:100%; object-fit:cover;">
            <div class="desc" style="padding:10px;">
                <h3>${spot.title} <span style="display:inline; color:#F78536">${spot.rate}</span></h3>
                <span>${spot.addr1}</span>
            </div>
        </div>`;

        spot_list.appendChild(template);
    });

    // 더보기 버튼 생성
    if (more_spots.next) {
        const template = document.createElement("div");

        template.setAttribute("id", "spot_search_more_button");
        template.setAttribute("class", "col-md-12 text-center animate-box fadeInUp animated");

        template.innerHTML = `<a class="btn btn-primary btn-outline btn-lg" onclick="viewMoreSpotList('${more_spots.next}')"><i
        class="icon-arrow-down22"></i> 더보기
    <i class="icon-arrow-down22"></i></a>`;

        spot_list.appendChild(template);

    };
};

window.changeSigunguForSpotSearch = changeSigunguForSpotSearch
window.viewSpotList = viewSpotList
window.viewMoreSpotList = viewMoreSpotList


const main_search_button = document.getElementById("main_search_button")

function press(f) {
    if (f.keyCode == 13) { //javascript에서는 13이 enter키를 의미함
        main_search_button.click();
    };
};

document.addEventListener('keypress', press);
