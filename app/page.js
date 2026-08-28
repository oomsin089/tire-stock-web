"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [brand, setBrand] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [s, st] = await Promise.all([api("/stock/summary"), api("/stock")]);
        setSummary(s);
        setStock(st);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const brands = useMemo(
    () => [...new Set(stock.map((r) => r.brand))].sort(),
    [stock]
  );

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return stock.filter((r) => {
      if (brand && r.brand !== brand) return false;
      if (!needle) return true;
      return (
        `${r.brand} ${r.model} ${r.size} ${r.lot_no} ${r.location_name}`
          .toLowerCase()
          .includes(needle)
      );
    });
  }, [stock, brand, q]);

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Dashboard</div>
        <h1 className="page-title">ภาพรวมสต๊อก</h1>
        <p className="page-desc">ยางคงเหลือทั้งหมด แยกตามล็อตและพื้นที่เก็บ</p>
      </div>

      {error && <div className="alert alert-err">โหลดข้อมูลไม่สำเร็จ: {error}</div>}

      <div className="stat-row">
        <div className="stat">
          <div className="stat-label">ยางคงเหลือรวม</div>
          <div className="stat-value">
            {summary ? summary.total_tires_in_stock.toLocaleString() : "—"}
            <span className="unit">เส้น</span>
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">จำนวนสินค้า (SKU)</div>
          <div className="stat-value">{summary ? summary.product_count : "—"}</div>
        </div>
        <div className="stat">
          <div className="stat-label">พื้นที่เก็บ</div>
          <div className="stat-value">{summary ? summary.location_count : "—"}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h2>ของคงเหลือ</h2>
          <span className="count-note">{rows.length} รายการ</span>
          <div className="toolbar">
            <select value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="">ทุกยี่ห้อ</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <input
              placeholder="ค้นหา รุ่น/ขนาด/ล็อต/พื้นที่"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading">กำลังโหลด…</div>
        ) : rows.length === 0 ? (
          <div className="empty">
            <div className="big">ไม่พบรายการ</div>
            ลองล้างตัวกรอง หรือเพิ่มสต๊อกที่หน้า “รับเข้า”
          </div>
        ) : (
          <div className="table-wrap">
            <table className="grid">
              <thead>
                <tr>
                  <th>ยี่ห้อ</th>
                  <th>รุ่น</th>
                  <th>ขนาด</th>
                  <th>ล็อต</th>
                  <th>พื้นที่</th>
                  <th style={{ textAlign: "right" }}>คงเหลือ</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.product_id}-${r.lot_no}-${r.location_id}`}>
                    <td>{r.brand}</td>
                    <td>{r.model}</td>
                    <td className="num">{r.size}</td>
                    <td><span className="tag lot">{r.lot_no}</span></td>
                    <td><span className="tag">{r.location_name}</span></td>
                    <td className="num qty-strong">{r.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
