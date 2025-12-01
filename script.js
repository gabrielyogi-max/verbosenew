// Initialize the map centered on the Mediterranean
var map = L.map('map').setView([41.9028, 12.4964], 5); // Coordinates for Rome, Zoom level 5

// Add a tile layer that looks somewhat neutral/classical
// Esri.WorldPhysical is good for terrain, CartoDB.PositronNoLabels is clean.
// Using OpenStreetMap standard for reliability, but we could filter it with CSS if needed.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Define a custom icon (optional, standard blue marker for now, maybe gold later)
// For simplicity, we use the default marker but customized popup content.

// Data for key Roman cities
const cities = [
    {
        name: "Roma (Rome)",
        coords: [41.9028, 12.4964],
        desc: "Caput Mundi. O coração do império e a sede do poder dos Césares."
    },
    {
        name: "Constantinopolis (Istanbul)",
        coords: [41.0082, 28.9784],
        desc: "A Nova Roma. Capital do Império Romano do Oriente a partir de 330 d.C."
    },
    {
        name: "Alexandria",
        coords: [31.2001, 29.9187],
        desc: "A joia do Mediterrâneo, famosa por sua biblioteca e farol."
    },
    {
        name: "Carthago (Carthage)",
        coords: [36.8564, 10.337],
        desc: "Antiga rival de Roma, reconstruída para se tornar uma província vital."
    },
    {
        name: "Londinium (London)",
        coords: [51.5074, -0.1278],
        desc: "Capital da província da Britânia e um importante centro comercial."
    },
    {
        name: "Antiochia (Antioch)",
        coords: [36.2021, 36.1606],
        desc: "O berço do cristianismo gentílico e uma das maiores metrópoles do oriente."
    },
    {
        name: "Lutetia (Paris)",
        coords: [48.8566, 2.3522],
        desc: "Uma cidade importante na Gália, precursora da moderna Paris."
    },
    {
        name: "Hispalis (Seville)",
        coords: [37.3891, -5.9845],
        desc: "Importante porto fluvial na província da Bética (Hispânia)."
    }
];

// Loop through the cities array and add markers to the map
cities.forEach(function(city) {
    var marker = L.marker(city.coords).addTo(map);
    
    // Create Roman-styled popup content
    var popupContent = `
        <div style="text-align:center;">
            <h3 style="margin: 0; color: #4E004E; border-bottom: 1px solid #D4AF37;">${city.name}</h3>
            <p style="margin-top: 5px;">${city.desc}</p>
        </div>
    `;
    
    marker.bindPopup(popupContent);
});

// Add a polygon approximation for the Empire (very rough simplification for visual effect)
// This is just a visual aid, not perfectly historical borders.
var empireBounds = [
    [54, -4], // Britain
    [52, 5],  // Germania Inferior
    [48, 18], // Danube frontier
    [45, 25], // Dacia
    [45, 35], // Black Sea North
    [42, 42], // Caucasus
    [35, 40], // Syria
    [30, 35], // Judea/Egypt border
    [25, 30], // Egypt South
    [32, 10], // Africa Proconsularis
    [34, -5], // Mauretania
    [42, -9], // Lusitania
    [50, -5], // Gaul West
    [54, -4]  // Back to Britain
];

// L.polygon(empireBounds, {
//     color: '#D4AF37',
//     fillColor: '#660066',
//     fillOpacity: 0.1,
//     weight: 2
// }).addTo(map).bindPopup("Extensão aproximada do Império");

// Note: The polygon above is commented out because simple coordinates look ugly on a real map without many points.
// Sticking to markers is cleaner for this demo.
