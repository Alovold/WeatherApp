let apiKey = "ee61fed0375f5d7a32c78a747e0deb72";

let submitBtn = document.querySelector("#submitBtn");
let weatherTitle = document.querySelector("#weatherDisplayTitle")
let weatherTemp = document.querySelector("#tempDisplay")
let weatherType = document.querySelector("#weatherTypeDisplay")
let weatherDisplay = document.querySelector("#weatherDisplay")
let weatherIcon = document.querySelector("#weatherIcon")
let savedSearchesDiv = document.querySelector("#savedSearches")
let saveBtn = document.querySelector("#saveBtn")
let currentCitySearch = "";
let currentStateSearch = "";

weatherDisplay.style.visibility = "hidden";




function locationFetch(cityName, stateCode) {
    //event.preventDefault();
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode}&limit=5&appid=${apiKey}`)
    .then((response)=>{
        const result = response.json();
        console.log(result);
        
        return result;
    })
    .then((data)=>{
        let lat = data[0].lat;
        let lon = data[0].lon;
        currentCitySearch = cityName;
        currentStateSearch = stateCode;
        weatherTitle.textContent = `Current weather in ${cityName}`
        weatherFetch(lat, lon);
    })
}



function weatherFetch(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then((response)=>{
        const result = response.json();
        console.log(result);
        return result;
    })
    .then((data)=>{
        let tempKelvin = data.main.temp;
        let tempImperial = Math.round(((tempKelvin - 273.15) * 9) / 5 + 32);
        weatherTemp.textContent = `Current Temp: ${tempImperial} Degrees Fahrenheit`;
        let mainWeather = data.weather[0].description;
        let iconId = data.weather[0].icon;
        if (weatherDisplay.style.visibility == "hidden") {
            weatherDisplay.style.visibility = "visible";
        }
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconId}@4x.png`
        weatherType.textContent = `Current weather: ${mainWeather}`;
    })
}

function fullFetch(event) {
    event.preventDefault();
    let cityName = document.querySelector("#cityInput").value;
    let stateCode = document.querySelector("#stateInput").value;
    console.log(stateCode);
    locationFetch(cityName, stateCode);
}

class SelectedAreas {
    constructor(savedAreas = [], areaCount = 0) {
        this.savedAreas = savedAreas;
        this.areaCount = areaCount;
    }
    addArea(cityInput, stateInput){
        let newArea = { id: this.areaCount+1, city: cityInput, state: stateInput };
        this.savedAreas.push(newArea);
        let newCard = document.createElement("div");
        let newCardArea = document.createElement("p");
        let newCardRemove = document.createElement("button");
        let newCardRecall = document.createElement("button");
        let newCardTime = document.createElement("p");
        let currentTime = new Date();
        newCardArea.textContent = `${cityInput}, ${stateInput}`;
        newCardTime.textContent = currentTime;
        newCardRemove.textContent = "Remove Search";
        newCardRecall.textContent = "Search Again";
        newCardRemove.addEventListener("click", ()=> this.removeArea(newArea.id));
        newCardRecall.addEventListener("click", ()=> locationFetch(cityInput, stateInput));
        newCard.id = `card${newArea.id}`;
        newCard.classList.add("card");
        newCard.classList.add("blue-grey");
        newCardArea.classList.add(`savedText`);
        newCardTime.classList.add(`savedText`);
        newCardRecall.classList.add(`waves-effect`);
        newCardRecall.classList.add(`waves-light`);
        newCardRecall.classList.add(`btn`);
        newCardRecall.classList.add(`cardBtn`);
        newCardRemove.classList.add(`waves-effect`);
        newCardRemove.classList.add(`waves-light`);
        newCardRemove.classList.add(`btn`);
        newCardRemove.classList.add(`cardBtn`);
        newCard.appendChild(newCardArea);
        newCard.appendChild(newCardTime);
        newCard.appendChild(newCardRecall);
        newCard.appendChild(newCardRemove);
        savedSearchesDiv.appendChild(newCard);
        this.areaCount++;
    }
    removeArea(id){
        let removedArea = document.getElementById(`card${id}`);
        savedSearchesDiv.removeChild(removedArea);
    }
}

let savedSearches = new SelectedAreas;
submitBtn.addEventListener("click", fullFetch);
saveBtn.addEventListener("click", ()=> {return savedSearches.addArea(currentCitySearch, currentStateSearch)});