<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let map = $state(null);
  let mapContainer = $state(null);
  let zoom = 17; //el zoom default 

  const centroInicial = [-33.5990313, -70.8738986];
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

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

    misMarcadores.forEach((marcador) => {
      L.marker(marcador.posicion)
        .addTo(map)
        .bindPopup(
          `<strong>${marcador.titulo}</strong><br>${marcador.descripcion}`
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
    <button type="button" class="control-btn" on:click={zoomIn}>+</button>
    <button type="button" class="control-btn" on:click={zoomOut}>−</button>
    <button type="button" class="control-btn center-btn" on:click={resetCenter}>
      Centrar
    </button>
  </div>

  <div bind:this={mapContainer} class="leaflet-map">
    {#if !map}
      <div class="map-placeholder">Cargando mapa...</div>
    {/if}
  </div>
</div>

<style>
  .contenedor-mapa-seguro {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 0;
  }

  .leaflet-map {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .map-controls {
    position: absolute;
    top: 8rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    z-index: 1100;
  }

  .control-btn {
    width: 3rem;
    height: 3rem;
    border: none;
    border-radius: 0.75rem;
    background: rgba(26, 26, 26, 0.85);
    color: #fff;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.25);
    transition: transform 0.15s ease, background 0.15s ease;
  }

  .control-btn:hover {
    transform: translateY(-1px);
    background: rgba(40, 40, 40, 0.95);
  }

  .center-btn {
    width: auto;
    min-width: 4.5rem;
    padding: 0 1rem;
    font-size: 0.95rem;
  }

  .map-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.35);
    font-size: 1rem;
    font-weight: 700;
  }
</style>