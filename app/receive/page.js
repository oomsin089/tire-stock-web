import MovementForm from "@/components/MovementForm";

export default function ReceivePage() {
  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Stock In</div>
        <h1 className="page-title">รับเข้า</h1>
        <p className="page-desc">บันทึกยางที่รับเข้าคลัง เพิ่มของคงเหลือในพื้นที่ที่เลือก</p>
      </div>
      <MovementForm mode="in" />
    </>
  );
}
