/* ============================================================
   NetKids — App de alfabetización en redes e IoT (3.º-6.º EP)
   CEIP Fregacedos · Vanilla JS, sin dependencias, 100% offline
   ============================================================ */

const STORAGE_KEY = "netkids_state_v1";
const COURSES = [3, 4, 5, 6];
const AVATARS = ["🦊", "🐧", "🐙", "🦖", "🐝", "🦉", "🐺", "🐬", "🦄", "🐢", "🐱", "🐼"];

const DEVICE_LIB = {
  pc:        { icon: "💻", label: "Portátil" },
  tablet:    { icon: "📱", label: "Tablet" },
  printer:   { icon: "🖨️", label: "Impresora" },
  router:    { icon: "📶", label: "Router" },
  switchd:   { icon: "🔀", label: "Switch" },
  phone:     { icon: "📱", label: "Móvil" },
  tv:        { icon: "📺", label: "Smart TV" },
  speaker:   { icon: "🔊", label: "Altavoz" },
  headset:   { icon: "🎧", label: "Auriculares" },
  camera:    { icon: "📷", label: "Cámara IP" },
  server:    { icon: "🗄️", label: "Servidor" },
  keyboard:  { icon: "⌨️", label: "Teclado" },
};

/* ============================================================
   ICONOS VECTORIALES DE EQUIPOS (estilo Cisco Packet Tracer)
   Glifos planos reconocibles con el lenguaje visual de Cisco:
   routers azules con flechas de tráfico, switches grises, torres
   de servidor, monitores, etc. Se usan en el simulador (sandbox).
   ============================================================ */
const DEVICE_SVG = {
  router: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="50" rx="25" ry="7" fill="#0f1d38"/>
    <rect x="7" y="22" width="50" height="26" rx="4" fill="#27406f" stroke="#16223f" stroke-width="2"/>
    <ellipse cx="32" cy="22" rx="25" ry="7" fill="#365a9c" stroke="#16223f" stroke-width="2"/>
    <g stroke="#dbe9ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <line x1="18" y1="32" x2="46" y2="32"/><polyline points="41,27 46,32 41,37"/><polyline points="23,27 18,32 23,37"/>
      <line x1="32" y1="40" x2="46" y2="40"/><polyline points="42,37 46,40 42,43"/>
      <line x1="32" y1="40" x2="18" y2="40"/><polyline points="22,37 18,40 22,43"/>
    </g>
  </svg>`,
  switchd: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="20" width="52" height="26" rx="5" fill="#5b6b85" stroke="#33405a" stroke-width="2"/>
    <rect x="6" y="40" width="52" height="6" rx="3" fill="#46556f"/>
    <g stroke="#eef3fb" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <line x1="16" y1="28" x2="46" y2="28"/><polyline points="41,24.5 46,28 41,31.5"/>
      <line x1="48" y1="35" x2="18" y2="35"/><polyline points="23,31.5 18,35 23,38.5"/>
    </g>
  </svg>`,
  server: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="6" width="28" height="52" rx="4" fill="#3a4a66" stroke="#1f2a40" stroke-width="2"/>
    <g fill="#9fb3d4"><rect x="23" y="13" width="18" height="3.4" rx="1.7"/><rect x="23" y="20" width="18" height="3.4" rx="1.7"/></g>
    <circle cx="32" cy="36" r="6.5" fill="#1f2a40"/><circle cx="32" cy="36" r="2.6" fill="#9fb3d4"/>
    <circle cx="26" cy="50" r="2.2" fill="#22c55e"/><circle cx="32" cy="50" r="2.2" fill="#f59e0b"/>
  </svg>`,
  pc: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="48" height="32" rx="3" fill="#2a3346" stroke="#161c28" stroke-width="2"/>
    <rect x="12" y="16" width="40" height="24" rx="2" fill="#7fd1ff"/>
    <rect x="26" y="44" width="12" height="6" fill="#2a3346"/>
    <rect x="18" y="50" width="28" height="4" rx="2" fill="#2a3346"/>
  </svg>`,
  tablet: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="16" y="8" width="32" height="48" rx="5" fill="#2a3346" stroke="#161c28" stroke-width="2"/>
    <rect x="20" y="13" width="24" height="36" rx="2" fill="#7fd1ff"/>
    <circle cx="32" cy="52.5" r="1.8" fill="#7f8da3"/>
  </svg>`,
  phone: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="6" width="24" height="52" rx="5" fill="#2a3346" stroke="#161c28" stroke-width="2"/>
    <rect x="23.5" y="12" width="17" height="38" rx="1.5" fill="#7fd1ff"/>
    <circle cx="32" cy="54" r="1.6" fill="#7f8da3"/>
  </svg>`,
  printer: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="10" width="36" height="14" rx="2" fill="#cdd6e4"/>
    <rect x="10" y="24" width="44" height="20" rx="3" fill="#5b6b85" stroke="#33405a" stroke-width="2"/>
    <rect x="18" y="40" width="28" height="14" fill="#fff" stroke="#5b6b85" stroke-width="2"/>
    <circle cx="46" cy="32" r="2.4" fill="#22c55e"/>
  </svg>`,
  tv: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="12" width="52" height="34" rx="3" fill="#2a3346" stroke="#161c28" stroke-width="2"/>
    <rect x="10" y="16" width="44" height="26" rx="2" fill="#7fd1ff"/>
    <rect x="28" y="46" width="8" height="6" fill="#2a3346"/>
    <rect x="24" y="52" width="16" height="4" rx="2" fill="#2a3346"/>
  </svg>`,
  speaker: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="6" width="28" height="52" rx="5" fill="#3a4a66" stroke="#1f2a40" stroke-width="2"/>
    <circle cx="32" cy="22" r="7" fill="#1f2a40"/><circle cx="32" cy="22" r="3" fill="#9fb3d4"/>
    <circle cx="32" cy="42" r="10" fill="#1f2a40"/><circle cx="32" cy="42" r="4.5" fill="#9fb3d4"/>
  </svg>`,
  camera: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="20" width="34" height="20" rx="6" fill="#5b6b85" stroke="#33405a" stroke-width="2"/>
    <circle cx="22" cy="30" r="7" fill="#1f2a40"/><circle cx="22" cy="30" r="3" fill="#7fd1ff"/>
    <rect x="44" y="26" width="9" height="8" rx="1" fill="#5b6b85"/>
    <rect x="30" y="40" width="4" height="9" fill="#33405a"/>
    <rect x="22" y="49" width="20" height="4" rx="2" fill="#33405a"/>
  </svg>`,
};

/* ============================================================
   MOTOR DE TOPOLOGÍA: puertos reales + cables (estilo Packet Tracer)
   ============================================================ */
const DEVICE_PORTS = {
  pc:       [{ id: "eth",  type: "rj45",   label: "Ethernet (RJ45)" }, { id: "usb", type: "usb-a", label: "USB-A" }, { id: "hdmi", type: "hdmi", label: "HDMI" }, { id: "wifi", type: "wifi", label: "WiFi" }],
  tablet:   [{ id: "wifi", type: "wifi",   label: "WiFi" }, { id: "bt", type: "bluetooth", label: "Bluetooth" }, { id: "usbc", type: "usb-c", label: "USB-C" }],
  printer:  [{ id: "usb",  type: "usb-a",  label: "USB-A" }, { id: "eth", type: "rj45", label: "Ethernet (RJ45)" }],
  router:   [{ id: "wan",  type: "rj45",   label: "WAN (RJ45)" }, { id: "lan1", type: "rj45", label: "LAN1 (RJ45)" }, { id: "lan2", type: "rj45", label: "LAN2 (RJ45)" }, { id: "wifi", type: "wifi", label: "WiFi" }],
  switchd:  [{ id: "p1",   type: "rj45",   label: "Puerto 1 (RJ45)" }, { id: "p2", type: "rj45", label: "Puerto 2 (RJ45)" }, { id: "p3", type: "rj45", label: "Puerto 3 (RJ45)" }, { id: "p4", type: "rj45", label: "Puerto 4 (RJ45)" }],
  phone:    [{ id: "wifi", type: "wifi",   label: "WiFi" }, { id: "bt", type: "bluetooth", label: "Bluetooth" }, { id: "usbc", type: "usb-c", label: "USB-C" }],
  tv:       [{ id: "hdmi", type: "hdmi",   label: "HDMI" }, { id: "wifi", type: "wifi", label: "WiFi" }],
  speaker:  [{ id: "bt",   type: "bluetooth", label: "Bluetooth" }, { id: "usb", type: "usb-a", label: "USB-A" }],
  headset:  [{ id: "bt",   type: "bluetooth", label: "Bluetooth" }],
  camera:   [{ id: "eth",  type: "rj45",   label: "Ethernet (RJ45)" }, { id: "wifi", type: "wifi", label: "WiFi" }],
  server:   [{ id: "eth1", type: "rj45",   label: "Puerto 1 (RJ45)" }, { id: "eth2", type: "rj45", label: "Puerto 2 (RJ45)" }],
  keyboard: [{ id: "usb",  type: "usb-a",  label: "USB-A" }, { id: "bt", type: "bluetooth", label: "Bluetooth" }],
};

const CABLE_DEFS = {
  rj45:      { label: "Cable de red (RJ45)", icon: "🔌", color: "#06b6d4", category: "cable",    matches: t => t === "rj45",
               swatchType: "rj45",  desc: "Conector ancho con muescas. Para internet por cable: ordenadores, switches y routers." },
  usb:       { label: "Cable USB",           icon: "🔲", color: "#a78bfa", category: "cable",    matches: t => t === "usb-a" || t === "usb-c",
               swatchType: "usb-a", desc: "Rectangular (USB-A) u ovalado (USB-C). Para teclados, impresoras o cargar dispositivos." },
  hdmi:      { label: "Cable HDMI",          icon: "📺", color: "#f59e0b", category: "cable",    matches: t => t === "hdmi",
               swatchType: "hdmi",  desc: "Conector trapezoidal azul. Para enviar imagen y sonido a una pantalla o Smart TV." },
  wifi:      { label: "WiFi",                icon: "📶", color: "#22c55e", category: "wireless", matches: t => t === "wifi",
               swatchType: "wifi",  desc: "Sin cable: conexión inalámbrica a internet por ondas de radio." },
  bluetooth: { label: "Bluetooth",           icon: "🦷", color: "#6366f1", category: "wireless", matches: t => t === "bluetooth",
               swatchType: "bluetooth", desc: "Sin cable: conexión inalámbrica de corto alcance entre aparatos cercanos." },
};
const SIMPLE_TOOLS = [
  { key: "cable",    label: "Cable",         icon: "🔌", color: "#06b6d4", swatchType: "rj45", desc: "Cualquier cable físico que une dos aparatos." },
  { key: "wireless", label: "Inalámbrico",   icon: "📶", color: "#22c55e", swatchType: "wifi", desc: "Conexión sin cables: WiFi o Bluetooth." },
];

const PORT_ICON = { rj45: "🔌", "usb-a": "🔲", "usb-c": "🔳", hdmi: "📺", wifi: "📶", bluetooth: "🦷" };

/* Iconos reales de conector, dibujados a escala para que se reconozcan en un dispositivo de verdad:
   RJ45 con sus 8 pines dorados y la pestaña del clip, USB-A/USB-C con su silueta exacta, HDMI trapezoidal,
   y los logotipos ESTÁNDAR de WiFi y Bluetooth (los mismos que aparecen en routers, móviles y cajas reales). */
