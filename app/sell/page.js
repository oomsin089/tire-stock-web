import MovementForm from "@/components/MovementForm";

export default function SellPage() {
  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Stock Out</div>
        <h1 className="page-title">ขายออก</h1>
        <p className="page-desc">ตัดยางออกจากคลัง ระบบกันไม่ให้ตัดเกินของที่มี</p>
      </div>
      <MovementForm mode="out" />
    </>
  );
}
