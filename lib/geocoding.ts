export interface Coords {
  lat: number;
  lng: number;
}

export interface AlamatParams {
  alamat?: string | null;
  desa?: string | null;
  kecamatan?: string | null;
  kabupaten?: string | null;
  provinsi?: string | null;
}

export async function getCoordsFromAddress(dataAlamat: AlamatParams): Promise<Coords | null> {
  const queryText = [
    dataAlamat.alamat,
    dataAlamat.desa,
    dataAlamat.kecamatan,
    dataAlamat.kabupaten,
    dataAlamat.provinsi,
    "Indonesia",
  ]
    .filter(Boolean)
    .join(", ");

  if (!queryText.trim() || queryText === "Indonesia") return null;

  try {
    const query = encodeURIComponent(queryText);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
      headers: {
        "User-Agent": "PasarNusaApp/1.0",
      },
    });

    if (!res.ok) {
      console.warn("Geocoding HTTP error:", res.statusText);
      return null;
    }

    const result = await res.json();
    if (result && result.length > 0) {
      return {
        lat: parseFloat(result[0].lat),
        lng: parseFloat(result[0].lon),
      };
    }
  } catch (err) {
    console.error("Gagal melakukan geocoding alamat:", err);
  }

  return null;
}