const PORT_SVG = {
  "rj45": `<svg viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet">
    <rect x="6" y="14" width="36" height="28" rx="2" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
    <rect x="18" y="6" width="12" height="9" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
    <rect x="11" y="20" width="26" height="16" fill="#0f172a"/>
    <g fill="#facc15">
      <rect x="13" y="22" width="2.4" height="12"/><rect x="16.3" y="22" width="2.4" height="12"/>
      <rect x="19.6" y="22" width="2.4" height="12"/><rect x="22.9" y="22" width="2.4" height="12"/>
      <rect x="26.2" y="22" width="2.4" height="12"/><rect x="29.5" y="22" width="2.4" height="12"/>
      <rect x="32.8" y="22" width="2.4" height="12"/><rect x="36.1" y="22" width="2.4" height="12"/>
    </g>
  </svg>`,
  "usb-a": `<svg viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet">
    <rect x="4" y="16" width="40" height="18" rx="2" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
    <rect x="9" y="20.5" width="30" height="9" fill="#0f172a"/>
  </svg>`,
  "usb-c": `<svg viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet">
    <rect x="8" y="16" width="32" height="16" rx="8" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
    <rect x="13" y="20" width="22" height="8" rx="4" fill="#0f172a"/>
  </svg>`,
  "hdmi": `<svg viewBox="0 0 48 48" preserveAspectRatio="xMidYMid meet">
    <polygon points="8,10 40,10 36,32 14,32 8,24" fill="#1e293b" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round"/>
    <rect x="13" y="15" width="24" height="13" rx="1" fill="#0f172a"/>
    <g fill="#cbd5e1">
      <rect x="15" y="17" width="1.8" height="4"/><rect x="18.4" y="17" width="1.8" height="4"/>
      <rect x="21.8" y="17" width="1.8" height="4"/><rect x="25.2" y="17" width="1.8" height="4"/>
      <rect x="28.6" y="17" width="1.8" height="4"/><rect x="32" y="17" width="1.8" height="4"/>
      <rect x="16.7" y="22.5" width="1.8" height="4"/><rect x="20.1" y="22.5" width="1.8" height="4"/>
      <rect x="23.5" y="22.5" width="1.8" height="4"/><rect x="26.9" y="22.5" width="1.8" height="4"/>
      <rect x="30.3" y="22.5" width="1.8" height="4"/>
    </g>
  </svg>`,
  /* logo estándar de WiFi (igual que en routers, móviles y barras de estado) */
  "wifi": `<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" fill="#22c55e">
    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
  </svg>`,
  /* logotipo estándar de Bluetooth (la runa azul oficial) */
  "bluetooth": `<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" fill="#60a5fa">
    <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>
  </svg>`,
};

function portGroup(type) {
  if (type === "wifi") return "wifi";
  if (type === "bluetooth") return "bluetooth";
  return "cable";
}
function groupsForPorts(ports) {
  const order = ["cable", "wifi", "bluetooth"];
  const present = new Set(ports.map(p => portGroup(p.type)));
  return order.filter(g => present.has(g));
}
const GROUP_META = {
  cable:     { label: "Cable",     icon: "🔌" },
  wifi:      { label: "WiFi",      icon: "📶" },
  bluetooth: { label: "Bluetooth", icon: "🦷" },
};

function isSimpleMode() {
  return !state.course || state.course <= 4;
}
function getPorts(devKey) {
  return DEVICE_PORTS[devKey] || [];
}
function categoryOf(type) {
  return (type === "wifi" || type === "bluetooth") ? "wireless" : "cable";
}
function simplifyPorts(devKey) {
  const real = getPorts(devKey);
  const out = [];
  const cableRef = real.find(p => categoryOf(p.type) === "cable");
  const wirelessRef = real.find(p => categoryOf(p.type) === "wireless");
  if (cableRef) out.push({ id: "cable", type: cableRef.type, label: "Cable" });
  if (wirelessRef) out.push({ id: "wireless", type: wirelessRef.type, label: "Inalámbrico" });
  return out;
}
function portsForDisplay(devKey) {
  return isSimpleMode() ? simplifyPorts(devKey) : getPorts(devKey);
}
function canConnect(typeA, typeB, tool) {
  if (tool === "cable" || tool === "wireless") {
    return categoryOf(typeA) === tool && categoryOf(typeB) === tool;
  }
  const def = CABLE_DEFS[tool];
  return !!def && def.matches(typeA) && def.matches(typeB);
}
function isWirelessTool(tool) {
  if (CABLE_DEFS[tool]) return CABLE_DEFS[tool].category === "wireless";
  return tool === "wireless";
}
function colorForTool(tool) {
  if (CABLE_DEFS[tool]) return CABLE_DEFS[tool].color;
  if (tool === "cable") return "#06b6d4";
  if (tool === "wireless") return "#22c55e";
  return "#94a3b8";
}
function mismatchMessage(typeA, typeB, tool) {
  if (tool === "cable" || tool === "wireless") {
    return "Ese dispositivo no tiene ese tipo de conexión por ahí ❌";
  }
  const def = CABLE_DEFS[tool];
  return `❌ El ${def ? def.label : "cable"} no es compatible con ese puerto. Mira bien el tipo de conector.`;
}
function renderCableToolbar(containerEl, onSelect, legendEl) {
  containerEl.innerHTML = "";
  const tools = isSimpleMode()
    ? SIMPLE_TOOLS
    : Object.entries(CABLE_DEFS).map(([k, d]) => ({ key: k, label: d.label, icon: d.icon, color: d.color, swatchType: d.swatchType, desc: d.desc }));
  tools.forEach(t => {
    const b = document.createElement("button");
    b.className = "cable-tool";
    b.dataset.key = t.key;
    const swatch = document.createElement("span");
    swatch.className = "port-dot tool-plug";
    swatch.dataset.type = t.swatchType;
    swatch.setAttribute("aria-hidden", "true");
    swatch.innerHTML = PORT_SVG[t.swatchType] || "";
    const labelSpan = document.createElement("span");
    labelSpan.textContent = `${t.icon} ${t.label}`;
    b.appendChild(swatch);
    b.appendChild(labelSpan);
    b.onclick = () => {
      containerEl.querySelectorAll(".cable-tool").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      if (legendEl) legendEl.querySelectorAll(".legend-row").forEach(r => r.classList.toggle("active", r.dataset.key === t.key));
      onSelect(t.key);
    };
    containerEl.appendChild(b);
  });
  if (legendEl) renderCableLegend(legendEl, tools);
}
function renderCableLegend(legendEl, tools) {
  legendEl.innerHTML = `<div class="legend-title">🔎 Identifica cada conexión</div>`;
  tools.forEach(t => {
    const row = document.createElement("div");
    row.className = "legend-row";
    row.dataset.key = t.key;
    const swatch = document.createElement("span");
    swatch.className = "port-dot tool-plug";
    swatch.dataset.type = t.swatchType;
    swatch.setAttribute("aria-hidden", "true");
    swatch.innerHTML = PORT_SVG[t.swatchType] || "";
    const text = document.createElement("span");
    text.className = "legend-text";
    text.innerHTML = `<b>${t.icon} ${t.label}</b><br>${t.desc}`;
    row.appendChild(swatch);
    row.appendChild(text);
    legendEl.appendChild(row);
  });
}
function makePortDot(ownerId, port, onClick) {
  const dot = document.createElement("div");
  dot.className = "port-dot";
  dot.dataset.port = port.id;
  dot.dataset.type = port.type;
  dot.dataset.node = ownerId;
  dot.dataset.group = portGroup(port.type);
  dot.innerHTML = `${PORT_SVG[port.type] || ""}<span class="port-tooltip">${port.label}</span>`;
  dot.addEventListener("click", () => onClick(ownerId, port.id, port.type, dot));
  return dot;
}

/* ---------------- ESTADO ---------------- */
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { course: null, avatar: null, name: "", progress: {}, sandboxDesigns: [] };
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------------- TOAST ---------------- */
let toastTimer = null;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------------- NAVEGACIÓN ---------------- */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

/* ============================================================
   DATOS DE MÓDULOS Y MISIONES
   ============================================================ */
const MODULES = [
  {
    id: 1, key: "mod-1", icon: "🔌", title: "Conectar dispositivos",
    desc: "Aprende a conectar dispositivos reales a la red: cable, WiFi, USB y Bluetooth.",
    css: "mod-1",
  },
  {
    id: 2, key: "mod-2", icon: "📦", title: "Así viajan los datos",
    desc: "Descubre cómo se divide la información en paquetes y viaja por la red. Incluye un reto de cifrado.",
    css: "mod-2",
  },
  {
    id: 3, key: "mod-3", icon: "🔍", title: "Redes y diagnóstico",
    desc: "Conviértete en técnico de red: detecta fallos y decide qué arreglar primero.",
    css: "mod-3",
  },
  {
    id: 4, key: "mod-4", icon: "🔒", title: "Ciberseguridad básica",
    desc: "Contraseñas seguras, phishing y privacidad: decisiones reales, sin penalización.",
    css: "mod-4",
  },
];

