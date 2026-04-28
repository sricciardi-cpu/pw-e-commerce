// Productos físicamente disponibles en stock — editá este archivo para agregar/quitar productos
const productosStock = [
  {
    id: "s1",
    nombre: "Escocia Alternativa",
    precio: 70000,
    categoria: "alternativa",
    tipo: "nacion",
    talle: ["M", "L", "XL"],
    descripcion: "Camiseta alternativa de Escocia con diseño oscuro y el cardo nacional bordado en el pecho.",
    imagen: "/Escocia_alt_frente.png",
    imagenEspalda: "/Escocia_alt_espalda.png",
    stock: 3,
  },
  {
    id: "s2",
    nombre: "FijianDrua Training",
    precio: 70000,
    categoria: "training",
    tipo: "club",
    talle: ["S", "M", "L"],
    descripcion: "Camiseta de training de los Fijian Drua, liviana y transpirable para el máximo rendimiento en cancha.",
    imagen: "/FijianDrua_training_frente.png",
    imagenEspalda: "/FijianDrua_training_espalda.png",
    stock: 4,
  },
  {
    id: "s3",
    nombre: "Francia Local",
    precio: 70000,
    categoria: "local",
    tipo: "nacion",
    talle: ["L", "XL", "2XL"],
    descripcion: "Camiseta local del XV de France, el azul profundo que marca cada conquista del seleccionado galo.",
    imagen: "/Francia_frente.png",
    imagenEspalda: "/francia_espalda.png",
    stock: 2,
  },
];

export default productosStock;
