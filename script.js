// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { getFirestore, getDocs, collection, addDoc, orderBy, query, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js';


// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCNf1UPe0RN9FUrukAIf79o_wgtqbM6Ux8",
    authDomain: "new-perfect-app.firebaseapp.com",
    projectId: "new-perfect-app",
    storageBucket: "new-perfect-app.appspot.com",
    messagingSenderId: "185180136509",
    appId: "1:185180136509:web:a61ff19f144a8a1b4c7654"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);



let map; // Declare map variable outside the function

document.getElementById('locate-btn').addEventListener('click', (e) => {
    e.preventDefault();
    console.log("Locate button clicked.");

    if (navigator.geolocation) {
        console.log("Geolocation is supported.");

        // Clear any existing interval
        if (window.locationInterval) {
            clearInterval(window.locationInterval);
            console.log("Cleared existing interval.");
        }

        // Get initial position and start continuous tracking
        navigator.geolocation.getCurrentPosition(showPosition, showError);
        window.locationInterval = setInterval(() => {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        }, 5000); // 5000 milliseconds = 5 seconds
    } else {
        alert("Geolocation is not supported by this browser.");
        console.error("Geolocation is not supported by this browser.");
    }

});



function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Initialize the map if it's not already initialized
    if (!map) {
        console.log("Initializing map.");
        map = L.map('map').setView([lat, lon], 13);

        // Add the OpenStreetMap tile layer to the map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        // Update map view to the user's location
        console.log("Updating map view.");
        map.setView([lat, lon]);
    }
    
    // Add a marker at the user's location
    L.marker([lat, lon]).addTo(map)
    .bindPopup('You are here!')
    .openPopup();
    
    // Perform reverse geocoding to get address details
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
    .then(response => response.json())
    .then(data => {
        const address = data.address;
        const displayName = data.display_name;
        document.getElementById('details').innerHTML = `
        <p><strong>Location Details:</strong></p>
        <p>${displayName}</p>
        <p>Latitude: ${lat}</p>
        <p>Longitude: ${lon}</p>
        `;
    })
        
    
    .catch(error => {
        console.error('Error fetching the address details:', error);
    });
    sendData(lat, lon)
}

function sendData(lat, lon) {

    console.log("data sent!")

    console.log("Rishabh");
    const customDocumentId = "your_custom_id"; // Replace "your_custom_id" with your desired custom ID

    addDoc(collection(db, 'User Location'), {
        latitude: lat,
        longitude: lon
    }, customDocumentId)
    .then(() => {
        // Optional: If you want to perform any actions after the document is successfully added
    })
    .catch((error) => {
        console.error('Error adding message: ', error);
    });
    
    
}


function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            console.error("Error: User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            console.error("Error: Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            console.error("Error: The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            console.error("Error: An unknown error occurred.");
            break;
    }
}



// NEW CODE---------------------------------------------------------]
