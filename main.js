let url = "https://open-api.jejucodingcamp.workers.dev/";

let data = [{
"role": "system",
"content": "assistant는 제주 여행 전문가이다."
}, {
"role": "user",
"content": "차가 없는 경우 제주 1박 2일 일정을 알려줘"
}]

let $input1 = document.querySelector('#question1');
let $input2 = document.querySelector('#question2');
let $input3 = document.querySelector('#question3');
let $button = document.querySelector('#search');

let contents1, contents2, contents3;

$button.addEventListener('click', e => {
e.preventDefault();
contents1 = $input1.value;
contents2 = $input2.value.replace('일', '');
contents3 = $input3.value;

// 입력값 검사
const inputs = document.querySelectorAll('input[type="text"]');
for(let input of inputs) {
    if(input.value.trim() === '') {
        displayError('제주의 어떤 모습을 기대하시나요? 주어진 질문에 답변을 기재해주세요.');
        return;
    }
});

data.push({
    "role": "user",
    "content": contents1
})
data.push({
    "role": "user",
    "content": contents2
})
data.push({
    "role": "user",
    "content": contents3
});
function submitForm(event) {
// 사용자의 입력을 localStorage에 저장합니다.
localStorage.setItem('userLocation', document.getElementById('question1').value);
localStorage.setItem('days', document.getElementById('question2').value.replace('일', '')); // '일' 문자를 제거하고 저장합니다.;
localStorage.setItem('places', document.getElementById('question3').value);
localStorage.setItem('rent', document.querySelector('input[name="choice"]:checked').value);

// 페이지 이동
window.location.href = '/result.html';


chatGPTAPI(contents1, contents2, contents3)

// 입력값 초기화
$input1.value = ''
$input2.value = ''
$input3.value = ''
}

function chatGPTAPI(place, days, destination) {
const url = https://open-api.jejucodingcamp.workers.dev/?place=${place}&days=${days}&destination=${destination}

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data), // 요청 본문을 JSON 형식의 문자열로 변환합니다.
    redirect: 'follow'
})
.then(res => {
    console.log(res); // 응답 전체를 콘솔에 출력합니다.
    return res.json();
})
.then(res => {
    console.log(res); // 응답 본문을 콘솔에 출력합니다.
    $answer.innerHTML = `<p>${res.choices[0].message.content}</p>`;
})
.catch(error => {
    console.error('Error:', error); // 에러가 발생한 경우 콘솔에 에러를 출력합니다.
});
}

let userLocation; // 사용자가 입력한 장소

async function getCoordinates(address) {
let url = https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)};

let response = await fetch(url, {
    headers: {
        'X-NCP-APIGW-API-KEY-ID': 'wtw87t3vqm',
        'X-NCP-APIGW-API-KEY': 'miRyTBERHATYzJsPdnbnlaOTxMG57bsEuDiS7Oea'
    }
});
if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}

let data = await response.json();
if (data.status === 'OK') {
    return {
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng
    };
} else {
    throw new Error('Geocoding failed!');
}
}

async function createMarker() {
let userLocation = localStorage.getItem('userLocation'); // 사용자가 입력한 주소를 가져옵니다.
let coordinates = await getCoordinates(userLocation);

var mapDiv = document.getElementById('map');
var mapOptions = {
    center: new naver.maps.LatLng(coordinates.lat, coordinates.lng),
    zoom: 10
};

var map = new naver.maps.Map(mapDiv, mapOptions);

var marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(coordinates.lat, coordinates.lng),
    map: map
});
}

function displayError(message) {
const modal = document.querySelector("#modal");
modal.style.display = "block";
modal.querySelector(".modal-content p").textContent = message;

modal.querySelector(".close-button").addEventListener("click", function() {
    modal.style.display = "none";
});
}