/* Cada misión define build(course) -> config usado por su motor de juego */
const MISSIONS = [
  // ---------- MÓDULO 1 ----------
  {
    id: "m1-1", module: 1, icon: "🔌", title: "Conecta los dispositivos",
    short: "Arrastra cada aparato a su tipo de conexión",
    engine: "connect",
    build(course) {
      const sets = {
        3: {
          nodes: [{ id: "A", key: "pc" }, { id: "B", key: "router" }, { id: "C", key: "headset" }, { id: "D", key: "tablet" }],
          objectives: [{ a: "A", b: "B" }, { a: "C", b: "D" }],
          intro: "Elige arriba el tipo de conexión (Cable o Inalámbrico) y pulsa los puntos de conexión de cada aparato para unirlos.",
        },
        4: {
          nodes: [{ id: "A", key: "pc" }, { id: "B", key: "router" }, { id: "C", key: "printer" }, { id: "D", key: "tablet" }],
          objectives: [{ a: "A", b: "B" }, { a: "C", b: "B" }, { a: "D", b: "B" }],
          intro: "Conecta cada aparato al router con el tipo de conexión adecuado: cable o inalámbrico.",
        },
        5: {
          nodes: [{ id: "A", key: "pc" }, { id: "B", key: "switchd" }, { id: "C", key: "router" }, { id: "D", key: "tv" }, { id: "E", key: "phone" }, { id: "F", key: "speaker" }],
          objectives: [{ a: "A", b: "B" }, { a: "B", b: "C" }, { a: "D", b: "A" }, { a: "E", b: "C" }],
          intro: "Ahora eliges el cable exacto: RJ45, USB, HDMI o una conexión inalámbrica (WiFi/Bluetooth). Fíjate en el tipo de puerto de cada aparato. Ojo: hay un aparato de más que no aparece en los retos.",
        },
        6: {
          nodes: [{ id: "A", key: "pc" }, { id: "B", key: "switchd" }, { id: "C", key: "router" }, { id: "D", key: "server" }, { id: "E", key: "camera" }, { id: "F", key: "phone" }, { id: "G", key: "tv" }, { id: "H", key: "headset" }, { id: "I", key: "printer" }],
          objectives: [{ a: "A", b: "B" }, { a: "B", b: "C" }, { a: "B", b: "D" }, { a: "E", b: "C" }, { a: "F", b: "C" }, { a: "G", b: "A" }],
          intro: "Monta una pequeña red de centro: switch, router, servidor, cámara IP, móvil y proyector. Elige siempre el cable o la conexión correcta. Hay dos aparatos de más: solo conecta lo que pide la lista de retos.",
        },
      };
      return sets[course];
    },
  },
  {
    id: "m1-2", module: 1, icon: "🛠️", title: "¿Por qué no está en red?",
    short: "Diagnostica el problema de conexión",
    engine: "quiz",
    build(course) {
      const scenarios = {
        3: { text: "La impresora del aula del futuro no imprime. La pantalla dice «sin conexión».", options: [
          { t: "El cable USB está desconectado", correct: true, fb: "¡Exacto! Sin cable no hay señal. Revisa siempre las conexiones físicas primero." },
          { t: "La impresora necesita más tinta", correct: false, fb: "La tinta no afecta a si está «en red» o no. Eso es un problema distinto." },
          { t: "Hay que reiniciar el cole entero", correct: false, fb: "No hace falta una solución tan drástica para un cable suelto." },
        ]},
        4: { text: "El portátil del profe se conecta al router pero la tablet no detecta el WiFi.", options: [
          { t: "El WiFi del router está apagado o la tablet está en modo avión", correct: true, fb: "¡Bien! Revisa primero lo más simple: ¿está el WiFi encendido en ambos lados?" },
          { t: "El router necesita un cable USB", correct: false, fb: "Los routers no usan cable USB para repartir WiFi." },
          { t: "Hay que comprar otra tablet", correct: false, fb: "Antes de cambiar el dispositivo, comprueba la configuración." },
        ]},
        5: { text: "Tres ordenadores del aula no llegan al servidor del cole, pero sí entre ellos.", options: [
          { t: "El switch que los conecta al router/servidor puede estar desconectado", correct: true, fb: "¡Correcto! Si se ven entre ellos pero no al servidor, el problema está más arriba: switch o router." },
          { t: "Los tres ordenadores están estropeados a la vez", correct: false, fb: "Es muy improbable que fallen 3 a la vez del mismo modo; busca el punto común." },
          { t: "Falta actualizar el navegador", correct: false, fb: "Un navegador desactualizado no impide llegar al servidor de la red." },
        ]},
        6: { text: "Durante un examen se cae internet en toda la clase. Necesitas un plan B.", options: [
          { t: "Tener actividades sin conexión preparadas y avisar a los alumnos con calma", correct: true, fb: "¡Eso es un plan de contingencia! Siempre conviene tener una alternativa offline." },
          { t: "Esperar sin decir nada hasta que vuelva sola", correct: false, fb: "Mejor anticiparse: la incertidumbre genera más problemas." },
          { t: "Cambiar todos los ordenadores de sitio", correct: false, fb: "Mover el hardware no soluciona un corte de internet." },
        ]},
      };
      return scenarios[course];
    },
  },

  {
    id: "m1-3", module: 1, icon: "🏠", title: "Monta la red de casa",
    short: "Otra topología distinta: conecta los aparatos del salón",
    engine: "connect",
    build(course) {
      const sets = {
        3: {
          nodes: [{ id: "A", key: "tv" }, { id: "B", key: "router" }, { id: "C", key: "phone" }, { id: "D", key: "speaker" }],
          objectives: [{ a: "A", b: "B" }, { a: "C", b: "D" }],
          intro: "Conecta la Smart TV con el router y el móvil con el altavoz. Elige cable o inalámbrico según corresponda.",
        },
        4: {
          nodes: [{ id: "A", key: "pc" }, { id: "B", key: "printer" }, { id: "C", key: "router" }, { id: "D", key: "camera" }],
          objectives: [{ a: "A", b: "C" }, { a: "B", b: "C" }, { a: "D", b: "C" }],
          intro: "Conecta el portátil, la impresora y la cámara al router con el tipo de conexión adecuado.",
        },
        5: {
          nodes: [{ id: "A", key: "pc" }, { id: "B", key: "speaker" }, { id: "C", key: "keyboard" }, { id: "D", key: "router" }, { id: "E", key: "phone" }, { id: "F", key: "camera" }],
          objectives: [{ a: "A", b: "B" }, { a: "A", b: "C" }, { a: "A", b: "D" }, { a: "E", b: "D" }],
          intro: "Monta el rincón tecnológico: ordenador con altavoz y teclado, y todos los aparatos con conexión a internet. Hay un aparato que no necesitas conectar en esta misión.",
        },
        6: {
          nodes: [{ id: "A", key: "pc" }, { id: "B", key: "switchd" }, { id: "C", key: "router" }, { id: "D", key: "server" }, { id: "E", key: "tv" }, { id: "F", key: "camera" }, { id: "G", key: "printer" }, { id: "H", key: "headset" }],
          objectives: [{ a: "A", b: "B" }, { a: "B", b: "C" }, { a: "B", b: "D" }, { a: "E", b: "C" }, { a: "F", b: "C" }],
          intro: "Diseña la red completa de una sala: switch, router, servidor, Smart TV y cámara IP. Elige siempre el cable o conexión exacta. Hay dos aparatos de más: comprueba la lista de retos antes de conectar.",
        },
      };
      return sets[course];
    },
  },
  {
    id: "m1-4", module: 1, icon: "🔍", title: "¿Qué conector usarías?",
    short: "Elige el tipo de conexión adecuado para cada situación",
    engine: "quiz",
    build(course) {
      const scenarios = {
        3: { text: "Quieres conectar el teclado al ordenador sin usar ningún cable. ¿Qué tipo de conexión eliges?", options: [
          { t: "Conexión inalámbrica", correct: true, fb: "¡Exacto! Sin cables de por medio, es una conexión inalámbrica." },
          { t: "Cable de red", correct: false, fb: "Un cable de red sí es un cable físico, no es lo que buscamos aquí." },
          { t: "Cable HDMI", correct: false, fb: "El HDMI es para imagen y sonido, no para un teclado sin cables." },
        ]},
        4: { text: "La Smart TV no tiene ningún cable enchufado pero está viendo vídeos de internet. ¿Cómo se conecta?", options: [
          { t: "Por WiFi", correct: true, fb: "¡Bien! Sin cables, la TV usa la conexión inalámbrica WiFi para internet." },
          { t: "Por un cable USB invisible", correct: false, fb: "No existen cables invisibles: si no hay cable, es inalámbrico." },
          { t: "No puede estar conectada a internet sin cable", correct: false, fb: "Sí puede: el WiFi permite conectarse sin ningún cable." },
        ]},
        5: { text: "Quieres que tu móvil tenga internet en clase a través del router. ¿Qué conexión usarías?", options: [
          { t: "WiFi", correct: true, fb: "¡Correcto! Los móviles se conectan a routers por WiFi para tener internet." },
          { t: "Cable HDMI", correct: false, fb: "El HDMI sirve para enviar imagen a una pantalla, no para dar internet a un móvil." },
          { t: "Cable RJ45", correct: false, fb: "La mayoría de móviles no tienen puerto Ethernet (RJ45)." },
        ]},
        6: { text: "Hay que conectar una cámara de seguridad al switch del centro con la máxima estabilidad posible. ¿Qué cable usarías?", options: [
          { t: "Cable de red RJ45", correct: true, fb: "¡Exacto! El cable RJ45 da una conexión estable y constante, ideal para vigilancia." },
          { t: "Bluetooth", correct: false, fb: "El Bluetooth tiene poco alcance y no es fiable para una cámara de seguridad fija." },
          { t: "Cable HDMI", correct: false, fb: "El HDMI conecta un dispositivo a una pantalla, no sirve para dar red a una cámara." },
        ]},
      };
      return scenarios[course];
    },
  },

  // ---------- MÓDULO 2 ----------
  {
    id: "m2-1", module: 2, icon: "📡", title: "Sigue el paquete",
    short: "Mira cómo viaja la información por la red",
    engine: "packet",
    build(course) {
      const variants = {
        3: { hops: ["📱 Tablet", "📶 Router", "🖨️ Impresora"], note: "Cuando envías una foto, no viaja entera de golpe: se divide en trocitos pequeños llamados paquetes.", quiz: "¿Cómo viaja la información por la red?", options: [
          { t: "En paquetes pequeños, uno tras otro", correct: true, fb: "¡Sí! Por eso se llama «paquete de datos»." },
          { t: "Toda junta en un solo envío gigante", correct: false, fb: "No, eso sería muy lento y arriesgado si algo falla." },
        ]},
        4: { hops: ["💻 Portátil", "📶 Router", "🌐 Internet", "🗄️ Servidor"], note: "Cada dispositivo tiene una dirección IP, como una dirección postal, para saber a quién enviar cada paquete.", quiz: "¿Para qué sirve la dirección IP?", options: [
          { t: "Identifica a cada dispositivo en la red, como una dirección postal", correct: true, fb: "¡Correcto! Sin IP, los paquetes no sabrían a quién entregar la información." },
          { t: "Sirve para que el WiFi tenga mejor color", correct: false, fb: "La IP no tiene nada que ver con el color del WiFi." },
        ]},
        5: { hops: ["📱 Móvil", "📶 Router", "🌐 Internet", "☁️ Nube", "🗄️ Servidor"], note: "Si un paquete se pierde en el camino, el protocolo pide que se reenvíe automáticamente.", quiz: "Un paquete se pierde por el camino. ¿Qué pasa?", options: [
          { t: "El protocolo detecta que falta y pide que se reenvíe", correct: true, fb: "¡Exacto! Por eso casi nunca notamos los fallos: el sistema se autocorrige." },
          { t: "El archivo se rompe para siempre", correct: false, fb: "No, los protocolos de red están diseñados para recuperarse de pérdidas." },
        ]},
        6: { hops: ["📱 Móvil (4G)", "📡 Antena", "🌐 Internet", "🗄️ Servidor"], note: "El WiFi suele ser más rápido y estable que el 4G, pero depende de cuánta gente lo use a la vez (ancho de banda) y de la latencia (el tiempo de respuesta).", quiz: "¿Qué es la latencia?", options: [
          { t: "El tiempo que tarda un dato en ir y volver", correct: true, fb: "¡Bien! Una latencia baja es clave en videollamadas y videojuegos online." },
          { t: "La cantidad de batería que gasta el móvil", correct: false, fb: "Eso es el consumo energético, no la latencia." },
        ]},
      };
      return variants[course];
    },
  },
  {
    id: "m2-2", module: 2, icon: "🔐", title: "Mensaje secreto",
    short: "Descifra el mensaje y descubre qué es la encriptación",
    engine: "cipher",
    build(course) {
      const shiftByCourse = { 3: 1, 4: 2, 5: 3, 6: 4 };
      const messages = {
        3: "HOLA",
        4: "REDES",
        5: "INTERNET SEGURO",
        6: "LA CLAVE ES SECRETA",
      };
      return { shift: shiftByCourse[course], message: messages[course] };
    },
  },

  {
    id: "m2-3", module: 2, icon: "🎬", title: "Vídeo en directo",
    short: "Descubre cómo viaja un streaming de vídeo",
    engine: "packet",
    build(course) {
      const variants = {
        3: { hops: ["📷 Cámara", "📶 Router", "📱 Móvil"], note: "Cuando ves un directo, las imágenes también se envían en paquetes, uno tras otro, muy rápido.", quiz: "¿Por qué a veces el vídeo en directo se queda pixelado o se corta?", options: [
          { t: "Porque algunos paquetes llegan tarde o se pierden", correct: true, fb: "¡Sí! Si faltan paquetes, la imagen se ve peor unos instantes." },
          { t: "Porque la cámara se rompe siempre que pasa eso", correct: false, fb: "No, la cámara sigue funcionando; el problema está en el envío de los paquetes." },
        ]},
        4: { hops: ["💻 Portátil", "📶 Router", "🌐 Internet", "🗄️ Servidor de vídeo"], note: "El streaming consiste en enviar y recibir paquetes de vídeo de forma continua, sin descargar el archivo entero antes.", quiz: "¿Qué es el streaming?", options: [
          { t: "Ver o escuchar contenido mientras se va descargando, sin esperar a tenerlo completo", correct: true, fb: "¡Correcto! Por eso puedes ver un vídeo nada más darle a play." },
          { t: "Guardar el vídeo entero en el dispositivo antes de poder verlo", correct: false, fb: "Eso sería descargar, no streaming." },
        ]},
        5: { hops: ["📱 Móvil", "📡 Antena 4G", "🌐 Internet", "☁️ Nube", "🗄️ Servidor"], note: "El ancho de banda determina cuántos paquetes por segundo pueden llegar; con poco ancho de banda, el vídeo baja de calidad automáticamente.", quiz: "Si tienes poco ancho de banda, ¿qué suele hacer la app de vídeo?", options: [
          { t: "Bajar la calidad del vídeo para que no se corte", correct: true, fb: "¡Exacto! Así prioriza que se vea fluido aunque sea con menos resolución." },
          { t: "Subir la calidad para compensar", correct: false, fb: "Eso necesitaría más ancho de banda, justo lo que falta." },
        ]},
        6: { hops: ["🎮 Consola", "📶 Router", "🌐 Internet", "🗄️ Servidor de juego"], note: "En videojuegos online, una latencia alta genera lag: lo que ves se retrasa respecto a lo que ocurre realmente en el servidor.", quiz: "¿Qué es el lag en un videojuego online?", options: [
          { t: "El retraso entre lo que haces y lo que ves en pantalla, causado por la latencia", correct: true, fb: "¡Bien! Por eso una buena conexión es clave para jugar online sin retrasos." },
          { t: "Un virus que infecta la consola", correct: false, fb: "No, el lag no es un virus, es un retraso de red." },
        ]},
      };
      return variants[course];
    },
  },
  {
    id: "m2-4", module: 2, icon: "❓", title: "¿Cómo viajan los datos?",
    short: "Repasa las ideas clave sobre paquetes e IP",
    engine: "quiz",
    build(course) {
      const scenarios = {
        3: { text: "Tu profe dice que las fotos se envían en trocitos pequeños. ¿Cómo se llaman esos trocitos?", options: [
          { t: "Paquetes de datos", correct: true, fb: "¡Eso es! Por eso se llaman paquetes de datos." },
          { t: "Migas de pan", correct: false, fb: "Es una forma graciosa de decirlo, pero el nombre real es «paquetes»." },
        ]},
        4: { text: "¿Para qué sirve una dirección IP?", options: [
          { t: "Para identificar a cada dispositivo en la red, como una dirección postal", correct: true, fb: "¡Correcto! Sin IP, los paquetes no sabrían a quién entregar la información." },
          { t: "Para decorar la pantalla de inicio del móvil", correct: false, fb: "La IP no tiene relación con la decoración de pantallas." },
        ]},
        5: { text: "Un paquete llega dañado a su destino. ¿Qué hace el protocolo de red?", options: [
          { t: "Detecta el error y pide que se reenvíe", correct: true, fb: "¡Exacto! Los protocolos están diseñados para corregir estos fallos." },
          { t: "Lo deja pasar tal cual, aunque esté dañado", correct: false, fb: "No, eso provocaría errores; el protocolo pide el reenvío." },
        ]},
        6: { text: "¿Qué es el ancho de banda?", options: [
          { t: "La cantidad de datos que pueden viajar por la red en un segundo", correct: true, fb: "¡Bien! A más ancho de banda, más datos por segundo pueden circular." },
          { t: "El tamaño físico del router", correct: false, fb: "El tamaño del router no determina cuántos datos puede mover." },
        ]},
      };
      return scenarios[course];
    },
  },

  // ---------- MÓDULO 3 ----------
  {
    id: "m3-1", module: 3, icon: "🚨", title: "¿Qué falla?",
    short: "Encuentra el dispositivo con el problema",
    engine: "findfault",
    build(course) {
      const setups = {
        3: { devices: ["pc", "printer", "router"], faulty: ["printer"], story: "El aula no puede imprimir. Solo hay un problema: encuéntralo." },
        4: { devices: ["pc", "tablet", "printer", "router"], faulty: ["router"], story: "Nadie tiene WiFi. Busca el origen del fallo." },
        5: { devices: ["pc", "tablet", "switchd", "router", "server"], faulty: ["switchd", "router"], story: "Hay 2 fallos a la vez en la red del centro. Encuéntralos." },
        6: { devices: ["pc", "tablet", "switchd", "router", "server", "camera"], faulty: ["switchd", "router", "camera"], story: "Caída total: hay 3 fallos. Encuéntralos todos antes de diseñar el plan B." },
      };
      return setups[course];
    },
  },
  {
    id: "m3-2", module: 3, icon: "🧭", title: "¿Qué arreglas primero?",
    short: "Prioriza los problemas de red",
    engine: "priority",
    build(course) {
      const sets = {
        3: { items: [
          { t: "El cable de la impresora está desconectado", w: 1 },
          { t: "La impresora tiene poca tinta", w: 2 },
        ]},
        4: { items: [
          { t: "El router está apagado (nadie tiene red)", w: 1 },
          { t: "Una tablet tiene la batería baja", w: 2 },
          { t: "Un alumno quiere cambiar el fondo de pantalla", w: 3 },
        ]},
        5: { items: [
          { t: "El servidor del cole no responde a nadie", w: 1 },
          { t: "Un switch de un aula concreta está caído", w: 2 },
          { t: "Una impresora necesita papel", w: 3 },
        ]},
        6: { items: [
          { t: "Se ha caído internet en todo el centro durante un examen", w: 1 },
          { t: "El WiFi va lento en una sola aula", w: 2 },
          { t: "Una funda de un portátil está rota", w: 3 },
        ]},
      };
      return sets[course];
    },
  },

  {
    id: "m3-3", module: 3, icon: "🔧", title: "Otro fallo en la red",
    short: "Nuevo escenario: encuentra el dispositivo con el problema",
    engine: "findfault",
    build(course) {
      const setups = {
        3: { devices: ["tablet", "router", "speaker"], faulty: ["router"], story: "La tablet no puede reproducir música por el altavoz inalámbrico. Encuentra el fallo." },
        4: { devices: ["pc", "printer", "switchd", "router"], faulty: ["switchd"], story: "Dos ordenadores no consiguen llegar a la impresora de red. Busca el origen." },
        5: { devices: ["pc", "tablet", "camera", "router", "server"], faulty: ["camera", "router"], story: "Las cámaras de seguridad no graban y el servidor tampoco responde. Hay 2 fallos a la vez." },
        6: { devices: ["pc", "tablet", "switchd", "router", "server", "camera", "phone"], faulty: ["switchd", "server", "phone"], story: "Incidente grande: hay 3 fallos a la vez en la red del centro. Encuéntralos todos." },
      };
      return setups[course];
    },
  },
  {
    id: "m3-4", module: 3, icon: "📋", title: "Prioriza otra vez",
    short: "Nuevo escenario: ordena qué arreglar primero",
    engine: "priority",
    build(course) {
      const sets = {
        3: { items: [
          { t: "El router está totalmente apagado", w: 1 },
          { t: "Un cable está un poco torcido pero funciona bien", w: 2 },
        ]},
        4: { items: [
          { t: "Se ha caído el WiFi de todo el centro", w: 1 },
          { t: "Una tablet tiene la pantalla un poco sucia", w: 2 },
          { t: "Un alumno pregunta cuál es su contraseña", w: 3 },
        ]},
        5: { items: [
          { t: "El servidor de archivos del cole no arranca", w: 1 },
          { t: "Un switch de un aula parpadea en naranja de forma rara", w: 2 },
          { t: "Una funda de una tablet está rayada", w: 3 },
        ]},
        6: { items: [
          { t: "Se ha detectado un posible ciberataque: hay que cortar el acceso ya", w: 1 },
          { t: "El WiFi de la biblioteca va algo más lento de lo normal", w: 2 },
          { t: "Un ratón inalámbrico necesita pilas nuevas", w: 3 },
        ]},
      };
      return sets[course];
    },
  },

  // ---------- MÓDULO 4 ----------
  {
    id: "m4-1", module: 4, icon: "🔑", title: "¿Contraseña segura?",
    short: "Elige la contraseña más fuerte",
    engine: "password",
    build(course) {
      const rounds = {
        3: [{ pwd: "1234", weak: true }, { pwd: "Tigre_Azul92", weak: false }],
        4: [{ pwd: "contraseña", weak: true }, { pwd: "Rfg7!luna25", weak: false }],
        5: [{ pwd: "fregacedos", weak: true }, { pwd: "N3z@-V2-Cole!", weak: false }, { pwd: "00000000", weak: true }],
        6: [{ pwd: "qwerty123", weak: true }, { pwd: "M1#robot_FutureLab", weak: false }, { pwd: "11111111", weak: true }],
      };
      return { rounds: rounds[course] };
    },
  },
  {
    id: "m4-2", module: 4, icon: "🎣", title: "¿Es phishing?",
    short: "Detecta correos y mensajes falsos",
    engine: "phishing",
    build(course) {
      const sets = {
        3: [
          { text: "Mensaje: «¡Has ganado una tablet GRATIS! Pulsa aquí y da tu nombre.»", phishing: true },
          { text: "Mensaje de tu profe: «Recuerda traer mañana el libro de mates.»", phishing: false },
        ],
        4: [
          { text: "Correo: «Tu cuenta del cole ha sido bloqueada, entra en este enlace raro y pon tu contraseña.»", phishing: true },
          { text: "Correo del cole: «El viernes hay excursión, traed el bocadillo.»", phishing: false },
          { text: "WiFi gratis del centro comercial sin contraseña: ¿lo usas para entrar a tu cuenta del cole?", phishing: true },
        ],
        5: [
          { text: "Mensaje: «Soy tu amigo, necesito que me pases tu contraseña del cole urgentemente.»", phishing: true },
          { text: "Notificación oficial de la app del cole avisando de una reunión de padres.", phishing: false },
          { text: "Página que copia el diseño de tu plataforma educativa pero la URL es rara.", phishing: true },
        ],
        6: [
          { text: "Te llega un email diciendo que ganaste un sorteo que nunca hiciste, con un enlace para «verificar tu identidad».", phishing: true },
          { text: "Aviso real de tu centro sobre el calendario de exámenes, enviado desde el correo oficial.", phishing: false },
          { text: "Una app pide acceso a todos tus contactos para «mejorar tu experiencia», sin explicar por qué.", phishing: true },
        ],
      };
      return { rounds: sets[course] };
    },
  },
  {
    id: "m4-3", module: 4, icon: "🛡️", title: "¿Contraseña segura? (ronda 2)",
    short: "Otra ronda: elige la contraseña más fuerte",
    engine: "password",
    build(course) {
      const rounds = {
        3: [{ pwd: "abcd", weak: true }, { pwd: "Delfin_Verde47", weak: false }],
        4: [{ pwd: "colegio2024", weak: true }, { pwd: "Kx9!Brisa_77", weak: false }],
        5: [{ pwd: "12345678", weak: true }, { pwd: "V3l0z#Tigre-09", weak: false }, { pwd: "password", weak: true }],
        6: [{ pwd: "admin123", weak: true }, { pwd: "Pl@neta-Z7_Fuego", weak: false }, { pwd: "00000000", weak: true }],
      };
      return { rounds: rounds[course] };
    },
  },
  {
    id: "m4-4", module: 4, icon: "🚩", title: "¿Es phishing? (ronda 2)",
    short: "Otra ronda: detecta correos y mensajes falsos",
    engine: "phishing",
    build(course) {
      const sets = {
        3: [
          { text: "Mensaje: «Eres el ganador, pulsa este enlace y escribe el nombre de tus padres.»", phishing: true },
          { text: "Mensaje de tu tutor: «Mañana hay excursión, no olvides el chubasquero.»", phishing: false },
        ],
        4: [
          { text: "Correo: «Tu cuenta de juego será borrada si no entras en este enlace ahora mismo.»", phishing: true },
          { text: "Correo del cole avisando del nuevo horario de la biblioteca.", phishing: false },
          { text: "Un desconocido te pide en el chat del juego tu usuario y contraseña «para regalarte monedas».", phishing: true },
        ],
        5: [
          { text: "Te llega un SMS diciendo que tu paquete está retenido y debes pagar un euro pulsando un enlace.", phishing: true },
          { text: "Notificación de la app del cole sobre una nueva tarea en la plataforma.", phishing: false },
          { text: "Una web idéntica a tu plataforma de juego te pide iniciar sesión otra vez, pero la URL es distinta.", phishing: true },
        ],
        6: [
          { text: "Recibes un email de un «familiar» pidiendo dinero urgente por una emergencia, con errores de ortografía.", phishing: true },
          { text: "Aviso oficial de tu centro educativo sobre un cambio de horario, firmado por dirección.", phishing: false },
          { text: "Una app de fotos pide permiso para leer tus mensajes y contactos sin razón aparente.", phishing: true },
        ],
      };
      return { rounds: sets[course] };
    },
  },

];

