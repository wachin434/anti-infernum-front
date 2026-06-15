import { z } from "zod";
import type { LatLngTuple } from "leaflet";

const ubicacionSchema = z.object({
  crs: z.object({
    type: z.string(),
    properties: z.record(z.string(), z.string()),
  }),
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]),
});

export const reporteApiSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  descripcion: z.string(),
  ubicacion: ubicacionSchema,
  estado: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const reporteApiListSchema = z.array(reporteApiSchema);

export type ReporteApi = z.infer<typeof reporteApiSchema>;

export type ReporteMarcador = {
  id: number;
  titulo: string;
  descripcion: string;
  posicion: LatLngTuple;
  estado: string;
  createdAt: string;
  updatedAt: string;
};

export const mapReporteApiAReporteMarcador = (reporte: ReporteApi): ReporteMarcador => ({
  id: reporte.id,
  titulo: reporte.titulo,
  descripcion: reporte.descripcion,
  posicion: [reporte.ubicacion.coordinates[1], reporte.ubicacion.coordinates[0]],
  estado: reporte.estado,
  createdAt: reporte.createdAt,
  updatedAt: reporte.updatedAt,
});

export async function obtenerReportesApi(url: string): Promise<ReporteMarcador[]> {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Error al obtener reportes: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const parseResult = reporteApiListSchema.safeParse(data.datos);

  if (!parseResult.success) {
    throw new Error(`Respuesta de reportes inválida: ${parseResult.error.message}`);
  }

  return parseResult.data.map(mapReporteApiAReporteMarcador);
}

export async function enviarReporteApi(
  url: string,
  payload: {
    titulo: string;
    descripcion: string;
    latitud: number;
    longitud: number;
  }
): Promise<void> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      titulo: payload.titulo,
      descripcion: payload.descripcion,
      latitud: payload.latitud,
      longitud: payload.longitud,
      ubicacion: {
        type: "Point",
        coordinates: [payload.longitud, payload.latitud],
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Error al enviar reporte: ${response.status} ${errorText}`);
  }
}
