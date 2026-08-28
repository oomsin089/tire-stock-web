"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const today = () => new Date().toISOString().slice(0, 10);

// mode = "in" (รับเข้า) หรือ "out" (ขายออก)
export default function MovementForm({ mode }) {
  const isIn = mode === "in";
  const endpoint = isIn ? "/movements/stock-in" : "/movements/stock-out";
  const verb = isIn ? "รับเข้า" : "ขายออก";

  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadErr, setLoadErr] = useState("");

  const [form, setForm] = useState({
    moved_on: today(),
    product_id: "",
    lot_no: "",
    location_id: "",
    quantity: "",
    unit_price: "",
    note: "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null); // {ok:boolean, text:string}

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
      const payload = {
        moved_on: form.moved_on,
        product_id: Number(form.product_id),
        lot_no: form.lot_no.trim(),
        location_id: Number(form.location_id),
        quantity: Number(form.quantity),
        note: form.note.trim() || null,
      };
      if (form.unit_price !== "") payload.unit_price = Number(form.unit_price);

      await api(endpoint, { method: "POST", body: JSON.stringify(payload) });
      setMsg({ ok: true, text: `บันทึก${verb} ${payload.quantity} เส้นเรียบร้อย` });
      // ล้างเฉพาะช่องที่มักเปลี่ยนทุกครั้ง
      setForm((f) => ({ ...f, lot_no: "", quantity: "", unit_price: "", note: "" }));
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  }

  const ready =
    form.product_id && form.lot_no && form.location_id && form.quantity;

  return (
    <div className="card" style={{ maxWidth: 580 }}>
      <div className="card-head">
        <h2>บันทึก{verb}</h2>
      </div>
      <div className="card-body">
        {loadErr && (
          <div className="alert alert-err" style={{ marginBottom: 16 }}>
            โหลดสินค้า/พื้นที่ไม่สำเร็จ: {loadErr}
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
                <option key={p.id} value={p.id}>
                  {p.brand} {p.model} — {p.size}
                </option>
              ))}
            </select>
          </div>

          <div className="row-2">
            <div className="field">
              <label>ล็อต (Lot No.)</label>
              <input value={form.lot_no} onChange={set("lot_no")} placeholder="เช่น 1326" required />
            </div>
            <div className="field">
              <label>พื้นที่เก็บ</label>
              <select value={form.location_id} onChange={set("location_id")} required>
                <option value="">— เลือกพื้นที่ —</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="row-2">
            <div className="field">
              <label>จำนวน (เส้น)</label>
              <input
                type="number" min="1" value={form.quantity}
                onChange={set("quantity")} placeholder="0" required
              />
            </div>
            <div className="field">
              <label>ราคา/หน่วย <span className="hint">(ไม่บังคับ)</span></label>
              <input
                type="number" min="0" value={form.unit_price}
                onChange={set("unit_price")} placeholder="บาท"
              />
            </div>
          </div>

          <div className="row-2">
            <div className="field">
              <label>วันที่</label>
              <input type="date" value={form.moved_on} onChange={set("moved_on")} required />
            </div>
            <div className="field">
              <label>หมายเหตุ <span className="hint">(ไม่บังคับ)</span></label>
              <input value={form.note} onChange={set("note")} placeholder="—" />
            </div>
          </div>

          <div>
            <button className="btn btn-primary" disabled={busy || !ready}>
              {busy ? "กำลังบันทึก…" : `บันทึก${verb}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
