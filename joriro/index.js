console.log("js로 로드 하였음")

// function handleSingleClick(e) {
//     console.log("singleClick")
//     console.log(e.innerText)
//     const singleItem = document.getElementById(e.id)
//     singleItem.classList.toggle("mystyle")
// }

// function handleUpdate(e) {
//     const singleItem = document.getElementById(e.id).previousSibling
//     singleItem.style.visibility = "hidden"

//     const updateInput = document.createElement("input")
//     updateInput.setAttribute("id", "update-input")
//     updateInput.value = singleItem.innerHTML


//     singleItem.parentNode.insertBefore(updateInput, singleItem)

//     const updateButton = document.getElementById(e.id)
//     updateButton.setAttribute("onclick", "handleUpdateConfirm(this)")


// }

// function handleUpdateConfirm(e) {
//     const updateInput = document.getElementById("update-input")

//     const singleItem = document.getElementById(e.id).previousSibling
//     singleItem.innerHTML = updateInput.value
//     singleItem.style.visibility = "visible"

//     const updateButton = document.getElementById(e.id)
//     updateButton.setAttribute("onclick", "handleUpdate(this)")

//     updateInput.remove()
// }

// function handleDelete(e) {
//     const singleItem = document.getElementById(e.id).parentElement
//     singleItem.remove()
// }

// function addItem() {
//     console.log("addItem 실행 중")
//     const itemInput = document.getElementById("item-input")
//     const content = itemInput.value
//     if (content) {
//         console.log("컨텐트가 있는 경우")

//         const myList = document.getElementById("my-list")
//         console.log(myList.getElementsByTagName("li").length)
//         let list_number = myList.getElementsByTagName("li").length + 1

//         const newList = document.createElement("li")

//         const newText = document.createElement("p")
//         newText.innerText = content
//         newText.setAttribute("onclick", "handleSingleClick(this)")
//         newText.setAttribute("id", `${list_number}th-item`)
//         newList.appendChild(newText)

//         const updateButton = document.createElement("button")
//         updateButton.innerText = "수정"
//         updateButton.setAttribute("onclick", "handleUpdate(this)")
//         updateButton.setAttribute("id", `${list_number}th-item-update-button`)
//         newList.appendChild(updateButton)

//         const deleteButton = document.createElement("button")
//         deleteButton.innerText = "삭제"
//         deleteButton.setAttribute("onclick", "handleDelete(this)")
//         deleteButton.setAttribute("id", `${list_number}th-item-delete-button`)
//         newList.appendChild(deleteButton)

//         myList.append(newList)

//         itemInput.value = ""
//     } else {
//         console.log("컨텐트가 없는 경우")
//         alert("값을 입력해")
//     }




// }

// document.addEventListener('DOMContentLoaded', function () {
//     const placeSelect = document.getElementById('place-select');

function loadPlace(e) {
    console.log('새로운 배경 선택');
    imageDict = {};
    imageDict[1] = 'background-image: url(/images/625.jpg);';
    imageDict[2] = 'background-image: url(/images/haeundae.jpg);';
    imageDict[3] = 'background-image: url(/images/hanra.png);';
    imageDict[4] = 'background-image: url(/images/panmunjeom.JPG);';
    imageDict[5] = 'background-image: url(/images/seokguram.jpeg);';

    sourceDict = {}
    sourceDict[1] = '전쟁기념관(https://www.warmemo.or.kr/)'
    sourceDict[2] = '부산광역시(https://www.busan.go.kr/index)'
    sourceDict[3] = '제주특별자치도청(https://www.jeju.go.kr/index.htm)'
    sourceDict[4] = '경기도(https://www.gg.go.kr/)'
    sourceDict[5] = '경주시청(https://www.gyeongju.go.kr/tour/page.do?listType=&mnu_uid=2349&sortKwd=&code_uid=1044&srchKwd=&area_uid=258&cmd=2&pageNo=1)'



    const selectedBackground = imageDict[e];
    const selectedSource = sourceDict[e];

    const backgroud = document.getElementById("background-image")
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
    backgroud.appendChild(sourceText)
}

//     const selectFxOptions = {
//         onChange: loadPlace // 변경 이벤트에 loadPlace를 호출
//     };

//     const selectFxInstance = new SelectFx(placeSelect, selectFxOptions);
// });    