function missionsForModule(modId) {
  return MISSIONS.filter(m => m.module === modId);
}
function getMission(id) {
  return MISSIONS.find(m => m.id === id);
}
function isMissionDone(id) {
  return !!state.progress[id];
}
function markDone(id) {
  state.progress[id] = true;
  saveState();
}
function totalProgress() {
  const done = Object.keys(state.progress).length;
  return Math.round((done / MISSIONS.length) * 100);
}

/* ============================================================
   PANTALLA HOME
   ============================================================ */
function renderHome() {
  const cg = document.getElementById("course-grid");
  cg.innerHTML = "";
  COURSES.forEach(c => {
    const b = document.createElement("button");
    b.className = "course-btn" + (state.course === c ? " selected" : "");
    b.textContent = c + "º";
    b.onclick = () => { state.course = c; renderHome(); checkStartEnabled(); };
    cg.appendChild(b);
  });

  const ag = document.getElementById("avatar-grid");
  ag.innerHTML = "";
  AVATARS.forEach(a => {
    const b = document.createElement("button");
    b.className = "avatar-btn" + (state.avatar === a ? " selected" : "");
    b.textContent = a;
    b.onclick = () => { state.avatar = a; renderHome(); checkStartEnabled(); };
    ag.appendChild(b);
  });

  document.getElementById("player-name").value = state.name || "";
  checkStartEnabled();
}
function checkStartEnabled() {
  const nameVal = document.getElementById("player-name").value.trim();
  document.getElementById("btn-start").disabled = !(state.course && state.avatar && nameVal.length > 0);
}

