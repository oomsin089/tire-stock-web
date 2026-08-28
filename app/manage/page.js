"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ManagePage() {
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [prod, setProd] = useState({ brand: "", model: "", size: "" });
  const [loc, setLoc] = useState({ name: "", note: "" });
  const [msg, setMsg] = useState(null);

  async function load() {
    try {
      const [p, l] = await Promise.all([api("/products"), api("/locations")]);
      setProducts(p);
      setLocations(l);
    } catch (e) {
      setMsg({ ok: false, text: e.message });
    }
  }
  useEffect(() => { load(); }, []);

  async function addProduct(e) {
    e.preventDefault();
    setMsg(null);
    try {
      await api("/products", {
        method: "POST",
        body: JSON.stringify({
          brand: prod.brand.trim(),
          model: prod.model.trim(),
          size: prod.size.trim(),
        }),
      });
      setProd({ brand: "", model: "", size: "" });
      setMsg({ ok: true, text: "เพิ่มสินค้าเรียบร้อย" });
      load();
    } catch (e) {
      setMsg({ ok: false, text: e.message });
    }
  }

  async function addLocation(e) {
    e.preventDefault();
    setMsg(null);
    try {
      await api("/locations", {
        method: "POST",
        body: JSON.stringify({ name: loc.name.trim(), note: loc.note.trim() || null }),
      });
      setLoc({ name: "", note: "" });
      setMsg({ ok: true, text: "เพิ่มพื้นที่เรียบร้อย" });
      load();
    } catch (e) {
      setMsg({ ok: false, text: e.message });
    }
  }

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Manage</div>
        <h1 className="page-title">จัดการข้อมูล</h1>
        <p className="page-desc">เพิ่มสินค้าและพื้นที่เก็บ ก่อนนำไปใช้ในหน้ารับเข้า/ขายออก</p>
      </div>

      {msg && (
        <div className={`alert ${msg.ok ? "alert-ok" : "alert-err"}`} style={{ marginBottom: 20 }}>
          {msg.text}
        </div>
      )}

      <div className="two-col">
        {/* สินค้า */}
        <div className="card">
          <div className="card-head">
            <h2>สินค้า</h2>
            <span className="count-note">{products.length} รายการ</span>
          </div>
          <div className="card-body">
            <form className="form-grid" onSubmit={addProduct} style={{ marginBottom: 20 }}>
              <div className="row-2">
                <div className="field">
                  <label>ยี่ห้อ</label>
                  <input value={prod.brand} onChange={(e) => setProd({ ...prod, brand: e.target.value })} placeholder="GITI" required />
                </div>
                <div className="field">
                  <label>รุ่น</label>
                  <input value={prod.model} onChange={(e) => setProd({ ...prod, model: e.target.value })} placeholder="P10" required />
                </div>
              </div>
              <div className="field">
                <label>ขนาด</label>
                <input value={prod.size} onChange={(e) => setProd({ ...prod, size: e.target.value })} placeholder="255/45/19" required />
              </div>
              <div><button className="btn btn-primary">เพิ่มสินค้า</button></div>
            </form>

            <div className="table-wrap" style={{ maxHeight: 340, overflowY: "auto" }}>
              <table className="grid">
                <thead>
                  <tr><th>ยี่ห้อ</th><th>รุ่น</th><th>ขนาด</th></tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.brand}</td>
                      <td>{p.model}</td>
                      <td className="num">{p.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* พื้นที่ */}
        <div className="card">
          <div className="card-head">
            <h2>พื้นที่เก็บ</h2>
            <span className="count-note">{locations.length} แห่ง</span>
          </div>
          <div className="card-body">
            <form className="form-grid" onSubmit={addLocation} style={{ marginBottom: 20 }}>
              <div className="row-2">
                <div className="field">
                  <label>ชื่อพื้นที่</label>
                  <input value={loc.name} onChange={(e) => setLoc({ ...loc, name: e.target.value })} placeholder="โรง1 / ตู้2" required />
                </div>
                <div className="field">
                  <label>หมายเหตุ <span className="hint">(ไม่บังคับ)</span></label>
                  <input value={loc.note} onChange={(e) => setLoc({ ...loc, note: e.target.value })} placeholder="—" />
                </div>
              </div>
              <div><button className="btn btn-primary">เพิ่มพื้นที่</button></div>
            </form>

            <div className="table-wrap">
              <table className="grid">
                <thead>
                  <tr><th>พื้นที่</th><th>หมายเหตุ</th></tr>
                </thead>
                <tbody>
                  {locations.map((l) => (
                    <tr key={l.id}>
                      <td><span className="tag">{l.name}</span></td>
                      <td>{l.note || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
