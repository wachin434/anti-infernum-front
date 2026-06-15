import { obtenerReportesApi } from "$lib/data/reportes";
import type { PageServerLoad } from "./$types";

const REPORTES_API_URL = "https://anti-infernum-report-service.onrender.com/api/reportes";

export const load: PageServerLoad = async () => {
  try {
    const reportes = await obtenerReportesApi(REPORTES_API_URL);
    return { reportes };
  } catch (error) {
    console.error("Error al cargar reportes:", error);
    return { reportes: [] };
  }
};
