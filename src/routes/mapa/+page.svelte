<script lang="ts">
  import { onMount } from "svelte";
  import "@/styles/mapa.css";

  import { Map, TileLayer, Marker, Popup } from "sveaflet";
  import type { LatLngTuple } from "leaflet";

  import fireMarkerIconUrl from "$lib/assets/fire-svgrepo-com.svg";
  import zoomInIconUrl from "$lib/assets/zoom-in-1-svgrepo-com.svg";
  import zoomOutIconUrl from "$lib/assets/zoom-out-1-svgrepo-com.svg";
  import centerIconUrl from "$lib/assets/location-target-svgrepo-com.svg";
  
  let mapRef = $state<any>(null);
  let isMounted = $state(false); //tuve q hacer la wea de cargar el mapa fuera del ssr, pq si no creashea toda la wea xd
  let zoom = $state(17); // El zoom default

  const centroInicial: [number, number] = [-33.5990313, -70.8738986]; //esta vaina usa el tipo tupple para las coordenadas
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attributionText = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  // Array de marcadores de prueba (recordar quitar esta wea xdd) 
  //tuve que definir los tipos para que reconociera el tupple, pq si no se pone mañosin
const misMarcadores: { id: number; posicion: LatLngTuple; titulo: string; descripcion: string }[] = [
  {
    id: 1,
    posicion: [-33.5990916, -70.8731771],
    titulo: "Incendio en Pastelería Kaiser",
    descripcion: "Ayuda loko, se quemaron 3 tortas y una watona",
  },
];

  let fireMarkerIcon = $state<any>(null);

  function zoomIn() {
    if (mapRef) {
      mapRef.zoomIn();
      zoom = mapRef.getZoom();
    }
  }

  function zoomOut() {
    if (mapRef) {
      mapRef.zoomOut();
      zoom = mapRef.getZoom();
    }
  }

  function resetCenter() {
    if (mapRef) {
      mapRef.setView(centroInicial, 17);
      zoom = 17;
    }
  }

  onMount(async () => {
    const L = await import("leaflet");

    fireMarkerIcon = L.icon({
      iconUrl: fireMarkerIconUrl,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    //big brain time 🥵🥵
    isMounted = true;
  });
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    crossorigin=""
  />
  <title>Mapa de incendios - Anti Infernum</title>
</svelte:head>

<div class="contenedor-mapa-seguro">
  <div class="map-controls">
    <button type="button" class="control-btn" onclick={zoomIn}>
      <img src={zoomInIconUrl} alt="Zoom In" />
    </button>
    <button type="button" class="control-btn" onclick={zoomOut}>
      <img src={zoomOutIconUrl} alt="Zoom Out" />
    </button>
    <button type="button" class="control-btn" onclick={resetCenter}>
      <img src={centerIconUrl} alt="Centrar" />
    </button>
  </div>

  <div class="leaflet-map">
    {#if isMounted}
      <Map 
        options={{ center: centroInicial, zoom: zoom, zoomControl: false }} 
        bind:instance={mapRef}
      >
        <TileLayer url={tileUrl} options={{ maxZoom: 19, attribution: attributionText }} />

        {#if fireMarkerIcon}
          {#each misMarcadores as marcador (marcador.id)}
            <Marker latLng={marcador.posicion} options={{ icon: fireMarkerIcon }}>
              <Popup>
                <strong>{marcador.titulo}</strong><br>{marcador.descripcion}
              </Popup>
            </Marker>
          {/each}
        {/if}
      </Map>
    {:else}
      <div class="map-placeholder">Cargando mapa...</div>
    {/if}
  </div>
</div>