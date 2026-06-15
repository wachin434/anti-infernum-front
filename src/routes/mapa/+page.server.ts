import { reporteApiListSchema, mapReporteApiAReporteMarcador } from "$lib/data/reportes";
import type { PageServerLoad } from "./$types";

const REPORTES_API_URL = "https://anti-infernum-report-service.onrender.com/api/reportes";

export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch(REPORTES_API_URL, { cache: "no-store" });

  if (!response.ok) {
    console.error(`Error al obtener reportes iniciales: ${response.status} ${response.statusText}`);
    return { reportes: [] };
  }

  const json = await response.json();
  const result = reporteApiListSchema.safeParse(json);

  if (!result.success) {
    console.error("Respuesta inicial de reportes inválida:", result.error.format());
    return { reportes: [] };
  }

  return {
    reportes: result.data.map(mapReporteApiAReporteMarcador),
  };
};
