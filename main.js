let url = "https://open-api.jejucodingcamp.workers.dev/";

let data = [{
    "role": "system",
    "content": "assistant는 제주 여행 전문가이다."
}, {
    "role": "user",
    "content": "차가 없는 경우 제주 1박 2일 일정을 알려줘"
}]

let userLocation; // 사용자가 입력한 장소

async function getCoordinates(address) {
    let url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=6a63d3e4c31f43d6927788f9e5b68020`;

    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();
    return {
        lat: data.results[0].geometry.lat,
        lng: data.results[0].geometry.lng
    };
}

async function createMarker() {
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

async function displayData() {
    const inputs = document.querySelectorAll('input[type="text"]');
    for(let input of inputs) {
        if(input.value.trim() === '') {
            displayError('값을 입력해주세요');
            return;
        }
    }

    try {
        userLocation = document.querySelector('#question1').value; // 사용자가 입력한 장소
        createMarker();
    } catch (e) {
        displayError(e.message);
    }
}

window.onload = function() {
    document.querySelector('#search').addEventListener('click', function(e) {
        e.preventDefault();
        displayData();
    });
}

document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();  // 기본 submit작을 막습니다
    // 여기에 form 데이터를 처리하는 코드를 작성합니다
    window.location.href = '/result.html';  // 페이지 이동
});
