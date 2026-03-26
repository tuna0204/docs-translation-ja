import { f as __nuxt_component_0$3 } from './server.mjs';
import { _ as __nuxt_component_1 } from './TresCanvas.server-_2-3czgJ.mjs';
import { c as component_default$4, O as OrbitControls_default } from './trescientos-BWS9yc8F.mjs';
import { defineComponent, ref, mergeProps, withCtx, createVNode, createBlock, openBlock, Suspense, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSuspense } from 'vue/server-renderer';
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
    const renderTimes = ref(0);
    js({
      renderTimes: {
        value: renderTimes,
        type: "graph",
        label: "Render Times (ms)",
        onUpdate: () => {
          renderTimes.value = 0;
        }
      }
    }, {
      uuid: "on-demand"
    });
    function onRender() {
      renderTimes.value = 1;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$3;
      const _component_TresCanvas = __nuxt_component_1;
      const _component_Environment = component_default$4;
      const _component_OrbitControls = OrbitControls_default;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full h-screen relative" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(ssrRenderComponent(_component_TresCanvas, {
        "render-mode": "on-demand",
        onRender
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<TresPerspectiveCamera${_scopeId}></TresPerspectiveCamera>`);
            ssrRenderSuspense(_push2, {
              default: () => {
                _push2(ssrRenderComponent(_component_Environment, {
                  background: "",
                  preset: "sunset",
                  blur: 0.8
                }, null, _parent2, _scopeId));
              },
              _: 1
            });
            _push2(`<TresMesh${_scopeId}><TresBoxGeometry${_scopeId}></TresBoxGeometry><TresMeshNormalMaterial${_scopeId}></TresMeshNormalMaterial></TresMesh>`);
            _push2(ssrRenderComponent(_component_OrbitControls, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("TresPerspectiveCamera"),
              (openBlock(), createBlock(Suspense, null, {
                default: withCtx(() => [
                  createVNode(_component_Environment, {
                    background: "",
                    preset: "sunset",
                    blur: 0.8
                  })
                ]),
                _: 1
              })),
              createVNode("TresMesh", null, [
                createVNode("TresBoxGeometry"),
                createVNode("TresMeshNormalMaterial")
              ]),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/advanced/on-demand/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BFgjUpa1.mjs.map
