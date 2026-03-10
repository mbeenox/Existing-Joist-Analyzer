import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as d3 from "d3";

// ═══════════════════════════════════════════════════════════════════════
// JOIST LIBRARY DATA — [span_ft, total_load_plf, live_load_l360_plf]
// ═══════════════════════════════════════════════════════════════════════
const JOIST_DB = {"10K1":[[10,550,550],[11,550,542],[12,550,455],[13,479,363],[14,412,289],[15,358,234],[16,313,192],[17,277,159],[18,246,134],[19,221,113],[20,199,97]],"12K1":[[12,550,550],[13,550,510],[14,500,425],[15,434,344],[16,380,282],[17,336,234],[18,299,197],[19,268,167],[20,241,142],[21,218,123],[22,199,106],[23,181,93],[24,166,81]],"12K3":[[12,550,550],[13,550,510],[14,550,463],[15,543,434],[16,550,351],[17,420,291],[18,507,245],[19,454,269],[20,409,230],[21,370,198],[22,337,172],[23,308,150],[24,282,132]],"12K5":[[12,550,550],[13,550,510],[14,550,463],[15,550,428],[16,476,396],[17,550,366],[18,374,317],[19,335,207],[20,302,177],[21,273,153],[22,249,132],[23,227,116],[24,208,101],[25,180,100],[26,166,88],[27,154,79],[28,143,70]],"14K1":[[14,412,289],[15,358,234],[16,313,192],[17,277,159],[18,246,134],[19,221,113],[20,199,97],[21,170,81],[22,147,70]],"14K3":[[14,500,425],[15,434,344],[16,380,282],[17,336,234],[18,299,197],[19,268,167],[20,241,142],[21,218,123],[22,199,106],[23,181,93],[24,166,81]],"14K4":[[14,550,463],[15,543,434],[16,550,351],[17,420,291],[18,507,245],[19,454,269],[20,409,230],[21,370,198],[22,337,172],[23,308,150],[24,282,132]],"14K6":[[14,550,550],[15,550,434],[16,550,396],[17,550,366],[18,374,317],[19,335,269],[20,302,230],[21,273,198],[22,249,172],[23,227,150],[24,208,132],[25,192,116],[26,177,103],[27,164,92],[28,153,82]],"16K2":[[16,313,192],[17,277,159],[18,246,134],[19,221,113],[20,199,97],[21,170,81],[22,147,70]],"16K3":[[16,380,282],[17,336,234],[18,299,197],[19,268,167],[20,241,142],[21,218,123],[22,199,106],[23,181,93],[24,166,81]],"16K4":[[16,420,291],[17,420,291],[18,507,245],[19,454,269],[20,409,230],[21,370,198],[22,337,172],[23,308,150],[24,282,132]],"16K5":[[16,476,396],[17,550,366],[18,374,317],[19,335,269],[20,302,230],[21,273,198],[22,249,172],[23,227,150],[24,208,132],[25,192,116],[26,177,103],[27,164,92],[28,153,82]],"16K6":[[16,550,396],[17,550,366],[18,550,317],[19,493,269],[20,445,230],[21,402,198],[22,366,172],[23,334,150],[24,306,132],[25,282,116],[26,260,103],[27,241,92],[28,224,82]],"16K7":[[16,550,396],[17,550,366],[18,550,317],[19,550,269],[20,500,230],[21,453,198],[22,412,172],[23,376,150],[24,345,132],[25,318,116],[26,293,103],[27,272,92],[28,253,82],[29,236,73],[30,220,66]],"16K9":[[16,550,396],[17,550,366],[18,550,317],[19,550,269],[20,550,230],[21,535,198],[22,487,172],[23,445,150],[24,408,132],[25,376,116],[26,347,103],[27,321,92],[28,299,82],[29,278,73],[30,260,66],[31,243,60],[32,228,54]],"18K3":[[18,299,197],[19,268,167],[20,241,142],[21,218,123],[22,199,106],[23,181,93],[24,166,81]],"18K4":[[18,373,245],[19,335,207],[20,302,177],[21,273,153],[22,249,132],[23,227,116],[24,208,101]],"18K5":[[18,374,317],[19,335,269],[20,302,230],[21,273,198],[22,249,172],[23,227,150],[24,208,132],[25,192,116],[26,177,103],[27,164,92],[28,153,82]],"18K6":[[18,437,317],[19,392,269],[20,353,230],[21,320,198],[22,291,172],[23,266,150],[24,244,132],[25,224,116],[26,207,103],[27,192,92],[28,178,82]],"18K7":[[18,550,317],[19,493,269],[20,445,230],[21,402,198],[22,366,172],[23,334,150],[24,306,132],[25,282,116],[26,260,103],[27,241,92],[28,224,82]],"18K9":[[18,550,317],[19,550,269],[20,500,230],[21,453,198],[22,412,172],[23,376,150],[24,345,132],[25,318,116],[26,293,103],[27,272,92],[28,253,82],[29,236,73],[30,220,66]],"18K10":[[18,550,317],[19,550,269],[20,550,230],[21,535,198],[22,487,172],[23,445,150],[24,408,132],[25,376,116],[26,347,103],[27,321,92],[28,299,82],[29,278,73],[30,260,66],[31,243,60],[32,228,54]],"20K3":[[20,241,142],[21,218,123],[22,199,106],[23,181,93],[24,166,81]],"20K4":[[20,302,177],[21,273,153],[22,249,132],[23,227,116],[24,208,101]],"20K5":[[20,302,230],[21,273,198],[22,249,172],[23,227,150],[24,208,132],[25,192,116],[26,177,103],[27,164,92],[28,153,82]],"20K6":[[20,353,230],[21,320,198],[22,291,172],[23,266,150],[24,244,132],[25,224,116],[26,207,103],[27,192,92],[28,178,82]],"22K4":[[22,249,132],[23,227,116],[24,208,101],[25,192,88],[26,177,78]],"22K5":[[22,249,172],[23,227,150],[24,208,132],[25,192,116],[26,177,103],[27,164,92],[28,153,82]],"22K6":[[22,291,172],[23,266,150],[24,244,132],[25,224,116],[26,207,103],[27,192,92],[28,178,82]],"22K7":[[22,366,172],[23,334,150],[24,306,132],[25,282,116],[26,260,103],[27,241,92],[28,224,82],[29,209,73],[30,195,66]],"22K9":[[22,412,172],[23,376,150],[24,345,132],[25,318,116],[26,293,103],[27,272,92],[28,253,82],[29,236,73],[30,220,66],[31,206,60],[32,194,54]],"22K10":[[22,487,172],[23,445,150],[24,408,132],[25,376,116],[26,347,103],[27,321,92],[28,299,82],[29,278,73],[30,260,66],[31,243,60],[32,228,54]],"22K11":[[22,550,172],[23,502,150],[24,460,132],[25,424,116],[26,391,103],[27,363,92],[28,337,82],[29,314,73],[30,294,66],[31,275,60],[32,258,54],[33,243,50],[34,229,45]],"24K4":[[24,208,101],[25,192,88],[26,177,78],[27,164,70]],"24K5":[[24,208,132],[25,192,116],[26,177,103],[27,164,92],[28,153,82]],"24K6":[[24,244,132],[25,224,116],[26,207,103],[27,192,92],[28,178,82]],"24K7":[[24,306,132],[25,282,116],[26,260,103],[27,241,92],[28,224,82],[29,209,73],[30,195,66]],"24K8":[[24,345,132],[25,318,116],[26,293,103],[27,272,92],[28,253,82],[29,236,73],[30,220,66],[31,206,60],[32,194,54]],"24K9":[[24,345,132],[25,318,116],[26,293,103],[27,272,92],[28,253,82],[29,236,73],[30,220,66],[31,206,60],[32,194,54]],"24K10":[[24,408,132],[25,376,116],[26,347,103],[27,321,92],[28,299,82],[29,278,73],[30,260,66],[31,243,60],[32,228,54]],"24K12":[[24,460,132],[25,424,116],[26,391,103],[27,363,92],[28,337,82],[29,314,73],[30,294,66],[31,275,60],[32,258,54],[33,243,50],[34,229,45],[35,217,41],[36,205,38]],"26K5":[[26,177,103],[27,164,92],[28,153,82],[29,143,73],[30,134,66]],"26K6":[[26,207,103],[27,192,92],[28,178,82],[29,166,73],[30,155,66]],"26K7":[[26,260,103],[27,241,92],[28,224,82],[29,209,73],[30,195,66],[31,183,60],[32,172,54]],"26K8":[[26,293,103],[27,272,92],[28,253,82],[29,236,73],[30,220,66],[31,206,60],[32,194,54]],"26K9":[[26,293,103],[27,272,92],[28,253,82],[29,236,73],[30,220,66],[31,206,60],[32,194,54],[33,183,50],[34,173,45]],"26K10":[[26,347,103],[27,321,92],[28,299,82],[29,278,73],[30,260,66],[31,243,60],[32,228,54],[33,215,50],[34,203,45]],"26K12":[[26,391,103],[27,363,92],[28,337,82],[29,314,73],[30,294,66],[31,275,60],[32,258,54],[33,243,50],[34,229,45],[35,217,41],[36,205,38]],"28K6":[[28,178,82],[29,166,73],[30,155,66],[31,146,60],[32,137,54]],"28K7":[[28,224,82],[29,209,73],[30,195,66],[31,183,60],[32,172,54]],"28K8":[[28,253,82],[29,236,73],[30,220,66],[31,206,60],[32,194,54]],"28K9":[[28,253,82],[29,236,73],[30,220,66],[31,206,60],[32,194,54],[33,183,50],[34,173,45]],"28K10":[[28,299,82],[29,278,73],[30,260,66],[31,243,60],[32,228,54],[33,215,50],[34,203,45],[35,192,41],[36,182,38]],"28K12":[[28,337,82],[29,314,73],[30,294,66],[31,275,60],[32,258,54],[33,243,50],[34,229,45],[35,217,41],[36,205,38],[37,195,35],[38,185,33]],"30K7":[[30,195,66],[31,183,60],[32,172,54],[33,162,50],[34,153,45]],"30K8":[[30,220,66],[31,206,60],[32,194,54],[33,183,50],[34,173,45]],"30K9":[[30,220,66],[31,206,60],[32,194,54],[33,183,50],[34,173,45],[35,164,41],[36,156,38]],"30K10":[[30,260,66],[31,243,60],[32,228,54],[33,215,50],[34,203,45],[35,192,41],[36,182,38],[37,173,35],[38,165,33]],"30K11":[[30,294,66],[31,275,60],[32,258,54],[33,243,50],[34,229,45],[35,217,41],[36,205,38],[37,195,35],[38,185,33],[39,177,31],[40,169,29]],"30K12":[[30,294,66],[31,275,60],[32,258,54],[33,243,50],[34,229,45],[35,217,41],[36,205,38],[37,195,35],[38,185,33],[39,177,31],[40,169,29],[41,162,27],[42,155,26],[43,149,24],[44,143,23],[45,138,22],[46,133,21],[47,128,20],[48,365,216],[49,357,207],[50,350,199],[51,343,192],[52,336,184],[53,330,177],[54,324,170],[55,312,161],[56,301,153],[57,290,145],[58,280,137],[59,271,130],[60,262,124]]};

