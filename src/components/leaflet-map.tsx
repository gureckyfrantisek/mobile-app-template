import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

type Props = {
  initialLat?: number;
  initialLng?: number;
  initialZoom?: number;
};

function createLeafletHtml(lat: number, lng: number, zoom: number): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
  <style>
    * { box-sizing: border-box; }
    html, body, #map {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([${lat}, ${lng}], ${zoom});
    let osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let otm = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let ortofoto = L.tileLayer.wms("https://ags.cuzk.gov.cz/arcgis1/services/ORTOFOTO/MapServer/WMSServer", {
        layers: "0", 
        format: "image/png",
        transparent: true,
        attribution: "&copy ČÚZK"
    });

    let baseMaps = {
        "OpenStreetMap": osm,
        "OpenTopoMap": otm,
        "Ortofoto ČÚZK": ortofoto
    };

    let layerControl = L.control.layers(baseMaps, null, {collapsed: true}).addTo(map);
  <\/script>
</body>
</html>`;
}

export function LeafletMap({ initialLat = 50.104, initialLng = 14.388, initialZoom = 17 }: Props) {
  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: createLeafletHtml(initialLat, initialLng, initialZoom) }}
      style={styles.map}
      javaScriptEnabled
    />
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
