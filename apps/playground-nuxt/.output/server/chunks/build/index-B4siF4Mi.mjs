import { f as __nuxt_component_0$3 } from './server.mjs';
import { _ as __nuxt_component_1 } from './TresCanvas.server-_2-3czgJ.mjs';
import { O as OrbitControls_default } from './trescientos-BWS9yc8F.mjs';
import { defineComponent, resolveDirective, mergeProps, unref, withCtx, createVNode, withDirectives, createBlock, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrGetDirectiveProps } from 'vue/server-renderer';
import { j as js } from './tresleches-C3j7xceu.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'vue-router';
import 'tailwindcss/colors';
import '@iconify/vue';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'three';
import 'radashi';
import '@pmndrs/pointer-events';
import 'three-stdlib';
import 'stats.js';
import 'stats-gl';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { clearColor } = js({
      clearColor: "#000"
    }, {
      uuid: "lights"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$3;
      const _component_TresCanvas = __nuxt_component_1;
      const _component_OrbitControls = OrbitControls_default;
      const _directive_log = resolveDirective("log");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full h-screen relative" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(ssrRenderComponent(_component_TresCanvas, {
        "clear-color": unref(clearColor),
        shadows: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<TresPerspectiveCamera${_scopeId}></TresPerspectiveCamera><TresMesh name="Im a pretty Box"${ssrRenderAttr("position", [0, 1, 0])} cast-shadow${_scopeId}><TresBoxGeometry${_scopeId}></TresBoxGeometry><TresMeshToonMaterial color="teal"${_scopeId}></TresMeshToonMaterial></TresMesh><TresMesh${ssrRenderAttrs(mergeProps({
              ref: "planeRef",
              rotation: [-Math.PI / 2, 0, 0],
              "receive-shadow": ""
            }, ssrGetDirectiveProps(_ctx, _directive_log, void 0, "material")))}${_scopeId}><TresPlaneGeometry${ssrRenderAttr("args", [10, 10, 10, 10])}${_scopeId}></TresPlaneGeometry><TresMeshToonMaterial${_scopeId}></TresMeshToonMaterial></TresMesh><TresDirectionalLight color="white"${ssrRenderAttr("intensity", 1)}${ssrRenderAttr("position", [5, 5, -5])} cast-shadow${_scopeId}></TresDirectionalLight>`);
            _push2(ssrRenderComponent(_component_OrbitControls, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("TresPerspectiveCamera"),
              createVNode("TresMesh", {
                name: "Im a pretty Box",
                position: [0, 1, 0],
                "cast-shadow": ""
              }, [
                createVNode("TresBoxGeometry"),
                createVNode("TresMeshToonMaterial", { color: "teal" })
              ]),
              withDirectives((openBlock(), createBlock("TresMesh", {
                ref: "planeRef",
                rotation: [-Math.PI / 2, 0, 0],
                "receive-shadow": ""
              }, [
                createVNode("TresPlaneGeometry", { args: [10, 10, 10, 10] }),
                createVNode("TresMeshToonMaterial")
              ], 8, ["rotation"])), [
                [_directive_log, void 0, "material"]
              ]),
              createVNode("TresDirectionalLight", {
                color: "white",
                intensity: 1,
                position: [5, 5, -5],
                "cast-shadow": ""
              }),
              createVNode(_component_OrbitControls)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/basic/lights/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B4siF4Mi.mjs.map
