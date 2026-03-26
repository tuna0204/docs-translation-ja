import { defineComponent, watch, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { j as js } from './tresleches-C3j7xceu.mjs';
import '@vueuse/core';

const uuid = "leches-basic-parent-child";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Child",
  __ssrInlineRender: true,
  setup(__props) {
    const { color, metalness, roughness, wireframe, number: numberControl, booleanDropdown } = js({
      wireframe: false,
      number: 1,
      booleanDropdown: true,
      color: "#ff0000",
      metalness: {
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.1
      },
      roughness: {
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.1
      }
    }, { uuid });
    watch(color, (value) => {
      console.log("color", value);
    });
    watch(metalness, (value) => {
      console.log("metalness", value);
    });
    watch(roughness, (value) => {
      console.log("roughness", value);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<TresMesh${ssrRenderAttrs(_attrs)}><TresBoxGeometry${ssrRenderAttr("args", [1, 1, 1])}></TresBoxGeometry><TresMeshNormalMaterial${ssrRenderAttr("wireframe", unref(wireframe))}></TresMeshNormalMaterial></TresMesh>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/misc/parent-child/Child.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=Child-C4mFYlrT.mjs.map