/* ============================================================
   PANTALLA MAPA
   ============================================================ */
function renderMap() {
  document.getElementById("map-avatar").textContent = state.avatar;
  document.getElementById("map-name").textContent = state.name;
  document.getElementById("map-course").textContent = state.course + "º";

  const fill = document.getElementById("global-progress-fill");
  const pct = totalProgress();
  fill.style.width = pct + "%";
  document.getElementById("global-progress-text").textContent = pct + "% completado";

  const grid = document.getElementById("modules-grid");
  grid.innerHTML = "";
  MODULES.forEach(mod => {
    const missions = missionsForModule(mod.id);
    const done = missions.filter(m => isMissionDone(m.id)).length;
    const card = document.createElement("div");
    card.className = "module-card " + mod.css;
    card.innerHTML = `
      <div>
        <div class="m-icon">${mod.icon}</div>
        <h3>Módulo ${mod.id} · ${mod.title}</h3>
        <p>${mod.desc}</p>
      </div>
      <div class="m-progress">${done}/${missions.length} misiones</div>
    `;
    card.onclick = () => openModule(mod.id);
    grid.appendChild(card);
  });
}

function openModule(modId) {
  const mod = MODULES.find(m => m.id === modId);
  document.getElementById("missions-title").textContent = `Módulo ${mod.id} · ${mod.title}`;
  document.getElementById("missions-desc").textContent = mod.desc;
  const list = document.getElementById("mission-list");
  list.innerHTML = "";
  const missions = missionsForModule(modId);
  missions.forEach((m, idx) => {
    const done = isMissionDone(m.id);
    const item = document.createElement("div");
    item.className = "mission-item" + (done ? " done" : "");
    item.innerHTML = `
      <div class="m-num">${idx + 1}</div>
      <div class="m-body"><h4>${m.icon} ${m.title}</h4><p>${m.short}</p></div>
      <div class="m-status">${done ? "✅" : "▶️"}</div>
    `;
    item.onclick = () => startMission(m.id);
    list.appendChild(item);
  });
  showScreen("screen-missions");
}

/* ============================================================
   MOTOR DE MISIÓN: router por tipo
   ============================================================ */
let currentMissionId = null;

function startMission(id) {
  currentMissionId = id;
  const m = getMission(id);
  document.getElementById("mission-title").textContent = m.icon + " " + m.title;
  const cfg = m.build(state.course);
  const stage = document.getElementById("mission-stage");
  stage.innerHTML = "";

  const engines = {
    connect: renderConnectEngine,
    quiz: renderQuizEngine,
    packet: renderPacketEngine,
    cipher: renderCipherEngine,
    findfault: renderFindFaultEngine,
    priority: renderPriorityEngine,
    password: renderPasswordEngine,
    phishing: renderPhishingEngine,
  };
  engines[m.engine](stage, cfg, m);
  showScreen("screen-mission");
}

function completeMission(successMsg) {
  markDone(currentMissionId);
  toast(successMsg || "¡Misión completada! 🎉");
}

function finishButton(container, label) {
  const row = document.createElement("div");
  row.className = "mission-controls";
  const btn = document.createElement("button");
  btn.className = "btn btn-primary";
  btn.textContent = label || "Volver al mapa de misiones";
  btn.onclick = () => openModule(getMission(currentMissionId).module);
  row.appendChild(btn);
  container.appendChild(row);
}

/* ---------- ENGINE: connect (tablero de topología, estilo Packet Tracer) ---------- */
function renderConnectEngine(stage, cfg) {
  const card = document.createElement("div");
  card.className = "stage-card";
  card.innerHTML = `<div class="instructions"><span class="bubble-icon">🧰</span><span>${cfg.intro}</span></div>`;

  const toolbarDiv = document.createElement("div");
  toolbarDiv.className = "cable-toolbar";
  card.appendChild(toolbarDiv);

  const legendDiv = document.createElement("div");
  legendDiv.className = "cable-legend";
  card.appendChild(legendDiv);

  const boardWrap = document.createElement("div");
  boardWrap.className = "topo-board-wrap";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("topo-svg");
  boardWrap.appendChild(svg);
  const board = document.createElement("div");
  board.className = "topo-board";
  boardWrap.appendChild(board);
  card.appendChild(boardWrap);

  const objWrap = document.createElement("div");
  objWrap.className = "topo-objectives";
  card.appendChild(objWrap);

  let activeTool = null;
  let pending = null;
  const madeLinks = [];
  const usedPortKeys = new Set();
  const doneSet = new Set();
  const activeGroupByNode = {};
  const singleGroupNodes = new Set();
  let finished = false;
  let mistakes = 0;

  renderCableToolbar(toolbarDiv, key => {
    activeTool = key;
    pending = null;
    syncPortVisualState();
  }, legendDiv);

  function isPortActive(nodeId, type) {
    if (singleGroupNodes.has(nodeId)) return true;
    return activeGroupByNode[nodeId] === portGroup(type);
  }

  function syncPortVisualState() {
    card.querySelectorAll(".port-dot[data-node]").forEach(dot => {
      const nodeId = dot.dataset.node, portId = dot.dataset.port, group = dot.dataset.group;
      const key = nodeId + ":" + portId;
      dot.classList.toggle("used", usedPortKeys.has(key));
      dot.classList.toggle("pending", !!(pending && pending.nodeId === nodeId && pending.portId === portId));
      dot.classList.toggle("inactive", !singleGroupNodes.has(nodeId) && activeGroupByNode[nodeId] !== group);
    });
    card.querySelectorAll(".conn-toggle[data-node]").forEach(b => {
      b.classList.toggle("active", activeGroupByNode[b.dataset.node] === b.dataset.group);
    });
  }

  function setActiveGroup(nodeId, group) {
    activeGroupByNode[nodeId] = group;
    syncPortVisualState();
  }

  function buildConnScreen(nodeId, groups) {
    const wrap = document.createElement("div");
    wrap.className = "conn-screen";
    groups.forEach(g => {
      const meta = GROUP_META[g];
      const b = document.createElement("button");
      b.className = "conn-toggle";
      b.dataset.node = nodeId;
      b.dataset.group = g;
      b.innerHTML = `${meta.icon} ${meta.label}`;
      b.onclick = () => setActiveGroup(nodeId, g);
      wrap.appendChild(b);
    });
    return wrap;
  }

  function buildPortList(nodeId, ports, withLabels) {
    const portList = document.createElement("div");
    portList.className = "port-list" + (withLabels ? " with-labels" : "");
    ports.forEach(p => {
      if (withLabels) {
        const item = document.createElement("div");
        item.className = "port-item";
        item.appendChild(makePortDot(nodeId, p, handleTopoPortClick));
        const cap = document.createElement("span");
        cap.className = "port-caption";
        cap.textContent = p.label;
        item.appendChild(cap);
        portList.appendChild(item);
      } else {
        portList.appendChild(makePortDot(nodeId, p, handleTopoPortClick));
      }
    });
    return portList;
  }

  function openDeviceZoom(node, dev, ports, groups, single) {
    card.querySelectorAll(".device-modal-overlay").forEach(m => m.remove());
    const overlay = document.createElement("div");
    overlay.className = "device-modal-overlay";
    overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
    const modal = document.createElement("div");
    modal.className = "device-modal";
    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close";
    closeBtn.textContent = "✕";
    closeBtn.onclick = () => overlay.remove();
    modal.appendChild(closeBtn);
    const panel = document.createElement("div");
    panel.className = "device-back-panel big";
    panel.innerHTML = `<div class="back-badge">${dev.icon}</div>
      <div class="d-name">${dev.label}</div>
      <div class="back-label">🔧 Parte trasera &middot; puertos reales</div>`;
    modal.appendChild(panel);
    if (!single) modal.appendChild(buildConnScreen(node.id, groups));
    panel.appendChild(buildPortList(node.id, ports, true));
    overlay.appendChild(modal);
    card.appendChild(overlay);
    syncPortVisualState();
  }

  cfg.nodes.forEach(node => {
    const dev = DEVICE_LIB[node.key];
    const ports = portsForDisplay(node.key);
    const groups = groupsForPorts(ports);
    const single = groups.length <= 1;
    if (single) singleGroupNodes.add(node.id);
    const box = document.createElement("div");
    box.className = "topo-device";
    box.id = "topo-" + node.id;
    const panel = document.createElement("div");
    panel.className = "device-back-panel";
    panel.innerHTML = `<button class="zoom-btn" title="Ver parte trasera">🔍</button>
      <div class="d-icon-big">${dev.icon}</div><div class="d-name">${dev.label}</div>`;
    panel.querySelector(".zoom-btn").onclick = () => openDeviceZoom(node, dev, ports, groups, single);
    panel.appendChild(buildPortList(node.id, ports, false));
    box.appendChild(panel);
    if (!single) box.appendChild(buildConnScreen(node.id, groups));
    board.appendChild(box);
  });

  syncPortVisualState();

  function renderObjectives() {
    objWrap.innerHTML = "";
    cfg.objectives.forEach((ob, i) => {
      const done = doneSet.has(i);
      const row = document.createElement("div");
      row.className = "topo-objective" + (done ? " done" : "");
      const labelA = DEVICE_LIB[cfg.nodes.find(n => n.id === ob.a).key].label;
      const labelB = DEVICE_LIB[cfg.nodes.find(n => n.id === ob.b).key].label;
      row.innerHTML = `<span class="ob-status">${done ? "✅" : "⬜"}</span><span>Conecta <b>${labelA}</b> con <b>${labelB}</b></span>`;
      objWrap.appendChild(row);
    });
  }
  renderObjectives();

  function drawTopoLinks() {
    svg.innerHTML = "";
    const rect = boardWrap.getBoundingClientRect();
    madeLinks.forEach(link => {
      const elA = board.querySelector(`#topo-${link.a.nodeId} .port-dot[data-port="${link.a.portId}"]`);
      const elB = board.querySelector(`#topo-${link.b.nodeId} .port-dot[data-port="${link.b.portId}"]`);
      if (!elA || !elB) return;
      const ra = elA.getBoundingClientRect(), rb = elB.getBoundingClientRect();
      const x1 = ra.left + ra.width / 2 - rect.left, y1 = ra.top + ra.height / 2 - rect.top;
      const x2 = rb.left + rb.width / 2 - rect.left, y2 = rb.top + rb.height / 2 - rect.top;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1); line.setAttribute("y1", y1);
      line.setAttribute("x2", x2); line.setAttribute("y2", y2);
      line.setAttribute("stroke", colorForTool(link.tool));
      line.setAttribute("stroke-width", "3");
      if (isWirelessTool(link.tool)) line.setAttribute("stroke-dasharray", "6,5");
      svg.appendChild(line);
    });
  }

  function handleTopoPortClick(nodeId, portId, type, dotEl) {
    if (finished) return;
    if (!isPortActive(nodeId, type)) {
      toast("Activa antes el tipo de conexión en la pantalla del dispositivo 👆");
      return;
    }
    if (!activeTool) { toast("Elige primero un cable o conexión arriba ☝️"); return; }
    if (!pending) { pending = { nodeId, portId, type }; syncPortVisualState(); return; }
    if (pending.nodeId === nodeId && pending.portId === portId) {
      pending = null; syncPortVisualState(); return;
    }
    const ok = canConnect(pending.type, type, activeTool);
    if (ok) {
      madeLinks.push({ a: { nodeId: pending.nodeId, portId: pending.portId }, b: { nodeId, portId }, tool: activeTool });
      usedPortKeys.add(pending.nodeId + ":" + pending.portId);
      usedPortKeys.add(nodeId + ":" + portId);
      cfg.objectives.forEach((ob, i) => {
        const pair1 = ob.a === pending.nodeId && ob.b === nodeId;
        const pair2 = ob.b === pending.nodeId && ob.a === nodeId;
        if (pair1 || pair2) doneSet.add(i);
      });
      pending = null;
      toast("¡Conexión correcta! ✅");
      renderObjectives();
      syncPortVisualState();
      drawTopoLinks();
      if (doneSet.size === cfg.objectives.length) {
        finished = true;
        const stars = mistakes === 0 ? 3 : (mistakes <= 2 ? 2 : 1);
        setTimeout(() => completeMission(`¡Misión completada! 🎉 ${"⭐".repeat(stars)}${"☆".repeat(3 - stars)}`), 400);
      }
    } else {
      mistakes++;
      const pendNode = pending.nodeId, pendPort = pending.portId;
      dotEl.classList.add("flash-bad");
      const pendEl = card.querySelector(`.port-dot[data-node="${pendNode}"][data-port="${pendPort}"]`);
      if (pendEl) pendEl.classList.add("flash-bad");
      setTimeout(() => {
        dotEl.classList.remove("flash-bad");
        if (pendEl) pendEl.classList.remove("flash-bad");
      }, 500);
      toast(mismatchMessage(pending.type, type, activeTool));
      pending = null;
      syncPortVisualState();
    }
  }

  stage.appendChild(card);
  finishButton(stage);
}

