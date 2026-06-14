<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import "@/styles/mapa.css";
  import { Map, TileLayer, Marker, Popup } from "sveaflet";
  import type { LatLngTuple } from "leaflet";

  // Importación de iconos .svg
  import fireMarkerIconUrl from "$lib/assets/fire-svgrepo-com.svg";
  import zoomInIconUrl from "$lib/assets/zoom-in-1-svgrepo-com.svg";
  import zoomOutIconUrl from "$lib/assets/zoom-out-1-svgrepo-com.svg";
  import centerIconUrl from "$lib/assets/location-target-svgrepo-com.svg";
  import currentLocationIconUrl from "$lib/assets/location-define-svgrepo-com.svg";

  // Estados usando las Runas de Svelte 5
  let mapRef = $state<any>(null);
  let isMounted = $state(false);
  let zoom = $state(17);

  // Contenedor del mapa para capturar los eventos del dedo
  let contenedorMapaNode = $state<HTMLDivElement | null>(null);

  // Coordenadas fijas solo para el arranque inicial del componente mapa
  const centroInicial: LatLngTuple = [-33.5990313, -70.8738986];

  // Runas para la posición del usuario en tiempo real
  let posicionUsuario = $state<LatLngTuple>([-33.5990313, -70.8738986]);
  let centroBase = $state<LatLngTuple>([-33.5990313, -70.8738986]);
  let tieneUbicacionReal = $state(false);

  // Bandera para controlar si la cámara debe seguir al usuario automáticamente
  let centradoAutomatico = $state(true);

  // ID para controlar y apagar el rastro del GPS
  let watchId: number | null = null;

  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attributionText = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  // Marcadores de incendios estables
  const misMarcadores: { id: number; posicion: LatLngTuple; titulo: string; descripcion: string }[] = [
    {
      id: 1,
      posicion: [-33.5990916, -70.8731771],
      titulo: "Incendio en Pastelería Kaiser",
      descripcion: "Ayuda loko, se quemaron 3 tortas y una watona",
    },
  ];

  let fireMarkerIcon = $state<any>(null);
  let userLocationIcon = $state<any>(null);

  // Función para solicitar y espiar la ubicación en tiempo real
  function obtenerUbicacionTiempoReal() {
    if (!navigator.geolocation) {
      console.error("Tu navegador no soporta geolocalización, hno");
      return;
    }

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        posicionUsuario = [latitude, longitude];
        centroBase = [latitude, longitude]; 
        tieneUbicacionReal = true;

        // SOLO movemos la cámara de forma obligatoria si el auto-centrado está activo
        if (mapRef && centradoAutomatico) {
          mapRef.setView(posicionUsuario, mapRef.getZoom());
        }
      },
      (error) => {
        console.warn("Error al obtener ubicación en tiempo real:", error.message);
        if (!tieneUbicacionReal) {
          alert("No pudimos activar el rastreo de ubicación. Se usará la de respaldo.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  // Funciones de control de los botones flotantes
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
      centradoAutomatico = true; // Reactivamos el candado de seguimiento continuo
      mapRef.setView(centroBase, 17);
      zoom = 17;
    }
  }

  // Función que apaga el auto-centrado si el usuario toca o arrastra físicamente el mapa
  function desactivarSeguimiento() {
    if (centradoAutomatico) {
      centradoAutomatico = false;
      console.log("Seguimiento desactivado por interacción física del usuario.");
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

    userLocationIcon = L.icon({
      iconUrl: currentLocationIconUrl,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });

    isMounted = true;
    obtenerUbicacionTiempoReal();

    // Vinculamos los eventos nativos de interacción directamente al elemento contenedor
    if (contenedorMapaNode) {
      contenedorMapaNode.addEventListener("touchstart", desactivarSeguimiento, { passive: true });
      contenedorMapaNode.addEventListener("mousedown", desactivarSeguimiento, { passive: true });
      contenedorMapaNode.addEventListener("wheel", desactivarSeguimiento, { passive: true });
    }
  });

  onDestroy(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }
    // Limpieza de eventos
    if (contenedorMapaNode) {
      contenedorMapaNode.removeEventListener("touchstart", desactivarSeguimiento);
      contenedorMapaNode.removeEventListener("mousedown", desactivarSeguimiento);
      contenedorMapaNode.removeEventListener("wheel", desactivarSeguimiento);
    }
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

  <div class="leaflet-map" bind:this={contenedorMapaNode}>
    {#if isMounted}
      <Map 
        options={{ center: centroInicial, zoom: zoom, zoomControl: false }} 
        bind:instance={mapRef}
      >
        <TileLayer url={tileUrl} options={{ maxZoom: 19, attribution: attributionText }} />

        {#if tieneUbicacionReal && userLocationIcon}
          <Marker latLng={posicionUsuario} options={{ icon: userLocationIcon }}>
            <Popup>
              <strong>Tu ubicación aproximada</strong>
            </Popup>
          </Marker>
        {/if}

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