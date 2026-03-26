import { computed, unref, mergeProps, withCtx, renderSlot, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { Primitive } from 'reka-ui';
import { b as useAppConfig, c as useComponentUI, t as tv } from './server.mjs';

const theme = {
  "base": "min-h-[calc(100vh-var(--ui-header-height))]"
};
const _sfc_main = {
  __name: "UMain",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false, default: "main" },
    class: { type: null, required: false },
    ui: { type: Object, required: false }
  },
  setup(__props) {
    const props = __props;
    const appConfig = useAppConfig();
    const uiProp = useComponentUI("main", props);
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.main || {} }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        class: ui.value({ class: [unref(uiProp)?.base, props.class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../node_modules/.pnpm/@nuxt+ui@4.5.0_@nuxt+content@3.10.0_better-sqlite3@12.5.0_magicast@0.5.1_valibot@1.2.0__4995ab990a17ff4c1f805763520f4dd9/node_modules/@nuxt/ui/dist/runtime/components/Main.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Main-Dmv-xk2L.mjs.map
