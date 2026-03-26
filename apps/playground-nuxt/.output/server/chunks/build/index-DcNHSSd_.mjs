import { _ as __nuxt_component_1 } from './TresCanvas.server-_2-3czgJ.mjs';
import { O as OrbitControls_default } from './trescientos-BWS9yc8F.mjs';
import { mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import 'three';
import '@vueuse/core';
import 'radashi';
import '@pmndrs/pointer-events';
import 'three-stdlib';
import 'stats.js';
import 'stats-gl';
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
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_TresCanvas = __nuxt_component_1;
  const _component_OrbitControls = OrbitControls_default;
  _push(ssrRenderComponent(_component_TresCanvas, mergeProps({ "clear-color": "#82DBC5" }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<TresPerspectiveCamera${_scopeId}></TresPerspectiveCamera><TresMesh${_scopeId}><TresBoxGeometry${_scopeId}></TresBoxGeometry><TresMeshNormalMaterial${_scopeId}></TresMeshNormalMaterial></TresMesh>`);
        _push2(ssrRenderComponent(_component_OrbitControls, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode("TresPerspectiveCamera"),
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
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/basic/primitives/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-DcNHSSd_.mjs.map
