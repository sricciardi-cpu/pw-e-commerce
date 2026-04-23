# Documentación de Prompts – Camisetas Zeus

---
### Prompt #1
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> I have a Next.js 14 project with App Router. Delete all the default content and build a rugby shirt ecommerce called "Scrum Store" from scratch with this exact structure:
>
> app/page.js - Home page
> app/quienes-somos/page.js - About us page
> app/catalogo/page.js - Product catalog with category filter
> app/contacto/page.js - Contact form with validation
> app/layout.js - Main layout with Navbar
> components/Navbar.js - Navigation menu
> data/productos.js - Mock product data
>
> Rules:
> - Simple code, no unnecessary complexity
> - Tailwind CSS for all styling
> - Spanish text throughout
> - Each file should be self-contained and easy to understand
> - Add a short comment above each important concept
>
> Start by creating only data/productos.js with 8 rugby shirts:
> {id, nombre, precio, categoria: "local"|"visitante"|"entrenamiento", descripcion, imagen, stock}
> Prices in Argentine pesos. For imagen use https://placehold.co/400x400?text=NombreCamiseta

---
### Prompt #2
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Create components/Navbar.js for Scrum Store. Requirements:
> - Semantic HTML: <nav> with <ul> and <li>
> - Links to: Inicio (/), Catálogo (/catalogo), Quiénes Somos (/quienes-somos), Contacto (/contacto)
> - Use Next.js Link component for navigation
> - Simple responsive design with Tailwind CSS
> - Store name "Scrum Store" on the left, links on the right
>
> Then update app/layout.js to:
> - Import and render Navbar on all pages
> - Keep the existing globals.css import
> - Simple clean layout

---
### Prompt #3
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Create app/page.js for Scrum Store home page. Requirements:
> - Hero section: title "Scrum Store", subtitle "Las mejores camisetas de rugby", button linking to /catalogo
> - Featured products section: show first 4 products from data/productos.js
> - Each product shown as a card with: image, name, price formatted as $XX.000, category badge, button linking to /catalogo
> - Semantic HTML: <main>, <section>, <h1>, <h2>
> - Tailwind CSS styling, keep it clean and simple
> - No "use client" needed, this is a server component

---
### Prompt #4
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> The product images are not loading. Replace all imagen URLs in data/productos.js
> to use this format instead: https://via.placeholder.com/400x400
>
> Also make sure next.config.mjs has via.placeholder.com added as an allowed image domain.

---
### Prompt #5
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Images are still not loading. Stop using next/image component entirely.
> Replace every <Image> from "next/image" with a regular HTML <img> tag in all files.
> No need for external domain config with <img> tags.

---
### Prompt #6
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Create app/quienes-somos/page.js for Scrum Store.
> Include:
> - A hero section with title "Quiénes Somos" and a short description about a rugby shirt store
> - A section with 3 values of the brand (passion, quality, community) each with an emoji, title and short text
> - A section with a brief history of the store
> Keep it simple, semantic HTML (main, section, h1, h2, p), styled with Tailwind CSS.
> No "use client" needed.

---
### Prompt #7
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Create app/catalogo/page.js for Scrum Store.
> Include:
> - Import all products from @/data/productos
> - Filter buttons: "Todas", "local", "visitante", "entrenamiento"
> - Filtering works with useState — no page reload
> - Show filtered products in a responsive grid
> - Each product card shows: name, price formatted in ARS, category badge, stock availability
> - Mark file as "use client" at the top
> - Use semantic HTML: main, section, h1, article
> - Style with Tailwind CSS
> Do not use next/image, use regular <img> tags instead.

---
### Prompt #8
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Create app/contacto/page.js for Scrum Store.
> Include:
> - A contact form with fields: nombre (text), email (email), mensaje (textarea)
> - Semantic HTML: <form>, <label> with htmlFor pointing to each input id
> - Accessibility: aria-describedby linking each input to its error message
> - Client-side validation with useState:
>   - nombre: cannot be empty
>   - email: must contain @ and .
>   - mensaje: minimum 20 characters
> - Show error messages below each field when validation fails
> - On successful submit: show a success message and reset the form
> - Mark as "use client" at the top
> - Style with Tailwind CSS
> Do not use any external libraries, only React and HTML.