/* ---------- ENGINE: quiz (escenario + opción múltiple) ---------- */
function renderQuizEngine(stage, cfg) {
  const card = document.createElement("div");
  card.className = "stage-card";
  card.innerHTML = `<div class="instructions"><span class="bubble-icon">🧩</span><span>${cfg.text}</span></div>`;

  const choices = document.createElement("div");
  choices.className = "choice-grid";
  const fb = document.createElement("div");
  fb.className = "feedback-box";
  let mistakes = 0;

  cfg.options.forEach(opt => {
    const b = document.createElement("button");
    b.className = "choice-btn";
    b.textContent = opt.t;
    b.onclick = () => {
      choices.querySelectorAll(".choice-btn").forEach(x => x.disabled = true);
      b.classList.add(opt.correct ? "correct" : "wrong");
      fb.classList.add("show", opt.correct ? "ok" : "fail");
      fb.textContent = opt.fb;
      if (opt.correct) {
        const stars = mistakes === 0 ? 3 : (mistakes === 1 ? 2 : 1);
        setTimeout(() => completeMission(`¡Misión completada! 🎉 ${"⭐".repeat(stars)}${"☆".repeat(3 - stars)}`), 400);
      } else {
        mistakes++;
        setTimeout(() => choices.querySelectorAll(".choice-btn").forEach(x => x.disabled = false), 900);
      }
    };
    choices.appendChild(b);
  });

  card.appendChild(choices);
  card.appendChild(fb);
  stage.appendChild(card);
  finishButton(stage);
}

/* ---------- ENGINE: packet (animación) ---------- */
function renderPacketEngine(stage, cfg) {
  const card = document.createElement("div");
  card.className = "stage-card";
  card.innerHTML = `<div class="instructions"><span class="bubble-icon">📨</span><span>Pulsa «Enviar» y observa cómo el paquete recorre la red, parada a parada.</span></div>`;

  const track = document.createElement("div");
  track.className = "packet-track";
  const line = document.createElement("div");
  line.className = "packet-line";
  track.appendChild(line);

  const n = cfg.hops.length;
  const positions = cfg.hops.map((_, i) => 6 + (i * (88 / (n - 1))));
  cfg.hops.forEach((label, i) => {
    const node = document.createElement("div");
    node.className = "packet-node";
    node.style.left = positions[i] + "%";
    node.textContent = label.split(" ")[0];
    track.appendChild(node);
    const cap = document.createElement("div");
    cap.style.position = "absolute";
    cap.style.top = "62%";
    cap.style.left = positions[i] + "%";
    cap.style.transform = "translateX(-50%)";
    cap.style.fontSize = ".62rem";
    cap.style.color = "#94a3b8";
    cap.style.width = "70px";
    cap.style.textAlign = "center";
    cap.textContent = label.split(" ").slice(1).join(" ");
    track.appendChild(cap);
  });
  const dot = document.createElement("div");
  dot.className = "packet-dot";
  dot.style.left = positions[0] + "%";
  track.appendChild(dot);
  card.appendChild(track);

  const btnSend = document.createElement("button");
  btnSend.className = "btn btn-primary";
  btnSend.textContent = "📨 Enviar paquete";
  btnSend.style.marginBottom = "10px";
  let step = 0;
  btnSend.onclick = () => {
    if (step >= positions.length - 1) { step = 0; }
    step++;
    dot.style.left = positions[step] + "%";
    if (step === positions.length - 1) {
      toast("¡Paquete entregado! 📬");
      btnSend.disabled = true;
      setTimeout(showNote, 600);
    }
  };
  card.appendChild(btnSend);

  const note = document.createElement("div");
  note.className = "career-callout";
  note.style.display = "none";
  note.innerHTML = `<span>💡</span><span>${cfg.note}</span>`;
  function showNote() { note.style.display = "flex"; setTimeout(showQuiz, 300); }
  card.appendChild(note);

  const quizWrap = document.createElement("div");
  quizWrap.style.marginTop = "14px";
  function showQuiz() {
    quizWrap.innerHTML = `<p style="font-weight:700;margin:8px 0">${cfg.quiz}</p>`;
    const choices = document.createElement("div");
    choices.className = "choice-grid";
    const fb = document.createElement("div");
    fb.className = "feedback-box";
    cfg.options.forEach(opt => {
      const b = document.createElement("button");
      b.className = "choice-btn";
      b.textContent = opt.t;
      b.onclick = () => {
        choices.querySelectorAll(".choice-btn").forEach(x => x.disabled = true);
        b.classList.add(opt.correct ? "correct" : "wrong");
        fb.classList.add("show", opt.correct ? "ok" : "fail");
        fb.textContent = opt.fb;
        if (opt.correct) setTimeout(() => completeMission(), 400);
        else setTimeout(() => choices.querySelectorAll(".choice-btn").forEach(x => x.disabled = false), 900);
      };
      choices.appendChild(b);
    });
    quizWrap.appendChild(choices);
    quizWrap.appendChild(fb);
  }
  card.appendChild(quizWrap);

  stage.appendChild(card);
  finishButton(stage);
}

/* ---------- ENGINE: cipher (mensaje cifrado) ---------- */
function renderCipherEngine(stage, cfg) {
  const card = document.createElement("div");
  card.className = "stage-card";
  card.innerHTML = `<div class="instructions"><span class="bubble-icon">🔐</span><span>Cuando enviamos datos importantes, se «encriptan»: se transforman para que solo quien tiene la clave pueda leerlos. Descifra este mensaje desplazando las letras.</span></div>`;

  const encrypted = caesarShift(cfg.message, cfg.shift);
  const box = document.createElement("div");
  box.className = "cipher-box";
  box.textContent = encrypted;
  card.appendChild(box);

  const hint = document.createElement("p");
  hint.style.fontSize = ".82rem";
  hint.style.color = "#5b5876";
  hint.textContent = `Pista: cada letra se ha movido ${cfg.shift} posición(es) en el abecedario. Escribe el mensaje original.`;
  card.appendChild(hint);

  const inputRow = document.createElement("div");
  inputRow.style.display = "flex";
  inputRow.style.gap = "10px";
  inputRow.style.marginTop = "10px";
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Escribe tu respuesta...";
  input.style.flex = "1";
  input.style.padding = "12px 14px";
  input.style.borderRadius = "12px";
  input.style.border = "2px solid #e5e7eb";
  input.style.fontFamily = "inherit";
  input.style.fontSize = "1rem";
  const checkBtn = document.createElement("button");
  checkBtn.className = "btn btn-primary";
  checkBtn.textContent = "Comprobar";
  inputRow.appendChild(input);
  inputRow.appendChild(checkBtn);
  card.appendChild(inputRow);

  const fb = document.createElement("div");
  fb.className = "feedback-box";
  card.appendChild(fb);

  checkBtn.onclick = () => {
    const guess = input.value.trim().toUpperCase();
    if (guess === cfg.message) {
      fb.classList.add("show", "ok");
      fb.textContent = "¡Correcto! Esto es una idea básica de criptografía: ocultar información para que solo la entienda quien tiene la clave.";
      setTimeout(showCareer, 500);
    } else {
      fb.classList.add("show", "fail");
      fb.textContent = "Aún no es correcto. Revisa el desplazamiento de letras e inténtalo de nuevo.";
    }
  };

  const career = document.createElement("div");
  career.className = "career-callout";
  career.style.display = "none";
  career.innerHTML = `<span>👩‍💻</span><span>La encriptación protege contraseñas, compras online y mensajes privados. Profesiones como <b>analista de ciberseguridad</b>, <b>criptógrafo/a</b> o <b>perito informático</b> trabajan todos los días con estas ideas.</span>`;
  function showCareer() {
    career.style.display = "flex";
    setTimeout(() => completeMission(), 600);
  }
  card.appendChild(career);

  stage.appendChild(card);
  finishButton(stage);
}
function caesarShift(text, shift) {
  return text.split("").map(ch => {
    if (ch === " ") return " ";
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + shift) % 26) + 65);
    }
    return ch;
  }).join("");
}

/* ---------- ENGINE: findfault ---------- */
function renderFindFaultEngine(stage, cfg) {
  const card = document.createElement("div");
  card.className = "stage-card";
  card.innerHTML = `<div class="instructions"><span class="bubble-icon">🚨</span><span>${cfg.story} Pulsa sobre los dispositivos que tienen el problema (${cfg.faulty.length}).</span></div>`;

  const row = document.createElement("div");
  row.className = "device-row";
  let foundCount = 0;
  const found = new Set();

  cfg.devices.forEach(devKey => {
    const dev = DEVICE_LIB[devKey];
    const el = document.createElement("div");
    el.className = "device";
    el.innerHTML = `<div class="d-icon">${dev.icon}</div><div class="d-label">${dev.label}</div>`;
    el.onclick = () => {
      if (found.has(devKey)) return;
      if (cfg.faulty.includes(devKey)) {
        el.style.borderColor = "var(--bad)";
        el.style.background = "#fef2f2";
        found.add(devKey);
        foundCount++;
        toast("¡Ahí está el fallo! 🔧");
        if (foundCount === cfg.faulty.length) {
          setTimeout(() => completeMission(), 400);
        }
      } else {
        el.style.borderColor = "var(--good)";
        toast("Ese dispositivo funciona bien ✅");
      }
    };
    row.appendChild(el);
  });
  card.appendChild(row);
  stage.appendChild(card);
  finishButton(stage);
}

/* ---------- ENGINE: priority (ordenar) ---------- */
function renderPriorityEngine(stage, cfg) {
  const card = document.createElement("div");
  card.className = "stage-card";
  card.innerHTML = `<div class="instructions"><span class="bubble-icon">🧭</span><span>Pulsa los problemas en orden, del más urgente al menos urgente.</span></div>`;

  const list = document.createElement("div");
  list.className = "choice-grid";
  let nextRank = 1;
  const shuffled = [...cfg.items].sort(() => Math.random() - 0.5);

  shuffled.forEach(item => {
    const b = document.createElement("button");
    b.className = "choice-btn";
    b.textContent = item.t;
    b.onclick = () => {
      if (b.disabled) return;
      if (item.w === nextRank) {
        b.classList.add("correct");
        b.disabled = true;
        b.textContent = `${nextRank}. ${item.t}`;
        nextRank++;
        toast("¡Orden correcto! ✅");
        if (nextRank > cfg.items.length) {
          setTimeout(() => completeMission(), 400);
        }
      } else {
        toast("Ese no toca todavía, piensa qué es más urgente ❌");
      }
    };
    list.appendChild(b);
  });
  card.appendChild(list);
  stage.appendChild(card);
  finishButton(stage);
}

