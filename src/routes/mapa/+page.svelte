<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import "@/styles/mapa.css";
  //importación pa los iconos .svg q puse ouyeaa 🥵
  import fireMarkerIconUrl from "$lib/assets/fire-svgrepo-com.svg";
  import zoomInIconUrl from "$lib/assets/zoom-in-1-svgrepo-com.svg";
  import zoomOutIconUrl from "$lib/assets/zoom-out-1-svgrepo-com.svg";
  import centerIconUrl from "$lib/assets/location-target-svgrepo-com.svg";
  import currentLocationIconUrl from "$lib/assets/location-define-svgrepo-com.svg";

  

  let map = $state(null);
  let mapContainer = $state(null);
  let zoom = 17; //el zoom default

  //después hay que cambiar esto por la ubicación del usuario esosi
  const centroInicial = [-33.5990313, -70.8738986];
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  //pon auí tu array de marcadores de prueba super seguro 👀👀 wea mala jashdha
  const misMarcadores = [
    {
      id: 1,
      posicion: [-33.5990916, -70.8731771],
      titulo: "Incendio en Pastelería Kaiser",
      descripcion: "Ayuda loko, se quemaron 3 tortas y una watona",
    },
  ];

  function zoomIn() {
    map?.zoomIn();
  }

  function zoomOut() {
    map?.zoomOut();
  }

  function resetCenter() {
    map?.setView(centroInicial, zoom);
  }

  //acá tuve que hacer algo exótico para que funcionara la libreria del mapa wn
  //pq resulta que el leaflet se pone mañoso con el ssr jsdahj
  onMount(async () => {
    const L = await import("leaflet");

    map = L.map(mapContainer, {
      center: centroInicial,
      zoom,
      zoomControl: false,
    });

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    //se pone mañoso si intento poner el url del icono pelao, asi que quedó esta wea acá xd
    const fireMarkerIcon = L.icon({
      iconUrl: fireMarkerIconUrl,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    misMarcadores.forEach((marcador) => {
      L.marker(marcador.posicion, { icon: fireMarkerIcon })
        .addTo(map)
        .bindPopup(
          `<strong>${marcador.titulo}</strong><br>${marcador.descripcion}`,
        );
    });

    map.on("zoomend", () => {
      zoom = map.getZoom();
    });
  });

  onDestroy(() => {
    map?.remove();
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
    <button type="button" class="control-btn" on:click={zoomIn}>
      <img src={zoomInIconUrl} alt="Zoom In" />
    </button>
    <button type="button" class="control-btn" on:click={zoomOut}>
      <img src={zoomOutIconUrl} alt="Zoom Out" />
    </button>
    <button type="button" class="control-btn" on:click={resetCenter}>
      <img src={centerIconUrl} alt="Centrar" />
    </button>
  </div>

  <div bind:this={mapContainer} class="leaflet-map">
    {#if !map}
      <div class="map-placeholder">Cargando mapa...</div>
    {/if}
  </div>
</div>