---
### Prompt #9
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Update app/contacto/page.js.
> Above the contact form, add a section with 3 cards:
> - Instagram: icon (use emoji 📸), text "Seguinos en Instagram", link to https://instagram.com
> - WhatsApp: icon (use emoji 💬), text "Escribinos por WhatsApp", link to https://wa.me/5491100000000
> - Email: icon (use emoji 📧), text "Mandanos un mail", link to mailto:scrumstore@gmail.com
>
> Each card should:
> - Be a clickable <a> tag that opens in a new tab
> - Have a border, rounded corners, hover effect with Tailwind
> - Show the emoji large, the text below it
> - Be in a responsive 3-column grid
>
> Keep the existing form below, no other changes.

---
### Prompt #10
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Update data/productos.js with 12 shirts — mix of football and rugby.
> Each product must have:
> {
>   id, nombre, precio,
>   deporte: "futbol" | "rugby",
>   tipo: "nacion" | "club",
>   talle: ["S", "M", "L", "XL"],
>   descripcion,
>   imagen: use a regular URL string like "https://via.placeholder.com/400x400",
>   stock: number
> }
>
> Include a mix: 6 football (3 clubs, 3 nations) and 6 rugby (3 clubs, 3 nations).
> Prices between $35000 and $70000 ARS.
>
> Then update app/catalogo/page.js with these filters:
> - Deporte: "Todos", "Fútbol", "Rugby"
> - Tipo: "Todos", "Naciones", "Clubes"
> - Talle: "Todos", "S", "M", "L", "XL"
>
> Filters work independently with useState — all three can be active at the same time.
> Each product card shows: nombre, precio in ARS, deporte badge, tipo badge, available sizes as small pills.
> Keep "use client" at top. Semantic HTML, Tailwind CSS, regular <img> tags.

---
### Prompt #11
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Create app/catalogo/[id]/page.js — a dynamic product detail page.
>
> It should:
> - Get the product id from the URL params
> - Find the matching product from @/data/productos
> - Display: nombre, precio formatted in ARS, deporte badge, tipo badge,
>   descripcion, stock, and available sizes as selectable buttons
> - One size can be selected at a time using useState (selected size highlights in green)
> - "Consultar por WhatsApp" button that opens:
>   https://wa.me/5492216220145?text=Hola!%20Me%20interesa%20la%20camiseta%20[nombre]%20talle%20[talle]
> - Back button using Next.js Link to /catalogo
> - If product not found show "Producto no encontrado"
> - Use regular <img> tag, semantic HTML, Tailwind CSS
> - Mark as "use client" because of useState for size selection
>
> Add a short comment explaining what makes this a dynamic route in Next.js.

