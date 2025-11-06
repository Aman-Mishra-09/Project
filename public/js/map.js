
L.map('map').setView([28.61, 77.21], 10)
    .addLayer(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'))
    .addLayer(L.marker([28.61, 77.21]).bindPopup('Delhi, India').openPopup());