/* ---------- ENGINE: password ---------- */
function renderPasswordEngine(stage, cfg) {
  const card = document.createElement("div");
  card.className = "stage-card";
  card.innerHTML = `<div class="instructions"><span class="bubble-icon">🔑</span><span>De cada pareja, elige la contraseña más segura.</span></div>`;

  let idx = 0;
  let correct = 0;
  const roundsTotal = Math.ceil(cfg.rounds.length / 1);
  const wrap = document.createElement("div");
  card.appendChild(wrap);

  function renderRound() {
    wrap.innerHTML = "";
    if (idx >= cfg.rounds.length) {
      completeMission();
      return;
    }
    const r = cfg.rounds[idx];
    const p = document.createElement("p");
    p.style.fontWeight = "700";
    p.textContent = `Ronda ${idx + 1}: ¿esta contraseña es segura?`;
    wrap.appendChild(p);
    const box = document.createElement("div");
    box.className = "cipher-box";
    box.style.fontSize = "1.1rem";
    box.textContent = r.pwd;
    wrap.appendChild(box);
    const choices = document.createElement("div");
    choices.className = "choice-grid";
    choices.style.marginTop = "12px";
    ["Sí, es segura", "No, es débil"].forEach((label, i) => {
      const b = document.createElement("button");
      b.className = "choice-btn";
      b.textContent = label;
      b.onclick = () => {
        const saidSecure = i === 0;
        const isCorrect = saidSecure === !r.weak;
        choices.querySelectorAll("button").forEach(x => x.disabled = true);
        b.classList.add(isCorrect ? "correct" : "wrong");
        toast(isCorrect ? "¡Bien visto! ✅" : "Esa no era la respuesta correcta ❌");
        setTimeout(() => { idx++; renderRound(); }, 800);
      };
      choices.appendChild(b);
    });
    wrap.appendChild(choices);
  }
  renderRound();
  stage.appendChild(card);
  finishButton(stage);
}

/* ---------- ENGINE: phishing ---------- */
function renderPhishingEngine(stage, cfg) {
  const card = document.createElement("div");
  card.className = "stage-card";
  card.innerHTML = `<div class="instructions"><span class="bubble-icon">🎣</span><span>Decide si cada situación es segura o un intento de engaño (phishing).</span></div>`;

  let idx = 0;
  const wrap = document.createElement("div");
  card.appendChild(wrap);

  function renderRound() {
    wrap.innerHTML = "";
    if (idx >= cfg.rounds.length) {
      completeMission();
      return;
    }
    const r = cfg.rounds[idx];
    const p = document.createElement("p");
    p.style.fontWeight = "600";
    p.textContent = r.text;
    wrap.appendChild(p);
    const choices = document.createElement("div");
    choices.className = "choice-grid";
    [["⚠️ Es phishing / peligroso", true], ["✅ Es seguro", false]].forEach(([label, val]) => {
      const b = document.createElement("button");
      b.className = "choice-btn";
      b.textContent = label;
      b.onclick = () => {
        const isCorrect = val === r.phishing;
        choices.querySelectorAll("button").forEach(x => x.disabled = true);
        b.classList.add(isCorrect ? "correct" : "wrong");
        toast(isCorrect ? "¡Buen ojo! ✅" : "Ojo, revísalo de nuevo la próxima vez ❌");
        setTimeout(() => { idx++; renderRound(); }, 900);
      };
      choices.appendChild(b);
    });
    wrap.appendChild(choices);
  }
  renderRound();
  stage.appendChild(card);
  finishButton(stage);
}

/* ============================================================
   SANDBOX LIBRE
   ============================================================ */
const SANDBOX_DEVICES = ["pc", "tablet", "phone", "printer", "router", "switchd", "tv", "speaker", "camera", "server"];
const SANDBOX_CATEGORIES = [
  { key: "network", label: "Dispositivos de red", icon: "🌐", devices: ["router", "switchd", "server"] },
  { key: "end",     label: "Dispositivos finales", icon: "💻", devices: ["pc", "tablet", "phone", "printer", "tv", "speaker", "camera"] },
  { key: "conn",    label: "Conexiones", icon: "🔌", devices: null },
];
let sbCounter = 0;
let sbLinks = []; // {a:{devId,portId}, b:{devId,portId}, tool}
let sbActiveTool = null;
let sbPending = null; // {devId, portId, type, el}
let sbMode = "select"; // "select" | "delete"
let sbAddIndex = 0;

function sbGlyph(key) {
  return DEVICE_SVG[key] || `<span class="emoji">${(DEVICE_LIB[key] || {}).icon || "❓"}</span>`;
}

/* ============================================================
   EXPORTAR LA RED COMO IMAGEN PNG (para entregar / evaluar)
   Dibuja en un <canvas> una cabecera con los datos del alumno y
   el reto, la cuadrícula, los cables con sus luces y los equipos.
   ============================================================ */
const deviceImgCache = {};
function preloadDeviceImages() {
  Object.entries(DEVICE_SVG).forEach(([k, svg]) => {
    if (deviceImgCache[k]) return;
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    deviceImgCache[k] = img;
  });
}

async function exportSandboxPNG() {
  const deviceEls = [...document.querySelectorAll(".sb-device")];
  if (deviceEls.length === 0) { toast("Añade y conecta dispositivos antes de exportar 🙂"); return; }
  preloadDeviceImages();
  await Promise.all(Object.values(deviceImgCache).map(img =>
    img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
  ));

  const wrap = document.querySelector(".pt-canvas-wrap");
  const wrapRect = wrap.getBoundingClientRect();
  const W = Math.round(wrapRect.width);
  const H = Math.round(wrapRect.height);
  const headerH = 70;
  const scale = 2;

  const out = document.createElement("canvas");
  out.width = W * scale;
  out.height = (H + headerH) * scale;
  const ctx = out.getContext("2d");
  ctx.scale(scale, scale);

  // fondo
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H + headerH);

  // cabecera con datos del alumno y del reto
  const redName = (document.getElementById("sandbox-design-name").value || "Mi red").trim();
  ctx.fillStyle = "#1f3050";
  ctx.fillRect(0, 0, W, headerH);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
  ctx.fillText("🛰️ NetKids · " + redName, 16, 28);
  ctx.font = "13px 'Segoe UI', Arial, sans-serif";
  const sub = "Nombre: " + (state.name || "—") +
              "     ·     Curso: " + (state.course ? state.course + "º" : "—") +
              "     ·     Fecha: " + new Date().toLocaleDateString() +
              "     ·     Dispositivos: " + deviceEls.length +
              "     ·     Conexiones: " + sbLinks.length;
  ctx.fillText(sub, 16, 50);

  // zona de trabajo (desplazada bajo la cabecera)
  ctx.save();
  ctx.translate(0, headerH);

  // cuadrícula
  ctx.strokeStyle = "#e6ecf5";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 26) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // cables
  sbLinks.forEach(link => {
    const a = document.querySelector(`#${link.a.devId} .port-dot[data-port="${link.a.portId}"]`);
    const b = document.querySelector(`#${link.b.devId} .port-dot[data-port="${link.b.portId}"]`);
    if (!a || !b) return;
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const x1 = ra.left + ra.width / 2 - wrapRect.left, y1 = ra.top + ra.height / 2 - wrapRect.top;
    const x2 = rb.left + rb.width / 2 - wrapRect.left, y2 = rb.top + rb.height / 2 - wrapRect.top;
    ctx.strokeStyle = colorForTool(link.tool);
    ctx.lineWidth = 3; ctx.lineCap = "round";
    ctx.setLineDash(isWirelessTool(link.tool) ? [6, 5] : []);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.setLineDash([]);
    [[x1, y1], [x2, y2]].forEach(([x, y]) => {
      ctx.fillStyle = "#22c55e"; ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.5;
      ctx.fillRect(x - 4.5, y - 4.5, 9, 9); ctx.strokeRect(x - 4.5, y - 4.5, 9, 9);
    });
  });

  // dispositivos (icono + nombre)
  deviceEls.forEach(el => {
    const key = el.dataset.key;
    const r = el.getBoundingClientRect();
    const gx = r.left - wrapRect.left;
    const gy = r.top - wrapRect.top;
    const img = deviceImgCache[key];
    const glyphX = gx + (r.width - 48) / 2;
    if (img) { try { ctx.drawImage(img, glyphX, gy, 48, 48); } catch (e) {} }
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 11px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText((DEVICE_LIB[key] || {}).label || "", gx + r.width / 2, gy + 62);
    ctx.textAlign = "left";
  });

  ctx.restore();

  const safe = s => (s || "").toString().replace(/[^a-z0-9áéíóúñ _-]/gi, "").trim().replace(/\s+/g, "_");
  const fname = "NetKids_" + (state.course || "") + "_" + (safe(state.name) || "alumno") + "_" + (safe(redName) || "red") + ".png";
  out.toBlob(blob => {
    const a = document.createElement("a");
    a.download = fname;
    a.href = URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    toast("Imagen exportada 📷 Súbela al aula virtual o envíasela al profe");
  }, "image/png");
}

