document.addEventListener('DOMContentLoaded', function() {
    var plan = document.getElementById('plan');

    // 사용자 정보와 GPT 추천 장소를 가져옵니다. 이 정보는 이전 페이지에서 전달되어야 합니다.
    var userInfo = {};  // 사용자 정보
    var recommendedPlaces = [];  // GPT 추천 장소

    // 사용자 정보를 추가합니다.
    var userInfoElement = document.createElement('p');
    userInfoElement.textContent = '이름: ' + userInfo.name + ', 여행일자: ' + userInfo.date;
    plan.appendChild(userInfoElement);

    // GPT 추천 장소를 추가합니다.
    var placesElement = document.createElement('ul');
    recommendedPlaces.forEach(function(place) {
        var placeElement = document.createElement('li');
        placeElement.textContent = place;
        placesElement.appendChild(placeElement);
    });
    plan.appendChild(placesElement);
});
