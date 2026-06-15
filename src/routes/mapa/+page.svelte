<script lang="ts">
  import { onMount, onDestroy, tick } from "svelte";
  import "@/styles/mapa.css";
  import { Map, TileLayer, Marker, Popup } from "sveaflet";
  import type { LatLngTuple } from "leaflet";
  import type { ReporteMarcador } from "$lib/data/reportes";
  import { obtenerReportesApi, enviarReporteApi } from "$lib/data/reportes";
  import ReportForm from "@/components/organisms/report-form.svelte";

  import fireMarkerIconUrl from "$lib/assets/fire-svgrepo-com.svg";
  import zoomInIconUrl from "$lib/assets/zoom-in-1-svgrepo-com.svg";
  import zoomOutIconUrl from "$lib/assets/zoom-out-1-svgrepo-com.svg";
  import centerIconUrl from "$lib/assets/location-target-svgrepo-com.svg";
  import currentLocationIconUrl from "$lib/assets/location-define-svgrepo-com.svg";
  import mapPinIconUrl from "$lib/assets/map-pin-svgrepo-com.svg";

  let { data } = $props();

  let mapRef = $state<any>(null);
  let isMounted = $state(false);
  let zoom = $state(17);

  let contenedorMapaNode = $state<HTMLDivElement | null>(null);

  const centroInicial: LatLngTuple = [-33.5990313, -70.8738986];

  let posicionUsuario = $state<LatLngTuple>([-33.5990313, -70.8738986]);
  let centroBase = $state<LatLngTuple>([-33.5990313, -70.8738986]);
  let tieneUbicacionReal = $state(false);

  let centradoAutomatico = $state(true);

  let reportes = $state<ReporteMarcador[]>([]);
  let reportesError = $state<string | null>(null);
  let reportesLoading = $state(false);
  let reportesPollId= $state<number | null>(null);
  let watchId= $state<number | null>(null);
  let reportFormOpen = $state(false);
  let selectingLocation = $state(false);
  let selectedLocation = $state<LatLngTuple | null>(null);

  const REPORTES_API_URL = "https://anti-infernum-report-service.onrender.com/api/reportes";
  const POLL_INTERVAL_MS = 15000;

  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attributionText = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  let fireMarkerIcon = $state<any>(null);
  let userLocationIcon = $state<any>(null);
  let mapPinIcon = $state<any>(null);

  async function cargarReportes() {
    reportesLoading = true;
    reportesError = null;

    try {
      reportes = await obtenerReportesApi(REPORTES_API_URL);
    } catch (error) {
      reportes = [];
      reportesError = error instanceof Error ? error.message : "Error desconocido al cargar reportes.";
    } finally {
      reportesLoading = false;
    }
  }

  function iniciarPollingReportes() {
    cargarReportes();
    reportesPollId = window.setInterval(cargarReportes, POLL_INTERVAL_MS);
  }

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
      centradoAutomatico = true;
      mapRef.setView(centroBase, 17);
      zoom = 17;
    }
  }

  function abrirFormularioReporte() {
    if (!data?.isAuthenticated) {
      alert("Usted debe estar registrado para hacer un reporte");
      return;
    }

    reportFormOpen = true;
    selectingLocation = false;
    selectedLocation = null;
  }

  function handleMapClick(event: any) {
    if (!selectingLocation) {
      return;
    }

    const latlng = event?.detail?.latlng ?? event?.latlng;
    if (!latlng || typeof latlng.lat !== "number" || typeof latlng.lng !== "number") {
      return;
    }

    selectedLocation = [latlng.lat, latlng.lng];
  }

  function cerrarFormularioReporte() {
    reportFormOpen = false;
    selectingLocation = false;
    selectedLocation = null;
  }

  function activarSeleccionUbicacion() {
    reportFormOpen = false;
    selectingLocation = true;
    selectedLocation = null;
  }

  function confirmarUbicacion() {
    if (!selectedLocation) {
      return;
    }
    reportFormOpen = true;
    selectingLocation = false;
  }

  async function enviarReporte(event: CustomEvent) {
    const { titulo, descripcion, latitud, longitud } = event.detail;

    try {
      await enviarReporteApi(REPORTES_API_URL, { titulo, descripcion, latitud, longitud });
      reportFormOpen = false;
      selectedLocation = null;
      await cargarReportes();
      alert("Reporte enviado correctamente.");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "No se pudo enviar el reporte. Intente nuevamente.");
    }
  }

  function desactivarSeguimiento() {
    if (centradoAutomatico) {
      centradoAutomatico = false;
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

    mapPinIcon = L.icon({
      iconUrl: mapPinIconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -28],
    });

    if (data?.reportes?.length) {
      reportes = data.reportes;
    }

    isMounted = true;
    obtenerUbicacionTiempoReal();
    iniciarPollingReportes();

    await tick();
    if (mapRef && typeof mapRef.on === "function") {
      mapRef.on("click", handleMapClick);
    }

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

    if (reportesPollId !== null) {
      clearInterval(reportesPollId);
    }

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
  <div class="map-controls-left">
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
  {#if !selectingLocation}
    <div class="report-button-container">
      <button type="button" class="report-control-btn" onclick={abrirFormularioReporte}>
        Reportar incendio
      </button>
    </div>
  {/if}
  {#if selectingLocation}
    <div class="selection-mode-badge">
      <strong>Modo selección de ubicación</strong>
      <span>Toca el mapa para elegir el lugar del incendio.</span>
    </div>
  {/if}

  <div class="leaflet-map" bind:this={contenedorMapaNode}>
    {#if isMounted}
      <Map
        options={{ center: centroInicial, zoom, zoomControl: false }}
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
          {#if reportes.length > 0}
            {#each reportes as reporte (reporte.id)}
              <Marker latLng={reporte.posicion} options={{ icon: fireMarkerIcon }}>
                <Popup>
                  <strong>{reporte.titulo}</strong><br />{reporte.descripcion}
                </Popup>
              </Marker>
            {/each}
          {:else}
            <Marker latLng={[-33.5990916, -70.8731771]} options={{ icon: fireMarkerIcon }}>
              <Popup>
                <strong>Incendio de ejemplo</strong><br />Esperando datos de la API...
              </Popup>
            </Marker>
          {/if}

          {#if selectingLocation && selectedLocation}
            <Marker latLng={selectedLocation} options={{ icon: mapPinIcon }}>
              <Popup>
                <div class="selection-popup">
                  <strong>Ubicación seleccionada</strong>
                  <p>Presiona el botón de confirmación en el panel inferior.</p>
                </div>
              </Popup>
            </Marker>
          {/if}
        {/if}
      </Map>

      {#if selectingLocation}
        <div class="location-selection-overlay">
          <div class="location-selection-card">
            <p class="selection-title">Seleccione la ubicación</p>

            {#if selectedLocation}
              <p>Latitud: {selectedLocation[0].toFixed(6)}</p>
              <p>Longitud: {selectedLocation[1].toFixed(6)}</p>
              <button type="button" class="primary-button" onclick={confirmarUbicacion}>
                Confirmar ubicación
              </button>
            {:else}
              <p class="info-text">
                Toca el mapa para colocar el pin de ubicación.
              </p>
            {/if}

            <button
              type="button"
              class="secondary-button"
              onclick={() => {
                selectingLocation = false;
                reportFormOpen = true;
                selectedLocation = null;
              }}
            >
              Volver al formulario
            </button>
          </div>
        </div>
      {/if}
    {:else}
      <div class="map-placeholder">Cargando mapa...</div>
    {/if}
  </div>

  {#if reportFormOpen}
    <ReportForm
      currentLocation={tieneUbicacionReal ? posicionUsuario : null}
      selectedLocation={selectedLocation}
      on:close={cerrarFormularioReporte}
      on:pickOnMap={activarSeleccionUbicacion}
      on:submitReport={enviarReporte}
    />
  {/if}
</div>