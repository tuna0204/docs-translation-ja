import { f as __nuxt_component_0$3 } from './server.mjs';
import { _ as __nuxt_component_1 } from './TresCanvas.server-_2-3czgJ.mjs';
import { defineComponent, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { clearColor } = js({
      clearColor: "#82DBC5"
    }, {
      uuid: "simple"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$3;
      const _component_TresCanvas = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full h-screen relative" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(ssrRenderComponent(_component_TresCanvas, { "clear-color": unref(clearColor) }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<TresPerspectiveCamera${_scopeId}></TresPerspectiveCamera><TresGroup${_scopeId}><TresMesh name="Im a pretty Box"${_scopeId}><TresBoxGeometry${_scopeId}></TresBoxGeometry><TresMeshNormalMaterial${_scopeId}></TresMeshNormalMaterial></TresMesh></TresGroup>`);
          } else {
            return [
              createVNode("TresPerspectiveCamera"),
              createVNode("TresGroup", null, [
                createVNode("TresMesh", { name: "Im a pretty Box" }, [
                  createVNode("TresBoxGeometry"),
                  createVNode("TresMeshNormalMaterial")
                ])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/basic/simple/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D7Wp9jmj.mjs.map
