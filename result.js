var script = document.createElement('script');
script.src = "https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=wtw87t3vqm";
document.head.appendChild(script);

window.onload = function() {
    document.getElementById('form').addEventListener('submit', submitForm);
}

async function submitForm(event) {
    event.preventDefault();

    let userLocation = document.getElementById('question1').value;
    let days = parseInt(document.getElementById('question2').value.replace('일', ''));
    let places = document.getElementById('question3').value;
    let rent = document.getElementById('choice1').checked ? 'Yes' : 'No';

    localStorage.setItem('userLocation', userLocation);
    localStorage.setItem('days', String(days));
    localStorage.setItem('places', places);
    localStorage.setItem('rent', rent);

    let coordinates;
    try {
        coordinates = await getCoordinates(userLocation);
        createMarker(coordinates.lat, coordinates.lng); // 좌표를 사용하여 마커 생성
    } catch (error) {
        console.error(error);
        alert('주소를 변환하는 데 실패했습니다.');
        return;
    }

    try {
        let recommendedPlace = await fetchGPTPlace(userLocation, days, 'morning');
        let dayPlan = await fetchGPTDayPlan(userLocation, days);

        let planElement = document.getElementById('plan');
        await addPlan(userLocation, days, planElement);
    } catch (error) {
        console.error(error);
        alert('일정을 가져오는 데 실패했습니다.');
        return;
    }

    window.location.href = 'result.html';
}

function createMarker(lat, lng) {
    let mapOptions = {
        center: new naver.maps.LatLng(lat, lng),
        zoom: 10
    };

    let map = new naver.maps.Map('map', mapOptions);
    let marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        map: map
    });
}

async function getCoordinates(address) {
    let url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`;
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
    if (data.status === 'OK' && data.results.length > 0) {
        return {
            lat: data.results[0].geometry.location.lat,
            lng: data.results[0].geometry.location.lng
        };
    } else {
        throw new Error('Geocoding failed! No result found.');
    }
}

async function fetchGPTPlace(userLocation, day, timeOfDay) {
    const response = await fetch(`Your_API_Endpoint?location=${userLocation}&day=${day}&timeOfDay=${timeOfDay}`);
    const data = await response.json();
    return data.recommendedPlace; 
}

async function fetchGPTDayPlan(userLocation, day) {
    const response = await fetch(`Your_API_Endpoint?location=${userLocation}&day=${day}`);
    const data = await response.json();
    return data.dayPlan; 
}

async function addPlan(userLocation, days, planElement) {
    for(let i=0; i<days; i++) {
        let dayCell = document.createElement('h3');
        dayCell.textContent = `Day ${i+1}`;
        planElement.appendChild(dayCell);

        let dayPlan = await fetchGPTDayPlan(userLocation, i+1); 

        let planText = `아침: ${dayPlan.morning || 'TBD'}, 점심: ${dayPlan.afternoon || 'TBD'}, 저녁: ${dayPlan.evening || 'TBD'}`;

        let planCell = document.createElement('p');
        planCell.textContent = planText;
        planElement.appendChild(planCell);
    }
}
