"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const today = () => new Date().toISOString().slice(0, 10);

export default function TransferPage() {
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadErr, setLoadErr] = useState("");

  const [form, setForm] = useState({
    moved_on: today(),
    product_id: "",
    lot_no: "",
    from_location_id: "",
    to_location_id: "",
    quantity: "",
    note: "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [p, l] = await Promise.all([api("/products"), api("/locations")]);
        setProducts(p);
        setLocations(l);
      } catch (e) {
        setLoadErr(e.message);
      }
    })();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      await api("/movements/transfer", {
        method: "POST",
        body: JSON.stringify({
          moved_on: form.moved_on,
          product_id: Number(form.product_id),
          lot_no: form.lot_no.trim(),
          from_location_id: Number(form.from_location_id),
          to_location_id: Number(form.to_location_id),
          quantity: Number(form.quantity),
          note: form.note.trim() || null,
        }),
      });
      setMsg({ ok: true, text: `ย้าย ${form.quantity} เส้นเรียบร้อย` });
      setForm((f) => ({ ...f, lot_no: "", quantity: "", note: "" }));
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  }

  const ready =
    form.product_id && form.lot_no && form.from_location_id &&
    form.to_location_id && form.quantity &&
    form.from_location_id !== form.to_location_id;

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Transfer</div>
        <h1 className="page-title">ย้ายพื้นที่</h1>
        <p className="page-desc">ย้ายยางระหว่างพื้นที่เก็บ ตัดจากต้นทาง เพิ่มที่ปลายทางอัตโนมัติ</p>
      </div>

      <div className="card" style={{ maxWidth: 580 }}>
        <div className="card-head"><h2>บันทึกการย้าย</h2></div>
        <div className="card-body">
          {loadErr && (
            <div className="alert alert-err" style={{ marginBottom: 16 }}>
              โหลดข้อมูลไม่สำเร็จ: {loadErr}
            </div>
          )}
          {msg && (
            <div className={`alert ${msg.ok ? "alert-ok" : "alert-err"}`} style={{ marginBottom: 16 }}>
              {msg.text}
            </div>
          )}

          <form className="form-grid" onSubmit={submit}>
            <div className="field">
              <label>สินค้า</label>
              <select value={form.product_id} onChange={set("product_id")} required>
                <option value="">— เลือกสินค้า —</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.brand} {p.model} — {p.size}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>ล็อต (Lot No.)</label>
              <input value={form.lot_no} onChange={set("lot_no")} placeholder="เช่น 1326" required />
            </div>

            <div className="row-2">
              <div className="field">
                <label>จากพื้นที่</label>
                <select value={form.from_location_id} onChange={set("from_location_id")} required>
                  <option value="">— ต้นทาง —</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>ไปพื้นที่</label>
                <select value={form.to_location_id} onChange={set("to_location_id")} required>
                  <option value="">— ปลายทาง —</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {form.from_location_id && form.from_location_id === form.to_location_id && (
              <div className="alert alert-err">ต้นทางกับปลายทางต้องคนละที่</div>
            )}

            <div className="row-2">
              <div className="field">
                <label>จำนวน (เส้น)</label>
                <input type="number" min="1" value={form.quantity} onChange={set("quantity")} placeholder="0" required />
              </div>
              <div className="field">
                <label>วันที่</label>
                <input type="date" value={form.moved_on} onChange={set("moved_on")} required />
              </div>
            </div>

            <div className="field">
              <label>หมายเหตุ <span className="hint">(ไม่บังคับ)</span></label>
              <input value={form.note} onChange={set("note")} placeholder="—" />
            </div>

            <div>
              <button className="btn btn-primary" disabled={busy || !ready}>
                {busy ? "กำลังบันทึก…" : "บันทึกการย้าย"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
