import ProductoPanel from "../_components/ProductoPanel";

const TALLES_KIDS = ["16", "18", "20", "22", "24", "26"];

export default function AdminKidsPage() {
  return (
    <ProductoPanel
      tabla="catalogo"
      titulo="Niños (por encargo)"
      seccion="kids"
      talles={TALLES_KIDS}
    />
  );
}
