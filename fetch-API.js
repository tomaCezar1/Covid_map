const mapbox_api = "pk.eyJ1IjoibWFyY3VzYXVycmVsaXVzIiwiYSI6ImNrZGMyb2JzcjA2N2UyeXFvdGd5ZW0xNW0ifQ.Z7njubb2uxHca8ltWwxX_A";

mapboxgl.accessToken = "pk.eyJ1IjoibWFyY3VzYXVycmVsaXVzIiwiYSI6ImNrZHI1enEwaDA1bnMyc283NGhxNGwwYTcifQ.msyaY-RY8azW_gRbB6Ip7g";
let map = new mapboxgl.Map({
    container: 'map',
    zoom: 2,
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [0, 20]
});

// Geocoder
const token = "pk.eyJ1IjoibWFyY3VzYXVycmVsaXVzIiwiYSI6ImNrZHI1enEwaDA1bnMyc283NGhxNGwwYTcifQ.msyaY-RY8azW_gRbB6Ip7g"
let geocoder = new MapboxGeocoder({ // Initialize the geocoder
    accessToken: 'pk.eyJ1IjoibWFyY3VzYXVycmVsaXVzIiwiYSI6ImNrZHI1enEwaDA1bnMyc283NGhxNGwwYTcifQ.msyaY-RY8azW_gRbB6Ip7g',
    mapboxgl: mapboxgl, // Set the mapbox-gl instance
    marker: false, // Do not use the default marker style
    placeholder: 'Search a country'
});

// geocoder on the map
const geoCoder = map.addControl(geocoder);


let country = [];
let activeCases = [];
let activeCasesLength = 0;
let response = [];
let i = 0;

//Functions
function activeCasesFunc(index) {
    if (index >= 100) {
        return 'red'
    } else if (index >= 10) {
        return 'blue'
    } else return 'grey'
}


// Fetch API Coronavirus
const fetchVirus = fetch("https://covid-193.p.rapidapi.com/statistics?", {
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "covid-193.p.rapidapi.com",
        "x-rapidapi-key": "64441db4femshc9dc21237cf1d94p17ddc7jsnf40878a48594"
    }
})
    .then(response => response.json())

    //First try of the program, but it didnt work since I included a fetch in a forEach
    //loop, thus consuming too much memory (it is async code)
    // .then((data) => {
    //     const response = data.response
    //     console.log(data)
    //     console.log(data.response)

    // response
    // .forEach((response) => {
    //     const country = response.country;
    //     const activeCases = response.cases.active;
    //     // fetch('country-lat-long-227.json')
    //     .then(response => response.json())
    //     // .then((data) => console.log(data))
    //     .then((data) => {
    //         data.forEach((data) => {
    //             if(response.country.value === data.country.value){
    //                 new mapboxgl.Marker({
    //                     color: 'red',
    //                 })
    //                     .setLngLat([data.longitude, data.latitude])
    //                     .addTo(map);
    //             } else {
    //                 return console.log('not found')
    //             }
    //         })
    //     })

    .then((data) => {
        response = data.response

        response.forEach((response) => {
            country.push(response.country);
            activeCases.push(response.cases.active);
            activeCasesLength++;
        })
    })

    // })
    // })
    .catch(err => {
        console.log(err);
    });

fetchVirus
    .then(() => {
        fetch('country-lat-long-227.json')
            .then(response => response.json())
            .then((data) => {
                data.forEach((data) => {
                    if(country.value === data.country.value){
                        new mapboxgl.Marker({
                            color: activeCasesFunc(activeCases[i]),
                        })
                            .setLngLat([data.longitude, data.latitude])
                            .addTo(map);
                        i++;
                    } else {
                        return console.log('not found')
                    }
                })
            })
    })


//DOM Manipulation
const totalCases = document.getElementById('total-cases');
const deaths = document.getElementById('deaths');
const recoveries = document.getElementById('recoveries');
let totalNumber = 3000000;
let deathNumber = 0;
let recoveriesNumber = 0;

const fetchVirus2 = fetch("https://covid-193.p.rapidapi.com/statistics?", {
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "covid-193.p.rapidapi.com",
        "x-rapidapi-key": "64441db4femshc9dc21237cf1d94p17ddc7jsnf40878a48594"
    }
})

fetchVirus2
    .then((response) => response.json())
    // .then((data) => {
    //     console.log(data)
    // })
    .then((data) => {
        response = data.response
        response.forEach((response) => {
            totalNumber += response.cases.active;
            deathNumber += response.deaths.total;
            recoveriesNumber += response.cases.recovered;
        })
    })
    .then(() => {
        console.log(totalNumber)
        console.log(deathNumber)
        console.log(recoveriesNumber)
        recoveriesNumber = recoveriesNumber - 28500000;
    })
    .then(() => {
        totalNumber = totalNumber.toLocaleString();
        totalCases.innerHTML = `${totalNumber}`

        deathNumber = deathNumber.toLocaleString();
        deaths.innerHTML = `${deathNumber}`

        recoveriesNumber = recoveriesNumber.toLocaleString();
        recoveries.innerHTML = `${recoveriesNumber}`
    })