function distToSeg(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy;
  let t = l2 ? ((px - x1) * dx + (py - y1) * dy) / l2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function renderSandbox() {
  sbMode = "select";
  sbActiveTool = null;
  sbPending = null;
  sbAddIndex = 0;

  // Barra de categorías (selector inferior estilo Packet Tracer)
  const cats = document.getElementById("pt-cats");
  cats.innerHTML = "";
  SANDBOX_CATEGORIES.forEach((cat, i) => {
    const b = document.createElement("button");
    b.className = "pt-cat" + (i === 0 ? " active" : "");
    b.dataset.cat = cat.key;
    b.innerHTML = `<span>${cat.icon}</span> ${cat.label}`;
    b.onclick = () => {
      cats.querySelectorAll(".pt-cat").forEach(x => x.classList.toggle("active", x === b));
      renderModels(cat.key);
    };
    cats.appendChild(b);
  });
  renderModels(SANDBOX_CATEGORIES[0].key);

  // Lienzo: aceptar arrastre de dispositivos (enlazar una sola vez)
  const canvas = document.getElementById("sandbox-canvas");
  if (!canvas.dataset.bound) {
    canvas.dataset.bound = "1";
    canvas.addEventListener("dragover", e => e.preventDefault());
    canvas.addEventListener("drop", e => {
      e.preventDefault();
      const data = e.dataTransfer.getData("text/plain");
      if (data && data.startsWith("tray:")) {
        const key = data.split(":")[1];
        const rect = canvas.getBoundingClientRect();
        addSbDevice(key, e.clientX - rect.left - 36, e.clientY - rect.top - 36);
      }
    });
    // modo borrar: tocar cerca de un cable lo elimina
    canvas.addEventListener("pointerdown", e => {
      if (sbMode !== "delete") return;
      if (e.target.closest(".sb-device")) return;
      const cr = canvas.getBoundingClientRect();
      const px = e.clientX - cr.left, py = e.clientY - cr.top;
      let best = null, bestD = 16;
      sbLinks.forEach(link => {
        const a = document.querySelector(`#${link.a.devId} .port-dot[data-port="${link.a.portId}"]`);
        const b = document.querySelector(`#${link.b.devId} .port-dot[data-port="${link.b.portId}"]`);
        if (!a || !b) return;
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        const x1 = ra.left + ra.width / 2 - cr.left, y1 = ra.top + ra.height / 2 - cr.top;
        const x2 = rb.left + rb.width / 2 - cr.left, y2 = rb.top + rb.height / 2 - cr.top;
        const d = distToSeg(px, py, x1, y1, x2, y2);
        if (d < bestD) { bestD = d; best = link; }
      });
      if (best) {
        sbLinks = sbLinks.filter(l => l !== best);
        [best.a, best.b].forEach(end => {
          const dot = document.querySelector(`#${end.devId} .port-dot[data-port="${end.portId}"]`);
          const used = sbLinks.some(l => (l.a.devId === end.devId && l.a.portId === end.portId) || (l.b.devId === end.devId && l.b.portId === end.portId));
          if (dot && !used) dot.classList.remove("used");
        });
        drawSbLinks();
        toast("Cable eliminado 🗑️");
      }
    });
  }

  // Herramientas laterales: seleccionar / borrar
  const toolsEl = document.getElementById("pt-tools");
  toolsEl.querySelectorAll(".pt-tool").forEach(b => {
    b.classList.toggle("active", b.dataset.mode === "select");
    b.onclick = () => {
      sbMode = b.dataset.mode;
      toolsEl.querySelectorAll(".pt-tool").forEach(x => x.classList.toggle("active", x === b));
      document.getElementById("sandbox-canvas").classList.toggle("delete-mode", sbMode === "delete");
      const wrap = document.querySelector(".pt-canvas-wrap");
      if (wrap) wrap.classList.toggle("del", sbMode === "delete");
      if (sbPending) { sbPending.el.classList.remove("pending"); sbPending = null; }
      drawSbLinks();
    };
  });

  renderSavedDesigns();
  const exBtn = document.getElementById("btn-sandbox-export");
  if (exBtn) exBtn.onclick = exportSandboxPNG;
  preloadDeviceImages();
}

function renderModels(catKey) {
  const tray = document.getElementById("device-tray");
  tray.innerHTML = "";
  const cat = SANDBOX_CATEGORIES.find(c => c.key === catKey);
  if (catKey === "conn") {
    tray.classList.add("conn-mode");
    renderCableToolbar(tray, key => {
      sbActiveTool = key;
      if (sbPending) { sbPending.el.classList.remove("pending"); sbPending = null; }
    }, null);
    return;
  }
  tray.classList.remove("conn-mode");
  cat.devices.forEach(key => {
    const dev = DEVICE_LIB[key];
    const el = document.createElement("div");
    el.className = "tray-device";
    el.draggable = true;
    el.innerHTML = `<span class="tray-glyph">${sbGlyph(key)}</span><span class="tray-label">${dev.label}</span>`;
    el.addEventListener("click", () => addSbDeviceCascade(key));
    el.addEventListener("dragstart", e => e.dataTransfer.setData("text/plain", "tray:" + key));
    tray.appendChild(el);
  });
}

function addSbDeviceCascade(key) {
  const canvas = document.getElementById("sandbox-canvas");
  const w = canvas.clientWidth || 320;
  const cols = Math.max(3, Math.floor(w / 110));
  const i = sbAddIndex++;
  const x = 24 + (i % cols) * 96;
  const y = 24 + (Math.floor(i / cols) % 4) * 104;
  addSbDevice(key, x, y);
}

function addSbDevice(key, x, y) {
  const id = "sb" + (sbCounter++);
  const canvas = document.getElementById("sandbox-canvas");
  const dev = DEVICE_LIB[key];
  const el = document.createElement("div");
  el.className = "sb-device";
  el.id = id;
  el.dataset.key = key;
  el.style.left = Math.max(0, x) + "px";
  el.style.top = Math.max(0, y) + "px";

  const body = document.createElement("div");
  body.className = "sb-body";
  body.innerHTML = `<span class="sb-glyph">${sbGlyph(key)}</span><span class="sb-name">${dev.label}</span>`;
  el.appendChild(body);

  const portList = document.createElement("div");
  portList.className = "port-list";
  portsForDisplay(key).forEach(p => portList.appendChild(makePortDot(id, p, handleSbPortClick)));
  el.appendChild(portList);

  let dragging = false, ox = 0, oy = 0;
  body.addEventListener("pointerdown", e => {
    if (sbMode === "delete") { deleteSbDevice(id); return; }
    dragging = true; ox = e.clientX; oy = e.clientY;
    body.setPointerCapture(e.pointerId);
  });
  body.addEventListener("pointermove", e => {
    if (!dragging) return;
    const dx = e.clientX - ox, dy = e.clientY - oy;
    ox = e.clientX; oy = e.clientY;
    el.style.left = Math.max(0, el.offsetLeft + dx) + "px";
    el.style.top = Math.max(0, el.offsetTop + dy) + "px";
    drawSbLinks();
  });
  body.addEventListener("pointerup", () => { dragging = false; });

  canvas.appendChild(el);
}

function deleteSbDevice(id) {
  sbLinks = sbLinks.filter(l => l.a.devId !== id && l.b.devId !== id);
  const el = document.getElementById(id);
  if (el) el.remove();
  if (sbPending && sbPending.devId === id) sbPending = null;
  drawSbLinks();
  toast("Aparato eliminado 🗑️");
}

function handleSbPortClick(devId, portId, type, dotEl) {
  if (sbMode === "delete") {
    sbLinks = sbLinks.filter(l => !((l.a.devId === devId && l.a.portId === portId) || (l.b.devId === devId && l.b.portId === portId)));
    dotEl.classList.remove("used");
    drawSbLinks();
    return;
  }
  if (!sbActiveTool) { toast("Elige primero una conexión en la pestaña 🔌 Conexiones"); return; }
  if (!sbPending) {
    sbPending = { devId, portId, type, el: dotEl };
    dotEl.classList.add("pending");
    return;
  }
  if (sbPending.devId === devId && sbPending.portId === portId) {
    dotEl.classList.remove("pending");
    sbPending = null;
    return;
  }
  const ok = canConnect(sbPending.type, type, sbActiveTool);
  sbPending.el.classList.remove("pending");
  if (ok) {
    sbLinks.push({ a: { devId: sbPending.devId, portId: sbPending.portId }, b: { devId, portId }, tool: sbActiveTool });
    sbPending.el.classList.add("used");
    dotEl.classList.add("used");
    toast("¡Conectado correctamente! ✅");
    drawSbLinks();
  } else {
    const pEl = sbPending.el;
    dotEl.classList.add("flash-bad");
    pEl.classList.add("flash-bad");
    setTimeout(() => { dotEl.classList.remove("flash-bad"); pEl.classList.remove("flash-bad"); }, 500);
    toast(mismatchMessage(sbPending.type, type, sbActiveTool));
  }
  sbPending = null;
}

function drawSbLinks() {
  const svg = document.getElementById("sandbox-lines");
  svg.innerHTML = "";
  svg.style.pointerEvents = "none";
  const canvas = document.getElementById("sandbox-canvas");
  const canvasRect = canvas.getBoundingClientRect();
  const NS = "http://www.w3.org/2000/svg";
  sbLinks.forEach(link => {
    const elA = document.querySelector(`#${link.a.devId} .port-dot[data-port="${link.a.portId}"]`);
    const elB = document.querySelector(`#${link.b.devId} .port-dot[data-port="${link.b.portId}"]`);
    if (!elA || !elB) return;
    const ra = elA.getBoundingClientRect(), rb = elB.getBoundingClientRect();
    const x1 = ra.left + ra.width / 2 - canvasRect.left, y1 = ra.top + ra.height / 2 - canvasRect.top;
    const x2 = rb.left + rb.width / 2 - canvasRect.left, y2 = rb.top + rb.height / 2 - canvasRect.top;
    const wireless = isWirelessTool(link.tool);

    // línea ancha (transparente) para poder tocar y borrar el cable en modo borrar
    const hit = document.createElementNS(NS, "line");
    hit.setAttribute("x1", x1); hit.setAttribute("y1", y1);
    hit.setAttribute("x2", x2); hit.setAttribute("y2", y2);
    hit.setAttribute("stroke", "#000");
    hit.setAttribute("stroke-opacity", "0");
    hit.setAttribute("stroke-width", "16");
    hit.style.pointerEvents = (sbMode === "delete") ? "stroke" : "none";
    hit.style.cursor = "pointer";
    hit.addEventListener("click", () => {
      if (sbMode !== "delete") return;
      sbLinks = sbLinks.filter(l => l !== link);
      elA.classList.remove("used"); elB.classList.remove("used");
      drawSbLinks();
      toast("Cable eliminado 🗑️");
    });
    svg.appendChild(hit);

    const line = document.createElementNS(NS, "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    line.setAttribute("stroke", colorForTool(link.tool));
    line.setAttribute("stroke-width", "3");
    line.setAttribute("stroke-linecap", "round");
    if (wireless) line.setAttribute("stroke-dasharray", "6,5");
    line.style.pointerEvents = "none";
    svg.appendChild(line);

    // luces de estado verdes en cada extremo (enlace "activo", como en Packet Tracer)
    [[x1, y1], [x2, y2]].forEach(([x, y]) => {
      const dot = document.createElementNS(NS, "rect");
      dot.setAttribute("x", x - 4.5); dot.setAttribute("y", y - 4.5);
      dot.setAttribute("width", "9"); dot.setAttribute("height", "9");
      dot.setAttribute("rx", "1.5");
      dot.setAttribute("fill", "#22c55e");
      dot.setAttribute("stroke", "#ffffff");
      dot.setAttribute("stroke-width", "1.5");
      dot.style.pointerEvents = "none";
      svg.appendChild(dot);
    });
  });
}

function clearSandbox() {
  const canvas = document.getElementById("sandbox-canvas");
  canvas.innerHTML = "";
  document.getElementById("sandbox-lines").innerHTML = "";
  sbLinks = [];
  sbPending = null;
  sbAddIndex = 0;
}

function saveSandboxDesign() {
  const name = document.getElementById("sandbox-design-name").value.trim();
  if (!name) { toast("Ponle un nombre a tu red primero"); return; }
  const devices = [...document.querySelectorAll(".sb-device")].map(el => el.dataset.key);
  if (devices.length === 0) { toast("Añade al menos un dispositivo"); return; }
  state.sandboxDesigns.push({ name, deviceCount: devices.length, linkCount: sbLinks.length, date: new Date().toLocaleDateString() });
  saveState();
  document.getElementById("sandbox-design-name").value = "";
  toast("¡Red guardada! 💾");
  renderSavedDesigns();
}

function renderSavedDesigns() {
  const list = document.getElementById("sandbox-saved-list");
  list.innerHTML = "";
  const designs = state.sandboxDesigns || [];
  if (designs.length === 0) {
    list.innerHTML = `<div class="saved-empty">Aún no has guardado ninguna red.</div>`;
    return;
  }
  designs.slice().reverse().forEach(d => {
    const item = document.createElement("div");
    item.className = "saved-item";
    item.innerHTML = `<span>📁 ${d.name}</span><span>${d.deviceCount} disp. · ${d.linkCount} conex. · ${d.date}</span>`;
    list.appendChild(item);
  });
}


/* ============================================================
   INIT / EVENTOS
   ============================================================ */
function init() {
  renderHome();
  document.getElementById("player-name").addEventListener("input", e => {
    state.name = e.target.value;
    checkStartEnabled();
  });

  document.getElementById("btn-start").addEventListener("click", () => {
    state.name = document.getElementById("player-name").value.trim();
    saveState();
    renderMap();
    showScreen("screen-map");
  });

  document.getElementById("btn-map-home").addEventListener("click", () => {
    showScreen("screen-home");
    renderHome();
  });
  document.getElementById("btn-map-sandbox").addEventListener("click", () => {
    renderSandbox();
    showScreen("screen-sandbox");
  });
  document.getElementById("btn-missions-back").addEventListener("click", () => {
    renderMap();
    showScreen("screen-map");
  });
  document.getElementById("btn-mission-exit").addEventListener("click", () => {
    renderMap();
    showScreen("screen-map");
  });
  document.getElementById("btn-sandbox-back").addEventListener("click", () => {
    renderMap();
    showScreen("screen-map");
  });
  document.getElementById("btn-sandbox-clear").addEventListener("click", clearSandbox);
  document.getElementById("btn-sandbox-savebtn").addEventListener("click", saveSandboxDesign);
  document.getElementById("btn-sandbox-save").addEventListener("click", saveSandboxDesign);

  // Si ya hay un perfil guardado, ir directo al mapa
  if (state.course && state.avatar && state.name) {
    renderMap();
    showScreen("screen-map");
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

document.addEventListener("DOMContentLoaded", init);
