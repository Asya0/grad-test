// Модуль карты
const MapModule = (() => {
  let map;

  function initialize() {
    map = L.map("map").setView([55.7558, 37.6173], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);
  }

  function displayGeoJSON(data) {
    L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        layer.on("click", function (e) {
          modifyGeometry(layer, feature);
        });
      },
    }).addTo(map);
  }

  function goToLocation(lat, lng) {
    map.setView([lat, lng], 16);
  }

  function goToLocationDropdown(selectElement) {
    const coordinates = selectElement.value.split(",");
    const lat = parseFloat(coordinates[0]);
    const lng = parseFloat(coordinates[1]);
    goToLocation(lat, lng);
  }

  function getMap() {
    return map;
  }

  return {
    initialize,
    displayGeoJSON,
    goToLocation,
    goToLocationDropdown,
    getMap,
  };
})();

// Инициализация карты
MapModule.initialize();

// Выбор файла
function onFileChange(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const geojson = JSON.parse(event.target.result);
    MapModule.displayGeoJSON(geojson);
  };
  reader.readAsText(file);
}

// Переключение темы
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}

const darkThemeStyles = `
    body.dark-theme {
        background-color: #333;
        color: white;
    }
    .toolbar {
        background-color: #444;
        border: 1px solid #666;
    }
    button, select {
        background-color: #555;
        color: white;
    }
`;
const style = document.createElement("style");
style.appendChild(document.createTextNode(darkThemeStyles));
document.head.appendChild(style);

// Переключение на темную тему
toggleTheme();

// Привязка к функционалу карты
window.goToLocation = MapModule.goToLocation;

// цвет карты
function toggleTheme() {
  const body = document.body;
  if (body.classList.contains("dark-theme")) {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
    const map = document.getElementById("map");
    map.style.filter = "none";
  } else {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    const map = document.getElementById("map");
    map.style.filter = "invert(100%)";
  }
}
// местоположение
function getUserLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      goToLocation(latitude, longitude);
    });
  } else {
    alert("Геолокация недоступна");
  }
}

// Изменение геометрии объекта
function modifyGeometry(layer, feature) {
  const geometryType = feature.geometry.type || "Без названия";

  layer.bindPopup(`Тип геометрии: ${geometryType}`).openPopup();
}
