import { j as js, K as Ks } from './tresleches-C3j7xceu.mjs';
import { _ as __nuxt_component_1 } from './TresCanvas.server-_2-3czgJ.mjs';
import { defineComponent, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import _sfc_main$1 from './Child-C4mFYlrT.mjs';
import '@vueuse/core';
import './server.mjs';
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

const uuid = "leches-basic-parent-child";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    js("fpsgraph", { uuid });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TresLeches = Ks;
      const _component_TresCanvas = __nuxt_component_1;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_TresLeches, {
        uuid,
        class: "z-20 top-20"
      }, null, _parent));
      _push(ssrRenderComponent(_component_TresCanvas, {
        "window-size": "",
        "clear-color": "#82DBC5"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$1, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/misc/parent-child/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DGzo4rsl.mjs.map