---
### Prompt #12
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Redesign the entire Scrum Store app and rename it to "Camisetas Zeus".
> Apply these changes across ALL files:
>
> COLORS & THEME:
> - Primary: black (#000000)
> - Accent: orange (#F97316 - Tailwind orange-500)
> - Background: white (#FFFFFF)
> - Text: dark gray for body, black for headings
> - Replace all green colors with black or orange
>
> NAVBAR (components/Navbar.js):
> - Black background
> - "Camisetas Zeus" in white bold on the left
> - Links in white with orange hover effect
> - Orange underline on active link
>
> HOME (app/page.js):
> - Hero: black background, "Camisetas Zeus" in white, orange accent on tagline
> - Subtitle: "Las mejores camisetas de fútbol y rugby de Argentina"
> - Button to /catalogo: orange background, black text
> - Featured products section with updated card style: black border, orange price, orange badge accents
>
> ABOUT PAGE (app/quienes-somos/page.js):
> - Replace all content with new text about Camisetas Zeus in La Plata
> - 3 values: 🏉 Pasión, ⚡ Calidad, 📦 Entrega rápida
> - Updated history section
>
> CATALOG, PRODUCT DETAIL, CONTACT: full black/orange redesign
>
> Keep all functionality exactly as is. Only change colors, text and branding.

---
### Prompt #13
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Make these changes to the entire app:
>
> 1. DELETE app/quienes-somos/page.js completely.
>
> 2. UPDATE components/Navbar.js:
> - Remove "Quiénes Somos" link
> - Add "Mystery Futbox" link to /mystery-futbox
> - Add "Griptec Spray" link to /griptec-spray
> - Add a cart icon (use emoji 🛒) on the right side showing item count (hardcode 0 for now)
> - Add a placeholder logo space on the left of "Camisetas Zeus" text (use a ⚡ emoji as temporary logo)
>
> 3. UPDATE app/page.js (Home):
> - Add a "Quiénes Somos" section at the bottom with brand text, 3 values with emojis
>
> 4. CREATE app/mystery-futbox/page.js:
> - Show: "Mystery Futbox" title, original price $69.980 with strikethrough, 27% OFF badge
> - Current price: $50.800 in orange
> - Size selector with useState: S, M, L, XL
> - "Consultar por WhatsApp" button
> - Mark as "use client", semantic HTML, Tailwind, black/orange theme
>
> 5. CREATE app/griptec-spray/page.js:
> - Title: "Griptec Spray 200ml"
> - 4 pack options selectable with useState with prices and discount badges
> - "Consultar por WhatsApp" button
> - Mark as "use client", semantic HTML, Tailwind, black/orange theme

---
### Prompt #14
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> In app/page.js move the "Quiénes Somos" section ABOVE the "Productos destacados" section. No other changes.

---
### Prompt #15
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Build a shopping cart system for Camisetas Zeus.
>
> 1. CREATE context/CartContext.js:
> - Store items as array of { id, nombre, talle, precio, cantidad }
> - Functions: agregarAlCarrito(item), quitarDelCarrito(id, talle), vaciarCarrito()
> - Calculate total price
> - Wrap app in CartProvider
>
> 2. UPDATE app/layout.js: Import and wrap everything with CartProvider
>
> 3. UPDATE components/Navbar.js: Show real cart item count, make 🛒 a Link to /carrito
>
> 4. UPDATE app/catalogo/[id]/page.js: Replace WhatsApp button with "Agregar al carrito", validation, confirmation message
>
> 5. UPDATE app/mystery-futbox/page.js: Same cart integration
>
> 6. UPDATE app/griptec-spray/page.js: Same cart integration
>
> 7. CREATE app/carrito/page.js:
> - List all cart items with remove buttons
> - Show total price in orange
> - "Vaciar carrito" button
> - "Consultar por WhatsApp" button building message with all items and total
> - Empty state with link back to /catalogo
> - Mark as "use client", black/orange theme, Tailwind CSS

---
### Prompt #16
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> 1. UPDATE app/contacto/page.js:
> - Remove the 3 social cards (Instagram, WhatsApp, Email) section completely
> - Keep only the contact form as is
>
> 2. CREATE components/Footer.js:
> - Black background, white text, orange accents
> - Left column: ⚡ "Camisetas Zeus" in bold, tagline "La Plata, Buenos Aires", WhatsApp link
> - Middle column: "Enlaces" with links to all pages
> - Right column: "Seguinos" with Instagram and WhatsApp links
> - Bottom bar: thin orange divider line, copyright "© 2026 Camisetas Zeus. Todos los derechos reservados." and "Sitio web desarrollado por AlphaSites"
>
> 3. UPDATE app/layout.js: Import Footer and add it at the bottom of every page

---
### Prompt #17
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Make these two changes only:
>
> 1. UPDATE components/Navbar.js:
> - Make the navbar taller: increase padding to py-5
> - Make the logo text and links slightly bigger
>
> 2. UPDATE app/page.js - Hero section only:
> - Make the hero section full width, no rounded corners, no max-width container limiting it
> - It should go completely edge to edge (full bleed)
> - Keep min-height: make it taller, around min-h-[500px]
> - Center content vertically and horizontally
> - Keep all existing text and button as is
> - Add a comment: "// Background ready for image or video"

---
### Prompt #18
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> In app/layout.js, the <main> tag has padding and a max-width container limiting the width.
> Fix it so the hero on the home page can go full width edge to edge.
>
> Move the max-width container INSIDE each page instead of in layout.js.
> The layout.js main tag should have NO padding and NO max-width.
>
> Then in app/page.js:
> - Hero section: remove any container constraints, make it w-full, no margin, no padding on sides
> - It should touch the navbar directly on top and go full width left to right
> - Keep min-h-[500px] and centered content
>
> Then wrap only the non-hero content (quienes somos, productos destacados) in a div with max-w-5xl mx-auto px-4.
>
> Do the same padding fix for all other pages so they still look contained:
> app/catalogo/page.js, app/contacto/page.js, app/mystery-futbox/page.js,
> app/griptec-spray/page.js, app/catalogo/[id]/page.js, app/carrito/page.js
> Wrap their content in: <main className="max-w-5xl mx-auto px-4 py-8">

---
### Prompt #19
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> In components/Navbar.js add sticky positioning so it stays fixed at the top when scrolling.
> Add these classes to the main <nav> element: sticky top-0 z-50
> No other changes.

---
### Prompt #20
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Create app/guia-de-talles/page.js with this content:
>
> Title: "Guía de Talles"
> Black/orange theme, semantic HTML with <table> tags, Tailwind CSS.
>
> Three sections:
> 1. "Camisetas de Fútbol – Versión Jugador" — table with Talle, Pecho (cm), Largo (cm) — S through XXL
> 2. "Camisetas de Fútbol – Versión Hincha" — same columns — S through 4XL
> 3. "Camisetas de Rugby" — table with Talle, Ancho hombros, Ancho pecho, Largo, Manga — S through 5XL
>
> Also add "Guía de Talles" link in components/Navbar.js and components/Footer.js

---
### Prompt #21
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Update components/Navbar.js layout only:
> - Push "Camisetas Zeus" logo and text to the far left using justify-between on the nav
> - Push all navigation links and cart icon to the far right
> - Add more horizontal padding px-8 so everything breathes
> - No other changes

---
### Prompt #22
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> In components/Navbar.js change the inner container from max-w-5xl to max-w-full and increase horizontal padding to px-8.
> No other changes.

---
### Prompt #23
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Create a file called PROMPTS.md in the root of this project.
>
> Add every prompt that was used in this session so far, in order, with this structure:
> # Documentación de Prompts – Camisetas Zeus
> ### Prompt #[N]
> **Fecha y hora:** 22/04/2026
> **Prompt usado:**
> > [prompt text here]
>
> Include all prompts from this session in order (1 through 22).
> From now on, every time I give you a new prompt, automatically add it as a new entry at the bottom of PROMPTS.md with the current date and time.

---
### Prompt #24
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Update app/catalogo/[id]/page.js completely. Change the layout to:
>
> LEFT SIDE (40% width):
> - Large main product image taking full width of the left column
> - Below the main image: 2 small thumbnail images side by side
>   Use these as second image: https://via.placeholder.com/400x400?text=Vista+Trasera
>   When clicking a thumbnail, the main image updates to show that image (useState)
>   Selected thumbnail has an orange border
>
> RIGHT SIDE (60% width):
> - NO card/border wrapping, just clean content on white background
> - Badges (deporte, tipo) at top
> - Product name as h1
> - Price in orange
> - Description
> - Stock
> - Size selector buttons
> - "Agregar al carrito" button
> - Add a small link below the button: "Ver guía de talles →" linking to /guia-de-talles
>
> Layout: side by side on desktop (flex-row), stacked on mobile (flex-col)
> No rounded card wrapper around the whole thing.
> Mark as "use client". Tailwind CSS, black/orange theme.

---
### Prompt #25
**Fecha y hora:** 22/04/2026
**Prompt usado:**
> Create a file called vercel.json in the root of the project with this content:
> {
>   "framework": "nextjs"
> }

---
### Prompt #26
**Fecha y hora:** 23/04/2026
**Prompt usado:**
> Make these changes:
>
> 1. UPDATE data/productos.js:
> - Add a field liquidacion: true to all futbol products
> - Rugby products keep liquidacion: false
>
> 2. UPDATE app/catalogo/page.js:
> - Filter to show ONLY rugby products (deporte === "rugby")
> - Remove stock display from product cards completely
> - Update title to "Catálogo Rugby"
> - Keep all other filters (tipo, talle) working
>
> 3. CREATE app/sale/page.js:
> - Show only products where liquidacion === true (futbol products)
> - Title: "Sale 🔥" with subtitle "Últimas unidades disponibles"
> - Add a orange "SALE" badge on each card
> - Remove stock display from cards
> - Same card style as catalogo, with "Ver detalle" button
> - No filters needed, show all sale products in a grid
> - Mark as "use client", Tailwind CSS, black/orange theme
>
> 4. UPDATE components/Navbar.js:
> - Add "Sale 🔥" link to /sale between "Catálogo" and "Mystery Futbox"
>
> 5. UPDATE components/Footer.js:
> - Add "Sale" link to the links column

---
### Prompt #27
**Fecha y hora:** 23/04/2026
**Prompt usado:**
> [Duplicate of Prompt #26 — all changes were already applied. Navbar "Sale 🔥" emoji was removed by external edit, label is currently "Sale".]

---
### Prompt #28
**Fecha y hora:** 23/04/2026
**Prompt usado:**
> Update components/Navbar.js with these two changes:
>
> 1. Make navbar taller: change padding to py-6 on the nav element
> Make all text bigger: logo text-2xl font-bold, links text-lg
>
> 2. Import usePathname from "next/navigation" at the top
> Add "use client" at the top of the file
> For each Link, compare href with pathname:
> - If it matches: add className text-orange-500 font-semibold
> - If it does not match: add className text-white hover:text-orange-400
>
> The cart icon 🛒 stays on the right, no active state needed for it.

---
