<script lang="ts">
  import "@/styles/reportes.css";
  import type { ReporteMarcador } from "$lib/data/reportes";

  let { data } = $props();
  const reportes: ReporteMarcador[] = data?.reportes ?? [];
</script>

<svelte:head>
  <title>Reportes de incendios - Anti Infernum</title>
</svelte:head>

<main class="reportes-page">
  <section class="reportes-hero">
    <div class="reportes-header">
      <h1>Reportes recientes</h1>
      <p>Consulta los incendios reportados con ubicación y estado.</p>
    </div>

    {#if reportes.length === 0}
      <div class="reportes-empty">
        <p>No hay reportes disponibles en este momento.</p>
        <p>Intenta recargar la página para ver los datos más recientes.</p>
      </div>
    {:else}
      <div class="reportes-list">
        {#each reportes as reporte (reporte.id)}
          <article class="reporte-card">
            <div class="reporte-card-header">
              <h2>{reporte.titulo}</h2>
              <span class="reporte-estado">{reporte.estado}</span>
            </div>
            <p class="reporte-descripcion">{reporte.descripcion}</p>
            <div class="reporte-detalles">
              <span>Lat: {reporte.posicion[0].toFixed(6)}</span>
              <span>Lng: {reporte.posicion[1].toFixed(6)}</span>
              <span>{new Date(reporte.createdAt).toLocaleString()}</span>
            </div>
          </article>
        {/each}
      </div>
    {/if}
  </section>
</main>
