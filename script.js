let map; // Declare map variable outside the function

document.getElementById('locate-btn').addEventListener('click', () => {
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
}



function showError(error) {
    switch(error.code) {
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
