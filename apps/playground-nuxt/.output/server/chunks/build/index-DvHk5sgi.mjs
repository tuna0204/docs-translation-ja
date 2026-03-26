import { _ as __nuxt_component_1$1 } from './TresCanvas.server-_2-3czgJ.mjs';
import { mergeProps, withCtx, createVNode, defineComponent, watch, computed, unref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrRenderAttrs } from 'vue/server-renderer';
import { MeshBasicMaterial } from 'three';
import { O as OrbitControls_default, u as useGLTF, a as useTexture, b as useLoop } from './trescientos-BWS9yc8F.mjs';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "NuxtStones",
  __ssrInlineRender: true,
  setup(__props) {
    const { state, nodes } = useGLTF("/models/nuxt-stones/nuxt-stones.glb");
    watch(state, (state2) => {
      console.log(state2);
    });
    const stone = computed(() => nodes.value.Stone);
    const stoneCarved = computed(() => nodes.value.StoneCarved);
    const logo = computed(() => nodes.value.Logo);
    const littleStones = computed(() => Object.values(nodes.value).filter((node) => node.name.includes("Stone00")));
    const { state: stonesTexture } = useTexture("/models/nuxt-stones/RockBaked.png");
    const { state: littleStonesTexture } = useTexture("/models/nuxt-stones/LittleRocksBaked.png");
    watch(stonesTexture, (texture) => {
      texture.flipY = false;
    });
    watch(littleStonesTexture, (texture) => {
      texture.flipY = false;
    });
    const stoneBakedMaterial = computed(() => new MeshBasicMaterial({
      map: stonesTexture.value
    }));
    const littleStonesBakedMaterial = computed(() => new MeshBasicMaterial({
      map: littleStonesTexture.value
    }));
    watch([stone, stoneCarved, stoneBakedMaterial], ([stone2, stoneCarved2, texture]) => {
      if (stone2) {
        stone2.material = texture;
      }
      if (stoneCarved2) {
        stoneCarved2.material = texture;
      }
    });
    watch([littleStones, littleStonesBakedMaterial], ([littleStones2, texture]) => {
      littleStones2.forEach((stone2) => {
        stone2.material = texture;
      });
    });
    watch(logo, (logo2) => {
      logo2.material.emissiveIntensity = 10;
    });
    const { onBeforeRender } = useLoop();
    onBeforeRender(({ elapsed }) => {
      if (logo.value) {
        logo.value.material.emissiveIntensity = Math.sin(elapsed) * 6 + 7;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<TresGroup${ssrRenderAttrs(mergeProps({ "rotation-y": "1.57" }, _attrs))}>`);
      if (unref(state)) {
        _push(`<primitive${ssrRenderAttr("object", unref(state).scene)}></primitive>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</TresGroup>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NuxtStones.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main$1, { __name: "NuxtStones" });
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_TresCanvas = __nuxt_component_1$1;
  const _component_NuxtStones = __nuxt_component_1;
  const _component_OrbitControls = OrbitControls_default;
  _push(ssrRenderComponent(_component_TresCanvas, mergeProps({ "clear-color": "#040404" }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<TresPerspectiveCamera${ssrRenderAttr("position", [5, 5, 5])}${ssrRenderAttr("look-at", [0, 1, 0])}${_scopeId}></TresPerspectiveCamera>`);
        _push2(ssrRenderComponent(_component_NuxtStones, null, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_OrbitControls, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode("TresPerspectiveCamera", {
            position: [5, 5, 5],
            "look-at": [0, 1, 0]
          }),
          createVNode(_component_NuxtStones),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/loaders/gltf/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-DvHk5sgi.mjs.map