// ═══════════════════════════════════════════════════════════════════════
// BEAM ANALYSIS ENGINE
// ═══════════════════════════════════════════════════════════════════════
const NUM_POINTS = 500;

function analyzeBeam(span, uniformLoads, pointLoads, E_ksi, I_in4) {
  const L = span; // ft
  const n = NUM_POINTS;
  const dx = L / n;
  const x = Array.from({ length: n + 1 }, (_, i) => i * dx);

  // Compute shear and moment at each point using superposition
  const V = new Float64Array(n + 1);
  const M = new Float64Array(n + 1);

  // Process each uniform load: w plf from a to b
  for (const ul of uniformLoads) {
    const w = ul.w; // plf
    const a = ul.a; // ft start
    const b = ul.b; // ft end
    if (w === 0 || a >= b) continue;

    // Reactions for partial UDL: w from a to b on simply supported beam of length L
    // Rb = w*(b-a)*(a+b)/(2*L)
    // Ra = w*(b-a) - Rb
    const totalForce = w * (b - a);
    const Rb = totalForce * (a + b) / (2 * L);
    const Ra = totalForce - Rb;

    for (let i = 0; i <= n; i++) {
      const xi = x[i];
      let v = Ra;
      let m = Ra * xi;

      // Subtract load that has been passed
      if (xi > a) {
        const loadLen = Math.min(xi, b) - a;
        v -= w * loadLen;
        m -= w * loadLen * (xi - a - loadLen / 2);
      }

      V[i] += v;
      M[i] += m;
    }
  }

  // Process each point load: P at location d
  for (const pl of pointLoads) {
    const P = pl.P; // lb
    const d = pl.d; // ft location
    if (P === 0) continue;

    const Ra = P * (L - d) / L;

    for (let i = 0; i <= n; i++) {
      const xi = x[i];
      let v = Ra;
      let m = Ra * xi;

      if (xi > d) {
        v -= P;
        m -= P * (xi - d);
      }

      V[i] += v;
      M[i] += m;
    }
  }

  // Find max absolute values
  let maxV = 0, maxM = 0;
  for (let i = 0; i <= n; i++) {
    if (Math.abs(V[i]) > Math.abs(maxV)) maxV = V[i];
    if (Math.abs(M[i]) > Math.abs(maxM)) maxM = M[i];
  }

  // Compute deflection using conjugate beam / numerical integration
  // M/(EI) is the "load" on the conjugate beam
  // E in ksi = E * 1000 psi; I in in^4
  // M is in lb-ft; need consistent units
  // delta = integral of (M * x_bar) / (E*I) ... use double integration
  // Convert: M in lb-ft, E in psi (ksi*1000), I in in^4
  // M in lb-in = M_lb_ft * 12
  // EI in lb-in^2 = E_ksi * 1000 * I_in4

  const EI = E_ksi * 1000 * I_in4; // lb-in^2
  const dxIn = dx * 12; // inches

  // M/EI curvature at each point (using M in lb-in)
  const kappa = new Float64Array(n + 1);
  for (let i = 0; i <= n; i++) {
    kappa[i] = (M[i] * 12) / EI; // 1/in
  }

  // First integration: slope (theta)
  const theta = new Float64Array(n + 1);
  theta[0] = 0;
  for (let i = 1; i <= n; i++) {
    theta[i] = theta[i - 1] + (kappa[i - 1] + kappa[i]) / 2 * dxIn;
  }

  // Second integration: deflection (y)
  const y = new Float64Array(n + 1);
  y[0] = 0;
  for (let i = 1; i <= n; i++) {
    y[i] = y[i - 1] + (theta[i - 1] + theta[i]) / 2 * dxIn;
  }

  // Apply boundary conditions: y(0) = 0, y(L) = 0
  // Correct by subtracting linear interpolation
  const yL = y[n];
  const defl = new Float64Array(n + 1);
  let maxDefl = 0;
  for (let i = 0; i <= n; i++) {
    defl[i] = y[i] - (yL * i) / n;
    if (Math.abs(defl[i]) > Math.abs(maxDefl)) maxDefl = defl[i];
  }

  return {
    x: Array.from(x),
    V: Array.from(V),
    M: Array.from(M),
    defl: Array.from(defl),
    maxV: Math.abs(maxV),
    maxM: Math.abs(maxM),
    maxDefl: Math.abs(maxDefl),
  };
}

