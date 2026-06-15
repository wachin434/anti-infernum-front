<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { LatLngTuple } from "leaflet";
  import "@/styles/report-form.css";

  const dispatch = createEventDispatcher();

  type Props = {
    currentLocation: LatLngTuple | null;
    selectedLocation: LatLngTuple | null;
  };

  let { currentLocation = null, selectedLocation = null }: Props = $props();

  let titulo = $state("");
  let descripcion = $state("");
  let locationMethod = $state<"current" | "map">(selectedLocation ? "map" : "current");
  let errors = $state<Record<string, string>>({});
  let isSubmitting = $state(false);

  function handleClose() {
    dispatch("close");
  }

  function pickLocationOnMap() {
    locationMethod = "map";
    dispatch("pickOnMap");
  }

  function handleSubmit(event: Event) {
    event.preventDefault();
    errors = {};

    const tituloValue = titulo.trim();
    const descripcionValue = descripcion.trim();
    const coords =
      locationMethod === "current" ? currentLocation : selectedLocation;

    if (!tituloValue) {
      errors.titulo = "El título es obligatorio.";
    } else if (tituloValue.length < 5) {
      errors.titulo = "El título debe tener al menos 5 caracteres.";
    }

    if (!descripcionValue) {
      errors.descripcion = "La descripción es obligatoria.";
    } else if (descripcionValue.length < 10) {
      errors.descripcion = "La descripción debe tener al menos 10 caracteres.";
    }

    if (!coords) {
      errors.location =
        locationMethod === "current"
          ? "No se encontró su ubicación actual. Seleccione la ubicación en el mapa."
          : "Debe seleccionar una ubicación en el mapa antes de enviar el reporte.";
    }

    if (Object.keys(errors).length > 0) {
      return;
    }

    isSubmitting = true;
    const [latitud, longitud] = coords as LatLngTuple;
    dispatch("submitReport", {
      titulo: tituloValue,
      descripcion: descripcionValue,
      latitud,
      longitud,
      locationMethod,
    });
  }
</script>

<div class="report-form-overlay">
  <div class="report-form-card">
    <header class="report-form-header">
      <h2>Reportar incendio</h2>
      <button
        type="button"
        class="close-button"
        onclick={handleClose}
        aria-label="Cerrar formulario"
      >
        X
      </button>
    </header>

    <form class="report-form" onsubmit={handleSubmit}>
      <label>
        Título
        <input
          type="text"
          bind:value={titulo}
          placeholder="Ej. Foco activo cerca de parque"
          autocomplete="off"
        />
      </label>
      {#if errors.titulo}
        <p class="error-text">{errors.titulo}</p>
      {/if}

      <label>
        Descripción
        <textarea
          bind:value={descripcion}
          placeholder="Describe el incidente con la mayor claridad posible"
          rows="4"
        >
        </textarea>
      </label>
      {#if errors.descripcion}
        <p class="error-text">{errors.descripcion}</p>
      {/if}

      <div class="report-location-method">
        <span>Ubicación</span>
        <label>
          <input
            type="radio"
            name="locationMethod"
            value="current"
            checked={locationMethod === "current"}
            onchange={() => {
              locationMethod = "current";
            }}
          />
          Usar mi ubicación actual
        </label>
        <label>
          <input
            type="radio"
            name="locationMethod"
            value="map"
            checked={locationMethod === "map"}
            onchange={() => {
              locationMethod = "map";
            }}
          />
          Seleccionar en el mapa
        </label>
      </div>

      {#if locationMethod === "current"}
        <div class="location-preview">
          {#if currentLocation}
            <p>Latitud: {currentLocation[0].toFixed(6)}</p>
            <p>Longitud: {currentLocation[1].toFixed(6)}</p>
          {:else}
            <p class="info-text">
              No se encontró la ubicación actual. Seleccione la ubicación en el
              mapa.
            </p>
          {/if}
        </div>
      {:else}
        <div class="location-preview">
          {#if selectedLocation}
            <p>Latitud: {selectedLocation[0].toFixed(6)}</p>
            <p>Longitud: {selectedLocation[1].toFixed(6)}</p>
          {:else}
            <p class="info-text">
              Presione el botón para seleccionar la ubicación en el mapa.
            </p>
          {/if}
        </div>
        <button
          type="button"
          class="secondary-button"
          onclick={pickLocationOnMap}
        >
          Seleccionar ubicación en el mapa
        </button>
      {/if}

      {#if errors.location}
        <p class="error-text">{errors.location}</p>
      {/if}

      <button type="submit" class="primary-button" disabled={isSubmitting}>
        {isSubmitting ? "Enviando reporte..." : "Enviar reporte"}
      </button>
    </form>
  </div>
</div>
