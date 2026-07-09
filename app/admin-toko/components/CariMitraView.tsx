"use client";

import React, { useState } from "react";
import {
  Search,
  MapPin,
  Star,
  Phone,
  ArrowRight,
  Leaf,
  ShieldAlert,
  Hammer,
} from "lucide-react";

export default function CariMitraPage() {
  const [filterKategori, setFilterKategori] = useState("Semua");

  const daftarMitra = [
    {
      id: 1,
      nama: "Kelompok Tani Lestari",
      kategori: "Petani",
      komoditas: "Beras Mentik Wangi, Gabah Kering",
      jarak: "0.4 Km",
      rating: 4.9,
      icon: Leaf,
      status: "Verified Terdekat",
    },
    {
      id: 2,
      nama: "Peternakan Berkah Mulia",
      kategori: "Peternak",
      komoditas: "Telur Ayam Kampung, Susu Sapi Segar",
      jarak: "2.1 Km",
      rating: 4.8,
      icon: ShieldAlert,
      status: "Suplier Favorit",
    },
    {
      id: 3,
      nama: "Pengrajin Anyaman Bambu Desa",
      kategori: "Pengrajin",
      komoditas: "Besek Bambu, Keranjang Logistik",
      jarak: "1.5 Km",
      rating: 4.7,
      icon: Hammer,
      status: "Mitra Lokal",
    },
  ];

  const mitraTersaring =
    filterKategori === "Semua"
      ? daftarMitra
      : daftarMitra.filter((m) => m.kategori === filterKategori);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* Top Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <p className="text-sm text-slate-500" style={{ margin: 0 }}>
            Hubungkan rantai pasok UMKM Anda langsung dengan produsen utama
            pedesaan.
          </p>
        </div>

        {/* Search Bar CONTAINER */}
        <div style={{ position: "relative", width: "100%", maxWidth: "20rem" }}>
          <Search
            className="w-4 h-4 text-slate-400"
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: "1rem",
              height: "1rem",
              color: "#94A3B8",
            }}
          />
          <input
            type="text"
            placeholder="Cari petani atau komoditas..."
            className="w-full rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB] bg-white text-[#1E293B]"
            style={{
              width: "100%",
              padding: "0.625rem 1rem 0.625rem 2.25rem",
              border: "1px solid #E2E8F0",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              color: "#1E293B",
              backgroundColor: "#ffffff",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          borderBottom: "1px solid #E2E8F0",
          paddingBottom: "px",
        }}
      >
        {["Semua", "Petani", "Peternak", "Pengrajin"].map((kat) => (
          <button
            key={kat}
            onClick={() => setFilterKategori(kat)}
            style={{
              padding: "0.625rem 1rem",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              color: filterKategori === kat ? "#2563EB" : "#64748B",
              borderBottom:
                filterKategori === kat
                  ? "2px solid #2563EB"
                  : "2px solid transparent",
              marginBottom: "-1px",
            }}
          >
            {kat}
          </button>
        ))}
      </div>

      {/* Directory Grid - Dikunci menggunakan CSS Grid murni */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          width: "100%",
        }}
      >
        {mitraTersaring.map((mitra) => {
          const ItemIcon = mitra.icon;
          return (
            <div
              key={mitra.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:border-slate-300 transition-all"
              style={{
                backgroundColor: "#ffffff",
                padding: "1.5rem",
                borderRadius: "1rem",
                border: "1px solid #E2E8F0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#EFF6FF",
                      padding: "0.75rem",
                      borderRadius: "0.75rem",
                      color: "#2563EB",
                    }}
                  >
                    <ItemIcon
                      className="w-6 h-6"
                      style={{ width: "1.5rem", height: "1.5rem" }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      backgroundColor: "#ECFDF5",
                      color: "#10B981",
                      padding: "0.25rem 0.625rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #D1FAE5",
                    }}
                  >
                    {mitra.status}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#1E293B",
                    margin: 0,
                  }}
                >
                  {mitra.nama}
                </h3>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#94A3B8",
                    fontWeight: 500,
                    margin: 0,
                    marginTop: "0.25rem",
                  }}
                >
                  {mitra.kategori} Komoditas Utama
                </p>

                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#334155",
                    marginTop: "0.75rem",
                    fontWeight: 500,
                    backgroundColor: "#F8FAFC",
                    padding: "0.625rem",
                    borderRadius: "0.75rem",
                    border: "1px solid #E2E8F0",
                    margin: 0,
                  }}
                >
                  {mitra.komoditas}
                </p>
              </div>

              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #F1F5F9",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    color: "#64748B",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <MapPin style={{ width: "0.875rem", height: "0.875rem" }} />{" "}
                    Jarak:{" "}
                    <strong style={{ color: "#334155" }}>{mitra.jarak}</strong>
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      color: "#F59E0B",
                    }}
                  >
                    <Star
                      className="fill-current"
                      style={{ width: "0.875rem", height: "0.875rem" }}
                    />{" "}
                    <strong style={{ color: "#F59E0B" }}>{mitra.rating}</strong>
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                    paddingTop: "0.25rem",
                  }}
                >
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.375rem",
                      border: "1px solid #E2E8F0",
                      backgroundColor: "#ffffff",
                      color: "#475569",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "0.5rem 0",
                      borderRadius: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    <Phone style={{ width: "0.875rem", height: "0.875rem" }} />{" "}
                    Hubungi
                  </button>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.25rem",
                      backgroundColor: "#2563EB",
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "0.5rem 0",
                      borderRadius: "0.75rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Lihat Produk{" "}
                    <ArrowRight
                      style={{ width: "0.875rem", height: "0.875rem" }}
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