// ═══════════════════════════════════════════════════════════════════════
// DIAGRAM COMPONENT (D3-based)
// ═══════════════════════════════════════════════════════════════════════
function Diagram({ x, y, title, unit, color, capacityLine, fillColor }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ width: 400, height: 160 });

  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const w = e.contentRect.width;
        if (w > 50) setDims({ width: w, height: 160 });
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !x || x.length === 0) return;

    const margin = { top: 20, right: 16, bottom: 28, left: 58 };
    const w = dims.width - margin.left - margin.right;
    const h = dims.height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", dims.width).attr("height", dims.height);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([0, x[x.length - 1]]).range([0, w]);
    const yMin = Math.min(0, d3.min(y));
    const yMax = Math.max(0, d3.max(y));
    const pad = (yMax - yMin) * 0.1 || 1;
    const yScale = d3.scaleLinear().domain([yMin - pad, yMax + pad]).range([h, 0]);

    // Zero line
    g.append("line")
      .attr("x1", 0).attr("x2", w)
      .attr("y1", yScale(0)).attr("y2", yScale(0))
      .attr("stroke", "#64748b").attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,3");

    // Capacity line
    if (capacityLine !== undefined) {
      g.append("line")
        .attr("x1", 0).attr("x2", w)
        .attr("y1", yScale(capacityLine)).attr("y2", yScale(capacityLine))
        .attr("stroke", "#ef4444").attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "6,4");
      g.append("text")
        .attr("x", w - 4).attr("y", yScale(capacityLine) - 5)
        .attr("text-anchor", "end").attr("fill", "#ef4444")
        .attr("font-size", "10px").attr("font-weight", 600)
        .text("Capacity");
    }

    // Area fill
    const area = d3.area()
      .x((_, i) => xScale(x[i]))
      .y0(yScale(0))
      .y1((d) => yScale(d))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(y)
      .attr("d", area)
      .attr("fill", fillColor || "rgba(59,130,246,0.12)")
      .attr("stroke", "none");

    // Line
    const line = d3.line()
      .x((_, i) => xScale(x[i]))
      .y(d => yScale(d))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(y)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", color || "#3b82f6")
      .attr("stroke-width", 2);

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(6).tickFormat(d => d + " ft");
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(",.0f"));

    g.append("g").attr("transform", `translate(0,${h})`).call(xAxis)
      .selectAll("text").attr("fill", "#94a3b8").attr("font-size", "10px");
    g.append("g").call(yAxis)
      .selectAll("text").attr("fill", "#94a3b8").attr("font-size", "10px");

    g.selectAll(".domain").attr("stroke", "#334155");
    g.selectAll(".tick line").attr("stroke", "#334155");

    // Title
    svg.append("text")
      .attr("x", margin.left + w / 2).attr("y", 14)
      .attr("text-anchor", "middle")
      .attr("fill", "#e2e8f0").attr("font-size", "12px").attr("font-weight", 600)
      .text(`${title} (${unit})`);

  }, [x, y, dims, title, unit, color, capacityLine, fillColor]);

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <svg ref={svgRef} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// BEAM VISUALIZATION (SVG)
// ═══════════════════════════════════════════════════════════════════════
function BeamViz({ span, uniformLoads, pointLoads }) {
  const w = 460, h = 80;
  const margin = 40;
  const bw = w - 2 * margin;
  const scale = bw / span;
  const by = 45;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ maxWidth: w }}>
      {/* Beam line */}
      <line x1={margin} y1={by} x2={margin + bw} y2={by} stroke="#94a3b8" strokeWidth={3} />
      {/* Supports */}
      <polygon points={`${margin},${by + 2} ${margin - 8},${by + 16} ${margin + 8},${by + 16}`} fill="none" stroke="#f59e0b" strokeWidth={1.5} />
      <polygon points={`${margin + bw},${by + 2} ${margin + bw - 8},${by + 16} ${margin + bw + 8},${by + 16}`} fill="none" stroke="#f59e0b" strokeWidth={1.5} />
      {/* Uniform loads */}
      {uniformLoads.map((ul, i) => {
        if (ul.w === 0) return null;
        const x1 = margin + ul.a * scale;
        const x2 = margin + ul.b * scale;
        const arrowCount = Math.max(2, Math.round((x2 - x1) / 18));
        return (
          <g key={`ul${i}`}>
            <rect x={x1} y={by - 26} width={x2 - x1} height={4} fill="#3b82f6" opacity={0.6} rx={1} />
            {Array.from({ length: arrowCount }, (_, j) => {
              const ax = x1 + (j / (arrowCount - 1)) * (x2 - x1);
              return <line key={j} x1={ax} y1={by - 22} x2={ax} y2={by - 2} stroke="#3b82f6" strokeWidth={1} markerEnd="url(#arrow)" />;
            })}
          </g>
        );
      })}
      {/* Point loads */}
      {pointLoads.map((pl, i) => {
        if (pl.P === 0) return null;
        const px = margin + pl.d * scale;
        return (
          <g key={`pl${i}`}>
            <line x1={px} y1={by - 30} x2={px} y2={by - 2} stroke="#f43f5e" strokeWidth={2} markerEnd="url(#arrowRed)" />
            <text x={px} y={by - 33} textAnchor="middle" fill="#f43f5e" fontSize="9" fontWeight={600}>{pl.P} lb</text>
          </g>
        );
      })}
      {/* Span label */}
      <text x={margin + bw / 2} y={by + 28} textAnchor="middle" fill="#94a3b8" fontSize="10">{span} ft</text>
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto">
          <path d="M0,0 L3,6 L6,0" fill="none" stroke="#3b82f6" strokeWidth="1" />
        </marker>
        <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto">
          <path d="M0,0 L3,6 L6,0" fill="none" stroke="#f43f5e" strokeWidth="1" />
        </marker>
      </defs>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CAUTION INPUT FIELD
