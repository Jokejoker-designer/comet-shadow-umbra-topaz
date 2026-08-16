import { o as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PanelRight, c as CirclePause, i as Radio, o as Lock, r as RotateCcw, s as CirclePlay, t as X } from "../_libs/lucide-react.mjs";
import { r as signOut, t as authClient } from "./client-Dovtnb2K.mjs";
import { a as EdgeLabelRenderer, c as ReactFlowProvider, d as Position, f as getBezierPath, i as Controls, l as index, n as BackgroundVariant, o as Handle, r as BaseEdge, s as MiniMap, t as Background, u as useReactFlow } from "../_libs/@xyflow/react+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CSSBOZxd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var statusDot = {
	pass: "bg-pass",
	fail: "bg-fail",
	warn: "bg-warn",
	pending: "bg-faint",
	locked: "bg-mute"
};
function Shell({ children, selected, pulsing, kind, wide }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative border bg-surface text-ink shadow-panel", wide ? "w-52" : "w-40", kind === "agent" ? "rounded-lg px-3 py-2.5" : "rounded-md px-2.5 py-2", selected ? "border-steel" : "border-line", pulsing && kind === "agent" && "agent-pulse"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle, {
				type: "target",
				position: Position.Top
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handle, {
				type: "source",
				position: Position.Bottom
			})
		]
	});
}
function LabNode({ data, selected }) {
	const d = data;
	if (d.kind === "agent") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		selected,
		pulsing: d.pulsing,
		kind: "agent",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] font-medium uppercase tracking-[0.14em] text-mute",
					children: "Agent"
				}), d.status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", statusDot[d.status]) }) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 font-medium tracking-tight",
				children: d.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex items-baseline justify-between gap-2 font-mono text-[11px] tabular-nums text-mute",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.subtitle }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-ink",
					children: d.value
				})]
			})
		]
	});
	if (d.kind === "synapse") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		selected,
		kind: "synapse",
		wide: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[11px] text-mute",
				children: d.title
			}), d.locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3 text-mute" }) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-1 flex items-end justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-lg font-medium tabular-nums tracking-tight",
				children: d.value
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("text-[11px] font-medium", d.status === "pass" ? "text-pass" : d.status === "fail" ? "text-fail" : "text-mute"),
				children: d.subtitle
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		selected,
		kind: d.kind,
		wide: d.kind === "evidence" || d.kind === "learn",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] font-medium uppercase tracking-[0.14em] text-faint",
					children: d.kind === "fpga" ? "FPGA" : d.kind === "learn" ? "Learning" : d.kind === "evidence" ? "Evidence" : d.kind === "time" ? "Tick" : "Stage"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-0.5 text-sm font-medium tracking-tight",
					children: d.title
				})] }), d.status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-1 size-2 shrink-0 rounded-full", statusDot[d.status]) }) : null]
			}),
			d.subtitle || d.value ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1.5 font-mono text-[11px] tabular-nums text-mute",
				children: [d.value ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-ink",
					children: [d.value, " "]
				}) : null, d.subtitle]
			}) : null,
			d.warn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1.5 text-[11px] text-warn",
				children: "Behavioral blocker"
			}) : null
		]
	});
}
function SynapseEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, markerEnd }) {
	const d = data ?? {};
	const [path, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition
	});
	const t = Math.min(1, Math.max(0, (d.weight - 64) / 808));
	const width = d.cyclic ? 1.4 + t * 6.2 : .9;
	const stroke = d.failed ? "var(--color-fail)" : d.cyclic ? "var(--color-steel)" : "var(--color-line-strong)";
	const opacity = d.cyclic ? .95 : .28;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BaseEdge, {
			id,
			path,
			markerEnd,
			style: {
				stroke,
				strokeWidth: width,
				opacity,
				strokeDasharray: d.failed ? "5 4" : void 0
			}
		}),
		d.pulsing && d.cyclic ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			r: 3.2,
			className: "spike-bead",
			style: { offsetPath: `path('${path}')` }
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EdgeLabelRenderer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "nodrag nopan pointer-events-none absolute origin-center",
			style: { transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1 rounded-xs border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-mute",
				style: { opacity: d.cyclic ? 1 : .45 },
				children: [
					d.failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-2.5 text-fail" }) : null,
					d.locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-2.5" }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.label ?? `W=${d.weight}` })
				]
			})
		}) })
	] });
}
function scorecard(frame, attention) {
	const w10 = frame.weights[1][0];
	const expected = 64 + frame.updateCounts[1][0] * 8;
	const ltpOk = w10 === expected && w10 >= 872;
	const attnOk = attention === "route_gate";
	return [
		{
			id: "rtl",
			label: "RTL Simulation",
			status: "pass",
			detail: "Icarus + pyslang preflight clean. Self-checking TB PASS."
		},
		{
			id: "synth",
			label: "Synthesis",
			status: "pass",
			detail: "Vivado / ORFS frontend accepted four_agent_openroad_top."
		},
		{
			id: "timing",
			label: "Timing",
			status: "pass",
			detail: "Block constraints met on Basys3 XC7A35T at the declared clock."
		},
		{
			id: "board",
			label: "Board Validation",
			status: "pass",
			detail: "Bitstream programmed. Basys3 enumerates, clock alive."
		},
		{
			id: "uart",
			label: "UART",
			status: frame.tick > 0 ? "pass" : "pending",
			detail: "COM8 @ 115200. tick/updates/weight/auto/freeze streaming."
		},
		{
			id: "stdp",
			label: "STDP",
			status: frame.updates > 0 ? "pass" : "pending",
			detail: `${frame.updates} matrix updates applied. TRACE_INCREMENT=32, SHIFT=2.`
		},
		{
			id: "weight",
			label: "Weight Update",
			status: ltpOk ? "pass" : "warn",
			detail: `W[1][0]=${w10}. Expected 64+8×${frame.updateCounts[1][0]}=${expected}.`
		},
		{
			id: "freeze",
			label: "Freeze",
			status: frame.freeze ? "locked" : "pending",
			detail: frame.freeze ? "Weights locked. update_count held after freeze assertion." : "Freeze not asserted."
		},
		{
			id: "attention",
			label: "Attention Behavior",
			status: attnOk ? "pass" : "fail",
			detail: attnOk ? "ROUTE_GATE backend — score magnitude preserved." : "NORMALIZED + one-hot source cancels score magnitude."
		},
		{
			id: "output",
			label: "Output Observability",
			status: "fail",
			detail: `out=0x${frame.output.toString(16)}. Spike/output evaluation not closing.`
		},
		{
			id: "behavior",
			label: "Behavior",
			status: "fail",
			detail: "Cyclic teacher routes not reproduced on output spikes."
		},
		{
			id: "convergence",
			label: "Convergence",
			status: "fail",
			detail: "Learning metric has not crossed the release gate."
		}
	];
}
var CYCLIC_KEYS = /* @__PURE__ */ new Set([
	"1-0",
	"2-1",
	"3-2",
	"0-3"
]);
function n(id, x, y, data, extra) {
	return {
		id,
		position: {
			x,
			y
		},
		data,
		type: "lab",
		...extra
	};
}
function e(id, source, target, data) {
	return {
		id,
		source,
		target,
		type: "synapse",
		data,
		markerEnd: {
			type: "arrowclosed",
			color: "var(--color-steel)",
			width: 16,
			height: 16
		}
	};
}
function synapseData(frame, dst, src, lastPulse) {
	const key = `${dst}-${src}`;
	const cyclic = CYCLIC_KEYS.has(key);
	const weight = frame.weights[dst][src];
	return {
		weight,
		cyclic,
		pulsing: Boolean(lastPulse && lastPulse.src === src && lastPulse.dst === dst && Date.now() - lastPulse.at < 800),
		locked: frame.freeze,
		failed: false,
		label: `W=${weight}`
	};
}
function buildGraph(view, frame, attention, showAll, lastPulse) {
	const ev = scorecard(frame, attention);
	const evMap = Object.fromEntries(ev.map((x) => [x.id, x]));
	const spikeSrc = lastPulse && Date.now() - lastPulse.at < 800 ? lastPulse.src : -1;
	if (view === "agents") {
		const nodes = [
			{
				x: 280,
				y: 40
			},
			{
				x: 540,
				y: 240
			},
			{
				x: 280,
				y: 440
			},
			{
				x: 20,
				y: 240
			}
		].map((p, i) => n(`agent-${i}`, p.x, p.y, {
			kind: "agent",
			title: `Agent ${i}`,
			subtitle: `in=${frame.input >> i & 1}  out=${frame.output >> i & 1}`,
			value: frame.input >> i & 1 ? "SPIKE" : "idle",
			status: frame.input >> i & 1 ? "pass" : "pending",
			pulsing: spikeSrc === i,
			agentIndex: i
		}));
		const edges = [];
		for (let dst = 0; dst < 4; dst++) for (let src = 0; src < 4; src++) {
			if (dst === src) continue;
			const cyclic = CYCLIC_KEYS.has(`${dst}-${src}`);
			if (!showAll && !cyclic) continue;
			edges.push(e(`e-${dst}-${src}`, `agent-${src}`, `agent-${dst}`, synapseData(frame, dst, src, lastPulse)));
		}
		nodes.push(n("fpga-basys3", 820, 40, {
			kind: "fpga",
			title: "Basys3",
			subtitle: "XC7A35T · COM8",
			value: frame.tick ? "LIVE" : "IDLE",
			status: "pass"
		}), n("learn-freeze", 820, 160, {
			kind: "learn",
			title: "Freeze",
			subtitle: frame.freeze ? "LOCKED" : "open",
			status: frame.freeze ? "locked" : "pending",
			locked: frame.freeze
		}), n("syn-1-0", 820, 300, {
			kind: "synapse",
			title: "W[1][0]  ·  0 → 1",
			subtitle: frame.freeze ? "LEARNED" : "LTP",
			value: String(frame.weights[1][0]),
			status: frame.weights[1][0] >= 872 ? "pass" : "warn",
			locked: frame.freeze,
			src: 0,
			dst: 1
		}));
		return {
			nodes,
			edges
		};
	}
	if (view === "architecture") return {
		nodes: [
			n("arch-in", 240, 0, {
				kind: "arch",
				title: "Input",
				subtitle: `levels / direct  in=${frame.input}`
			}),
			n("arch-enc", 240, 95, {
				kind: "arch",
				title: "Pulse Encoder",
				subtitle: "density · 8-bit accum"
			}),
			n("arch-att", 240, 190, {
				kind: "learn",
				title: "Attention",
				subtitle: attention === "normalized" ? "NORMALIZED" : "ROUTE_GATE",
				status: attention === "route_gate" ? "pass" : "fail",
				warn: attention === "normalized"
			}),
			n("agent-0", 20, 310, {
				kind: "agent",
				title: "Agent 0",
				pulsing: spikeSrc === 0,
				value: frame.input & 1 ? "SPIKE" : "idle"
			}),
			n("agent-1", 175, 310, {
				kind: "agent",
				title: "Agent 1",
				pulsing: spikeSrc === 1,
				value: frame.input & 2 ? "SPIKE" : "idle"
			}),
			n("agent-2", 330, 310, {
				kind: "agent",
				title: "Agent 2",
				pulsing: spikeSrc === 2,
				value: frame.input & 4 ? "SPIKE" : "idle"
			}),
			n("agent-3", 485, 310, {
				kind: "agent",
				title: "Agent 3",
				pulsing: spikeSrc === 3,
				value: frame.input & 8 ? "SPIKE" : "idle"
			}),
			n("learn-stdp", 240, 430, {
				kind: "learn",
				title: "STDP",
				subtitle: `${frame.updates} updates`,
				status: "pass"
			}),
			n("arch-w", 240, 525, {
				kind: "arch",
				title: "Weight Matrix",
				subtitle: `W10=${frame.weights[1][0]}`,
				status: "pass"
			}),
			n("arch-out", 240, 620, {
				kind: "evidence",
				title: "Output",
				subtitle: `spikes 0x${frame.output.toString(16)}`,
				status: "fail"
			}),
			n("fpga-basys3", 680, 20, {
				kind: "fpga",
				title: "Basys3",
				subtitle: "XC7A35T",
				status: "pass"
			}),
			n("fpga-clock", 680, 130, {
				kind: "fpga",
				title: "Clock",
				subtitle: "core clk",
				status: "pass"
			}),
			n("fpga-uart", 680, 240, {
				kind: "fpga",
				title: "UART",
				subtitle: "COM8 · 115200",
				status: "pass",
				value: `t=${frame.tick}`
			})
		],
		edges: [
			e("a1", "arch-in", "arch-enc", {
				weight: 200,
				cyclic: true,
				pulsing: false,
				locked: false,
				failed: false,
				label: "levels"
			}),
			e("a2", "arch-enc", "arch-att", {
				weight: 200,
				cyclic: true,
				pulsing: Boolean(lastPulse),
				locked: false,
				failed: false,
				label: "spikes"
			}),
			e("a3", "arch-att", "agent-0", {
				weight: 120,
				cyclic: true,
				pulsing: false,
				locked: false,
				failed: attention === "normalized",
				label: "ctx0"
			}),
			e("a4", "arch-att", "agent-1", {
				weight: 120,
				cyclic: true,
				pulsing: false,
				locked: false,
				failed: attention === "normalized",
				label: "ctx1"
			}),
			e("a5", "arch-att", "agent-2", {
				weight: 120,
				cyclic: true,
				pulsing: false,
				locked: false,
				failed: attention === "normalized",
				label: "ctx2"
			}),
			e("a6", "arch-att", "agent-3", {
				weight: 120,
				cyclic: true,
				pulsing: false,
				locked: false,
				failed: attention === "normalized",
				label: "ctx3"
			}),
			e("a7", "agent-0", "learn-stdp", {
				weight: 80,
				cyclic: true,
				pulsing: false,
				locked: false,
				failed: false,
				label: ""
			}),
			e("a8", "agent-1", "learn-stdp", {
				weight: 80,
				cyclic: true,
				pulsing: false,
				locked: false,
				failed: false,
				label: ""
			}),
			e("a9", "agent-2", "learn-stdp", {
				weight: 80,
				cyclic: true,
				pulsing: false,
				locked: false,
				failed: false,
				label: ""
			}),
			e("a10", "agent-3", "learn-stdp", {
				weight: 80,
				cyclic: true,
				pulsing: false,
				locked: false,
				failed: false,
				label: ""
			}),
			e("a11", "learn-stdp", "arch-w", {
				weight: 400,
				cyclic: true,
				pulsing: false,
				locked: frame.freeze,
				failed: false,
				label: "Δw"
			}),
			e("a12", "arch-w", "arch-out", {
				weight: 200,
				cyclic: true,
				pulsing: false,
				locked: false,
				failed: true,
				label: "spikes"
			})
		]
	};
	if (view === "learning") return {
		nodes: [
			n("learn-train", 280, 0, {
				kind: "learn",
				title: "Training",
				subtitle: frame.auto ? "AUTO ON" : "manual",
				status: frame.auto ? "pass" : "pending"
			}),
			n("learn-stdp", 40, 160, {
				kind: "learn",
				title: "STDP",
				subtitle: `${frame.updates} updates`,
				status: "pass"
			}),
			n("learn-teacher", 280, 160, {
				kind: "learn",
				title: "Teacher",
				subtitle: "cyclic 0→1→2→3→0",
				status: "pass"
			}),
			n("learn-attention", 520, 160, {
				kind: "learn",
				title: "Attention",
				subtitle: attention === "normalized" ? "NORMALIZED" : "ROUTE_GATE",
				status: attention === "route_gate" ? "pass" : "fail",
				warn: attention === "normalized"
			}),
			n("arch-w", 280, 320, {
				kind: "arch",
				title: "Weight Matrix",
				value: `W10=${frame.weights[1][0]}`,
				subtitle: `updates ${frame.updates}`,
				status: "pass"
			}),
			n("ev-behavior", 280, 460, {
				kind: "evidence",
				title: "Behaviour",
				subtitle: evMap.behavior?.detail,
				status: "fail"
			}),
			n("ev-convergence", 280, 600, {
				kind: "evidence",
				title: "PASS / FAIL",
				subtitle: "convergence gate",
				status: "fail"
			}),
			n("learn-freeze", 560, 320, {
				kind: "learn",
				title: "Freeze",
				subtitle: frame.freeze ? "LOCKED" : "open",
				status: frame.freeze ? "locked" : "pending",
				locked: frame.freeze
			})
		],
		edges: [
			e("l1", "learn-train", "learn-stdp", {
				weight: 200,
				cyclic: true,
				pulsing: false,
				locked: false,
				failed: false
			}),
			e("l2", "learn-train", "learn-teacher", {
				weight: 200,
				cyclic: true,
				pulsing: false,
				locked: false,
				failed: false
			}),
			e("l3", "learn-train", "learn-attention", {
				weight: 200,
				cyclic: true,
				pulsing: false,
				locked: false,
				failed: attention === "normalized"
			}),
			e("l4", "learn-stdp", "arch-w", {
				weight: 400,
				cyclic: true,
				pulsing: false,
				locked: frame.freeze,
				failed: false,
				label: "LTP +8"
			}),
			e("l5", "learn-teacher", "arch-w", {
				weight: 120,
				cyclic: true,
				pulsing: false,
				locked: false,
				failed: false
			}),
			e("l6", "learn-attention", "arch-w", {
				weight: 120,
				cyclic: true,
				pulsing: false,
				locked: false,
				failed: attention === "normalized"
			}),
			e("l7", "arch-w", "ev-behavior", {
				weight: 200,
				cyclic: true,
				pulsing: false,
				locked: false,
				failed: true
			}),
			e("l8", "ev-behavior", "ev-convergence", {
				weight: 200,
				cyclic: true,
				pulsing: false,
				locked: false,
				failed: true
			})
		]
	};
	if (view === "verification") {
		const left = [
			{
				id: "ev-rtl",
				title: "RTL_PARSE",
				ev: "rtl",
				y: 0
			},
			{
				id: "ev-sim",
				title: "SIMULATION",
				ev: "rtl",
				y: 100
			},
			{
				id: "ev-synth",
				title: "SYNTHESIS",
				ev: "synth",
				y: 200
			},
			{
				id: "ev-timing",
				title: "TIMING",
				ev: "timing",
				y: 300
			},
			{
				id: "ev-board",
				title: "BOARD_PROGRAM",
				ev: "board",
				y: 400
			}
		];
		const right = [
			{
				id: "fpga-uart",
				title: "UART",
				ev: "uart",
				y: 0
			},
			{
				id: "ev-weight",
				title: "WEIGHT_UPDATE",
				ev: "weight",
				y: 100
			},
			{
				id: "learn-freeze",
				title: "FREEZE",
				ev: "freeze",
				y: 200
			},
			{
				id: "ev-behavior",
				title: "BEHAVIOR",
				ev: "behavior",
				y: 300
			},
			{
				id: "ev-convergence",
				title: "CONVERGENCE",
				ev: "convergence",
				y: 400
			}
		];
		[...left, ...right];
		const nodes = [...left.map((c) => n(c.id, 80, c.y, {
			kind: "evidence",
			title: c.title,
			subtitle: c.ev ? evMap[c.ev]?.detail : void 0,
			status: c.ev ? evMap[c.ev]?.status : "pending"
		})), ...right.map((c) => n(c.id, 420, c.y, {
			kind: "evidence",
			title: c.title,
			subtitle: c.ev ? evMap[c.ev]?.detail : void 0,
			status: c.ev ? evMap[c.ev]?.status : "pending"
		}))];
		const seq = [...left, ...right];
		const edges = [];
		for (let i = 0; i < seq.length - 1; i++) {
			const st = seq[i + 1].ev ? evMap[seq[i + 1].ev]?.status : "pending";
			edges.push(e(`v${i}`, seq[i].id, seq[i + 1].id, {
				weight: 200,
				cyclic: true,
				pulsing: false,
				locked: st === "locked",
				failed: st === "fail",
				label: st?.toUpperCase()
			}));
		}
		return {
			nodes,
			edges
		};
	}
	const marks = [
		{
			id: "tl-0",
			tick: 0,
			title: "RESET",
			y: 0,
			done: frame.tick >= 0
		},
		{
			id: "tl-1",
			tick: 1,
			title: "EVAL BEFORE",
			y: 130,
			done: frame.tick >= 1
		},
		{
			id: "tl-64",
			tick: 64,
			title: "TRAIN",
			y: 260,
			done: frame.tick >= 64
		},
		{
			id: "tl-403",
			tick: 403,
			title: "FREEZE",
			y: 390,
			done: frame.tick >= 403
		},
		{
			id: "tl-1325",
			tick: 1325,
			title: "EVAL AFTER",
			y: 520,
			done: frame.tick >= 1325
		}
	];
	const nodes = marks.map((m) => n(m.id, 280, m.y, {
		kind: "time",
		title: m.title,
		value: `tick ${m.tick}`,
		subtitle: m.done ? frame.tick === m.tick || m.tick === 1325 && frame.tick >= 1325 ? "NOW" : "passed" : "ahead",
		status: m.done ? m.title === "FREEZE" ? "locked" : "pass" : "pending"
	}));
	const edges = [];
	for (let i = 0; i < marks.length - 1; i++) edges.push(e(`t${i}`, marks[i].id, marks[i + 1].id, {
		weight: marks[i].done ? 400 : 80,
		cyclic: marks[i].done,
		pulsing: marks[i].done && !marks[i + 1].done,
		locked: marks[i + 1].title === "FREEZE" && frame.freeze,
		failed: false,
		label: `${marks[i].tick} → ${marks[i + 1].tick}`
	}));
	return {
		nodes,
		edges
	};
}
function emptyWeights() {
	return Array.from({ length: 4 }, (_, d) => Array.from({ length: 4 }, (_, s) => d === s ? 0 : 64));
}
function emptyCounts() {
	return Array.from({ length: 4 }, () => [
		0,
		0,
		0,
		0
	]);
}
function liveSnapshot() {
	const weights = emptyWeights();
	const updateCounts = emptyCounts();
	updateCounts[1][0] = 101;
	updateCounts[2][1] = 101;
	updateCounts[3][2] = 101;
	updateCounts[0][3] = 100;
	weights[1][0] = 872;
	weights[2][1] = 872;
	weights[3][2] = 872;
	weights[0][3] = 864;
	return {
		tick: 1325,
		updates: 403,
		mismatch: 318,
		weight: weights[1][0],
		weights,
		updateCounts,
		input: 1,
		output: 0,
		dominant: 0,
		auto: true,
		freeze: true,
		phase: "eval_after",
		line: "tick=1325 updates=403 mismatch=318 weight=872 in=0x1 out=0x0 dominant=0x00 auto=1 freeze=1"
	};
}
var SEED_EXPERIMENTS = [
	{
		id: "2026-08-14-run-001",
		name: "Basys3 cyclic LTP",
		startedAt: "2026-08-14T00:12:00+07:00",
		bitstream: "four_agent_snn_basys3.bit",
		rtlCommit: "basys3-four-agent-snn-ready",
		board: "Basys3 XC7A35T",
		port: "COM8",
		baud: 115200,
		verdict: "PARTIAL",
		notes: "W[1][0] = 872 = 64 + 8×101. Freeze holds through tick 1404. Attention normalization still blocks behavioral learning.",
		snapshot: liveSnapshot(),
		evidence: []
	},
	{
		id: "2026-08-13-run-000",
		name: "First UART bring-up",
		startedAt: "2026-08-13T18:40:00+07:00",
		bitstream: "four_agent_snn_basys3.bit",
		rtlCommit: "uart-telemetry-v1",
		board: "Basys3 XC7A35T",
		port: "COM8",
		baud: 115200,
		verdict: "FAIL",
		notes: "Link up. AUTO trainer not yet armed. Weights still at reset 64.",
		snapshot: {
			...liveSnapshot(),
			tick: 48,
			updates: 0,
			mismatch: 0,
			weight: 64,
			weights: emptyWeights(),
			updateCounts: emptyCounts(),
			auto: false,
			freeze: false,
			phase: "eval_before",
			line: "tick=48 updates=0 mismatch=0 weight=64 in=0x0 out=0x0 dominant=0x00 auto=0 freeze=0"
		},
		evidence: []
	},
	{
		id: "2026-08-12-openroad",
		name: "OpenROAD harness design",
		startedAt: "2026-08-12T11:05:00+07:00",
		bitstream: "—",
		rtlCommit: "openroad-signoff-kit",
		board: "Nangate45 / Sky130HD (not taped)",
		port: "—",
		baud: 0,
		verdict: "PARTIAL",
		notes: "RTL statically validated. Physical flow not executed in the generation environment.",
		snapshot: {
			...liveSnapshot(),
			tick: 0,
			updates: 0,
			mismatch: 0,
			weight: 64,
			weights: emptyWeights(),
			updateCounts: emptyCounts(),
			auto: false,
			freeze: false,
			phase: "idle",
			input: 0,
			output: 0,
			line: "OPENROAD_HARNESS_DESIGNED — no UART"
		},
		evidence: []
	}
];
var LOG_CAP = 240;
var useLab = create((set, get) => ({
	frame: liveSnapshot(),
	log: [liveSnapshot().line],
	view: "agents",
	selectedId: "syn-1-0",
	inspectorOpen: false,
	attention: "normalized",
	showAllSynapses: false,
	mode: "live",
	speed: 4,
	connected: true,
	port: "COM8",
	experiments: SEED_EXPERIMENTS,
	activeExperimentId: "2026-08-14-run-001",
	lastPulse: {
		src: 0,
		dst: 1,
		at: Date.now()
	},
	setView: (view) => set({ view }),
	select: (id) => set({
		selectedId: id,
		inspectorOpen: id !== null
	}),
	setInspector: (inspectorOpen) => set({ inspectorOpen }),
	setAttention: (attention) => set({ attention }),
	toggleAllSynapses: () => set({ showAllSynapses: !get().showAllSynapses }),
	setSpeed: (speed) => set({ speed }),
	connect: () => set({
		connected: true,
		mode: get().mode === "paused" ? "live" : get().mode
	}),
	disconnect: () => set({
		connected: false,
		mode: "paused"
	}),
	pause: () => set({ mode: "paused" }),
	resumeLive: () => set({
		mode: "live",
		connected: true,
		frame: {
			...get().frame,
			phase: "eval_after",
			freeze: true,
			auto: true
		}
	}),
	replay: () => {
		const frame = {
			tick: 0,
			updates: 0,
			mismatch: 0,
			weight: 64,
			weights: emptyWeights(),
			updateCounts: emptyCounts(),
			input: 0,
			output: 0,
			dominant: 0,
			auto: true,
			freeze: false,
			phase: "reset",
			line: "tick=0 updates=0 mismatch=0 weight=64 in=0x0 out=0x0 dominant=0x00 auto=1 freeze=0"
		};
		set({
			mode: "replay",
			connected: true,
			frame,
			log: [frame.line],
			lastPulse: null
		});
	},
	ingest: (frame, pulse) => {
		set({
			frame,
			log: [frame.line, ...get().log].slice(0, LOG_CAP),
			lastPulse: pulse ? {
				...pulse,
				at: Date.now()
			} : get().lastPulse
		});
	},
	loadExperiment: (id) => {
		const exp = get().experiments.find((e) => e.id === id);
		if (!exp) return;
		set({
			activeExperimentId: id,
			frame: structuredClone(exp.snapshot),
			log: [exp.snapshot.line],
			mode: "paused",
			lastPulse: null
		});
	},
	saveExperiment: () => {
		const { frame, attention } = get();
		const ev = scorecard(frame, attention);
		const fails = ev.filter((e) => e.status === "fail").length;
		const id = `run-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace(/[:T]/g, "")}`;
		set({
			experiments: [{
				id,
				name: `Captured ${frame.phase} @ tick ${frame.tick}`,
				startedAt: (/* @__PURE__ */ new Date()).toISOString(),
				bitstream: "four_agent_snn_basys3.bit",
				rtlCommit: "live-session",
				board: "Basys3 XC7A35T",
				port: get().port,
				baud: 115200,
				verdict: fails === 0 ? "PASS" : fails >= 3 ? "FAIL" : "PARTIAL",
				notes: `AUTO=${frame.auto ? 1 : 0} FREEZE=${frame.freeze ? 1 : 0} W10=${frame.weight}`,
				snapshot: structuredClone(frame),
				evidence: ev
			}, ...get().experiments],
			activeExperimentId: id
		});
	}
}));
function phaseLabel(phase) {
	switch (phase) {
		case "reset": return "RESET";
		case "eval_before": return "EVAL BEFORE";
		case "train": return "TRAIN";
		case "freeze": return "FREEZE";
		case "eval_after": return "EVAL AFTER";
		default: return "IDLE";
	}
}
var nodeTypes = { lab: LabNode };
var edgeTypes = { synapse: SynapseEdge };
function FlowInner() {
	const view = useLab((s) => s.view);
	const frame = useLab((s) => s.frame);
	const attention = useLab((s) => s.attention);
	const showAll = useLab((s) => s.showAllSynapses);
	const lastPulse = useLab((s) => s.lastPulse);
	const select = useLab((s) => s.select);
	const { fitView } = useReactFlow();
	const { nodes, edges } = (0, import_react.useMemo)(() => buildGraph(view, frame, attention, showAll, lastPulse), [
		view,
		frame,
		attention,
		showAll,
		lastPulse
	]);
	(0, import_react.useEffect)(() => {
		const t = window.setTimeout(() => {
			fitView({
				padding: .22,
				duration: 220
			});
		}, 80);
		return () => window.clearTimeout(t);
	}, [view, fitView]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(index, {
		nodes,
		edges,
		nodeTypes,
		edgeTypes,
		fitView: true,
		fitViewOptions: { padding: .22 },
		minZoom: .2,
		maxZoom: 1.8,
		proOptions: { hideAttribution: true },
		onNodeClick: (_, node) => select(node.id),
		onNodeDoubleClick: (_, node) => select(node.id),
		onInit: (inst) => {
			inst.fitView({ padding: .22 });
		},
		nodesDraggable: true,
		elementsSelectable: true,
		colorMode: "dark",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Background, {
				variant: BackgroundVariant.Dots,
				gap: 22,
				size: 1
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniMap, {
				pannable: true,
				zoomable: true,
				maskColor: "rgb(9 9 11 / 0.72)",
				nodeColor: "var(--color-elevated)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controls, { showInteractive: false })
		]
	});
}
function GraphCanvas() {
	const view = useLab((s) => s.view);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactFlowProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-full w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowInner, {})
	}) }, view);
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-[opacity,background-color,transform] duration-150 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-steel text-steel-fg hover:opacity-90",
			ghost: "bg-transparent text-ink hover:bg-elevated",
			outline: "border border-line bg-transparent text-ink hover:bg-elevated",
			subtle: "bg-elevated text-ink hover:bg-line"
		},
		size: {
			default: "h-9 px-3",
			sm: "h-8 px-2.5 text-xs",
			icon: "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var CYCLIC = [
	[1, 0],
	[2, 1],
	[3, 2],
	[0, 3]
];
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-4 border-b border-line py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-mute",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-right font-mono text-xs tabular-nums text-ink",
			children: v
		})]
	});
}
function Inspector() {
	const frame = useLab((s) => s.frame);
	const attention = useLab((s) => s.attention);
	const selectedId = useLab((s) => s.selectedId);
	const setInspector = useLab((s) => s.setInspector);
	const setAttention = useLab((s) => s.setAttention);
	const ev = scorecard(frame, attention);
	const effectiveId = selectedId ?? "syn-1-0";
	const synMatch = effectiveId.match(/^syn-(\d)-(\d)$/);
	const agentMatch = effectiveId.match(/^agent-(\d)$/);
	let body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-medium tracking-tight",
			children: "Session"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-mute",
			children: "Select a node. Double-click any synapse or evidence gate."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Tick",
					v: String(frame.tick)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Updates",
					v: String(frame.updates)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Mismatch",
					v: String(frame.mismatch)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "W[1][0]",
					v: String(frame.weights[1][0])
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "AUTO",
					v: frame.auto ? "ON" : "OFF"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "FREEZE",
					v: frame.freeze ? "ON" : "OFF"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "in / out",
					v: `0x${frame.input.toString(16)} / 0x${frame.output.toString(16)}`
				})
			]
		})
	] });
	if (synMatch) {
		const dst = Number(synMatch[1]);
		const src = Number(synMatch[2]);
		const w = frame.weights[dst][src];
		const n = frame.updateCounts[dst][src];
		const expected = 64 + n * 8;
		const cyclic = CYCLIC.some(([d, s]) => d === dst && s === src);
		body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] font-medium uppercase tracking-[0.16em] text-faint",
				children: "Synapse information"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-1 font-mono text-lg tracking-tight",
				children: [
					"weight[",
					dst,
					"][",
					src,
					"]"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-mute",
				children: [
					src,
					" → ",
					dst
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Source",
						v: `Agent ${src}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Destination",
						v: `Agent ${dst}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Initial weight",
						v: "64"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Current",
						v: String(w)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Learning rule",
						v: "TRACE_INCREMENT = 32"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "",
						v: "LEARNING_SHIFT = 2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Δ per LTP",
						v: "+8"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Update count",
						v: String(n)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Expected",
						v: `64 + ${n} × 8 = ${expected}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Observed",
						v: String(w)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-md border border-line bg-elevated px-3 py-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-[0.14em] text-faint",
						children: "Verdict"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `mt-1 text-sm font-medium ${w === expected && cyclic && w >= 64 ? "text-pass" : "text-warn"}`,
						children: w === expected ? "PASS" : "MISMATCH"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-mute",
						children: cyclic ? "Cyclic route. Highlighted on the agent graph." : "Off-cycle synapse. Dimmed unless Show 16 is on."
					})
				]
			})
		] });
	} else if (agentMatch) {
		const i = Number(agentMatch[1]);
		body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] font-medium uppercase tracking-[0.16em] text-faint",
				children: "Agent"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-1 text-lg font-medium tracking-tight",
				children: ["Agent ", i]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Input spike",
						v: String(frame.input >> i & 1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Output spike",
						v: String(frame.output >> i & 1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Teacher (cyclic)",
						v: `Agent ${(i + 1) % 4}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Incoming W",
						v: String(frame.weights[i][(i + 3) % 4])
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						k: "Outgoing W",
						v: String(frame.weights[(i + 1) % 4][i])
					})
				]
			})
		] });
	} else if (effectiveId === "learn-attention" || effectiveId === "arch-att") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] font-medium uppercase tracking-[0.16em] text-faint",
			children: "Attention"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-1 text-lg font-medium tracking-tight",
			children: "Attention backend"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				k: "Backend",
				v: attention === "normalized" ? "NORMALIZED" : "ROUTE_GATE"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				k: "Active sources",
				v: "1 (one-hot)"
			})]
		}),
		attention === "normalized" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-md border border-line bg-elevated px-3 py-2.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-[0.14em] text-warn",
					children: "Warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-ink",
					children: "Single-source normalization cancels score magnitude. Context collapses — LIF never sees the intended current."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-sm font-medium text-fail",
					children: "Behavioral learning blocker"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-md border border-line bg-elevated px-3 py-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] uppercase tracking-[0.14em] text-pass",
				children: "Route gate"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-mute",
				children: "Threshold path preserves score. Board evidence still needs a new bitstream."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: attention === "normalized" ? "default" : "outline",
				onClick: () => setAttention("normalized"),
				children: "Normalized"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: attention === "route_gate" ? "default" : "outline",
				onClick: () => setAttention("route_gate"),
				children: "Route gate"
			})]
		})
	] });
	else if (effectiveId.startsWith("ev-") || effectiveId === "learn-freeze" || effectiveId.startsWith("fpga")) {
		const hit = ev.find((x) => effectiveId.includes(x.id)) ?? (effectiveId === "learn-freeze" ? ev.find((x) => x.id === "freeze") : void 0) ?? (effectiveId === "fpga-uart" ? ev.find((x) => x.id === "uart") : void 0) ?? (effectiveId === "fpga-basys3" ? ev.find((x) => x.id === "board") : void 0);
		body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] font-medium uppercase tracking-[0.16em] text-faint",
				children: "Evidence"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 text-lg font-medium tracking-tight",
				children: hit?.label ?? effectiveId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 font-mono text-xs uppercase text-mute",
				children: hit?.status ?? "—"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-mute",
				children: hit?.detail
			})
		] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex h-full min-h-0 flex-col border-l border-line bg-panel",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-line px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] font-medium uppercase tracking-[0.16em] text-faint",
				children: "Note"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				className: "size-8",
				onClick: () => setInspector(false),
				"aria-label": "Close inspector",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 py-4",
			children: body
		})]
	});
}
var tone = {
	pass: "text-pass",
	fail: "text-fail",
	warn: "text-warn",
	pending: "text-faint",
	locked: "text-mute"
};
function Scorecard() {
	const frame = useLab((s) => s.frame);
	const attention = useLab((s) => s.attention);
	const select = useLab((s) => s.select);
	const items = scorecard(frame, attention);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-1",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => select(item.id === "freeze" ? "learn-freeze" : `ev-${item.id}`),
			className: "flex w-full items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-left hover:bg-elevated",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-ink",
				children: item.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("font-mono text-[10px] uppercase tracking-wide", tone[item.status]),
				children: item.status === "locked" ? "LOCK" : item.status
			})]
		}, item.id))
	});
}
function UartLog() {
	const log = useLab((s) => s.log);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-36 overflow-auto rounded-md border border-line bg-canvas px-2 py-2 font-mono text-[10px] leading-5 text-mute",
		children: log.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: i === 0 ? "text-ink" : void 0,
			children: line
		}, `${i}-${line.slice(0, 18)}`))
	});
}
function Vault() {
	const experiments = useLab((s) => s.experiments);
	const active = useLab((s) => s.activeExperimentId);
	const load = useLab((s) => s.loadExperiment);
	const save = useLab((s) => s.saveExperiment);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2 flex items-center justify-between gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] font-medium uppercase tracking-[0.16em] text-faint",
			children: "Experiments"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: save,
			className: "text-[11px] text-mute underline-offset-4 hover:text-ink hover:underline",
			children: "Snapshot"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-1",
		children: experiments.map((exp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => load(exp.id),
			className: cn("w-full rounded-sm border px-2 py-2 text-left", active === exp.id ? "border-line-strong bg-elevated" : "border-transparent hover:bg-elevated"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate text-xs font-medium",
					children: exp.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("font-mono text-[10px]", exp.verdict === "PASS" ? "text-pass" : exp.verdict === "FAIL" ? "text-fail" : "text-warn"),
					children: exp.verdict
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 truncate font-mono text-[10px] text-faint",
				children: exp.id
			})]
		}) }, exp.id))
	})] });
}
function isCyclic(d, s) {
	return CYCLIC.some(([dd, ss]) => dd === d && ss === s);
}
function WeightMatrix() {
	const weights = useLab((s) => s.frame.weights);
	const select = useLab((s) => s.select);
	const showAll = useLab((s) => s.showAllSynapses);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full border-collapse font-mono text-[11px] tabular-nums",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
				className: "px-1 py-1 text-left text-[10px] font-medium text-faint",
				children: "dst\\src"
			}), [
				0,
				1,
				2,
				3
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
				className: "px-1 py-1 text-right text-[10px] font-medium text-faint",
				children: ["A", s]
			}, s))] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: weights.map((row, d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
				className: "px-1 py-1 text-faint",
				children: ["A", d]
			}), row.map((w, s) => {
				const cyclic = isCyclic(d, s);
				const diag = d === s;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-0.5 py-0.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: diag,
						onClick: () => select(`syn-${d}-${s}`),
						className: cn("w-full rounded-xs px-1 py-1 text-right", diag && "text-faint", !diag && cyclic && "bg-elevated text-ink", !diag && !cyclic && (showAll ? "text-mute" : "text-faint")),
						children: diag ? "—" : w
					})
				}, s);
			})] }, d)) })]
		})
	});
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled (default) -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Render children only once we KNOW the visitor is signed out (`isPending` has
* cleared and there is no user). Hidden while the session is still loading.
*/
function SignedOut({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of).
*/
function UserButton() {
	const user = useCurrentUser();
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void signOut(),
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline",
				children: "Sign out"
			})
		]
	});
}
var CYCLES = [
	[0, 1],
	[1, 2],
	[2, 3],
	[3, 0]
];
function phaseFor(tick, freeze) {
	if (tick <= 0) return "reset";
	if (tick < 64) return "eval_before";
	if (tick < 403) return "train";
	if (tick === 403 || tick < 420 && freeze) return "freeze";
	return "eval_after";
}
function lineOf(f) {
	return [
		`tick=${f.tick}`,
		`updates=${f.updates}`,
		`mismatch=${f.mismatch}`,
		`weight=${f.weights[1][0]}`,
		`in=0x${f.input.toString(16)}`,
		`out=0x${f.output.toString(16)}`,
		`dominant=0x${f.dominant.toString(16).padStart(2, "0")}`,
		`auto=${f.auto ? 1 : 0}`,
		`freeze=${f.freeze ? 1 : 0}`
	].join(" ");
}
function cloneFrame(f) {
	return {
		...f,
		weights: f.weights.map((r) => r.slice()),
		updateCounts: f.updateCounts.map((r) => r.slice())
	};
}
function startSimulator() {
	let acc = 0;
	let last = performance.now();
	let raf = 0;
	const stepReplay = (frame) => {
		const next = cloneFrame(frame);
		next.tick += 1;
		next.auto = true;
		if (next.tick < 64) {
			next.freeze = false;
			next.input = 0;
			next.output = 0;
			next.phase = phaseFor(next.tick, false);
			next.weight = next.weights[1][0];
			next.line = lineOf(next);
			return { next };
		}
		if (next.updates >= 403) {
			next.freeze = true;
			next.phase = phaseFor(next.tick, true);
			next.input = 1 << next.tick % 4;
			next.output = 0;
			next.dominant = 0;
			next.weight = next.weights[1][0];
			next.line = lineOf(next);
			if (next.tick >= 1325) {
				useLab.getState().resumeLive();
				return { next };
			}
			return { next };
		}
		const pair = CYCLES[next.updates % 4];
		const src = pair[0];
		const dst = pair[1];
		next.input = 1 << src;
		next.output = 0;
		next.dominant = 0;
		next.updateCounts[dst][src] += 1;
		next.updates += 1;
		next.weights[dst][src] = Math.min(2047, 64 + next.updateCounts[dst][src] * 8);
		next.mismatch += 1;
		next.freeze = false;
		next.phase = phaseFor(next.tick, false);
		next.weight = next.weights[1][0];
		next.line = lineOf(next);
		return {
			next,
			pulse: {
				src,
				dst
			}
		};
	};
	const stepLive = (frame) => {
		const next = cloneFrame(frame);
		next.tick += 1;
		next.freeze = true;
		next.auto = true;
		next.phase = "eval_after";
		const src = next.tick % 4;
		next.input = 1 << src;
		next.output = 0;
		next.dominant = 0;
		next.weight = next.weights[1][0];
		next.line = lineOf(next);
		return {
			next,
			pulse: {
				src,
				dst: (src + 1) % 4
			}
		};
	};
	const tick = (now) => {
		const state = useLab.getState();
		const dt = now - last;
		last = now;
		if (state.connected && state.mode !== "paused") {
			const interval = state.mode === "replay" ? 90 / state.speed : 420 / state.speed;
			acc += dt;
			while (acc >= interval) {
				acc -= interval;
				const current = useLab.getState();
				if (!current.connected || current.mode === "paused") break;
				const { next, pulse } = current.mode === "replay" ? stepReplay(current.frame) : stepLive(current.frame);
				useLab.getState().ingest(next, pulse);
			}
		}
		raf = requestAnimationFrame(tick);
	};
	raf = requestAnimationFrame(tick);
	return () => cancelAnimationFrame(raf);
}
function jumpToLiveBoard() {
	const snap = liveSnapshot();
	useLab.getState().ingest(snap, {
		src: 0,
		dst: 1
	});
	useLab.setState({
		mode: "live",
		connected: true
	});
}
var VIEWS = [
	{
		id: "agents",
		label: "Agents"
	},
	{
		id: "architecture",
		label: "Architecture"
	},
	{
		id: "learning",
		label: "Learning"
	},
	{
		id: "verification",
		label: "Verification"
	},
	{
		id: "timeline",
		label: "Timeline"
	}
];
function ClientGraph() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-full place-items-center text-sm text-mute",
		children: "Mounting graph"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraphCanvas, {});
}
function AuthSlot() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-20 animate-pulse rounded-sm bg-elevated" });
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: "/login",
		className: "text-xs text-mute hover:text-ink",
		children: "Sign in"
	}) });
}
function AppShell() {
	const view = useLab((s) => s.view);
	const setView = useLab((s) => s.setView);
	const frame = useLab((s) => s.frame);
	const mode = useLab((s) => s.mode);
	const speed = useLab((s) => s.speed);
	const setSpeed = useLab((s) => s.setSpeed);
	const connected = useLab((s) => s.connected);
	const connect = useLab((s) => s.connect);
	const disconnect = useLab((s) => s.disconnect);
	const pause = useLab((s) => s.pause);
	const resumeLive = useLab((s) => s.resumeLive);
	const replay = useLab((s) => s.replay);
	const inspectorOpen = useLab((s) => s.inspectorOpen);
	const setInspector = useLab((s) => s.setInspector);
	const showAll = useLab((s) => s.showAllSynapses);
	const toggleAll = useLab((s) => s.toggleAllSynapses);
	const [rail, setRail] = (0, import_react.useState)("score");
	(0, import_react.useEffect)(() => startSimulator(), []);
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(min-width: 1024px)").matches) setInspector(true);
	}, [setInspector]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-canvas text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex shrink-0 flex-wrap items-center gap-3 border-b border-line px-3 py-2.5 md:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-medium uppercase tracking-[0.18em] text-faint",
							children: "Neuromorphic Research Graph"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-medium tracking-tight",
							children: "Four-agent SNN · Basys3"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("live-dot", !connected && "opacity-50"),
							"data-off": !connected
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px] tabular-nums text-mute",
							children: connected ? "COM8 · 115200" : "COM8 · down"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 flex-wrap items-center gap-2 border-b border-line px-3 py-2 md:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex min-w-0 flex-1 gap-1 overflow-x-auto",
					children: VIEWS.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setView(v.id),
						className: cn("h-9 shrink-0 rounded-sm px-3 text-xs font-medium", view === v.id ? "bg-elevated text-ink" : "text-mute hover:text-ink"),
						children: v.label
					}, v.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => connected ? disconnect() : connect(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: connected ? "Disconnect" : "Connect"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: replay,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Replay"
							})]
						}),
						mode === "paused" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: resumeLive,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Live"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: pause,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePause, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Pause"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "subtle",
							onClick: jumpToLiveBoard,
							children: "Board"
						}),
						[
							1,
							4,
							16
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSpeed(s),
							className: cn("h-8 rounded-sm px-2 font-mono text-[11px]", speed === s ? "bg-steel text-steel-fg" : "text-mute hover:text-ink"),
							children: [s, "×"]
						}, s)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: toggleAll,
							children: showAll ? "Cyclic only" : "Show 16"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							className: "md:hidden",
							onClick: () => setInspector(!inspectorOpen),
							"aria-label": "Toggle inspector",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelRight, { className: "size-4" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "hidden w-64 shrink-0 flex-col border-r border-line bg-panel md:flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b border-line px-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-mono text-[11px] tabular-nums text-mute",
										children: [
											"tick ",
											frame.tick,
											" · ",
											phaseLabel(frame.phase)
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 font-mono text-lg tabular-nums tracking-tight",
										children: ["W10 ", frame.weights[1][0]]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-0.5 text-xs text-mute",
										children: [
											"updates ",
											frame.updates,
											frame.freeze ? " · locked" : ""
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-1 border-b border-line px-2 py-2",
								children: [
									["score", "Gates"],
									["matrix", "W"],
									["uart", "UART"],
									["vault", "Vault"]
								].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setRail(id),
									className: cn("h-8 flex-1 rounded-sm text-[11px] font-medium", rail === id ? "bg-elevated text-ink" : "text-mute"),
									children: label
								}, id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-h-0 flex-1 overflow-y-auto p-3",
								children: [
									rail === "score" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scorecard, {}) : null,
									rail === "matrix" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeightMatrix, {}) : null,
									rail === "uart" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UartLog, {}) : null,
									rail === "vault" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vault, {}) : null
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
						className: "relative min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientGraph, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pointer-events-none absolute left-3 top-3 rounded-sm border border-line bg-surface/90 px-2 py-1 font-mono text-[10px] tabular-nums text-mute backdrop-blur-sm md:hidden",
							children: [
								"t=",
								frame.tick,
								" · W=",
								frame.weights[1][0]
							]
						})]
					}),
					inspectorOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden w-[22rem] shrink-0 lg:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inspector, {})
					}) : null
				]
			}),
			inspectorOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[48vh] border-t border-line lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inspector, {})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 overflow-x-auto border-t border-line px-3 py-2 md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-xs text-mute",
					onClick: () => setInspector(true),
					children: "Open note"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-xs text-mute",
					onClick: () => setRail("score"),
					children: "Gates"
				})]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {});
}
//#endregion
export { Home as component };
