import { reactive, ref, isReactive, toRefs, capitalize, isRef, defineComponent, useSlots, h, Fragment, inject, computed, toRaw, watch, nextTick, createElementBlock, openBlock, createElementVNode, normalizeStyle, normalizeClass, unref, withDirectives, createCommentVNode, renderList, createBlock, renderSlot, vShow, provide, toValue, customRef, toDisplayString, createVNode, Transition, withCtx, vModelText, createTextVNode, getCurrentInstance } from 'vue';
import { createSharedComposable, useWindowSize, isObject, unrefElement, useIntersectionObserver, useEventListener, useFps, useRafFn, useDark } from '@vueuse/core';

(function() {
  try {
    var t;
    if ("undefined" < "u") ;
  } catch (o) {
    console.error("vite-plugin-css-injected-by-js", o);
  }
})();
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
function Co(t) {
  return getCurrentInstance();
}
function ko(t, e = {}) {
  if (!isRef(t))
    return toRefs(t);
  const n = Array.isArray(t.value) ? Array.from({ length: t.value.length }) : {};
  for (const o in t.value)
    n[o] = customRef(() => ({
      get() {
        return t.value[o];
      },
      set(l) {
        var a;
        if ((a = toValue(e.replaceRef)) != null ? a : true)
          if (Array.isArray(t.value)) {
            const s = [...t.value];
            s[o] = l, t.value = s;
          } else {
            const s = { ...t.value, [o]: l };
            Object.setPrototypeOf(s, Object.getPrototypeOf(t.value)), t.value = s;
          }
        else
          t.value[o] = l;
      }
    }));
  return n;
}
const st = toValue;
function Oo(t, e) {
  Co() && false;
}
const Eo = void 0;
function So(t, e = {}) {
  const {
    pointerTypes: n,
    preventDefault: o,
    stopPropagation: l,
    exact: a,
    onMove: r,
    onEnd: s,
    onStart: i,
    initialValue: c,
    axis: f = "both",
    draggingElement: u = Eo,
    handle: h2 = t
  } = e, { width: A } = useWindowSize();
  let d = A.value;
  const v = ref(
    st(c) ?? { x: 0, y: 0 }
  );
  watch(A, () => {
    const b = A.value - d;
    v.value.x += b, d = A.value;
  });
  const y = ref();
  return {
    ...ko(v),
    position: v,
    isDragging: computed(() => !!y.value),
    style: computed(
      () => `left:${v.value.x}px;top:${v.value.y}px;`
    )
  };
}
const Mo = /* @__PURE__ */ Symbol("CONTROLS_CONTEXT_KEY"), be = "default", Bo = () => {
  const t = reactive({
    default: {}
  }), e = reactive({
    default: 0
  });
  return {
    store: t,
    triggers: e
  };
}, jt = createSharedComposable(Bo);
function Fo(t = be) {
  const { store: e } = jt();
  return provide(Mo, e), e[t];
}
const Pt = (t) => {
  const e = /^#(?:[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^0x(?:[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return typeof t == "boolean" ? "boolean" : typeof t == "number" ? "number" : typeof t == "string" && e.test(t) ? "color" : typeof t == "string" ? "text" : t.isVector3 || t.isVector2 || t.isEuler || Array.isArray(t.value) || t.value.isVector3 || t.value.isVector2 || t.value.isEuler || Array.isArray(t.value.value) ? "vector" : t.min !== void 0 || t.max !== void 0 || t.step !== void 0 ? "range" : t.options && Array.isArray(t.options) ? "select" : t.type === "graph" ? "graph" : t.variant || t.onClick ? "button" : "text";
}, Bt = (t, e, n, o, l) => {
  const a = {
    key: t,
    label: t,
    name: t,
    type: n,
    value: e,
    visible: true,
    icon: "",
    uniqueKey: t,
    folder: o
    // Add this line
  };
  switch (o && (a.folder = o, a.label = a.label.replace(o.replace(/[\u{1F300}-\u{1F9FF}]/gu, "").trim(), "").toLowerCase()), n) {
    case "boolean":
      return { ...a, type: "boolean" };
    case "number":
    case "range":
      return {
        ...a,
        type: n,
        min: l?.min,
        max: l?.max,
        step: l?.step ?? 0.1,
        format: l?.format
      };
    case "text":
    case "color":
      return { ...a, type: n };
    case "select": {
      const r = l?.options?.map((s) => typeof s == "object" && "text" in s && "value" in s ? s : {
        text: String(s),
        value: s
      }) || [];
      return {
        ...a,
        type: "select",
        options: r
      };
    }
    case "button":
      return { ...a, type: "button" };
    case "vector":
      return {
        ...a,
        type: "vector",
        step: l?.step,
        min: l?.min,
        max: l?.max,
        format: l?.format
      };
    case "graph":
    case "fpsgraph":
      return { ...a, type: n };
    default:
      return { ...a, type: "text" };
  }
}, js = (t, e, n) => {
  const { store: o, triggers: l } = jt(), a = {}, r = {}, s = typeof t == "string" ? t : null, i = s ? e : t, f = (s && s !== "fpsgraph" ? n : e)?.uuid || be;
  if (o[f] || (o[f] = reactive({})), l[f] || (l[f] = 0), t === "fpsgraph") {
    const d = Bt("fpsgraph", null, "fpsgraph", null);
    return o[f].fpsgraph = d, a.fpsgraph = d, r.fpsgraph = ref(d.value), r;
  }
  const u = o[f], h2 = isReactive(i), A = h2 ? toRefs(i) : {};
  for (let d in i) {
    let v = i[d], y = d;
    const g = `${d}`;
    if (h2 && A[d] && (v = A[d]), s && (d = `${s.replace(/[\u{1F300}-\u{1F9FF}]/gu, "").trim()}${capitalize(d)}`), y = `${f}-${d}`, typeof v == "object" && !isRef(v) && !Array.isArray(v) && v.value !== void 0) {
      const m = v, w = isRef(m.value) ? m.value : ref(m.value), b = m.type || Pt(m), S = Bt(d, w, b, s, m);
      S.label = m.label || g, S.icon = m.icon || "", S.visible = m.visible !== void 0 ? m.visible : true, S.uniqueKey = y, m.onUpdate && (S.onUpdate = m.onUpdate), u[d] = S, a[d] = S, r[d] = w;
      continue;
    }
    if (isRef(v)) {
      const m = Bt(d, v, v.value.type || Pt(v.value), s);
      u[d] = m, a[d] = m, r[d] = v;
      continue;
    } else if (typeof v == "object" && !Array.isArray(v) && isReactive(v)) {
      const m = toRefs(v);
      m[d] && (v = m[d]);
    }
    const x = ref(v), p = Bt(d, x, v.type || Pt(v), s);
    u[d] = p, a[d] = p, r[d] = x, p.uniqueKey = y;
  }
  return l[f]++, r;
};
function gn(t) {
  const e = t.toString();
  if (e.includes("e-"))
    return Number.parseInt(e.split("e-")[1], 10);
  const n = e.indexOf(".");
  return n === -1 ? 0 : e.length - n - 1;
}
function Ae(t) {
  const e = gn(t);
  return (n) => n.toFixed(e);
}
function xe(t) {
  return gn(t) === 0 ? "numeric" : "decimal";
}
function Z(t, e, n) {
  let o = t;
  return e !== void 0 && o < e && (o = e), n !== void 0 && o > n && (o = n), o;
}
const Zt = "http://www.w3.org/2000/svg";
function we(t) {
  const e = ref(false);
  let n = 0, o = 0, l = null, a = null, r = null, s = null, i = null, c = null;
  function f() {
    if (!l)
      return;
    a = (void 0).createElement("div"), a.classList.add("leches-guide-container"), (void 0).body.appendChild(a);
    const y = l.getBoundingClientRect();
    a.style.cssText = `
      position: fixed;
      left: ${y.left + y.width / 2}px;
      top: ${y.top}px;
      width: 0;
      height: ${y.height}px;
      pointer-events: none;
      z-index: 99999;
    `, r = (void 0).createElementNS(Zt, "svg"), r.classList.add("leches-guide"), a.appendChild(r), s = (void 0).createElementNS(Zt, "path"), s.classList.add("leches-guide_b"), r.appendChild(s), i = (void 0).createElementNS(Zt, "path"), i.classList.add("leches-guide_h"), r.appendChild(i), c = (void 0).createElement("div"), c.classList.add("leches-tooltip"), a.appendChild(c);
  }
  function u() {
    if (!s || !i || !c)
      return;
    const y = o, g = y + (y > 0 ? -1 : y < 0 ? 1 : 0), x = Math.max(-4, Math.min(4, -g));
    s.setAttributeNS(null, "d", `M 0,4 L${y},4`), i.setAttributeNS(null, "d", [
      `M ${g + x},0 L${g},4 L${g + x},8`,
      `M ${y},-1 L${y},9`
    ].join(" "));
    const p = t.formatDelta ? t.formatDelta(Math.abs(n)) : String(Math.abs(n).toFixed(2)), m = n >= 0 ? "+" : "-";
    c.textContent = `${m}${p}`, c.style.left = `${y}px`;
  }
  function h2() {
    a?.remove(), a = null, r = null, s = null, i = null, c = null;
  }
  function A(y) {
    const g = y.movementX, x = y.shiftKey ? 10 : y.altKey ? 0.1 : 1, p = g * toValue(t.step) * x, m = t.getValue(), w = Z(
      m + p,
      toValue(t.min),
      toValue(t.max)
    ), b = w - m;
    n += b, o += g * (p !== 0 ? b / p : 0), t.onUpdate(w), u();
  }
  function d() {
    e.value = false, n = 0, o = 0, (void 0).exitPointerLock?.(), h2(), (void 0).removeEventListener("mousemove", A), (void 0).removeEventListener("mouseup", d);
  }
  function v(y) {
    n = 0, o = 0, e.value = true, l = y.currentTarget, l?.requestPointerLock?.(), f(), (void 0).addEventListener("mousemove", A), (void 0).addEventListener("mouseup", d);
  }
  return getCurrentInstance() && false, {
    onMouseDown: v,
    isDragging: e
  };
}
const To = ["for", "title"], Vo = /* @__PURE__ */ defineComponent({
  __name: "ControlLabel",
  props: {
    label: {},
    control: {}
  },
  setup(t) {
    return (e, n) => (openBlock(), createElementBlock("label", {
      for: t.control.uniqueKey,
      title: t.label,
      class: "tl-text-gray-400 dark:tl-text-gray-500 tl-w-1/3 tl-truncate",
      style: { "padding-left": "var(--tl-h-padding)" }
    }, [
      t.control.icon ? (openBlock(), createElementBlock("i", {
        key: 0,
        class: normalizeClass(t.control.icon)
      }, null, 2)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
        createTextVNode(toDisplayString(t.label), 1)
      ], 64))
    ], 8, To));
  }
}), K = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [o, l] of e)
    n[o] = l;
  return n;
}, Y = /* @__PURE__ */ K(Vo, [["__scopeId", "data-v-e8aa98fa"]]), Uo = {
  class: "tl-flex tl-gap-1 tl-justify-between tl-items-center",
  style: { padding: "0 var(--tl-h-padding)", "margin-bottom": "var(--tl-unit-spacing)" }
}, Lo = ["id", "inputmode", "aria-valuemin", "aria-valuemax", "aria-valuenow"], Do = /* @__PURE__ */ defineComponent({
  __name: "NumberControl",
  props: {
    label: {},
    control: {}
  },
  emits: ["change"],
  setup(t, { emit: e }) {
    const n = t, o = e, l = computed(() => unref(n.control.value)), a = computed(() => n.control.step ?? 0.1), r = computed(() => n.control.format ?? Ae(a.value)), s = ref(r.value(l.value)), i = ref(false), { onMouseDown: c, isDragging: f } = we({
      getValue: () => l.value,
      step: a,
      min: computed(() => n.control.min),
      max: computed(() => n.control.max),
      onUpdate: (d) => o("change", d),
      formatDelta: (d) => r.value(d)
    });
    watch(l, (d) => {
      i.value || (s.value = r.value(d));
    }), watch(f, (d) => {
      d || (s.value = r.value(l.value));
    });
    function u() {
      i.value = true, s.value = String(l.value);
    }
    function h2() {
      i.value = false;
      const d = Number.parseFloat(s.value);
      if (Number.isNaN(d)) {
        s.value = r.value(l.value);
        return;
      }
      o("change", d), s.value = r.value(d);
    }
    function A(d) {
      if (d.key === "Enter") {
        d.target.blur();
        return;
      }
      const v = d.shiftKey ? 10 : d.altKey ? 0.1 : 1;
      if (d.key === "ArrowUp") {
        d.preventDefault();
        const y = Z(l.value + a.value * v, n.control.min, n.control.max);
        o("change", y);
      }
      if (d.key === "ArrowDown") {
        d.preventDefault();
        const y = Z(l.value - a.value * v, n.control.min, n.control.max);
        o("change", y);
      }
    }
    return (d, v) => (openBlock(), createElementBlock("div", Uo, [
      createVNode(Y, {
        label: t.label,
        control: t.control
      }, null, 8, ["label", "control"]),
      createElementVNode("div", {
        class: normalizeClass(["leches-num tl-relative tl-flex tl-items-center tl-w-2/3 tl-leches-input", { "leches-num--drg": unref(f) }])
      }, [
        createElementVNode("div", {
          class: "leches-knob",
          onMousedown: v[0] || (v[0] = //@ts-ignore
          (...y) => unref(c) && unref(c)(...y))
        }, null, 32),
        withDirectives(createElementVNode("input", {
          id: t.control.uniqueKey,
          "onUpdate:modelValue": v[1] || (v[1] = (y) => s.value = y),
          class: "leches-num_i tl-leches-input tl-w-full tl-text-right",
          type: "text",
          inputmode: unref(xe)(a.value),
          role: "spinbutton",
          "aria-valuemin": t.control.min,
          "aria-valuemax": t.control.max,
          "aria-valuenow": l.value,
          onFocus: u,
          onBlur: h2,
          onKeydown: A
        }, null, 40, Lo), [
          [vModelText, s.value]
        ])
      ], 2)
    ]));
  }
}), Ro = /* @__PURE__ */ K(Do, [["__scopeId", "data-v-3ce15e9a"]]), jo = {
  class: "tl-flex tl-gap-1 tl-justify-start tl-items-center",
  style: { padding: "0 var(--tl-h-padding)", "margin-bottom": "var(--tl-unit-spacing)", "min-height": "var(--tl-unit-size)" }
}, Ko = ["id", "value", "aria-label"], Qo = /* @__PURE__ */ defineComponent({
  __name: "TextControl",
  props: {
    label: {},
    control: {}
  },
  emits: ["change"],
  setup(t, { emit: e }) {
    const n = t, o = e, l = computed(() => unref(n.control.value));
    function a(r) {
      const { target: s } = r;
      o("change", s.value);
    }
    return (r, s) => (openBlock(), createElementBlock("div", jo, [
      createVNode(Y, {
        label: t.label,
        control: t.control
      }, null, 8, ["label", "control"]),
      createElementVNode("input", {
        id: t.control.uniqueKey,
        value: l.value,
        type: "text",
        tabindex: "0",
        class: "tl-leches-input tl-w-2/3",
        "aria-label": t.label,
        placeholder: "Enter value here...",
        onChange: a
      }, null, 40, Ko)
    ]));
  }
}), No = /* @__PURE__ */ K(Qo, [["__scopeId", "data-v-37c94034"]]), zo = {
  class: "tl-flex tl-gap-1 tl-items-center",
  style: { padding: "0 var(--tl-h-padding)", "margin-bottom": "var(--tl-unit-spacing)" }
}, qo = ["id", "checked"], Xo = ["for"], Ho = ["aria-checked"], Wo = { class: "i-ic:baseline-check tl-text-light dark:tl-text-dark" }, Po = /* @__PURE__ */ defineComponent({
  __name: "BooleanControl",
  props: {
    label: {},
    control: {}
  },
  emits: ["change"],
  setup(t, { emit: e }) {
    const n = t, o = e, l = computed(() => unref(n.control.value));
    function a(s) {
      const { target: i } = s;
      o("change", i.checked);
    }
    function r(s) {
      (s.code === "Space" || s.code === "Enter") && (s.preventDefault(), o("change", !l.value));
    }
    return (s, i) => (openBlock(), createElementBlock("div", zo, [
      createVNode(Y, {
        label: t.label,
        control: t.control
      }, null, 8, ["label", "control"]),
      createElementVNode("input", {
        id: t.control.uniqueKey,
        checked: l.value,
        class: "tl-hidden",
        type: "checkbox",
        onInput: a
      }, null, 40, qo),
      createElementVNode("label", {
        for: t.control.uniqueKey,
        class: "tl-w-2/3 tl-inline-flex tl-items-center tl-cursor-pointer"
      }, [
        createElementVNode("span", {
          tabindex: "0",
          role: "checkbox",
          "aria-checked": l.value,
          class: normalizeClass([{
            "tl-bg-dark-500 dark:tl-bg-gray-400": l.value,
            "tl-bg-gray-100 dark:tl-bg-dark-300": !l.value
          }, "leches-checkbox tl-flex tl-justify-center tl-items-center tl-rounded tl-text-white tl-outline-none tl-border-none focus:tl-border-gray-200 focus:tl-ring-2 focus:tl-ring-gray-200 tl-transition-colors tl-duration-200"]),
          onKeydown: r
        }, [
          withDirectives(createElementVNode("i", Wo, null, 512), [
            [vShow, l.value]
          ])
        ], 42, Ho)
      ], 8, Xo)
    ]));
  }
}), Zo = /* @__PURE__ */ K(Po, [["__scopeId", "data-v-9c08adc2"]]), Yo = {
  class: "tl-relative tl-flex tl-gap-2 tl-justify-between tl-items-center",
  style: { padding: "0 var(--tl-h-padding)", "margin-bottom": "var(--tl-unit-spacing)" }
}, Go = { class: "tl-relative tl-w-2/3 tl-flex tl-justify-between tl-items-center tl-gap-0.5" }, Jo = ["value", "min", "max", "step"], $o = ["inputmode", "aria-valuemin", "aria-valuemax", "aria-valuenow"], _o = /* @__PURE__ */ defineComponent({
  __name: "SliderControl",
  props: {
    label: {},
    control: {}
  },
  emits: ["change"],
  setup(t, { emit: e }) {
    const n = t, o = e, l = computed(() => unref(n.control.value)), a = computed(() => n.control.step ?? 0.1), r = computed(() => n.control.format ?? Ae(a.value)), s = ref(r.value(l.value)), i = ref(false), c = useDark(), f = computed(() => {
      const g = c.value ? "#9ca3af" : "#2d2d2d", x = c.value ? "#2d2d2d" : "#9ca3af";
      return {
        backgroundImage: `linear-gradient(to right, ${g} 0% ${100 * (l.value - (n.control.min || 0)) / ((n.control.max || 100) - (n.control.min || 0))}%, ${x} 0%)`
      };
    });
    watch(l, (g) => {
      i.value || (s.value = r.value(g));
    });
    function u(g) {
      const { target: x } = g;
      o("change", x.valueAsNumber);
    }
    const { onMouseDown: h2, isDragging: A } = we({
      getValue: () => l.value,
      step: a,
      min: computed(() => n.control.min),
      max: computed(() => n.control.max),
      onUpdate: (g) => o("change", g),
      formatDelta: (g) => r.value(g)
    });
    watch(A, (g) => {
      g || (s.value = r.value(l.value));
    });
    function d() {
      i.value = true, s.value = String(l.value);
    }
    function v() {
      i.value = false;
      const g = Number.parseFloat(s.value);
      if (Number.isNaN(g)) {
        s.value = r.value(l.value);
        return;
      }
      const x = Z(g, n.control.min, n.control.max);
      o("change", x), s.value = r.value(x);
    }
    function y(g) {
      if (g.key === "Enter") {
        g.target.blur();
        return;
      }
      const x = g.shiftKey ? 10 : g.altKey ? 0.1 : 1;
      if (g.key === "ArrowUp") {
        g.preventDefault();
        const p = Z(l.value + a.value * x, n.control.min, n.control.max);
        o("change", p);
      }
      if (g.key === "ArrowDown") {
        g.preventDefault();
        const p = Z(l.value - a.value * x, n.control.min, n.control.max);
        o("change", p);
      }
    }
    return (g, x) => (openBlock(), createElementBlock("div", Yo, [
      createVNode(Y, {
        label: t.label,
        control: t.control
      }, null, 8, ["label", "control"]),
      createElementVNode("div", Go, [
        createElementVNode("input", {
          value: l.value,
          class: "leches-range tl-w-1/2 tl-h-0.5 tl-bg-dark-200 dark:tl-bg-yellow tl-rounded-full tl-appearance-none",
          style: normalizeStyle(f.value),
          type: "range",
          min: t.control.min,
          max: t.control.max,
          step: t.control.step,
          onInput: u
        }, null, 44, Jo),
        createElementVNode("div", {
          class: normalizeClass(["leches-num tl-relative tl-flex tl-items-center tl-w-1/3 tl-leches-input", { "leches-num--drg": unref(A) }])
        }, [
          createElementVNode("div", {
            class: "leches-knob",
            onMousedown: x[0] || (x[0] = //@ts-ignore
            (...p) => unref(h2) && unref(h2)(...p))
          }, null, 32),
          withDirectives(createElementVNode("input", {
            "onUpdate:modelValue": x[1] || (x[1] = (p) => s.value = p),
            class: "leches-num_i tl-leches-input tl-w-full tl-text-right",
            type: "text",
            inputmode: unref(xe)(a.value),
            role: "spinbutton",
            "aria-valuemin": t.control.min,
            "aria-valuemax": t.control.max,
            "aria-valuenow": l.value,
            onFocus: d,
            onBlur: v,
            onKeydown: y
          }, null, 40, $o), [
            [vModelText, s.value]
          ])
        ], 2)
      ])
    ]));
  }
}), tl = /* @__PURE__ */ K(_o, [["__scopeId", "data-v-04f32adb"]]), el = {
  class: "tl-flex tl-gap-1 tl-items-center",
  style: { padding: "0 var(--tl-h-padding)", "margin-bottom": "var(--tl-unit-spacing)" }
}, nl = ["for"], ol = ["id", "value", "aria-label"], ll = { class: "leches-color-hex" }, rl = /* @__PURE__ */ defineComponent({
  __name: "ColorControl",
  props: {
    label: {},
    control: {}
  },
  emits: ["change"],
  setup(t, { emit: e }) {
    const n = t, o = e, l = computed(() => unref(n.control.value));
    function a(r) {
      const { target: s } = r;
      o("change", s.value);
    }
    return (r, s) => (openBlock(), createElementBlock("div", el, [
      createVNode(Y, {
        label: t.label,
        control: t.control
      }, null, 8, ["label", "control"]),
      createElementVNode("label", {
        for: `${t.control.uniqueKey}-color`,
        class: "leches-color-container tl-leches-input tl-w-2/3"
      }, [
        createElementVNode("input", {
          id: `${t.control.uniqueKey}-color`,
          tabindex: "0",
          value: l.value,
          "aria-label": t.label,
          class: "leches-color",
          type: "color",
          onInput: a
        }, null, 40, ol),
        createElementVNode("span", ll, toDisplayString(l.value), 1)
      ], 8, nl)
    ]));
  }
}), al = /* @__PURE__ */ K(rl, [["__scopeId", "data-v-39e888e4"]]);
function ne(t) {
  return t && typeof t.x == "number" && typeof t.y == "number";
}
function oe(t) {
  return t && typeof t.x == "number" && typeof t.y == "number" && typeof t.z == "number";
}
function sl(t) {
  if (typeof t == "number")
    return [t, t, t];
  if (oe(t)) {
    const { x: e, y: n, z: o } = t;
    return [e, n, o];
  }
  if (ne(t)) {
    const { x: e, y: n } = t;
    return [e, n];
  }
  return t;
}
const il = {
  class: "tl-flex tl-gap-1 tl-justify-between tl-items-center",
  style: { padding: "0 var(--tl-h-padding)", "margin-bottom": "var(--tl-unit-spacing)" }
}, cl = { class: "tl-relative tl-w-2/3 tl-flex tl-justify-between tl-gap-0.5" }, ul = ["onMousedown"], fl = {
  key: 0,
  class: "tl-font-bold tl-py-0.5 tl-text-0.65rem tl-text-gray-300 dark:tl-text-gray-400"
}, dl = ["id", "onUpdate:modelValue", "inputmode", "aria-valuenow", "aria-valuemin", "aria-valuemax", "onFocus", "onBlur", "onKeydown"], pl = /* @__PURE__ */ defineComponent({
  __name: "VectorControl",
  props: {
    label: {},
    control: {}
  },
  emits: ["change"],
  setup(t, { emit: e }) {
    const n = t, o = e, l = computed(() => unref(n.control.value)), a = computed(() => sl(l.value)), r = ref(["x", "y", "z"]), s = computed(() => ne(l.value) || oe(l.value)), i = computed(() => n.control.step ?? 1), c = computed(() => n.control.format ?? Ae(i.value)), f = ref(null), u = ref([]);
    function h2() {
      const p = a.value;
      u.value = p.map((m) => c.value(m));
    }
    h2(), watch(l, () => {
      f.value === null && h2();
    }, { deep: true });
    function A(p, m) {
      const w = l.value, b = s.value ? r.value[p] : p;
      w[b] = m, o("change", w);
    }
    function d(p) {
      return we({
        getValue: () => a.value[p],
        step: i,
        min: computed(() => n.control.min),
        max: computed(() => n.control.max),
        onUpdate: (m) => {
          A(p, m), u.value[p] = c.value(m);
        },
        formatDelta: (m) => c.value(m)
      });
    }
    const v = [d(0), d(1), d(2)];
    function y(p) {
      f.value = p, u.value[p] = String(a.value[p]);
    }
    function g(p) {
      f.value = null;
      const m = Number.parseFloat(u.value[p]);
      if (Number.isNaN(m)) {
        u.value[p] = c.value(a.value[p]);
        return;
      }
      const w = Z(m, n.control.min, n.control.max);
      A(p, w), u.value[p] = c.value(w);
    }
    function x(p, m) {
      if (p.key === "Enter") {
        p.target.blur();
        return;
      }
      const w = p.shiftKey ? 10 : p.altKey ? 0.1 : 1, b = a.value[m];
      if (p.key === "ArrowUp") {
        p.preventDefault();
        const S = Z(b + i.value * w, n.control.min, n.control.max);
        A(m, S);
      }
      if (p.key === "ArrowDown") {
        p.preventDefault();
        const S = Z(b - i.value * w, n.control.min, n.control.max);
        A(m, S);
      }
    }
    return (p, m) => (openBlock(), createElementBlock("div", il, [
      createVNode(Y, {
        label: t.label,
        control: t.control
      }, null, 8, ["label", "control"]),
      createElementVNode("div", cl, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(a.value, (w, b) => (openBlock(), createElementBlock("div", {
          key: t.label + b,
          class: normalizeClass(["leches-num tl-relative tl-flex tl-items-center tl-text-gray-400 tl-bg-gray-100 dark:tl-bg-dark-300 tl-rounded tl-border-none tl-outline-none tl-focus:tl-border-gray-200 tl-focus:tl-ring tl-focus:tl-ring-gray-200", {
            "tl-w-2/5": f.value === b,
            "tl-w-1/3": unref(oe)(l.value),
            "tl-w-1/2": unref(ne)(l.value),
            "leches-num--drg": v[b].isDragging.value
          }])
        }, [
          createElementVNode("div", {
            class: "leches-knob leches-knob--inline",
            onMousedown: (S) => v[b].onMouseDown(S)
          }, null, 40, ul),
          r.value[b] && s.value ? (openBlock(), createElementBlock("span", fl, toDisplayString(r.value[b]), 1)) : createCommentVNode("", true),
          withDirectives(createElementVNode("input", {
            id: `${t.control.uniqueKey}-${r.value[b]}`,
            "onUpdate:modelValue": (S) => u.value[b] = S,
            type: "text",
            inputmode: unref(xe)(i.value),
            role: "spinbutton",
            "aria-valuenow": a.value[b],
            "aria-valuemin": t.control.min,
            "aria-valuemax": t.control.max,
            class: "tl-w-full tl-text-right tl-text-0.65rem tl-text-gray-400 dark:tl-text-gray-400 tl-bg-transparent focus:tl-border-gray-200 tl-outline-none tl-border-none tl-font-sans tl-appearence-none",
            style: { padding: "var(--tl-input-padding)" },
            onFocus: (S) => y(b),
            onBlur: (S) => g(b),
            onKeydown: (S) => x(S, b)
          }, null, 40, dl), [
            [vModelText, u.value[b]]
          ])
        ], 2))), 128))
      ])
    ]));
  }
}), ml = /* @__PURE__ */ K(pl, [["__scopeId", "data-v-011fee9a"]]), gl = {
  class: "tl-flex tl-gap-1 tl-items-center",
  style: { padding: "0 var(--tl-h-padding)", "margin-bottom": "var(--tl-unit-spacing)" }
}, vl = { class: "tl-absolute tl-bottom-0.5 tl-right-0.5 tl-font-sans" }, yl = ["width", "height"], hl = ["points", "stroke"], it = 2, Ne = 100, ze = 20, bl = /* @__PURE__ */ defineComponent({
  __name: "FPSGraph",
  props: {
    label: {},
    control: {}
  },
  setup(t) {
    const e = ref(null), n = ref(160), o = ref(20), l = useFps({ every: Ne }), a = ref(""), r = ref([]), s = ref(n.value / it);
    let i = performance.now();
    useRafFn(({ timestamp: u }) => {
      u - i >= Ne && (i = u, r.value.push(l.value), r.value.length > s.value && r.value.shift(), a.value = r.value.map(
        (h2, A) => `${A * it},${o.value + ze - it / 2 - h2 * (o.value + ze - it) / 120}`
      ).join(" "));
    });
    const f = useDark();
    return (u, h2) => (openBlock(), createElementBlock("div", gl, [
      createVNode(Y, {
        label: t.label,
        control: t.control
      }, null, 8, ["label", "control"]),
      createElementVNode("div", {
        ref_key: "containerRef",
        ref: e,
        class: "tl-relative tl-w-2/3 tl-py-1 tl-text-right tl-text-gray-400 tl-bg-gray-100 dark:tl-bg-dark-300 dark:tl-text-gray-400 tl-outline-none tl-border-none tl-font-sans",
        style: { "border-radius": "var(--tl-blade-radius)" }
      }, [
        createElementVNode("div", vl, toDisplayString(Math.round(unref(l))) + " FPS ", 1),
        (openBlock(), createElementBlock("svg", {
          width: n.value,
          height: o.value,
          xmlns: "http://www.w3.org/2000/svg",
          class: "tl-bg-gray-100 dark:tl-bg-dark-300"
        }, [
          createElementVNode("polyline", {
            points: a.value,
            fill: "none",
            stroke: unref(f) ? "darkgray" : "lightgray",
            "stroke-width": it,
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, null, 8, hl)
        ], 8, yl))
      ], 512)
    ]));
  }
}), Al = /* @__PURE__ */ K(bl, [["__scopeId", "data-v-3569ccbe"]]), xl = {
  class: "tl-flex tl-gap-1 tl-justify-start tl-items-center",
  style: { padding: "0 var(--tl-h-padding)", "margin-bottom": "var(--tl-unit-spacing)", "min-height": "var(--tl-unit-size)" }
}, wl = ["id", "value"], Cl = ["value"], kl = /* @__PURE__ */ defineComponent({
  __name: "SelectControl",
  props: {
    label: {},
    control: {}
  },
  emits: ["change"],
  setup(t, { emit: e }) {
    const n = t, o = e, l = computed(() => unref(n.control.value));
    function a(r) {
      const s = r.target.value, i = n.control.options?.find(
        (c) => String(c.value) === s
      );
      o("change", i?.value ?? s);
    }
    return (r, s) => (openBlock(), createElementBlock("div", xl, [
      createVNode(Y, {
        label: t.label,
        control: t.control
      }, null, 8, ["label", "control"]),
      createElementVNode("select", {
        id: t.control.uniqueKey,
        value: String(l.value),
        class: "tl-leches-input tl-w-2/3",
        onChange: a
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(t.control.options, (i) => (openBlock(), createElementBlock("option", {
          key: String(i.value),
          value: String(i.value)
        }, toDisplayString(i.text), 9, Cl))), 128))
      ], 40, wl)
    ]));
  }
}), Ol = /* @__PURE__ */ K(kl, [["__scopeId", "data-v-ac58e4ee"]]), El = ["id"], Sl = /* @__PURE__ */ defineComponent({
  __name: "ButtonControl",
  props: {
    label: {},
    control: {}
  },
  setup(t) {
    const e = t, n = computed(() => {
      const o = "leches-btn", l = `leches-btn-${e.control.value.variant || "primary"}`, a = `leches-btn-${e.control.value.size || "sm"}`;
      return [o, l, a];
    });
    return (o, l) => (openBlock(), createElementBlock("button", {
      id: `${t.control.uniqueKey}`,
      class: normalizeClass(n.value),
      onClick: l[0] || (l[0] = //@ts-ignore
      (...a) => t.control.value.onClick && t.control.value.onClick(...a))
    }, [
      createElementVNode("i", {
        class: normalizeClass([t.control.value.icon, t.control.value.label ? "mr-1" : ""])
      }, null, 2),
      createTextVNode(" " + toDisplayString(t.control.value.label), 1)
    ], 10, El));
  }
}), Ml = /* @__PURE__ */ K(Sl, [["__scopeId", "data-v-23f233d0"]]), Bl = {
  class: "tl-flex tl-gap-1 tl-items-center",
  style: { padding: "0 var(--tl-h-padding)", "margin-bottom": "var(--tl-unit-spacing)" }
}, Fl = { class: "tl-absolute tl-bg-gray-100 tl-p-0.5 rounded dark:tl-bg-dark-300 tl-bottom-0.5 tl-right-1 tl-font-sans" }, Il = ["width", "height"], Tl = ["y1", "x2", "y2"], Vl = ["d"], Ft = 2, Ul = 100, qe = 4, Ll = /* @__PURE__ */ defineComponent({
  __name: "GraphControl",
  props: {
    label: {},
    control: {}
  },
  setup(t) {
    const e = t, n = ref(null), o = ref(160), l = ref(20), a = ref(""), r = ref([]), s = ref(Math.floor(o.value / Ft));
    let i = performance.now();
    function f(u) {
      if (u.length < 2)
        return "";
      if (u.length === 2)
        return `M ${u[0].x},${u[0].y} L ${u[1].x},${u[1].y}`;
      let h2 = `M ${u[0].x},${u[0].y}`;
      for (let A = 0; A < u.length - 1; A++) {
        const d = u[A], v = u[A + 1], y = d.x + (v.x - d.x) / 3, g = d.y, x = v.x - (v.x - d.x) / 3, p = v.y;
        h2 += ` C ${y},${g} ${x},${p} ${v.x},${v.y}`;
      }
      return h2;
    }
    return useRafFn(() => {
      const u = performance.now();
      if (u - i >= Ul && (i = u, r.value.push(typeof e.control.value == "number" ? e.control.value : 0), e.control.onUpdate && e.control.onUpdate(r.value), r.value.length > s.value && (r.value = r.value.slice(-s.value)), r.value.length > 0)) {
        const h2 = Math.min(0, ...r.value), A = Math.max(0, ...r.value), d = Math.max(1, A - h2), v = l.value - qe * 2, y = r.value.map((g, x) => {
          const p = x * Ft, m = (g - h2) / d, w = qe + (v - m * v);
          return { x: p, y: w };
        });
        a.value = f(y);
      }
    }), (u, h2) => (openBlock(), createElementBlock("div", Bl, [
      createVNode(Y, {
        label: t.label,
        control: t.control
      }, null, 8, ["label", "control"]),
      createElementVNode("div", {
        ref_key: "containerRef",
        ref: n,
        class: "tl-relative tl-w-2/3 tl-py-1 tl-text-right tl-text-gray-400 tl-bg-gray-100 dark:tl-bg-dark-300 dark:tl-text-gray-400 tl-outline-none tl-border-none tl-font-sans",
        style: { "border-radius": "var(--tl-blade-radius)" }
      }, [
        createElementVNode("div", Fl, toDisplayString(Math.round(t.control.value)), 1),
        (openBlock(), createElementBlock("svg", {
          width: o.value,
          height: l.value,
          xmlns: "http://www.w3.org/2000/svg",
          class: "tl-bg-gray-100 dark:tl-bg-dark-300"
        }, [
          Math.min(...r.value) < 0 && Math.max(...r.value) > 0 ? (openBlock(), createElementBlock("line", {
            key: 0,
            x1: "0",
            y1: l.value / 2,
            x2: o.value,
            y2: l.value / 2,
            stroke: "rgba(128, 128, 128, 0.2)",
            "stroke-width": "1"
          }, null, 8, Tl)) : createCommentVNode("", true),
          createElementVNode("path", {
            d: a.value,
            fill: "none",
            stroke: "currentColor",
            "stroke-width": Ft,
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, null, 8, Vl)
        ], 8, Il))
      ], 512)
    ]));
  }
}), Dl = /* @__PURE__ */ K(Ll, [["__scopeId", "data-v-8959627c"]]), Rl = { key: 0 }, jl = {
  key: 8,
  class: "tl-flex tl-justify-end",
  style: { padding: "var(--tl-v-padding) var(--tl-h-padding)" }
}, Kl = /* @__PURE__ */ defineComponent({
  __name: "ControlInput",
  props: {
    control: {}
  },
  emits: ["change"],
  setup(t, { emit: e }) {
    const n = e;
    function o(l) {
      n("change", l);
    }
    return (l, a) => t.control.visible ? (openBlock(), createElementBlock("div", Rl, [
      t.control.type === "color" ? (openBlock(), createBlock(al, {
        key: 0,
        label: t.control.label,
        control: t.control,
        onChange: o
      }, null, 8, ["label", "control"])) : t.control.type === "select" ? (openBlock(), createBlock(Ol, {
        key: 1,
        label: t.control.label,
        control: t.control,
        onChange: o
      }, null, 8, ["label", "control"])) : t.control.type === "vector" ? (openBlock(), createBlock(ml, {
        key: 2,
        label: t.control.label,
        control: t.control,
        onChange: o
      }, null, 8, ["label", "control"])) : t.control.type === "boolean" ? (openBlock(), createBlock(Zo, {
        key: 3,
        label: t.control.label,
        control: t.control,
        onChange: o
      }, null, 8, ["label", "control"])) : t.control.type === "fpsgraph" ? (openBlock(), createBlock(Al, {
        key: 4,
        label: t.control.label,
        control: t.control
      }, null, 8, ["label", "control"])) : t.control.type === "graph" ? (openBlock(), createBlock(Dl, {
        key: 5,
        label: t.control.label,
        control: t.control
      }, null, 8, ["label", "control"])) : t.control.type === "number" ? (openBlock(), createBlock(Ro, {
        key: 6,
        label: t.control.label,
        control: t.control,
        onChange: o
      }, null, 8, ["label", "control"])) : t.control.type === "range" ? (openBlock(), createBlock(tl, {
        key: 7,
        label: t.control.label,
        control: t.control,
        onChange: o
      }, null, 8, ["label", "control"])) : t.control.type === "button" ? (openBlock(), createElementBlock("div", jl, [
        createVNode(Ml, {
          label: t.control.label,
          control: t.control
        }, null, 8, ["label", "control"])
      ])) : (openBlock(), createBlock(No, {
        key: 9,
        label: t.control.label,
        control: t.control,
        onChange: o
      }, null, 8, ["label", "control"]))
    ])) : createCommentVNode("", true);
  }
}), vn = /* @__PURE__ */ K(Kl, [["__scopeId", "data-v-bada433a"]]), Ql = {
  class: "tl-transition-all tl-duration-200 tl-ease-in-out",
  style: { "margin-bottom": "var(--tl-unit-spacing)" }
}, Nl = ["aria-expanded", "data-folder"], zl = { class: "tl-relative tl-overflow-hidden" }, ql = {
  class: "tl-bg-white dark:tl-bg-dark-300 tl-rounded-b",
  style: { "padding-top": "var(--tl-v-padding)", "padding-bottom": "var(--tl-v-padding)" },
  role: "menu"
}, Xl = /* @__PURE__ */ defineComponent({
  __name: "Folder",
  props: {
    controls: {},
    label: {}
  },
  emits: ["open"],
  setup(t, { emit: e }) {
    const n = e;
    function o(r, s) {
      isRef(s.value) ? s.value.value = r : s.value = r;
    }
    const l = ref(false), a = () => {
      l.value = !l.value, n("open", l.value);
    };
    return (r, s) => (openBlock(), createElementBlock("div", Ql, [
      createElementVNode("button", {
        class: "tl-flex tl-items-center tl-justify-between tl-w-full tl-bg-gray-100 dark:tl-bg-dark-300 tl-border-none tl-text-gray-400 dark:tl-text-gray-400 tl-font-bold tl-font-sans tl-cursor-pointer tl-relative tl-z-10",
        style: { padding: "0 var(--tl-h-padding * 2)", height: "var(--tl-unit-size)", "line-height": "var(--tl-unit-size)", "font-size": "var(--tl-font-size)" },
        "aria-expanded": l.value,
        "aria-haspopup": "true",
        role: "button",
        "data-folder": t.label,
        tabindex: "0",
        onClick: a
      }, [
        createElementVNode("span", null, toDisplayString(t.label), 1),
        createElementVNode("i", {
          class: normalizeClass(l.value ? "i-ic:baseline-keyboard-arrow-up" : "i-ic:baseline-keyboard-arrow-down")
        }, null, 2)
      ], 8, Nl),
      createElementVNode("div", zl, [
        createVNode(Transition, {
          name: "slide",
          "enter-active-class": "tl-transition-[transform,opacity] tl-duration-200 tl-ease-out",
          "enter-from-class": "tl-origin-top tl-scale-y-0 tl-opacity-0",
          "enter-to-class": "tl-origin-top tl-scale-y-100 tl-opacity-100",
          "leave-active-class": "tl-transition-[transform,opacity] tl-duration-200 tl-ease-in",
          "leave-from-class": "tl-origin-top tl-scale-y-100 tl-opacity-100",
          "leave-to-class": "tl-origin-top tl-scale-y-0 tl-opacity-0"
        }, {
          default: withCtx(() => [
            withDirectives(createElementVNode("div", ql, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(t.controls, (i) => (openBlock(), createBlock(vn, {
                key: i.label,
                control: i,
                role: "menuitem",
                onChange: (c) => o(c, i)
              }, null, 8, ["control", "onChange"]))), 128))
            ], 512), [
              [vShow, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}), Hl = /* @__PURE__ */ K(Xl, [["__scopeId", "data-v-13096796"]]);
function Yt(t) {
  if (t === null || typeof t != "object")
    return false;
  const e = Object.getPrototypeOf(t);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in t ? false : Symbol.toStringTag in t ? Object.prototype.toString.call(t) === "[object Module]" : true;
}
function le(t, e, n = ".", o) {
  if (!Yt(e))
    return le(t, {}, n);
  const l = Object.assign({}, e);
  for (const a in t) {
    if (a === "__proto__" || a === "constructor")
      continue;
    const r = t[a];
    r != null && (Array.isArray(r) && Array.isArray(l[a]) ? l[a] = [...r, ...l[a]] : Yt(r) && Yt(l[a]) ? l[a] = le(
      r,
      l[a],
      (n ? `${n}.` : "") + a.toString()
    ) : l[a] = r);
  }
  return l;
}
function Wl(t) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((n, o) => le(n, o, ""), {})
  );
}
const Pl = Wl(), yn = 1 / 60 * 1e3, Zl = typeof performance < "u" ? () => performance.now() : () => Date.now(), hn = (t) => setTimeout(() => t(Zl()), yn);
function Yl(t) {
  let e = [], n = [], o = 0, l = false, a = false;
  const r = /* @__PURE__ */ new WeakSet(), s = {
    schedule: (i, c = false, f = false) => {
      const u = f && l, h2 = u ? e : n;
      return c && r.add(i), h2.indexOf(i) === -1 && (h2.push(i), u && l && (o = e.length)), i;
    },
    cancel: (i) => {
      const c = n.indexOf(i);
      c !== -1 && n.splice(c, 1), r.delete(i);
    },
    process: (i) => {
      if (l) {
        a = true;
        return;
      }
      if (l = true, [e, n] = [n, e], n.length = 0, o = e.length, o)
        for (let c = 0; c < o; c++) {
          const f = e[c];
          f(i), r.has(f) && (s.schedule(f), t());
        }
      l = false, a && (a = false, s.process(i));
    }
  };
  return s;
}
const Gl = 40;
let re = true, ht = false, ae = false;
const ut = {
  delta: 0,
  timestamp: 0
}, wt = [
  "read",
  "update",
  "preRender",
  "render",
  "postRender"
], Kt = wt.reduce((t, e) => (t[e] = Yl(() => ht = true), t), {}), se = wt.reduce((t, e) => {
  const n = Kt[e];
  return t[e] = (o, l = false, a = false) => (ht || _l(), n.schedule(o, l, a)), t;
}, {}), Jl = wt.reduce((t, e) => (t[e] = Kt[e].cancel, t), {});
wt.reduce((t, e) => (t[e] = () => Kt[e].process(ut), t), {});
const $l = (t) => Kt[t].process(ut), bn = (t) => {
  ht = false, ut.delta = re ? yn : Math.max(Math.min(t - ut.timestamp, Gl), 1), ut.timestamp = t, ae = true, wt.forEach($l), ae = false, ht && (re = false, hn(bn));
}, _l = () => {
  ht = true, re = true, ae || hn(bn);
}, An = () => ut;
function xn(t, e) {
  var n = {};
  for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && e.indexOf(o) < 0 && (n[o] = t[o]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var l = 0, o = Object.getOwnPropertySymbols(t); l < o.length; l++)
      e.indexOf(o[l]) < 0 && Object.prototype.propertyIsEnumerable.call(t, o[l]) && (n[o[l]] = t[o[l]]);
  return n;
}
var bt = function() {
};
const ie = (t, e, n) => Math.min(Math.max(n, t), e), Gt = 1e-3, tr = 0.01, Xe = 10, er = 0.05, nr = 1;
function or({ duration: t = 800, bounce: e = 0.25, velocity: n = 0, mass: o = 1 }) {
  let l, a;
  let r = 1 - e;
  r = ie(er, nr, r), t = ie(tr, Xe, t / 1e3), r < 1 ? (l = (c) => {
    const f = c * r, u = f * t, h2 = f - n, A = ce(c, r), d = Math.exp(-u);
    return Gt - h2 / A * d;
  }, a = (c) => {
    const u = c * r * t, h2 = u * n + n, A = Math.pow(r, 2) * Math.pow(c, 2) * t, d = Math.exp(-u), v = ce(Math.pow(c, 2), r);
    return (-l(c) + Gt > 0 ? -1 : 1) * ((h2 - A) * d) / v;
  }) : (l = (c) => {
    const f = Math.exp(-c * t), u = (c - n) * t + 1;
    return -Gt + f * u;
  }, a = (c) => {
    const f = Math.exp(-c * t), u = (n - c) * (t * t);
    return f * u;
  });
  const s = 5 / t, i = rr(l, a, s);
  if (t = t * 1e3, isNaN(i))
    return {
      stiffness: 100,
      damping: 10,
      duration: t
    };
  {
    const c = Math.pow(i, 2) * o;
    return {
      stiffness: c,
      damping: r * 2 * Math.sqrt(o * c),
      duration: t
    };
  }
}
const lr = 12;
function rr(t, e, n) {
  let o = n;
  for (let l = 1; l < lr; l++)
    o = o - t(o) / e(o);
  return o;
}
function ce(t, e) {
  return t * Math.sqrt(1 - e * e);
}
const ar = ["duration", "bounce"], sr = ["stiffness", "damping", "mass"];
function He(t, e) {
  return e.some((n) => t[n] !== void 0);
}
function ir(t) {
  let e = Object.assign({ velocity: 0, stiffness: 100, damping: 10, mass: 1, isResolvedFromDuration: false }, t);
  if (!He(t, sr) && He(t, ar)) {
    const n = or(t);
    e = Object.assign(Object.assign(Object.assign({}, e), n), { velocity: 0, mass: 1 }), e.isResolvedFromDuration = true;
  }
  return e;
}
function ke(t) {
  var { from: e = 0, to: n = 1, restSpeed: o = 2, restDelta: l } = t, a = xn(t, ["from", "to", "restSpeed", "restDelta"]);
  const r = { done: false, value: e };
  let { stiffness: s, damping: i, mass: c, velocity: f, duration: u, isResolvedFromDuration: h2 } = ir(a), A = We, d = We;
  function v() {
    const y = f ? -(f / 1e3) : 0, g = n - e, x = i / (2 * Math.sqrt(s * c)), p = Math.sqrt(s / c) / 1e3;
    if (l === void 0 && (l = Math.min(Math.abs(n - e) / 100, 0.4)), x < 1) {
      const m = ce(p, x);
      A = (w) => {
        const b = Math.exp(-x * p * w);
        return n - b * ((y + x * p * g) / m * Math.sin(m * w) + g * Math.cos(m * w));
      }, d = (w) => {
        const b = Math.exp(-x * p * w);
        return x * p * b * (Math.sin(m * w) * (y + x * p * g) / m + g * Math.cos(m * w)) - b * (Math.cos(m * w) * (y + x * p * g) - m * g * Math.sin(m * w));
      };
    } else if (x === 1)
      A = (m) => n - Math.exp(-p * m) * (g + (y + p * g) * m);
    else {
      const m = p * Math.sqrt(x * x - 1);
      A = (w) => {
        const b = Math.exp(-x * p * w), S = Math.min(m * w, 300);
        return n - b * ((y + x * p * g) * Math.sinh(S) + m * g * Math.cosh(S)) / m;
      };
    }
  }
  return v(), {
    next: (y) => {
      const g = A(y);
      if (h2)
        r.done = y >= u;
      else {
        const x = d(y) * 1e3, p = Math.abs(x) <= o, m = Math.abs(n - g) <= l;
        r.done = p && m;
      }
      return r.value = r.done ? n : g, r;
    },
    flipTarget: () => {
      f = -f, [e, n] = [n, e], v();
    }
  };
}
ke.needsInterpolation = (t, e) => typeof t == "string" || typeof e == "string";
const We = (t) => 0, wn = (t, e, n) => {
  const o = e - t;
  return o === 0 ? 1 : (n - t) / o;
}, Oe = (t, e, n) => -n * t + n * e + t, Cn = (t, e) => (n) => Math.max(Math.min(n, e), t), mt = (t) => t % 1 ? Number(t.toFixed(5)) : t, At = /(-)?([\d]*\.?[\d])+/g, ue = /(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi, cr = /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;
function Ct(t) {
  return typeof t == "string";
}
const kt = {
  test: (t) => typeof t == "number",
  parse: parseFloat,
  transform: (t) => t
}, gt = Object.assign(Object.assign({}, kt), { transform: Cn(0, 1) }), It = Object.assign(Object.assign({}, kt), { default: 1 }), Ee = (t) => ({
  test: (e) => Ct(e) && e.endsWith(t) && e.split(" ").length === 1,
  parse: parseFloat,
  transform: (e) => `${e}${t}`
}), et = Ee("deg"), vt = Ee("%"), E = Ee("px"), Pe = Object.assign(Object.assign({}, vt), { parse: (t) => vt.parse(t) / 100, transform: (t) => vt.transform(t * 100) }), Se = (t, e) => (n) => !!(Ct(n) && cr.test(n) && n.startsWith(t) || e && Object.prototype.hasOwnProperty.call(n, e)), kn = (t, e, n) => (o) => {
  if (!Ct(o))
    return o;
  const [l, a, r, s] = o.match(At);
  return {
    [t]: parseFloat(l),
    [e]: parseFloat(a),
    [n]: parseFloat(r),
    alpha: s !== void 0 ? parseFloat(s) : 1
  };
}, lt = {
  test: Se("hsl", "hue"),
  parse: kn("hue", "saturation", "lightness"),
  transform: ({ hue: t, saturation: e, lightness: n, alpha: o = 1 }) => "hsla(" + Math.round(t) + ", " + vt.transform(mt(e)) + ", " + vt.transform(mt(n)) + ", " + mt(gt.transform(o)) + ")"
}, ur = Cn(0, 255), Jt = Object.assign(Object.assign({}, kt), { transform: (t) => Math.round(ur(t)) }), G = {
  test: Se("rgb", "red"),
  parse: kn("red", "green", "blue"),
  transform: ({ red: t, green: e, blue: n, alpha: o = 1 }) => "rgba(" + Jt.transform(t) + ", " + Jt.transform(e) + ", " + Jt.transform(n) + ", " + mt(gt.transform(o)) + ")"
};
function fr(t) {
  let e = "", n = "", o = "", l = "";
  return t.length > 5 ? (e = t.substr(1, 2), n = t.substr(3, 2), o = t.substr(5, 2), l = t.substr(7, 2)) : (e = t.substr(1, 1), n = t.substr(2, 1), o = t.substr(3, 1), l = t.substr(4, 1), e += e, n += n, o += o, l += l), {
    red: parseInt(e, 16),
    green: parseInt(n, 16),
    blue: parseInt(o, 16),
    alpha: l ? parseInt(l, 16) / 255 : 1
  };
}
const fe = {
  test: Se("#"),
  parse: fr,
  transform: G.transform
}, j = {
  test: (t) => G.test(t) || fe.test(t) || lt.test(t),
  parse: (t) => G.test(t) ? G.parse(t) : lt.test(t) ? lt.parse(t) : fe.parse(t),
  transform: (t) => Ct(t) ? t : t.hasOwnProperty("red") ? G.transform(t) : lt.transform(t)
}, On = "${c}", En = "${n}";
function dr(t) {
  var e, n, o, l;
  return isNaN(t) && Ct(t) && ((n = (e = t.match(At)) === null || e === void 0 ? void 0 : e.length) !== null && n !== void 0 ? n : 0) + ((l = (o = t.match(ue)) === null || o === void 0 ? void 0 : o.length) !== null && l !== void 0 ? l : 0) > 0;
}
function Sn(t) {
  typeof t == "number" && (t = `${t}`);
  const e = [];
  let n = 0;
  const o = t.match(ue);
  o && (n = o.length, t = t.replace(ue, On), e.push(...o.map(j.parse)));
  const l = t.match(At);
  return l && (t = t.replace(At, En), e.push(...l.map(kt.parse))), { values: e, numColors: n, tokenised: t };
}
function Mn(t) {
  return Sn(t).values;
}
function Bn(t) {
  const { values: e, numColors: n, tokenised: o } = Sn(t), l = e.length;
  return (a) => {
    let r = o;
    for (let s = 0; s < l; s++)
      r = r.replace(s < n ? On : En, s < n ? j.transform(a[s]) : mt(a[s]));
    return r;
  };
}
const pr = (t) => typeof t == "number" ? 0 : t;
function mr(t) {
  const e = Mn(t);
  return Bn(t)(e.map(pr));
}
const Ot = { test: dr, parse: Mn, createTransformer: Bn, getAnimatableNone: mr }, gr = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function vr(t) {
  let [e, n] = t.slice(0, -1).split("(");
  if (e === "drop-shadow")
    return t;
  const [o] = n.match(At) || [];
  if (!o)
    return t;
  const l = n.replace(o, "");
  let a = gr.has(e) ? 1 : 0;
  return o !== n && (a *= 100), e + "(" + a + l + ")";
}
const yr = /([a-z-]*)\(.*?\)/g, de = Object.assign(Object.assign({}, Ot), { getAnimatableNone: (t) => {
  const e = t.match(yr);
  return e ? e.map(vr).join(" ") : t;
} });
function $t(t, e, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + (e - t) * 6 * n : n < 1 / 2 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t;
}
function Ze({ hue: t, saturation: e, lightness: n, alpha: o }) {
  t /= 360, e /= 100, n /= 100;
  let l = 0, a = 0, r = 0;
  if (!e)
    l = a = r = n;
  else {
    const s = n < 0.5 ? n * (1 + e) : n + e - n * e, i = 2 * n - s;
    l = $t(i, s, t + 1 / 3), a = $t(i, s, t), r = $t(i, s, t - 1 / 3);
  }
  return {
    red: Math.round(l * 255),
    green: Math.round(a * 255),
    blue: Math.round(r * 255),
    alpha: o
  };
}
const hr = (t, e, n) => {
  const o = t * t, l = e * e;
  return Math.sqrt(Math.max(0, n * (l - o) + o));
}, br = [fe, G, lt], Ye = (t) => br.find((e) => e.test(t)), Fn = (t, e) => {
  let n = Ye(t), o = Ye(e);
  let l = n.parse(t), a = o.parse(e);
  n === lt && (l = Ze(l), n = G), o === lt && (a = Ze(a), o = G);
  const r = Object.assign({}, l);
  return (s) => {
    for (const i in r)
      i !== "alpha" && (r[i] = hr(l[i], a[i], s));
    return r.alpha = Oe(l.alpha, a.alpha, s), n.transform(r);
  };
}, Ar = (t) => typeof t == "number", xr = (t, e) => (n) => e(t(n)), In = (...t) => t.reduce(xr);
function Tn(t, e) {
  return Ar(t) ? (n) => Oe(t, e, n) : j.test(t) ? Fn(t, e) : Un(t, e);
}
const Vn = (t, e) => {
  const n = [...t], o = n.length, l = t.map((a, r) => Tn(a, e[r]));
  return (a) => {
    for (let r = 0; r < o; r++)
      n[r] = l[r](a);
    return n;
  };
}, wr = (t, e) => {
  const n = Object.assign(Object.assign({}, t), e), o = {};
  for (const l in n)
    t[l] !== void 0 && e[l] !== void 0 && (o[l] = Tn(t[l], e[l]));
  return (l) => {
    for (const a in o)
      n[a] = o[a](l);
    return n;
  };
};
function Je(t) {
  const e = Ot.parse(t), n = e.length;
  let o = 0, l = 0, a = 0;
  for (let r = 0; r < n; r++)
    o || typeof e[r] == "number" ? o++ : e[r].hue !== void 0 ? a++ : l++;
  return { parsed: e, numNumbers: o, numRGB: l, numHSL: a };
}
const Un = (t, e) => {
  const n = Ot.createTransformer(e), o = Je(t), l = Je(e);
  return o.numHSL === l.numHSL && o.numRGB === l.numRGB && o.numNumbers >= l.numNumbers ? In(Vn(o.parsed, l.parsed), n) : ((r) => `${r > 0 ? e : t}`);
}, Cr = (t, e) => (n) => Oe(t, e, n);
function kr(t) {
  if (typeof t == "number")
    return Cr;
  if (typeof t == "string")
    return j.test(t) ? Fn : Un;
  if (Array.isArray(t))
    return Vn;
  if (typeof t == "object")
    return wr;
}
function Or(t, e, n) {
  const o = [], l = n || kr(t[0]), a = t.length - 1;
  for (let r = 0; r < a; r++) {
    let s = l(t[r], t[r + 1]);
    if (e) {
      const i = Array.isArray(e) ? e[r] : e;
      s = In(i, s);
    }
    o.push(s);
  }
  return o;
}
function Er([t, e], [n]) {
  return (o) => n(wn(t, e, o));
}
function Sr(t, e) {
  const n = t.length, o = n - 1;
  return (l) => {
    let a = 0, r = false;
    if (l <= t[0] ? r = true : l >= t[o] && (a = o - 1, r = true), !r) {
      let i = 1;
      for (; i < n && !(t[i] > l || i === o); i++)
        ;
      a = i - 1;
    }
    const s = wn(t[a], t[a + 1], l);
    return e[a](s);
  };
}
function Ln(t, e, { clamp: n = true, ease: o, mixer: l } = {}) {
  const a = t.length;
  bt(a === e.length), bt(!o || !Array.isArray(o) || o.length === a - 1), t[0] > t[a - 1] && (t = [].concat(t), e = [].concat(e), t.reverse(), e.reverse());
  const r = Or(e, o, l), s = a === 2 ? Er(t, r) : Sr(t, r);
  return n ? (i) => s(ie(t[0], t[a - 1], i)) : s;
}
const Qt = (t) => (e) => 1 - t(1 - e), Me = (t) => (e) => e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2, Mr = (t) => (e) => Math.pow(e, t), Dn = (t) => (e) => e * e * ((t + 1) * e - t), Br = (t) => {
  const e = Dn(t);
  return (n) => (n *= 2) < 1 ? 0.5 * e(n) : 0.5 * (2 - Math.pow(2, -10 * (n - 1)));
}, Rn = 1.525, Fr = 4 / 11, Ir = 8 / 11, Tr = 9 / 10, jn = (t) => t, Be = Mr(2), Vr = Qt(Be), Kn = Me(Be), Qn = (t) => 1 - Math.sin(Math.acos(t)), Nn = Qt(Qn), Ur = Me(Nn), Fe = Dn(Rn), Lr = Qt(Fe), Dr = Me(Fe), Rr = Br(Rn), jr = 4356 / 361, Kr = 35442 / 1805, Qr = 16061 / 1805, Dt = (t) => {
  if (t === 1 || t === 0)
    return t;
  const e = t * t;
  return t < Fr ? 7.5625 * e : t < Ir ? 9.075 * e - 9.9 * t + 3.4 : t < Tr ? jr * e - Kr * t + Qr : 10.8 * t * t - 20.52 * t + 10.72;
}, Nr = Qt(Dt), zr = (t) => t < 0.5 ? 0.5 * (1 - Dt(1 - t * 2)) : 0.5 * Dt(t * 2 - 1) + 0.5;
function qr(t, e) {
  return t.map(() => e || Kn).splice(0, t.length - 1);
}
function Xr(t) {
  const e = t.length;
  return t.map((n, o) => o !== 0 ? o / (e - 1) : 0);
}
function Hr(t, e) {
  return t.map((n) => n * e);
}
function Vt({ from: t = 0, to: e = 1, ease: n, offset: o, duration: l = 300 }) {
  const a = { done: false, value: t }, r = Array.isArray(e) ? e : [t, e], s = Hr(o && o.length === r.length ? o : Xr(r), l);
  function i() {
    return Ln(s, r, {
      ease: Array.isArray(n) ? n : qr(r, n)
    });
  }
  let c = i();
  return {
    next: (f) => (a.value = c(f), a.done = f >= l, a),
    flipTarget: () => {
      r.reverse(), c = i();
    }
  };
}
function Wr({ velocity: t = 0, from: e = 0, power: n = 0.8, timeConstant: o = 350, restDelta: l = 0.5, modifyTarget: a }) {
  const r = { done: false, value: e };
  let s = n * t;
  const i = e + s, c = a === void 0 ? i : a(i);
  return c !== i && (s = c - e), {
    next: (f) => {
      const u = -s * Math.exp(-f / o);
      return r.done = !(u > l || u < -l), r.value = r.done ? c : c + u, r;
    },
    flipTarget: () => {
    }
  };
}
const $e = { keyframes: Vt, spring: ke, decay: Wr };
function Pr(t) {
  if (Array.isArray(t.to))
    return Vt;
  if ($e[t.type])
    return $e[t.type];
  const e = new Set(Object.keys(t));
  return e.has("ease") || e.has("duration") && !e.has("dampingRatio") ? Vt : e.has("dampingRatio") || e.has("stiffness") || e.has("mass") || e.has("damping") || e.has("restSpeed") || e.has("restDelta") ? ke : Vt;
}
function zn(t, e, n = 0) {
  return t - e - n;
}
function Zr(t, e, n = 0, o = true) {
  return o ? zn(e + -t, e, n) : e - (t - e) + n;
}
function Yr(t, e, n, o) {
  return o ? t >= e + n : t <= -n;
}
const Gr = (t) => {
  const e = ({ delta: n }) => t(n);
  return {
    start: () => se.update(e, true),
    stop: () => Jl.update(e)
  };
};
function qn(t) {
  var e, n, { from: o, autoplay: l = true, driver: a = Gr, elapsed: r = 0, repeat: s = 0, repeatType: i = "loop", repeatDelay: c = 0, onPlay: f, onStop: u, onComplete: h2, onRepeat: A, onUpdate: d } = t, v = xn(t, ["from", "autoplay", "driver", "elapsed", "repeat", "repeatType", "repeatDelay", "onPlay", "onStop", "onComplete", "onRepeat", "onUpdate"]);
  let { to: y } = v, g, x = 0, p = v.duration, m, w = false, b = true, S;
  const Q = Pr(v);
  !((n = (e = Q).needsInterpolation) === null || n === void 0) && n.call(e, o, y) && (S = Ln([0, 100], [o, y], {
    clamp: false
  }), o = 0, y = 100);
  const L = Q(Object.assign(Object.assign({}, v), { from: o, to: y }));
  function D() {
    x++, i === "reverse" ? (b = x % 2 === 0, r = Zr(r, p, c, b)) : (r = zn(r, p, c), i === "mirror" && L.flipTarget()), w = false, A && A();
  }
  function Et() {
    g.stop(), h2 && h2();
  }
  function Nt(dt) {
    if (b || (dt = -dt), r += dt, !w) {
      const _ = L.next(Math.max(0, r));
      m = _.value, S && (m = S(m)), w = b ? _.done : r <= 0;
    }
    d?.(m), w && (x === 0 && (p ?? (p = r)), x < s ? Yr(r, p, c, b) && D() : Et());
  }
  function St() {
    f?.(), g = a(Nt), g.start();
  }
  return l && St(), {
    stop: () => {
      u?.(), g.stop();
    }
  };
}
function Xn(t, e) {
  return e ? t * (1e3 / e) : 0;
}
function Jr({ from: t = 0, velocity: e = 0, min: n, max: o, power: l = 0.8, timeConstant: a = 750, bounceStiffness: r = 500, bounceDamping: s = 10, restDelta: i = 1, modifyTarget: c, driver: f, onUpdate: u, onComplete: h2, onStop: A }) {
  let d;
  function v(p) {
    return n !== void 0 && p < n || o !== void 0 && p > o;
  }
  function y(p) {
    return n === void 0 ? o : o === void 0 || Math.abs(n - p) < Math.abs(o - p) ? n : o;
  }
  function g(p) {
    d?.stop(), d = qn(Object.assign(Object.assign({}, p), {
      driver: f,
      onUpdate: (m) => {
        var w;
        u?.(m), (w = p.onUpdate) === null || w === void 0 || w.call(p, m);
      },
      onComplete: h2,
      onStop: A
    }));
  }
  function x(p) {
    g(Object.assign({ type: "spring", stiffness: r, damping: s, restDelta: i }, p));
  }
  if (v(t))
    x({ from: t, velocity: e, to: y(t) });
  else {
    let p = l * e + t;
    typeof c < "u" && (p = c(p));
    const m = y(p), w = m === n ? -1 : 1;
    let b, S;
    const Q = (L) => {
      b = S, S = L, e = Xn(L - b, An().delta), (w === 1 && L > m || w === -1 && L < m) && x({ from: L, to: m, velocity: e });
    };
    g({
      type: "decay",
      from: t,
      velocity: e,
      timeConstant: a,
      power: l,
      restDelta: i,
      modifyTarget: c,
      onUpdate: v(p) ? Q : void 0
    });
  }
  return {
    stop: () => d?.stop()
  };
}
const Hn = (t, e) => 1 - 3 * e + 3 * t, Wn = (t, e) => 3 * e - 6 * t, Pn = (t) => 3 * t, Rt = (t, e, n) => ((Hn(e, n) * t + Wn(e, n)) * t + Pn(e)) * t, Zn = (t, e, n) => 3 * Hn(e, n) * t * t + 2 * Wn(e, n) * t + Pn(e), $r = 1e-7, _r = 10;
function ta(t, e, n, o, l) {
  let a, r, s = 0;
  do
    r = e + (n - e) / 2, a = Rt(r, o, l) - t, a > 0 ? n = r : e = r;
  while (Math.abs(a) > $r && ++s < _r);
  return r;
}
const ea = 8, na = 1e-3;
function oa(t, e, n, o) {
  for (let l = 0; l < ea; ++l) {
    const a = Zn(e, n, o);
    if (a === 0)
      return e;
    const r = Rt(e, n, o) - t;
    e -= r / a;
  }
  return e;
}
const Ut = 11, Tt = 1 / (Ut - 1);
function la(t, e, n, o) {
  if (t === e && n === o)
    return jn;
  const l = new Float32Array(Ut);
  for (let r = 0; r < Ut; ++r)
    l[r] = Rt(r * Tt, t, n);
  function a(r) {
    let s = 0, i = 1;
    const c = Ut - 1;
    for (; i !== c && l[i] <= r; ++i)
      s += Tt;
    --i;
    const f = (r - l[i]) / (l[i + 1] - l[i]), u = s + f * Tt, h2 = Zn(u, t, n);
    return h2 >= na ? oa(r, u, t, n) : h2 === 0 ? u : ta(r, s, s + Tt, t, n);
  }
  return (r) => r === 0 || r === 1 ? r : Rt(a(r), e, o);
}
class ra {
  subscriptions = /* @__PURE__ */ new Set();
  add(e) {
    return this.subscriptions.add(e), () => this.subscriptions.delete(e);
  }
  notify(e, n, o) {
    if (this.subscriptions.size)
      for (const l of this.subscriptions) l(e, n, o);
  }
  clear() {
    this.subscriptions.clear();
  }
}
function _e(t) {
  return !Number.isNaN(Number.parseFloat(t));
}
class aa {
  /**
   * The current state of the `MotionValue`.
   */
  current;
  /**
   * The previous state of the `MotionValue`.
   */
  prev;
  /**
   * Duration, in milliseconds, since last updating frame.
   */
  timeDelta = 0;
  /**
   * Timestamp of the last time this `MotionValue` was updated.
   */
  lastUpdated = 0;
  /**
   * Functions to notify when the `MotionValue` updates.
   */
  updateSubscribers = new ra();
  /**
   * A reference to the currently-controlling Popmotion animation
   */
  stopAnimation;
  /**
   * Tracks whether this value can output a velocity.
   */
  canTrackVelocity = false;
  /**
   * init - The initiating value
   * config - Optional configuration options
   */
  constructor(e) {
    this.prev = this.current = e, this.canTrackVelocity = _e(this.current);
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   */
  onChange(e) {
    return this.updateSubscribers.add(e);
  }
  clearListeners() {
    this.updateSubscribers.clear();
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @param v
   * @param render
   */
  set(e) {
    this.updateAndNotify(e);
  }
  /**
   * Update and notify `MotionValue` subscribers.
   *
   * @param v
   * @param render
   */
  updateAndNotify = (e) => {
    this.prev = this.current, this.current = e;
    const { delta: n, timestamp: o } = An();
    this.lastUpdated !== o && (this.timeDelta = n, this.lastUpdated = o), se.postRender(this.scheduleVelocityCheck), this.updateSubscribers.notify(this.current);
  };
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   */
  get() {
    return this.current;
  }
  /**
   * Get previous value.
   *
   * @returns - The previous latest state of `MotionValue`
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   */
  getVelocity() {
    return this.canTrackVelocity ? Xn(Number.parseFloat(this.current) - Number.parseFloat(this.prev), this.timeDelta) : 0;
  }
  /**
   * Schedule a velocity check for the next frame.
   */
  scheduleVelocityCheck = () => se.postRender(this.velocityCheck);
  /**
   * Updates `prev` with `current` if the value hasn't been updated this frame.
   * This ensures velocity calculations return `0`.
   */
  velocityCheck = ({ timestamp: e }) => {
    this.canTrackVelocity || (this.canTrackVelocity = _e(this.current)), e !== this.lastUpdated && (this.prev = this.current);
  };
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   */
  start(e) {
    return this.stop(), new Promise((n) => {
      const { stop: o } = e(n);
      this.stopAnimation = o;
    }).then(() => this.clearAnimation());
  }
  /**
   * Stop the currently active animation.
   */
  stop() {
    this.stopAnimation && this.stopAnimation(), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   */
  isAnimating() {
    return !!this.stopAnimation;
  }
  /**
   * Clear the current animation reference.
   */
  clearAnimation() {
    this.stopAnimation = null;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   */
  destroy() {
    this.updateSubscribers.clear(), this.stop();
  }
}
function sa(t) {
  return new aa(t);
}
const { isArray: ia } = Array;
function ca() {
  const t = ref({}), e = (o) => {
    const l = (a) => {
      t.value[a] && (t.value[a].stop(), t.value[a].destroy(), delete t.value[a]);
    };
    o ? ia(o) ? o.forEach(l) : l(o) : Object.keys(t.value).forEach(l);
  }, n = (o, l, a) => {
    if (t.value[o])
      return t.value[o];
    const r = sa(l);
    return r.onChange((s) => a[o] = s), t.value[o] = r, r;
  };
  return Oo(), {
    motionValues: t,
    get: n,
    stop: e
  };
}
function ua(t) {
  return Array.isArray(t);
}
function nt() {
  return {
    type: "spring",
    stiffness: 500,
    damping: 25,
    restDelta: 0.5,
    restSpeed: 10
  };
}
function _t(t) {
  return {
    type: "spring",
    stiffness: 550,
    damping: t === 0 ? 2 * Math.sqrt(550) : 30,
    restDelta: 0.01,
    restSpeed: 10
  };
}
function fa(t) {
  return {
    type: "spring",
    stiffness: 550,
    damping: t === 0 ? 100 : 30,
    restDelta: 0.01,
    restSpeed: 10
  };
}
function te() {
  return {
    type: "keyframes",
    ease: "linear",
    duration: 300
  };
}
function da(t) {
  return {
    type: "keyframes",
    duration: 800,
    values: t
  };
}
const tn = {
  default: fa,
  x: nt,
  y: nt,
  z: nt,
  rotate: nt,
  rotateX: nt,
  rotateY: nt,
  rotateZ: nt,
  scaleX: _t,
  scaleY: _t,
  scale: _t,
  backgroundColor: te,
  color: te,
  opacity: te
};
function Yn(t, e) {
  let n;
  return ua(e) ? n = da : n = tn[t] || tn.default, { to: e, ...n(e) };
}
const en = {
  ...kt,
  transform: Math.round
}, Gn = {
  // Color props
  color: j,
  backgroundColor: j,
  outlineColor: j,
  fill: j,
  stroke: j,
  // Border props
  borderColor: j,
  borderTopColor: j,
  borderRightColor: j,
  borderBottomColor: j,
  borderLeftColor: j,
  borderWidth: E,
  borderTopWidth: E,
  borderRightWidth: E,
  borderBottomWidth: E,
  borderLeftWidth: E,
  borderRadius: E,
  radius: E,
  borderTopLeftRadius: E,
  borderTopRightRadius: E,
  borderBottomRightRadius: E,
  borderBottomLeftRadius: E,
  // Positioning props
  width: E,
  maxWidth: E,
  height: E,
  maxHeight: E,
  size: E,
  top: E,
  right: E,
  bottom: E,
  left: E,
  // Spacing props
  padding: E,
  paddingTop: E,
  paddingRight: E,
  paddingBottom: E,
  paddingLeft: E,
  margin: E,
  marginTop: E,
  marginRight: E,
  marginBottom: E,
  marginLeft: E,
  // Transform props
  rotate: et,
  rotateX: et,
  rotateY: et,
  rotateZ: et,
  scale: It,
  scaleX: It,
  scaleY: It,
  scaleZ: It,
  skew: et,
  skewX: et,
  skewY: et,
  distance: E,
  translateX: E,
  translateY: E,
  translateZ: E,
  x: E,
  y: E,
  z: E,
  perspective: E,
  transformPerspective: E,
  opacity: gt,
  originX: Pe,
  originY: Pe,
  originZ: E,
  // Misc
  zIndex: en,
  filter: de,
  WebkitFilter: de,
  // SVG
  fillOpacity: gt,
  strokeOpacity: gt,
  numOctaves: en
}, Te = (t) => Gn[t];
function pe(t, e) {
  return e && typeof t == "number" && e.transform ? e.transform(t) : t;
}
function pa(t, e) {
  let n = Te(t);
  return n !== de && (n = Ot), n.getAnimatableNone ? n.getAnimatableNone(e) : void 0;
}
const ma = {
  linear: jn,
  easeIn: Be,
  easeInOut: Kn,
  easeOut: Vr,
  circIn: Qn,
  circInOut: Ur,
  circOut: Nn,
  backIn: Fe,
  backInOut: Dr,
  backOut: Lr,
  anticipate: Rr,
  bounceIn: Nr,
  bounceInOut: zr,
  bounceOut: Dt
};
function nn(t) {
  if (Array.isArray(t)) {
    const [e, n, o, l] = t;
    return la(e, n, o, l);
  } else if (typeof t == "string")
    return ma[t];
  return t;
}
function ga(t) {
  return Array.isArray(t) && typeof t[0] != "number";
}
function on(t, e) {
  return t === "zIndex" ? false : !!(typeof e == "number" || Array.isArray(e) || typeof e == "string" && Ot.test(e) && !e.startsWith("url("));
}
function va(t) {
  return Array.isArray(t.to) && t.to[0] === null && (t.to = [...t.to], t.to[0] = t.from), t;
}
function ya({ ease: t, times: e, delay: n, ...o }) {
  const l = { ...o };
  return e && (l.offset = e), t && (l.ease = ga(t) ? t.map(nn) : nn(t)), n && (l.elapsed = -n), l;
}
function ha(t, e, n) {
  return Array.isArray(e.to) && (t.duration || (t.duration = 800)), va(e), ba(t) || (t = {
    ...t,
    ...Yn(n, e.to)
  }), {
    ...e,
    ...ya(t)
  };
}
function ba({ delay: t, repeat: e, repeatType: n, repeatDelay: o, from: l, ...a }) {
  return !!Object.keys(a).length;
}
function Aa(t, e) {
  return t[e] || t.default || t;
}
function xa(t, e, n, o, l) {
  const a = Aa(o, t);
  let r = a.from === null || a.from === void 0 ? e.get() : a.from;
  const s = on(t, n);
  r === "none" && s && typeof n == "string" && (r = pa(t, n));
  const i = on(t, r);
  function c(u) {
    const h2 = {
      from: r,
      to: n,
      velocity: o.velocity ? o.velocity : e.getVelocity(),
      onUpdate: (A) => e.set(A)
    };
    return a.type === "inertia" || a.type === "decay" ? Jr({ ...h2, ...a }) : qn({
      ...ha(a, h2, t),
      onUpdate: (A) => {
        h2.onUpdate(A), a.onUpdate && a.onUpdate(A);
      },
      onComplete: () => {
        l && l(), u && u();
      }
    });
  }
  function f(u) {
    return e.set(n), l && l(), u && u(), { stop: () => {
    } };
  }
  return !i || !s || a.type === false ? f : c;
}
function wa() {
  const { motionValues: t, stop: e, get: n } = ca();
  return { motionValues: t, stop: e, push: (l, a, r, s = {}, i) => {
    const c = r[l], f = n(l, c, r);
    if (s && s.immediate) {
      f.set(a);
      return;
    }
    const u = xa(l, f, a, s, i);
    f.start(u);
  } };
}
function Ca(t, e = {}, { motionValues: n, push: o, stop: l } = wa()) {
  const a = unref(e), r = ref(false);
  watch(
    n,
    (u) => {
      r.value = Object.values(u).filter((h2) => h2.isAnimating()).length > 0;
    },
    {
      immediate: true,
      deep: true
    }
  );
  const s = (u) => {
    if (!a || !a[u])
      throw new Error(`The variant ${u} does not exist.`);
    return a[u];
  }, i = (u) => {
    typeof u == "string" && (u = s(u));
    const h2 = Object.entries(u).map(([d, v]) => {
      if (d !== "transition")
        return new Promise(
          (y) => (
            // @ts-expect-error - Fix errors later for typescript 5
            o(d, v, t, u.transition || Yn(d, u[d]), y)
          )
        );
    }).filter(Boolean);
    async function A() {
      await Promise.all(h2), u.transition?.onComplete?.();
    }
    return Promise.all([A()]);
  };
  return {
    isAnimating: r,
    apply: i,
    set: (u) => {
      const h2 = isObject(u) ? u : s(u);
      Object.entries(h2).forEach(([A, d]) => {
        A !== "transition" && o(A, d, t, {
          immediate: true
        });
      });
    },
    leave: async (u) => {
      let h2;
      if (a && (a.leave && (h2 = a.leave), !a.leave && a.initial && (h2 = a.initial)), !h2) {
        u();
        return;
      }
      await i(h2), u();
    },
    stop: l
  };
}
const Ve = "undefined" < "u", Oa = () => Ve;
function Sa({ target: t, state: e, variants: n, apply: o }) {
  const l = unref(n), a = ref(false), r = ref(false), s = ref(false), i = computed(() => {
    let f = [...Object.keys(e.value || {})];
    return l && (l.hovered && (f = [...f, ...Object.keys(l.hovered)]), l.tapped && (f = [...f, ...Object.keys(l.tapped)]), l.focused && (f = [...f, ...Object.keys(l.focused)])), f;
  }), c = computed(() => {
    const f = {};
    Object.assign(f, e.value), a.value && l.hovered && Object.assign(f, l.hovered), r.value && l.tapped && Object.assign(f, l.tapped), s.value && l.focused && Object.assign(f, l.focused);
    for (const u in f)
      i.value.includes(u) || delete f[u];
    return f;
  });
  l.hovered && (useEventListener(t, "mouseenter", () => a.value = true), useEventListener(t, "mouseleave", () => {
    a.value = false, r.value = false;
  })), l.tapped && Oa(), l.focused && (useEventListener(t, "focus", () => s.value = true), useEventListener(t, "blur", () => s.value = false)), watch([a, r, s], () => {
    o(c.value);
  });
}
function Ma({ set: t, target: e, variants: n, variant: o }) {
  const l = unref(n);
  watch(
    () => e,
    () => {
      l && (l.initial && (t("initial"), o.value = "initial"), l.enter && (o.value = "enter"));
    },
    {
      immediate: true,
      flush: "pre"
    }
  );
}
function Ba({ state: t, apply: e }) {
  watch(
    t,
    (n) => {
      n && e(n);
    },
    {
      immediate: true
    }
  );
}
function Fa({ target: t, variants: e, variant: n }) {
  const o = unref(e);
  o && (o.visible || o.visibleOnce) && useIntersectionObserver(t, ([{ isIntersecting: l }]) => {
    o.visible ? l ? n.value = "visible" : n.value = "initial" : o.visibleOnce && (l && n.value !== "visibleOnce" ? n.value = "visibleOnce" : n.value || (n.value = "initial"));
  });
}
function Ia(t, e = {
  syncVariants: true,
  lifeCycleHooks: true,
  visibilityHooks: true,
  eventListeners: true
}) {
  e.lifeCycleHooks && Ma(t), e.syncVariants && Ba(t), e.visibilityHooks && Fa(t), e.eventListeners && Sa(t);
}
function Jn(t = {}) {
  const e = reactive({
    ...t
  }), n = ref({});
  return watch(
    e,
    () => {
      const o = {};
      for (const [l, a] of Object.entries(e)) {
        const r = Te(l), s = pe(a, r);
        o[l] = s;
      }
      n.value = o;
    },
    {
      immediate: true,
      deep: true
    }
  ), {
    state: e,
    style: n
  };
}
function Ue(t, e) {
  watch(
    () => unrefElement(t),
    (n) => {
      n && e(n);
    },
    {
      immediate: true
    }
  );
}
const Ta = {
  x: "translateX",
  y: "translateY",
  z: "translateZ"
};
function $n(t = {}, e = true) {
  const n = reactive({ ...t }), o = ref("");
  return watch(
    n,
    (l) => {
      let a = "", r = false;
      if (e && (l.x || l.y || l.z)) {
        const s = [l.x || 0, l.y || 0, l.z || 0].map((i) => pe(i, E)).join(",");
        a += `translate3d(${s}) `, r = true;
      }
      for (const [s, i] of Object.entries(l)) {
        if (e && (s === "x" || s === "y" || s === "z"))
          continue;
        const c = Te(s), f = pe(i, c);
        a += `${Ta[s] || s}(${f}) `;
      }
      e && !r && (a += "translateZ(0px) "), o.value = a.trim();
    },
    {
      immediate: true,
      deep: true
    }
  ), {
    state: n,
    transform: o
  };
}
const Va = ["", "X", "Y", "Z"], Ua = ["perspective", "translate", "scale", "rotate", "skew"], _n = ["transformPerspective", "x", "y", "z"];
Ua.forEach((t) => {
  Va.forEach((e) => {
    const n = t + e;
    _n.push(n);
  });
});
const La = new Set(_n);
function Le(t) {
  return La.has(t);
}
const Da = /* @__PURE__ */ new Set(["originX", "originY", "originZ"]);
function to(t) {
  return Da.has(t);
}
function Ra(t) {
  const e = {}, n = {};
  return Object.entries(t).forEach(([o, l]) => {
    Le(o) || to(o) ? e[o] = l : n[o] = l;
  }), { transform: e, style: n };
}
function De(t) {
  const { transform: e, style: n } = Ra(t), { transform: o } = $n(e), { style: l } = Jn(n);
  return o.value && (l.value.transform = o.value), l.value;
}
function ja(t, e) {
  let n, o;
  const { state: l, style: a } = Jn();
  return Ue(t, (r) => {
    o = r;
    for (const s of Object.keys(Gn))
      r.style[s] === null || r.style[s] === "" || Le(s) || to(s) || (l[s] = r.style[s]);
    n && Object.entries(n).forEach(([s, i]) => r.style[s] = i), e && e(l);
  }), watch(
    a,
    (r) => {
      if (!o) {
        n = r;
        return;
      }
      for (const s in r) o.style[s] = r[s];
    },
    {
      immediate: true
    }
  ), {
    style: l
  };
}
function Ka(t) {
  const e = t.trim().split(/\) |\)/);
  if (e.length === 1)
    return {};
  const n = (o) => o.endsWith("px") || o.endsWith("deg") ? Number.parseFloat(o) : Number.isNaN(Number(o)) ? Number(o) : o;
  return e.reduce((o, l) => {
    if (!l)
      return o;
    const [a, r] = l.split("("), i = r.split(",").map((f) => n(f.endsWith(")") ? f.replace(")", "") : f.trim())), c = i.length === 1 ? i[0] : i;
    return {
      ...o,
      [a]: c
    };
  }, {});
}
function Qa(t, e) {
  Object.entries(Ka(e)).forEach(([n, o]) => {
    const l = ["x", "y", "z"];
    if (n === "translate3d") {
      if (o === 0) {
        l.forEach((a) => t[a] = 0);
        return;
      }
      o.forEach((a, r) => t[l[r]] = a);
      return;
    }
    if (o = Number.parseFloat(`${o}`), n === "translateX") {
      t.x = o;
      return;
    }
    if (n === "translateY") {
      t.y = o;
      return;
    }
    if (n === "translateZ") {
      t.z = o;
      return;
    }
    t[n] = o;
  });
}
function Na(t, e) {
  let n, o;
  const { state: l, transform: a } = $n();
  return Ue(t, (r) => {
    o = r, r.style.transform && Qa(l, r.style.transform), n && (r.style.transform = n), e && e(l);
  }), watch(
    a,
    (r) => {
      if (!o) {
        n = r;
        return;
      }
      o.style.transform = r;
    },
    {
      immediate: true
    }
  ), {
    transform: l
  };
}
function za(t) {
  return Object.entries(t);
}
function qa(t, e) {
  const n = reactive({}), o = (r) => Object.entries(r).forEach(([s, i]) => n[s] = i), { style: l } = ja(t, o), { transform: a } = Na(t, o);
  return watch(
    n,
    (r) => {
      za(r).forEach(([s, i]) => {
        const c = Le(s) ? a : l;
        c[s] && c[s] === i || (c[s] = i);
      });
    },
    {
      immediate: true,
      deep: true
    }
  ), Ue(t, () => e), {
    motionProperties: n,
    style: l,
    transform: a
  };
}
function Xa(t = {}) {
  const e = unref(t), n = ref();
  return {
    state: computed(() => {
      if (n.value)
        return e[n.value];
    }),
    variant: n
  };
}
function eo(t, e = {}, n) {
  const { motionProperties: o } = qa(t), { variant: l, state: a } = Xa(e), r = Ca(o, e), s = {
    target: t,
    variant: l,
    variants: e,
    state: a,
    motionProperties: o,
    ...r
  };
  return Ia(s, n), s;
}
const Ha = {
  initial: {
    opacity: 0
  },
  enter: {
    opacity: 1
  }
}, Wa = {
  initial: {
    opacity: 0
  },
  visible: {
    opacity: 1
  }
}, Pa = {
  initial: {
    opacity: 0
  },
  visibleOnce: {
    opacity: 1
  }
}, Za = {
  initial: {
    scale: 0,
    opacity: 0
  },
  enter: {
    scale: 1,
    opacity: 1
  }
}, Ya = {
  initial: {
    scale: 0,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1
  }
}, Ga = {
  initial: {
    scale: 0,
    opacity: 0
  },
  visibleOnce: {
    scale: 1,
    opacity: 1
  }
}, Ja = {
  initial: {
    x: -100,
    rotate: 90,
    opacity: 0
  },
  enter: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
}, $a = {
  initial: {
    x: -100,
    rotate: 90,
    opacity: 0
  },
  visible: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
}, _a = {
  initial: {
    x: -100,
    rotate: 90,
    opacity: 0
  },
  visibleOnce: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
}, ts = {
  initial: {
    x: 100,
    rotate: -90,
    opacity: 0
  },
  enter: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
}, es = {
  initial: {
    x: 100,
    rotate: -90,
    opacity: 0
  },
  visible: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
}, ns = {
  initial: {
    x: 100,
    rotate: -90,
    opacity: 0
  },
  visibleOnce: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
}, os = {
  initial: {
    y: -100,
    rotate: -90,
    opacity: 0
  },
  enter: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
}, ls = {
  initial: {
    y: -100,
    rotate: -90,
    opacity: 0
  },
  visible: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
}, rs = {
  initial: {
    y: -100,
    rotate: -90,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
}, as = {
  initial: {
    y: 100,
    rotate: 90,
    opacity: 0
  },
  enter: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
}, ss = {
  initial: {
    y: 100,
    rotate: 90,
    opacity: 0
  },
  visible: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
}, is = {
  initial: {
    y: 100,
    rotate: 90,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
}, cs = {
  initial: {
    x: -100,
    opacity: 0
  },
  enter: {
    x: 0,
    opacity: 1
  }
}, us = {
  initial: {
    x: -100,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1
  }
}, fs = {
  initial: {
    x: -100,
    opacity: 0
  },
  visibleOnce: {
    x: 0,
    opacity: 1
  }
}, ds = {
  initial: {
    x: 100,
    opacity: 0
  },
  enter: {
    x: 0,
    opacity: 1
  }
}, ps = {
  initial: {
    x: 100,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1
  }
}, ms = {
  initial: {
    x: 100,
    opacity: 0
  },
  visibleOnce: {
    x: 0,
    opacity: 1
  }
}, gs = {
  initial: {
    y: -100,
    opacity: 0
  },
  enter: {
    y: 0,
    opacity: 1
  }
}, vs = {
  initial: {
    y: -100,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1
  }
}, ys = {
  initial: {
    y: -100,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1
  }
}, hs = {
  initial: {
    y: 100,
    opacity: 0
  },
  enter: {
    y: 0,
    opacity: 1
  }
}, bs = {
  initial: {
    y: 100,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1
  }
}, As = {
  initial: {
    y: 100,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1
  }
}, ln = {
  __proto__: null,
  fade: Ha,
  fadeVisible: Wa,
  fadeVisibleOnce: Pa,
  pop: Za,
  popVisible: Ya,
  popVisibleOnce: Ga,
  rollBottom: as,
  rollLeft: Ja,
  rollRight: ts,
  rollTop: os,
  rollVisibleBottom: ss,
  rollVisibleLeft: $a,
  rollVisibleOnceBottom: is,
  rollVisibleOnceLeft: _a,
  rollVisibleOnceRight: ns,
  rollVisibleOnceTop: rs,
  rollVisibleRight: es,
  rollVisibleTop: ls,
  slideBottom: hs,
  slideLeft: cs,
  slideRight: ds,
  slideTop: gs,
  slideVisibleBottom: bs,
  slideVisibleLeft: us,
  slideVisibleOnceBottom: As,
  slideVisibleOnceLeft: fs,
  slideVisibleOnceRight: ms,
  slideVisibleOnceTop: ys,
  slideVisibleRight: ps,
  slideVisibleTop: vs
}, xs = /* @__PURE__ */ Symbol(
  ""
), no = {
  // Preset to be loaded
  preset: {
    type: String,
    required: false
  },
  // Instance
  instance: {
    type: Object,
    required: false
  },
  // Variants
  variants: {
    type: Object,
    required: false
  },
  // Initial variant
  initial: {
    type: Object,
    required: false
  },
  // Lifecycle hooks variants
  enter: {
    type: Object,
    required: false
  },
  leave: {
    type: Object,
    required: false
  },
  // Intersection observer variants
  visible: {
    type: Object,
    required: false
  },
  visibleOnce: {
    type: Object,
    required: false
  },
  // Event listeners variants
  hovered: {
    type: Object,
    required: false
  },
  tapped: {
    type: Object,
    required: false
  },
  focused: {
    type: Object,
    required: false
  },
  // Helpers
  delay: {
    type: [Number, String],
    required: false
  },
  duration: {
    type: [Number, String],
    required: false
  }
};
function ws(t) {
  return Object.prototype.toString.call(t) === "[object Object]";
}
function me(t) {
  if (Array.isArray(t))
    return t.map(me);
  if (ws(t)) {
    const e = {};
    for (const n in t)
      e[n] = me(t[n]);
    return e;
  }
  return t;
}
function oo(t) {
  const e = reactive({}), n = inject(xs, {}), o = computed(() => t.preset == null ? {} : n != null && t.preset in n ? structuredClone(toRaw(n)[t.preset]) : t.preset in ln ? structuredClone(ln[t.preset]) : {}), l = computed(() => ({
    initial: t.initial,
    enter: t.enter,
    leave: t.leave,
    visible: t.visible,
    visibleOnce: t.visibleOnce,
    hovered: t.hovered,
    tapped: t.tapped,
    focused: t.focused
  }));
  function a(i, c) {
    for (const f of ["delay", "duration"]) {
      if (c[f] == null)
        continue;
      const u = Number.parseInt(
        c[f]
      );
      for (const h2 of ["enter", "visible", "visibleOnce"]) {
        const A = i[h2];
        A != null && (A.transition ??= {}, A.transition[f] = u);
      }
    }
    return i;
  }
  const r = computed(() => {
    const i = Pl(
      {},
      l.value,
      o.value,
      t.variants || {}
    );
    return a({ ...i }, t);
  });
  function s(i, c, f) {
    i.props ??= {}, i.props.style ??= {}, i.props.style = { ...i.props.style, ...f };
    const u = a(
      me(r.value),
      i.props
    );
    return i.props.onVnodeMounted = ({ el: h2 }) => {
      e[c] = eo(
        h2,
        u
      );
    }, i.props.onVnodeUpdated = ({ el: h2 }) => {
      const A = De(e[c].state);
      for (const [d, v] of Object.entries(A))
        h2.style[d] = v;
    }, i;
  }
  return {
    motionConfig: r,
    setNodeInstance: s
  };
}
defineComponent({
  name: "Motion",
  props: {
    ...no,
    is: {
      type: [String, Object],
      default: "div"
    }
  },
  setup(t) {
    const e = useSlots(), { motionConfig: n, setNodeInstance: o } = oo(t);
    return () => {
      const l = De(n.value.initial || {}), a = h(t.is, void 0, e);
      return o(a, 0, l), a;
    };
  }
});
defineComponent({
  name: "MotionGroup",
  props: {
    ...no,
    is: {
      type: [String, Object],
      required: false
    }
  },
  setup(t) {
    const e = useSlots(), { motionConfig: n, setNodeInstance: o } = oo(t);
    return () => {
      const l = De(n.value.initial || {}), a = e.default?.() || [];
      for (let r = 0; r < a.length; r++) {
        const s = a[r];
        s.type === Fragment && Array.isArray(s.children) ? s.children.forEach(function i(c, f) {
          if (c != null) {
            if (Array.isArray(c)) {
              i(c, f);
              return;
            }
            typeof c == "object" && o(c, f, l);
          }
        }) : o(s, r, l);
      }
      return t.is ? h(t.is, void 0, a) : a;
    };
  }
});
const Cs = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%201.1//EN'%20'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3e%3csvg%20width='100%25'%20height='100%25'%20viewBox='0%200%20512%20512'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20xml:space='preserve'%20xmlns:serif='http://www.serif.com/'%20style='fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;'%3e%3cg%3e%3cpath%20d='M23.643,161.704C21.68,162.429%2020.375,164.301%2020.375,166.394C20.375,193.066%2020.375,364.574%2020.375,390.522C20.375,392.515%2021.568,394.313%2023.403,395.088C49.689,406.192%20238.753,486.057%20260.182,495.109C261.444,495.642%20262.868,495.634%20264.124,495.087C284.944,486.023%20464.604,407.798%20490.147,396.677C491.978,395.88%20493.159,394.071%20493.151,392.074C493.054,365.991%20492.407,192.933%20492.308,166.551C492.301,164.514%20491.058,162.685%20489.167,161.928C461.898,151.007%20265.558,72.371%20265.558,72.371C265.558,72.371%2052.689,150.978%2023.643,161.704Z'%20style='fill:rgb(247,213,137);'/%3e%3cg%3e%3cellipse%20cx='69.528'%20cy='306.824'%20rx='8.997'%20ry='6.271'%20style='fill:rgb(224,154,69);'/%3e%3cg%20transform='matrix(0.951996,-0.30611,0.30611,0.951996,268.035,103.075)'%3e%3cellipse%20cx='69.528'%20cy='306.824'%20rx='8.997'%20ry='6.271'%20style='fill:rgb(224,154,69);'/%3e%3c/g%3e%3cg%20transform='matrix(0.769784,-1.5777,1.12551,0.549156,-1.23586,259.974)'%3e%3cpath%20d='M70.072,300.526C75.038,300.526%2077.865,305.822%2077.865,309.283C77.865,312.744%2074.546,314.332%2069.58,314.332C64.615,314.332%2060.768,309.741%2060.768,306.28C60.768,302.818%2065.106,300.526%2070.072,300.526Z'%20style='fill:rgb(224,154,69);'/%3e%3c/g%3e%3cg%20transform='matrix(0.558659,-1.14499,0.873225,0.42606,147.838,250.78)'%3e%3cpath%20d='M70.072,300.526C75.038,300.526%2079.152,306.924%2079.152,310.385C79.152,313.846%2074.546,314.332%2069.58,314.332C64.615,314.332%2060.768,309.741%2060.768,306.28C60.768,302.818%2065.106,300.526%2070.072,300.526Z'%20style='fill:rgb(224,154,69);'/%3e%3c/g%3e%3cg%20transform='matrix(1.26042,0.576197,-0.476734,1.04285,204.261,-21.4536)'%3e%3cpath%20d='M69.528,300.553C74.494,300.553%2080.058,304.029%2080.058,307.49C80.058,310.951%2075.828,313.677%2070.863,313.677C65.897,313.677%2060.531,310.285%2060.531,306.824C60.531,303.363%2064.563,300.553%2069.528,300.553Z'%20style='fill:rgb(224,154,69);'/%3e%3c/g%3e%3cg%20transform='matrix(1.36526,0.238192,-0.197075,1.12959,172.189,60.607)'%3e%3cpath%20d='M69.528,300.553C74.494,300.553%2079.603,304.073%2080.058,307.49C80.853,313.452%2075.528,315.258%2070.562,315.258C65.597,315.258%2060.213,311.264%2059.984,305.117C59.855,301.659%2064.563,300.553%2069.528,300.553Z'%20style='fill:rgb(224,154,69);'/%3e%3c/g%3e%3cg%20transform='matrix(1.61451,0.208798,-0.147067,1.13718,21.9756,4.661)'%3e%3cpath%20d='M69.528,300.553C74.494,300.553%2080.058,304.029%2080.058,307.49C80.058,310.951%2075.828,313.677%2070.863,313.677C65.897,313.677%2060.531,310.285%2060.531,306.824C60.531,303.363%2064.563,300.553%2069.528,300.553Z'%20style='fill:rgb(224,154,69);'/%3e%3c/g%3e%3c/g%3e%3cuse%20xlink:href='%23_Image1'%20x='262.004'%20y='163.181'%20width='232px'%20height='333px'/%3e%3cpath%20d='M23.643,161.704C21.68,162.429%2020.375,164.301%2020.375,166.394C20.375,182.056%2020.375,245.191%2020.375,245.191L262.158,334.749L492.609,247.034L492.296,163.181L265.558,72.371C265.558,72.371%2052.689,150.978%2023.643,161.704Z'%20style='fill:white;fill-opacity:0.59;'/%3e%3cuse%20xlink:href='%23_Image2'%20x='20.375'%20y='72.371'%20width='472px'%20height='177px'/%3e%3cg%20id='Fruit'%20transform='matrix(0.969817,-0.243833,0.243833,0.969817,-19.2667,68.1636)'%3e%3cpath%20id='Strawberry'%20d='M329.576,83.06C329.576,83.06%20302.675,40.918%20276.245,42.428C249.815,43.938%20233.677,56.887%20218.356,79.144C203.035,101.401%20189.3,122.646%20192.333,143.689C195.366,164.732%20202.025,187.918%20281.442,179.739C360.858,171.56%20338.722,99.926%20329.576,83.06Z'%20style='fill:rgb(247,14,78);'/%3e%3cg%20id='Seeds'%3e%3cg%20transform='matrix(0.343281,0.694388,-0.64316,0.317956,224.322,-128.806)'%3e%3cpath%20d='M261.102,72.29C261.102,72.29%20266.484,78.99%20266.484,81.862C266.484,85.069%20264.073,87.673%20261.102,87.673C258.132,87.673%20255.72,85.069%20255.72,81.862C255.72,78.99%20261.102,72.29%20261.102,72.29Z'%20style='fill:rgb(166,6,68);'/%3e%3c/g%3e%3cg%20transform='matrix(0.343281,0.694388,-0.64316,0.317956,199.97,-111.561)'%3e%3cpath%20d='M261.102,72.29C261.102,72.29%20266.484,78.99%20266.484,81.862C266.484,85.069%20264.073,87.673%20261.102,87.673C258.132,87.673%20255.72,85.069%20255.72,81.862C255.72,78.99%20261.102,72.29%20261.102,72.29Z'%20style='fill:rgb(166,6,68);'/%3e%3c/g%3e%3cg%20transform='matrix(0.604018,0.484952,-0.449175,0.559457,168.459,-61.3264)'%3e%3cpath%20d='M261.102,72.29C261.102,72.29%20266.484,78.99%20266.484,81.862C266.484,85.069%20264.073,87.673%20261.102,87.673C258.132,87.673%20255.72,85.069%20255.72,81.862C255.72,78.99%20261.102,72.29%20261.102,72.29Z'%20style='fill:rgb(166,6,68);'/%3e%3c/g%3e%3cg%20transform='matrix(0.604018,0.484952,-0.449175,0.559457,123.1,-32.8401)'%3e%3cpath%20d='M261.102,72.29C261.102,72.29%20266.484,78.99%20266.484,81.862C266.484,85.069%20264.073,87.673%20261.102,87.673C258.132,87.673%20255.72,85.069%20255.72,81.862C255.72,78.99%20261.102,72.29%20261.102,72.29Z'%20style='fill:rgb(166,6,68);'/%3e%3c/g%3e%3cg%20transform='matrix(0.604018,0.484952,-0.449175,0.559457,164.895,-25.7836)'%3e%3cpath%20d='M261.102,72.29C261.102,72.29%20266.484,78.99%20266.484,81.862C266.484,85.069%20264.073,87.673%20261.102,87.673C258.132,87.673%20255.72,85.069%20255.72,81.862C255.72,78.99%20261.102,72.29%20261.102,72.29Z'%20style='fill:rgb(166,6,68);'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cimage%20id='_Image1'%20width='232px'%20height='333px'%20xlink:href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOgAAAFNCAYAAAAKDyORAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAQX0lEQVR4nO3d6XLjRpaG4S8zAQIgqX0hXa4qqzwxNzN3Nhc4FzHutmuXRHHJ/gFQUmklKZBIIN8nosM/VJTT7vicCfDkOebq//5XAEJgvMnPlL77H9n8XJJM0vSSgNiZZOhNMS5DaRL5yd9SGVARUKAJNvU2H8nkI5lk8MuP/PS7tLiRbI+AArtjvMmOZfOxTHYsyTzz5xZaXP8l239PQIFtM8mgPMJm55JNV/uQX0jiiAtsh029zc+rI+xwg1/gJRFQoEbLI+xIJjvR80fY1RFQ4I1M0vcmr97C2l6tv5uAApswSXmELcYbHmFfwxEXWJc3vWPZYiSTnaqOI+zzf6fyLwQUeIVxRVVIMKr9CPs8dlDgecZVb2HHMuleEwuQRECB+7zpHVVvYU8lY5tciiQCCpRH2HwkW4wkmzW9nF8QUMTJOG/zs+oIu9/0ap7ADor4eNM7rI6wZw0fYVdDQNF5xuXlETYfSS5vejlrIaDoJmO9zc7KQoL0oOnVbIyAolNMeuDLQoIzybiml7M5zzMousJm3hYj2XzcuiPsawgo2slYb7PT8jpX76jp1WwNAUWrmHS/ahVy3u4j7Ks44qItbM/bfCRbjCVXNL2aHaHUDyEz1pvspPzOsnfc9Gp2zrODIkQm3asuP5/RFVYEFCGwPW/z8/ItbNJvejVBIaBoiLk7wmYnTS8mQBxx0YDbLurZ2eotKCNGQLF9ty0ox4+6qOMZtDzBdq3aRR0vIaColUkG91pQcoTdmOEZFHWx6d3Nka20oIwQR1y8jSn79xTj2rqo4zECirUY17+bZbmzFpQx4oiLVZnkXv+eJlpQxohaXLysakE5lsm33EUdT2AHxRPKLurV5WeOsI0joLjXRX0UaAvKGLGDxq5qQTkOoIs6nkNAI3PbgrIYB9dFHY8R0BgYVxUSjFrdgjJGBLS7vEkPqkKCdnRRx2MEtGtc5m0+bmUXddxDX9wOWXZRz0cyvcOmV4MaEdAWM+m+vzvCdrkFZbwIaNvcdlEfRdSCMl4EtA2M9SY7rVpQdreLOu7jGTR4Jt3zZS1s17uo4zkENDS3XdRHkqMFZewIaBCqFpTFOMou6ngKR9zG3bagzM/poo4HuA/ajKqLuslHtKDEC9hBd4gWlNgMAd2i8gg7ks1oQYk10dVvS267qI9oQYk3I6C14AiLuvEM+mZlF/URLSixNQR0XSYpj7B0UccOENCVLLuoj8r+PRxhsSME9AVlF/Xq5ghHWOwUz6BPo4s6AkJAS1UX9REtKBGUqANKF3WELr6AGnfvCEsXdYQtloBWXdRHtKBEO8RQ6nfbRT0fS44u6miTrr7FXbagLMZ0UUfrdSagJj3wZSEBLSjRAVUtTLsDajNvC7qoo7vaF1Bjvc1Oy7ewdFFHx7UmoHRRR1za8JLI9u4dYemijogE+zWLsWULynxMF3VEL5iAmnTPm3wsm5/RghKoNJuEqgWlzcdSQhd14KEGAkoXdeA1ftcvieiiDqxjF53lb1tQjumiDqxlazsoLSiButQW0LIFZXWEpYs6UIu3BdSmdzdHaEEJ1G6DgC6PsCOZ7EQcYYHtWTmgJunfO8LSvwfYrlVeEi27qOcjWlACu/RCLa43vWO6qAMBuA1o2YJyTBd1ICCJLX7z5RGWFpRAOKpnULv33w0vBMBj5aMlDWKBIJU7KAEFAkZAgYARUCBgBBQIGAEFAkZAgYARUCBIfM0ChKsqliegQMAIKBAwAgoEiWdQIGAUywPhqvokEFAgRLzFBQJmeAYFgkdAgYARUCBgBBQIkecZFAgeAQWCRKECEDCOuEDA2EGB4BFQIEgccYHgEVAgYAQUCBgBBQJGQIGAEVAgYAQUCBJfswABo5IICB4BBUJ0dx/UN7wSAM9hBwUCRkCBgBFQIGAEFHjAz+daTKcNv54p/+ZJk0sAQuAXC80vf2g+mWh+M5Gfz25/ZpNE6XBfyXC/kbURUERt9uO7br59kV/Mn/z5YjbT5Ms/sr1MtpfteHUEFJGaT6518+Xv8ii7gsXNZMcBLSuJCCiiM/v5Q5PP/17vQ2bXr2uoxUWEZleX64dTkuyOo2KoxUVk/GKhm89/b/RZl/ZqXs0rGP2A2Ey/fn72ZdBLXC+TSZp5GiSgiIP3ml3+2OijrujXvJjVEVBEYXb5U95vVnmQFIOaV7M6AooobLp7JnnR0PGWl0SIhJ/NNJ9cb/TZZO+g5tWsipdEiMT8ZrLR51wvk8vymlezHgKKzvOz1aqFHmqq/vY+AorOW0xv1v6Mywsl/eZeDi1fZ1Hqh5d5aT69lr+50WI61Xx6Iy3msmnvtoC86WPgaxaz2et/6B7jnLKjsy2tZj0EFE/zXtMf3zT98U1+/vjL/cVsJl1dSpKSvK/s5Oy2PC00xjlpjVNudnQq48I4XBJQPLK4mWjyz79W3nlm15cyXz+rd3i85ZVtxiap5rpa6c/2Dg7l8mLLK1oFF7bxhNmPb5p8/XxbC7ry5y5/hBvQFepol8dal4d1XCeguDX7+V2TL/9s9Fm/WMgvFjK7vvWxgmQw1Hxypdnlz6d/nvfVOz4Nc+1NLwBhmF9fabLhTY8lP5vKNNB1YBXZ0ZlskmoxvdFiNpNxTknelyv65TNqoBJ5H+zDPXbDLxab3ZF84vcEy0jp/mHTq1hbeHs6dm767cuTb2rXZZO0htXgPgIaOT+bafrj25t/j7GusTuT3USxPFS+GKqD7e2440DnUSwPSdMNr2E95AJ9OdR2BDRi86urWp49JQXy5X73ENCIzS7rOt4209S506o6EQIaKT+fa3a1Wvnba9LBXi2/B48R0EjNr69Ux3QgY22j17K6joBGapM7kk9J+kMKXbZg+a+UgEaqtoAOOd5ug+cZNG51BDQd7lE9tCXsoBHz89mb62aNdUr3j2paEZ5DQCO0bguQp/QOj4O8ntU1/BuO0FuvV6V7B7y53RECGiHrNi9qT4q+egccbXeF6wcxMkbG2rWfQ3v7h628U9lmBDRSNklX7rhurFN2HF6/nhhwxI3UqjNHXJarGL0jnA1hB41UUvTl9w918+3Lo58Za5UUA7n+IPim1N1F283opfuHSvpDLeaz8rvR+Uw2ycqrY1TvNaz8P4CARs4kiRytSoLFMygQMAIKBIyAAgGzdVzaBbAd7KBAiDxtN4GA0bgaCBg7KBAwdlAgeAQUCBgBBQJGQIGAEVAgSLzFBcJleIsLBI+AAkHiiAsEjCMuEDwCCgSMgAIBI6BAuDwBBYLl2UGBYHmOuEDA2EGBoBFQIFjsoEDQCCgQLE/jaiBk7KBAqDzPoEDQCCgQLHZQIGiMVkY4vDSfXGkxvan+N5WxVsYlskmipD+UiWwaeFz/tAiT95r9/K6b79/k57Nn/9jN969KB3tK9w9lbPcPf957AopmzSfXmvzzL/n5/PU/7L2mP75pMZsqPx1tf3EB6P5/hhCs+fWVJv/+/9XC+eBzs5/ft7SqkPCSCA2ZT651/fdf8n6zQpnZ1WXNKwoTAUUjpl8/306R3shbPtsiBBQ7N7++0vxm8rZfUnVe7zoCip1bTG/e/DvS4UENKwkdz6BogHnj7ud6mVye17SasBFQ7J7b/Ns9m6TKjs9qXEzI2EHRgKToy+XF2p+zaU/52TieaiKahqEp2dGpbNpb6c8a69Q7OFRx/puMc1teWUioJEJDjHMqRu80u/yp6fcvWkynv/7cWtm0J5cXSof70by1fYiAolFJf6CkP5Ak+dlMi8VM1qWR7ZTP8Urk/XLSGdAokyRy7Bm/4BkUCBgBBUJFTyIgbAQUCBY7KBA0AgoEjIACweKICwSNgAKh4msWIGwEFAiR9zLpPgEFgmR7krGGgAIBsvlJ+deG1wHgPi/Z/Fx2cGEk7oMCATGyexey+ej2AigBBZrkveR6sv0Psvn5o5vZBBRohJdJhrLDTzLJ8NmWCQQU2Ckjk53IDS8kk7zay4SAArtgnGzxu2z/3VoNhggosC3eyyR92eGFTHqwUecvAgrUzEuyvUO54Z+S7b2pJR8BBepirGw+lh18UF2NfAko8BZekstkBx9ls5PaG9gSUGBDJt2THf4p44qtdZZOyv8EAFiNkc3PZAcXkrFbb/nODgqswqSyg/e/lOHtAgEFXmCSwavVPttEQIEHyq9JTuT2Pq1U7bNNBBRYMk62eCfb/z2YcWIEFHHzkpJCbvCHTO8wmGAuEVBEyXvJZoeyg08yLgsumEsEFJGxssVItv9RMuGP7Sag6D6v8lL04KNsdhp8KO8joOg0k+zJ7n2Scf1WBXOJgKKDjGx2Kju8kIxrZTCXCCg6wkumJ9v/XbYYtzqU9xFQtJ5J+rKDC5l0vzPBXCKgaKWy2ueouhSddi6YSwQU7WKcbDGW7X+QpM4Gc4mAInxeUpJX1T5HnQ/lfQQUQTPpQXmbxOVRBXOJgCJAtppP8nEnl6JDRkARBu8ll8n1P8jkZ1GH8j4CisbdjUAYEMwHCCgashyB8Kn11T7bRECxWzYpL0UX641AiBUBxU4YV7xpBEKsCCi2xstUIxA+vXkEQqwIKOpnnGw+qnUEQqwIKOpRjUBwg48yWxiBECsCijcz6X41AiHOap9tIqDYkJXNT3c2AiFWBBTraWgEQqwIKFbS9AiEWBFQPKv8muQ4iBEIsSKgeMwkssVvQY1AiBUBRen2UvRFkCMQYkVAI1f29jmsevtQ7RMaAhor4+4uRVPtEywCGpOq2scOPrRuBEKsCGgk2j4CIVYEtNO6MwIhVkl57kF3dHMEQqzYQTvEuH5Z7ZPuEcyOIKAtV35Nclxdiu7uCIRYEdC2Mq6q9nkvRTACIVYEtE28l5IiyhEIsSKgLeC9ZHv7ssP/knEZwYwIAQ2alc3PqkvRVPvEiICGxktyPdn+B1lGIESPgAaEEQh4iIA2zshmJ7KMQMATCGhTGIGAFRDQHTNJITv4JJPuE0y8ioDuQFntc8QIBKwtoVZ+i4yTzcfVCASqfbA+dtC6eUlJVlX7HBNKvAkBrcldtQ8jEFAfAvpmpurt8wcjEFA7ArqJcrsse/vk54QSW0NA1+LvVfswAgHbR0BX4GVks+pSNCMQsEME9CXGldU+jEBAQwjoQ97LJH3Z4YVMekAw0SgCWmEEAkJEQI2TzUdVtQ+XohGWOAO6vBQ9+EM2OyGUCFZ0ATXpXlXtUxBMBC+OzvLGliMQBhdU+6BVur2DmkS2/54RCGitTgbUuEH1NQkjENBunQmol8pqnwEjENAd7Q+oSWSLsWz/PaFE57QzoIxAQCRaFdDyltdB9TUJIxDQfS0JqJUtzmX7fzACAVEJN6C31T4fZDNGICBOQQa0vBT9p0zSJ5iIWkABZQQC8FDDAfWSTWWL32WL3wgl8EBjATVueSmaEQjAc3Ya0LsRCH9S7QOsYDcBNa6q9mEEArCO7QXUS0pyucFHRiAAG9pKQE3KCASgDjUGlBEIQN3eFlDvJZeVl6IZgQDUbuOWJyYZVNU+A4IJbMmaO6iRyU7khheMQAB2YLWA2kQ2fyfbf0cogR16MaDGFYxAABr0KKBeRrZ3wAgEIAB3AWUEAhAcM7/6y9veIbWxQID+Aw7DzFbq+yhZAAAAAElFTkSuQmCC'/%3e%3cimage%20id='_Image2'%20width='472px'%20height='177px'%20xlink:href='data:image/png;base64,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'/%3e%3c/defs%3e%3c/svg%3e", ks = { class: "tresleches-container" }, Os = ["id"], Es = {
  key: 0,
  class: "w-1/3"
}, Ss = { class: "tl-rounded-full tl-inline-flex tl-justify-center tl-items-center tl-p-1.5 tl-bg-gray-100 dark:tl-bg-dark-300 tl-outline-none tl-border-none tl-cursor-pointer" }, Ms = ["src"], Bs = { class: "tl-flex-1 tl-relative tl-overflow-hidden tl-py-4" }, Fs = 280, ot = 36, rn = 100, Is = 600, Ts = 32, Vs = 32, an = 24, Us = 24, Ls = /* @__PURE__ */ defineComponent({
  __name: "TresLeches",
  props: {
    uuid: { default: "default" },
    collapsed: { type: Boolean, default: false },
    float: { type: Boolean, default: true }
  },
  setup(t, { expose: e }) {
    const n = t;
    useSlots();
    const { uuid: l, collapsed: a, float: r } = toRefs(n), s = ref(a.value), i = computed(() => s.value && !r.value), c = ref(null), f = ref(false), u = ref(false), { width: h2 } = useWindowSize(), { height: A } = useWindowSize();
    ref(false);
    const v = ref(false), y = ref(Fs), g = ref(null);
    Fo(l?.value);
    const x = ref(false), { store: p, triggers: m } = jt(), w = computed(() => p[l.value] || {});
    e({ controls: w });
    function b(F, T) {
      const V = w.value[F];
      V && (isRef(V.value) ? V.value.value = T : V.value = T);
    }
    const S = computed(() => {
      m[l.value];
      const F = p[l.value] || {}, T = {};
      for (const V of Object.keys(F)) {
        const H = F[V], N = H.folder || "default";
        T[N] || (T[N] = []), T[N].push(H);
      }
      return T;
    });
    function Q() {
      if (i.value)
        return ot;
      let F = 0, T = false;
      for (const N in S.value) {
        const tt = S.value[N];
        F += tt.length, N !== "default" && (F += 1), tt.some((Xt) => Xt.type === "fpsgraph") && (T = true);
      }
      const V = Ts + Vs + F * an + (T ? Us : 0), H = r.value ? A.value : Is;
      return Math.min(H, Math.max(rn, V));
    }
    const L = ref(Q()), D = ref(null), Et = ref(null), { style: Nt, position: St } = So(D, {
      handle: Et,
      initialValue: {
        x: h2.value - 40,
        y: 10
      }
    }), dt = computed(() => r.value ? [
      Nt.value,
      { width: `${y.value}px`, height: `${L.value}px`, right: "16px", left: "auto" }
    ] : [
      { width: "auto", height: "auto" }
    ]), _ = r.value ? {
      initial: {
        opacity: 0,
        y: 100,
        width: ot,
        height: ot,
        right: "1rem",
        left: "auto"
      },
      enter: {
        opacity: 1,
        y: 0,
        width: ot,
        height: ot,
        right: "1rem",
        left: "auto"
      },
      leave: {
        opacity: 0,
        y: 100,
        width: ot,
        height: ot,
        right: "1rem",
        left: "auto"
      }
    } : {
      initial: { opacity: 1 },
      enter: { opacity: 1 }
    }, { apply: zt } = eo(D, {
      initial: _.initial,
      enter: _.enter,
      ..._.leave ? { leave: _.leave } : {}
    });
    watch(S, async () => {
      const F = Q();
      F !== L.value && (L.value = F, !s.value && r.value && await zt({
        width: y.value,
        height: F,
        right: "1rem",
        left: "auto"
      }));
    }, { flush: "post" });
    const Mt = () => {
      if (!c.value)
        return;
      const { scrollTop: F, scrollHeight: T, clientHeight: V } = c.value;
      f.value = F > 20, u.value = T - F - V > 20;
    };
    function qt(F, T) {
      v.value = true, g.value = F, T.preventDefault(), T.stopPropagation();
      const V = T.clientX, H = T.clientY, N = y.value, tt = L.value, Xt = St.value.x, ao = c.value ? c.value.scrollHeight - c.value.clientHeight : 0, so = tt + ao;
      function je(Ht) {
        if (!(!v.value || !D.value)) {
          if (g.value === "right" || g.value === "corner") {
            const at = Ht.clientX - V;
            y.value = Math.max(280, N + at);
          }
          if (g.value === "left" || g.value === "corner-left") {
            const at = V - Ht.clientX, io = Math.max(280, N + at);
            St.value.x = Xt - at, y.value = io;
          }
          if (g.value === "bottom" || g.value === "corner" || g.value === "corner-left") {
            const at = Ht.clientY - H;
            L.value = Math.min(so, Math.max(rn, tt + at)), Mt();
          }
        }
      }
      function Ke() {
        v.value = false, g.value = null, Mt(), (void 0).removeEventListener("mousemove", je), (void 0).removeEventListener("mouseup", Ke);
      }
      (void 0).addEventListener("mousemove", je), (void 0).addEventListener("mouseup", Ke);
    }
    watch(L, (F) => {
      F && D.value && r.value && (D.value.style.maxHeight = `${F}px`);
    }), watch(y, (F) => {
      F && D.value && r.value && (D.value.style.maxWidth = `${F}px`);
    });
    function lo() {
      r.value && (s.value = !s.value);
    }
    watch(s, async (F) => {
      if (!r.value) {
        await nextTick(), D.value && (D.value.style.width = "", D.value.style.height = "", D.value.style.right = "", D.value.style.left = "", D.value.style.opacity = "1", D.value.style.transform = "");
        return;
      }
      if (!F) {
        await nextTick(), await zt({
          width: y.value,
          height: L.value,
          right: "1rem",
          left: "auto"
        });
        return;
      }
      await zt("enter");
    }, { immediate: true });
    function ro(F) {
      L.value = L.value + an * (F ? 1 : -1);
    }
    const Re = ref();
    return watch(Re, (F) => {
      L.value = L.value + F.clientHeight;
    }), (F, T) => (openBlock(), createElementBlock("div", ks, [
      createElementVNode("div", {
        id: `tres-leches-pane-${unref(l)}`,
        ref_key: "paneRef",
        ref: D,
        class: normalizeClass(["tl-leches tl-box-border tl-z-24 tl-bg-white dark:tl-bg-dark-200 tl-shadow-xl tl-font-sans tl-flex tl-flex-col tl-rounded-lg tl-overflow-hidden", [
          F.$attrs.class,
          unref(r) ? "tl-absolute tl-top-4" : "tl-relative"
        ]]),
        style: normalizeStyle(dt.value)
      }, [
        createElementVNode("header", {
          class: normalizeClass(["tl-flex tl-items-center tl-text-gray-200 dark:tl-text-gray-600", [!s.value && unref(r) ? "tl-justify-between" : "tl-justify-center"]])
        }, [
          !s.value && unref(r) ? (openBlock(), createElementBlock("div", Es)) : createCommentVNode("", true),
          !s.value && unref(r) ? (openBlock(), createElementBlock("div", {
            key: 1,
            ref_key: "handleRef",
            ref: Et,
            class: "tl-cursor-grabbing w-1/3"
          }, [...T[3] || (T[3] = [
            createElementVNode("i", { class: "i-ic-baseline-drag-indicator" }, null, -1),
            createElementVNode("i", { class: "i-ic-baseline-drag-indicator" }, null, -1),
            createElementVNode("i", { class: "i-ic-baseline-drag-indicator" }, null, -1)
          ])], 512)) : createCommentVNode("", true),
          createElementVNode("div", {
            class: normalizeClass(["tl-flex tl-p-0.5", [!s.value && unref(r) ? "tl-justify-end" : "tl-justify-center"]])
          }, [
            createElementVNode("button", Ss, [
              createElementVNode("img", {
                src: unref(Cs),
                alt: "TresLechesIcon",
                class: "tl-w-4 tl-h-4 tl-block",
                width: 16,
                height: 16,
                onClick: lo
              }, null, 8, Ms)
            ])
          ], 2)
        ], 2),
        withDirectives(createElementVNode("div", Bs, [
          createElementVNode("div", {
            class: normalizeClass(["tl-pointer-events-none tl-absolute tl-left-0 tl-right-0 tl-top-0 tl-h-8 tl-bg-gradient-linear tl-bg-gradient-to-b tl-from-white dark:tl-from-dark-200 tl-to-transparent tl-z-20 tl-opacity-0 tl-transition-opacity duration-200", { "!tl-opacity-100": f.value }])
          }, null, 2),
          createElementVNode("div", {
            class: normalizeClass(["tl-pointer-events-none tl-absolute tl-left-0 tl-right-0 tl-bottom-0 tl-h-8 tl-bg-gradient-linear tl-bg-gradient-to-t tl-from-white dark:tl-from-dark-200 tl-to-transparent tl-z-20 tl-opacity-0 tl-transition-opacity duration-200", { "!tl-opacity-100": u.value }])
          }, null, 2),
          createElementVNode("div", {
            ref_key: "scrollContainer",
            ref: c,
            class: "tl-scroll-container tl-h-full tl-overflow-y-auto tl-overflow-x-hidden tl-scrollbar tl-scrollbar-rounded tl-scrollbar-w-4px tl-scrollbar-radius-2 tl-scrollbar-track-radius-4 tl-scrollbar-thumb-radius-4 tl-scrollbar-track-color-gray-100 dark:tl-scrollbar-track-color-dark-300 tl-scrollbar-thumb-color-gray-300 dark:tl-scrollbar-thumb-color-gray-400",
            onScroll: Mt
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(S.value, (V, H) => (openBlock(), createElementBlock(Fragment, { key: H }, [
              H !== "default" ? (openBlock(), createBlock(Hl, {
                key: 0,
                label: H,
                controls: V,
                onOpen: ro
              }, null, 8, ["label", "controls"])) : createCommentVNode("", true),
              H === "default" ? (openBlock(true), createElementBlock(Fragment, { key: 1 }, renderList(V, (N) => (openBlock(), createBlock(vn, {
                key: N.label,
                control: N,
                onChange: (tt) => b(N.key, tt)
              }, null, 8, ["control", "onChange"]))), 128)) : createCommentVNode("", true)
            ], 64))), 128)),
            x.value ? (openBlock(), createElementBlock("div", {
              key: 0,
              ref_key: "slotsRef",
              ref: Re,
              style: { padding: "0 var(--tl-h-padding)" }
            }, [
              renderSlot(F.$slots, "default", {}, void 0, true)
            ], 512)) : createCommentVNode("", true)
          ], 544)
        ], 512), [
          [vShow, !s.value]
        ]),
        s.value ? createCommentVNode("", true) : (openBlock(), createElementBlock("span", {
          key: 0,
          class: "tl-absolute tl-left-0 tl-right-0 tl-bottom-0 tl-h-2 hover:tl-h-4 tl-transition-all tl-cursor-ns-resize tl-z-10",
          onMousedown: T[0] || (T[0] = (V) => qt("bottom", V))
        }, null, 32)),
        s.value ? createCommentVNode("", true) : (openBlock(), createElementBlock("span", {
          key: 1,
          class: "tl-absolute tl-left-0 tl-top-0 tl-bottom-0 tl-w-2 hover:tl-w-4 tl-transition-all tl-cursor-ew-resize tl-z-10",
          onMousedown: T[1] || (T[1] = (V) => qt("left", V))
        }, null, 32)),
        s.value ? createCommentVNode("", true) : (openBlock(), createElementBlock("span", {
          key: 2,
          class: "tl-absolute tl-left-0 tl-bottom-0 tl-w-4 tl-h-4 hover:tl-w-6 hover:tl-h-6 tl-transition-all tl-cursor-nesw-resize tl-z-10",
          onMousedown: T[2] || (T[2] = (V) => qt("corner-left", V))
        }, null, 32))
      ], 14, Os)
    ]));
  }
}), Ks = /* @__PURE__ */ K(Ls, [["__scopeId", "data-v-70d8df94"]]);

export { Ks as K, js as j };
//# sourceMappingURL=tresleches-C3j7xceu.mjs.map