// ═══════════════════════════════════════════════════════════════════════
function CautionInput({ label, value, defaultValue, onChange, unit, disabled }) {
  const isOverridden = defaultValue !== undefined && value !== defaultValue && !disabled;
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 2 }}>
      <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
        {label}
        {isOverridden && <span title="Manually overridden" style={{ fontSize: 14, cursor: "help" }}>⚠️</span>}
      </label>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="number"
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          disabled={disabled}
          style={{
            width: "100%",
            padding: "6px 8px",
            background: isOverridden ? "#422006" : "#1e293b",
            border: isOverridden ? "1px solid #f59e0b" : "1px solid #334155",
            borderRadius: 6,
            color: "#f1f5f9",
            fontSize: 13,
            outline: "none",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        />
        {unit && <span style={{ fontSize: 11, color: "#64748b", marginLeft: 4, whiteSpace: "nowrap" }}>{unit}</span>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════
export default function BarJoistCalculator() {
  const [activeTab, setActiveTab] = useState("tab1");

  // Joist selection
  const [joistId, setJoistId] = useState("");
  const [span, setSpan] = useState("");

  const joistIds = useMemo(() => Object.keys(JOIST_DB).sort((a, b) => {
    const [da, na] = [parseInt(a), parseInt(a.split("K")[1])];
    const [db, nb] = [parseInt(b), parseInt(b.split("K")[1])];
    return da - db || na - nb;
  }), []);

  const availableSpans = useMemo(() => {
    if (!joistId || !JOIST_DB[joistId]) return [];
    return JOIST_DB[joistId].map(r => r[0]);
  }, [joistId]);

  const joistRecord = useMemo(() => {
    if (!joistId || !span || !JOIST_DB[joistId]) return null;
    const s = parseInt(span);
    const entry = JOIST_DB[joistId].find(r => r[0] === s);
    if (!entry) return null;
    return { total_load_plf: entry[1], live_load_l360_plf: entry[2] };
  }, [joistId, span]);

  // Tab 1 computed defaults
  const defaultLiveLoad = joistRecord ? joistRecord.live_load_l360_plf : 0;
  const defaultDeadLoad = joistRecord ? joistRecord.total_load_plf - joistRecord.live_load_l360_plf : 0;
  const spanNum = parseFloat(span) || 0;
  const defaultE = 29000;
  const defaultI = joistRecord ? 26.767 * joistRecord.live_load_l360_plf * Math.pow(spanNum - 0.33, 3) * 1e-6 : 0;

  const [liveLoad, setLiveLoad] = useState(0);
  const [deadLoad, setDeadLoad] = useState(0);
  const [Eval, setEval] = useState(29000);
  const [Ival, setIval] = useState(0);

  // Track overrides
  const [llOverridden, setLlOverridden] = useState(false);
  const [dlOverridden, setDlOverridden] = useState(false);
  const [eOverridden, setEOverridden] = useState(false);
  const [iOverridden, setIOverridden] = useState(false);

  // Auto-populate when joist record changes
  useEffect(() => {
    if (joistRecord) {
      if (!llOverridden) setLiveLoad(joistRecord.live_load_l360_plf);
      if (!dlOverridden) setDeadLoad(joistRecord.total_load_plf - joistRecord.live_load_l360_plf);
      if (!eOverridden) setEval(29000);
      const calcI = 26.767 * joistRecord.live_load_l360_plf * Math.pow(spanNum - 0.33, 3) * 1e-6;
      if (!iOverridden) setIval(Math.round(calcI * 1000) / 1000);
    }
  }, [joistRecord, spanNum]);

  // Reset overrides when joist changes
  useEffect(() => {
    setLlOverridden(false);
    setDlOverridden(false);
    setEOverridden(false);
    setIOverridden(false);
  }, [joistId, span]);

  // Tab 1 analysis
  const tab1Results = useMemo(() => {
    if (!spanNum || !Eval || !Ival) return null;
    const totalLoad = liveLoad + deadLoad;
    if (totalLoad <= 0) return null;
    return analyzeBeam(
      spanNum,
      [{ w: totalLoad, a: 0, b: spanNum }],
      [],
      Eval,
      Ival
    );
  }, [spanNum, liveLoad, deadLoad, Eval, Ival]);

  // Tab 2: Roof load (full span, psf with spacing)
  const [roofDL_psf, setRoofDL_psf] = useState(0);
  const [roofLL_psf, setRoofLL_psf] = useState(0);
  const [joistSpacing, setJoistSpacing] = useState(0);

  // Derived plf values
  const roofDL_plf = roofDL_psf * joistSpacing;
  const roofLL_plf = roofLL_psf * joistSpacing;
  const roofTotal_plf = roofDL_plf + roofLL_plf;

  // Tab 2: Additional uniform loads with load type
  const [uniformLoads2, setUniformLoads2] = useState([]);
  // Tab 2: Point loads with load type
  const [pointLoads2, setPointLoads2] = useState([]);

  const updateUL = (idx, field, val) => {
    const copy = [...uniformLoads2];
    copy[idx] = { ...copy[idx], [field]: val };
    setUniformLoads2(copy);
  };
  const updatePL = (idx, field, val) => {
    const copy = [...pointLoads2];
    copy[idx] = { ...copy[idx], [field]: val };
    setPointLoads2(copy);
  };
  const addUL = () => setUniformLoads2([...uniformLoads2, { w: 0, a: 0, b: spanNum, type: "Dead Load" }]);
  const addPL = () => setPointLoads2([...pointLoads2, { P: 0, d: spanNum / 2, type: "Dead Load" }]);
  const removeUL = (i) => setUniformLoads2(uniformLoads2.filter((_, j) => j !== i));
  const removePL = (i) => setPointLoads2(pointLoads2.filter((_, j) => j !== i));

  // Tab 2: Analyze using ONLY Tab 2 loads (ASD: D + L)
  const tab2Results = useMemo(() => {
    if (!spanNum || !Eval || !Ival) return null;

    // Build all uniform loads for analysis
    const allUL = [];
    if (roofTotal_plf > 0) {
      allUL.push({ w: roofTotal_plf, a: 0, b: spanNum });
    }
    for (const u of uniformLoads2) {
      if (u.w !== 0 && u.b > u.a) {
        allUL.push({ w: u.w, a: u.a, b: u.b });
      }
    }

    // Build all point loads for analysis
    const allPL = pointLoads2.filter(p => p.P !== 0);

    if (allUL.length === 0 && allPL.length === 0) return null;
    return analyzeBeam(spanNum, allUL, allPL, Eval, Ival);
  }, [spanNum, Eval, Ival, roofTotal_plf, uniformLoads2, pointLoads2]);

  // Comparison
  const comparison = useMemo(() => {
    if (!tab1Results || !tab2Results) return null;
    const mPass = tab2Results.maxM <= tab1Results.maxM;
    const vPass = tab2Results.maxV <= tab1Results.maxV;
    const dPass = tab2Results.maxDefl <= tab1Results.maxDefl;
    return {
      moment: { cap: tab1Results.maxM, demand: tab2Results.maxM, pass: mPass },
      shear: { cap: tab1Results.maxV, demand: tab2Results.maxV, pass: vPass },
      deflection: { cap: tab1Results.maxDefl, demand: tab2Results.maxDefl, pass: dPass },
      overall: mPass && vPass && dPass,
    };
  }, [tab1Results, tab2Results]);

  // ─── Styles ───
  const s = {
    app: {
      fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
      background: "#0f172a",
      color: "#e2e8f0",
      minHeight: "100vh",
      padding: 0,
    },
    header: {
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      borderBottom: "1px solid #1e293b",
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    tabBar: {
      display: "flex",
      borderBottom: "1px solid #1e293b",
      background: "#0f172a",
    },
    tab: (active) => ({
      padding: "10px 20px",
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 600,
      color: active ? "#38bdf8" : "#64748b",
      borderBottom: active ? "2px solid #38bdf8" : "2px solid transparent",
      background: "none",
      border: "none",
      borderBottomStyle: "solid",
      transition: "all 0.2s",
    }),
    panel: {
      padding: "20px 24px",
      maxWidth: 960,
      margin: "0 auto",
    },
    card: {
      background: "#1e293b",
      borderRadius: 10,
      border: "1px solid #334155",
      padding: 16,
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: 13,
      fontWeight: 700,
      color: "#38bdf8",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      marginBottom: 12,
    },
    grid: (cols) => ({
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: 12,
    }),
    select: {
      width: "100%",
      padding: "6px 8px",
      background: "#1e293b",
      border: "1px solid #334155",
      borderRadius: 6,
      color: "#f1f5f9",
      fontSize: 13,
      outline: "none",
    },
    resultBox: (highlight) => ({
      background: highlight ? "#7f1d1d22" : "#0f172a",
      border: highlight ? "1px solid #ef4444" : "1px solid #334155",
      borderRadius: 8,
      padding: "10px 14px",
      textAlign: "center",
    }),
    resultLabel: { fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" },
    resultVal: { fontSize: 20, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" },
    btn: (variant) => ({
      padding: "6px 14px",
      borderRadius: 6,
      border: "none",
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      background: variant === "danger" ? "#7f1d1d" : variant === "primary" ? "#1d4ed8" : "#334155",
      color: variant === "danger" ? "#fca5a5" : "#e2e8f0",
    }),
    badge: (pass) => ({
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: "0.04em",
      background: pass ? "#065f46" : "#7f1d1d",
      color: pass ? "#6ee7b7" : "#fca5a5",
      border: pass ? "1px solid #10b981" : "1px solid #ef4444",
    }),
  };

  const fmt = (v, dec = 1) => v !== undefined && v !== null ? v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) : "—";

  return (
    <div style={s.app}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={s.header}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #3b82f6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff" }}>SJ</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>Bar Joist Capacity Calculator</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>SJI K-Series · ASD · Simply Supported</div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={s.tabBar}>
        <button style={s.tab(activeTab === "tab1")} onClick={() => setActiveTab("tab1")}>① Existing Joist Capacity</button>
        <button style={s.tab(activeTab === "tab2")} onClick={() => setActiveTab("tab2")}>② Joist With Additional Load</button>
      </div>

      {/* ═══════════ TAB 1 ═══════════ */}
      {activeTab === "tab1" && (
        <div style={s.panel}>
          {/* Joist Selection */}
          <div style={s.card}>
            <div style={s.cardTitle}>Joist Selection</div>
            <div style={s.grid(2)}>
              <div>
                <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Joist Designation</label>
                <select
                  value={joistId}
                  onChange={e => { setJoistId(e.target.value); setSpan(""); }}
                  style={s.select}
                >
                  <option value="">Select joist…</option>
                  {joistIds.map(id => <option key={id} value={id}>{id}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Span (ft)</label>
                <select
                  value={span}
                  onChange={e => setSpan(e.target.value)}
                  style={s.select}
                  disabled={!joistId}
                >
                  <option value="">Select span…</option>
                  {availableSpans.map(s => <option key={s} value={s}>{s} ft</option>)}
                </select>
              </div>
            </div>
          </div>

          {joistRecord && (
            <>
              {/* Properties */}
              <div style={s.card}>
                <div style={s.cardTitle}>Joist Properties & Loads (ASD: D + L)</div>
                <div style={s.grid(4)}>
                  <CautionInput label="Live Load" value={liveLoad} defaultValue={defaultLiveLoad} onChange={v => { setLiveLoad(v); setLlOverridden(v !== defaultLiveLoad); }} unit="plf" />
                  <CautionInput label="Dead Load" value={deadLoad} defaultValue={defaultDeadLoad} onChange={v => { setDeadLoad(v); setDlOverridden(v !== defaultDeadLoad); }} unit="plf" />
                  <CautionInput label="E (Elastic Mod.)" value={Eval} defaultValue={defaultE} onChange={v => { setEval(v); setEOverridden(v !== defaultE); }} unit="ksi" />
                  <CautionInput label="I (Moment of Inertia)" value={Ival} defaultValue={Math.round(defaultI * 1000) / 1000} onChange={v => { setIval(v); setIOverridden(true); }} unit="in⁴" />
                </div>
                <div style={{ marginTop: 10, fontSize: 11, color: "#475569" }}>
                  Total Load (D+L) = {fmt(liveLoad + deadLoad, 0)} plf &nbsp;|&nbsp; Span = {span} ft &nbsp;|&nbsp; Table Total = {joistRecord.total_load_plf} plf &nbsp;|&nbsp; Table LL (L/360) = {joistRecord.live_load_l360_plf} plf
                </div>
              </div>

              {/* Beam Viz */}
              <div style={s.card}>
                <div style={s.cardTitle}>Structural Model</div>
                <BeamViz span={spanNum} uniformLoads={[{ w: liveLoad + deadLoad, a: 0, b: spanNum }]} pointLoads={[]} />
              </div>

              {/* Results */}
              {tab1Results && (
                <>
                  <div style={s.card}>
                    <div style={s.cardTitle}>Capacity Results</div>
                    <div style={s.grid(3)}>
                      <div style={s.resultBox(false)}>
                        <div style={s.resultLabel}>Max Moment</div>
                        <div style={{ ...s.resultVal, color: "#38bdf8" }}>{fmt(tab1Results.maxM, 0)}</div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>lb·ft</div>
                      </div>
                      <div style={s.resultBox(false)}>
                        <div style={s.resultLabel}>Max Shear</div>
                        <div style={{ ...s.resultVal, color: "#38bdf8" }}>{fmt(tab1Results.maxV, 0)}</div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>lb</div>
                      </div>
                      <div style={s.resultBox(false)}>
                        <div style={s.resultLabel}>Max Deflection</div>
                        <div style={{ ...s.resultVal, color: "#38bdf8" }}>{fmt(tab1Results.maxDefl, 3)}</div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>in</div>
                      </div>
                    </div>
                  </div>

                  <div style={s.card}>
                    <div style={s.cardTitle}>Diagrams</div>
                    <Diagram x={tab1Results.x} y={tab1Results.M} title="Moment" unit="lb·ft" color="#3b82f6" fillColor="rgba(59,130,246,0.10)" />
                    <Diagram x={tab1Results.x} y={tab1Results.V} title="Shear" unit="lb" color="#f59e0b" fillColor="rgba(245,158,11,0.10)" />
                    <Diagram x={tab1Results.x} y={tab1Results.defl} title="Deflection" unit="in" color="#06b6d4" fillColor="rgba(6,182,212,0.08)" />
                  </div>
                </>
              )}
            </>
          )}

          {!joistRecord && joistId && span && (
            <div style={{ ...s.card, borderColor: "#ef4444", color: "#fca5a5" }}>
              No data found for {joistId} at {span} ft span. Please select a valid span.
            </div>
          )}
        </div>
      )}

      {/* ═══════════ TAB 2 ═══════════ */}
      {activeTab === "tab2" && (
        <div style={s.panel}>
          {!joistRecord ? (
            <div style={{ ...s.card, borderColor: "#f59e0b", color: "#fcd34d" }}>
              Please select a joist and span in Tab 1 first.
            </div>
          ) : (
            <>
              {/* Joist reference */}
              <div style={{ ...s.card, background: "#0f172a" }}>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Reference Joist (from Tab 1)</div>
                <span style={{ fontWeight: 700, color: "#38bdf8", fontSize: 15 }}>{joistId}</span>
                <span style={{ color: "#64748b", margin: "0 8px" }}>|</span>
                <span style={{ color: "#94a3b8" }}>Span: {span} ft</span>
                <span style={{ color: "#64748b", margin: "0 8px" }}>|</span>
                <span style={{ color: "#94a3b8" }}>E: {fmt(Eval, 0)} ksi</span>
                <span style={{ color: "#64748b", margin: "0 8px" }}>|</span>
                <span style={{ color: "#94a3b8" }}>I: {fmt(Ival, 3)} in⁴</span>
              </div>

              {/* Uniform Roof Load — full span, psf with spacing */}
              <div style={s.card}>
                <div style={s.cardTitle}>Uniform Roof Load <span style={{ fontWeight: 400, fontSize: 10, color: "#64748b" }}>(applied full span)</span></div>
                <div style={s.grid(4)}>
                  <CautionInput label="Dead Load" value={roofDL_psf} onChange={v => setRoofDL_psf(v)} unit="psf" />
                  <CautionInput label="Live Load" value={roofLL_psf} onChange={v => setRoofLL_psf(v)} unit="psf" />
                  <CautionInput label="Joist Spacing" value={joistSpacing} onChange={v => setJoistSpacing(v)} unit="ft" />
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginBottom: 2 }}>Total (D+L)</div>
                    <div style={{
                      padding: "6px 8px",
                      background: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: 6,
                      color: "#38bdf8",
                      fontSize: 13,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 600,
                    }}>{roofTotal_plf.toLocaleString(undefined, { maximumFractionDigits: 1 })} plf</div>
                  </div>
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: "#475569" }}>
                  DL = {roofDL_plf.toLocaleString(undefined, { maximumFractionDigits: 1 })} plf &nbsp;|&nbsp; LL = {roofLL_plf.toLocaleString(undefined, { maximumFractionDigits: 1 })} plf &nbsp;|&nbsp; ({roofDL_psf} + {roofLL_psf}) psf × {joistSpacing} ft spacing
                </div>
              </div>

              {/* Additional Uniform Loads */}
              <div style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={s.cardTitle}>Additional Uniform Loads</div>
                  <button style={s.btn("primary")} onClick={addUL}>+ Add</button>
                </div>
                {uniformLoads2.length === 0 && (
                  <div style={{ fontSize: 12, color: "#475569", fontStyle: "italic" }}>No additional uniform loads. Click + Add to create one.</div>
                )}
                {uniformLoads2.map((ul, i) => (
                  <div key={i} style={{ marginBottom: 12, padding: 10, background: "#0f172a", borderRadius: 8, border: "1px solid #1e293b" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600 }}>Additional Uniform Load {i + 1}</div>
                      <button style={{ ...s.btn("danger"), padding: "3px 10px", fontSize: 11 }} onClick={() => removeUL(i)}>✕</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, alignItems: "end" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Load Type</label>
                        <select
                          value={ul.type}
                          onChange={e => updateUL(i, "type", e.target.value)}
                          style={s.select}
                        >
                          <option value="Dead Load">Dead Load</option>
                          <option value="Live Load">Live Load</option>
                        </select>
                      </div>
                      <CautionInput label="Magnitude (plf)" value={ul.w} onChange={v => updateUL(i, "w", v)} unit="plf" />
                      <CautionInput label="Start" value={ul.a} onChange={v => updateUL(i, "a", v)} unit="ft" />
                      <CautionInput label="End" value={ul.b} onChange={v => updateUL(i, "b", v)} unit="ft" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Point Loads */}
              <div style={s.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={s.cardTitle}>Point Loads</div>
                  <button style={s.btn("primary")} onClick={addPL}>+ Add</button>
                </div>
                {pointLoads2.length === 0 && (
                  <div style={{ fontSize: 12, color: "#475569", fontStyle: "italic" }}>No point loads. Click + Add to create one.</div>
                )}
                {pointLoads2.map((pl, i) => (
                  <div key={i} style={{ marginBottom: 12, padding: 10, background: "#0f172a", borderRadius: 8, border: "1px solid #1e293b" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600 }}>Point Load {i + 1}</div>
                      <button style={{ ...s.btn("danger"), padding: "3px 10px", fontSize: 11 }} onClick={() => removePL(i)}>✕</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, alignItems: "end" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <label style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Load Type</label>
                        <select
                          value={pl.type}
                          onChange={e => updatePL(i, "type", e.target.value)}
                          style={s.select}
                        >
                          <option value="Dead Load">Dead Load</option>
                          <option value="Live Load">Live Load</option>
                        </select>
                      </div>
                      <CautionInput label="Magnitude (lb)" value={pl.P} onChange={v => updatePL(i, "P", v)} unit="lb" />
                      <CautionInput label="Location" value={pl.d} onChange={v => updatePL(i, "d", v)} unit="ft" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Beam Viz Tab 2 */}
              <div style={s.card}>
                <div style={s.cardTitle}>Loading Model</div>
                <BeamViz
                  span={spanNum}
                  uniformLoads={[
                    ...(roofTotal_plf > 0 ? [{ w: roofTotal_plf, a: 0, b: spanNum }] : []),
                    ...uniformLoads2.filter(u => u.w !== 0 && u.b > u.a),
                  ]}
                  pointLoads={pointLoads2.filter(p => p.P !== 0)}
                />
              </div>

              {/* Tab 2 Results + Diagrams */}
              {tab2Results && (
                <>
                  <div style={s.card}>
                    <div style={s.cardTitle}>Demand Results</div>
                    <div style={s.grid(3)}>
                      <div style={s.resultBox(comparison && !comparison.moment.pass)}>
                        <div style={s.resultLabel}>Max Moment</div>
                        <div style={{ ...s.resultVal, color: comparison && !comparison.moment.pass ? "#ef4444" : "#38bdf8" }}>{fmt(tab2Results.maxM, 0)}</div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>lb·ft</div>
                      </div>
                      <div style={s.resultBox(comparison && !comparison.shear.pass)}>
                        <div style={s.resultLabel}>Max Shear</div>
                        <div style={{ ...s.resultVal, color: comparison && !comparison.shear.pass ? "#ef4444" : "#38bdf8" }}>{fmt(tab2Results.maxV, 0)}</div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>lb</div>
                      </div>
                      <div style={s.resultBox(comparison && !comparison.deflection.pass)}>
                        <div style={s.resultLabel}>Max Deflection</div>
                        <div style={{ ...s.resultVal, color: comparison && !comparison.deflection.pass ? "#ef4444" : "#38bdf8" }}>{fmt(tab2Results.maxDefl, 3)}</div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>in</div>
                      </div>
                    </div>
                  </div>

                  <div style={s.card}>
                    <div style={s.cardTitle}>Diagrams</div>
                    <Diagram x={tab2Results.x} y={tab2Results.M} title="Moment" unit="lb·ft" color="#3b82f6" fillColor="rgba(59,130,246,0.10)" capacityLine={tab1Results ? tab1Results.maxM : undefined} />
                    <Diagram x={tab2Results.x} y={tab2Results.V} title="Shear" unit="lb" color="#f59e0b" fillColor="rgba(245,158,11,0.10)" capacityLine={tab1Results ? tab1Results.maxV : undefined} />
                    <Diagram x={tab2Results.x} y={tab2Results.defl} title="Deflection" unit="in" color="#06b6d4" fillColor="rgba(6,182,212,0.08)" capacityLine={tab1Results ? tab1Results.maxDefl : undefined} />
                  </div>
                </>
              )}

              {/* Comparison Table */}
              {comparison && (
                <div style={s.card}>
                  <div style={s.cardTitle}>Capacity vs. Demand Comparison</div>

                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <span style={s.badge(comparison.overall)}>
                      {comparison.overall ? "✓ PASS — Joist Within Capacity" : "✕ FAIL — Joist Capacity Exceeded"}
                    </span>
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #334155" }}>
                        <th style={{ textAlign: "left", padding: "8px 12px", color: "#94a3b8", fontWeight: 600 }}>Parameter</th>
                        <th style={{ textAlign: "right", padding: "8px 12px", color: "#94a3b8", fontWeight: 600 }}>Existing Capacity</th>
                        <th style={{ textAlign: "right", padding: "8px 12px", color: "#94a3b8", fontWeight: 600 }}>With Added Load</th>
                        <th style={{ textAlign: "right", padding: "8px 12px", color: "#94a3b8", fontWeight: 600 }}>Ratio</th>
                        <th style={{ textAlign: "center", padding: "8px 12px", color: "#94a3b8", fontWeight: 600 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Moment (lb·ft)", cap: comparison.moment.cap, dem: comparison.moment.demand, pass: comparison.moment.pass },
                        { name: "Shear (lb)", cap: comparison.shear.cap, dem: comparison.shear.demand, pass: comparison.shear.pass },
                        { name: "Deflection (in)", cap: comparison.deflection.cap, dem: comparison.deflection.demand, pass: comparison.deflection.pass },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #1e293b", background: !row.pass ? "#7f1d1d15" : "transparent" }}>
                          <td style={{ padding: "8px 12px", fontWeight: 500 }}>{row.name}</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" }}>{row.name.includes("Defl") ? fmt(row.cap, 3) : fmt(row.cap, 0)}</td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: !row.pass ? "#ef4444" : "#e2e8f0", fontWeight: !row.pass ? 700 : 400 }}>
                            {row.name.includes("Defl") ? fmt(row.dem, 3) : fmt(row.dem, 0)}
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "'JetBrains Mono', monospace", color: !row.pass ? "#ef4444" : "#94a3b8" }}>
                            {row.cap > 0 ? fmt(row.dem / row.cap * 100, 1) + "%" : "—"}
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "center" }}>
                            <span style={{ ...s.badge(row.pass), fontSize: 11, padding: "2px 10px" }}>
                              {row.pass ? "PASS" : "FAIL"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}