import { defineComponent, mergeDefaults, shallowRef, createElementBlock, createCommentVNode, unref, openBlock, ref, withAsyncContext, watch, toRaw, useSlots, renderSlot, toRefs, computed, toValue, readonly, watchEffect, nextTick, reactive, createElementVNode, createBlock } from 'vue';
import * as THREE from 'three';
import { MOUSE, TOUCH, Mesh, BoxGeometry, MeshBasicMaterial, BackSide, WebGLCubeRenderTarget, HalfFloatType, CubeCamera, Object3D, Scene, CubeTextureLoader, EquirectangularReflectionMapping, CubeReflectionMapping, Euler, Vector3, Texture, TextureLoader, WebGLRenderer, MathUtils, Material, REVISION, AudioListener, Audio, AudioLoader, BufferGeometry, InterleavedBuffer, InterleavedBufferAttribute, Vector2, Color, DoubleSide, ShaderMaterial, UniformsUtils } from 'three';
import { whenever, createInjectionState, useDevicePixelRatio, useWindowSize, useElementSize, refDebounced, createEventHook, useTimeout, tryOnScopeDispose, useAsyncState, unrefElement, useRafFn, useEventListener } from '@vueuse/core';
import { isObject, isFunction, isNumber } from 'radashi';
import { forwardHtmlEvents, getVoidObject } from '@pmndrs/pointer-events';
import { OrbitControls, RGBELoader, GLTFLoader, Reflector } from 'three-stdlib';
import StatsImpl from 'stats.js';
import StatsGlImpl from 'stats-gl';

const createTypeGuard = (property) => (value) => isObject(value) && property in value && !!value[property];
const isMesh = createTypeGuard("isMesh");
const isCamera = createTypeGuard("isCamera");
const isPerspectiveCamera = createTypeGuard("isPerspectiveCamera");
function resolveRuntimeMode() {
  try {
    const modeFromImportMeta = "production";
    if (modeFromImportMeta) return modeFromImportMeta;
  } catch {
  }
  return typeof process !== "undefined" && process.env && "production" ? "production" : "production";
}
resolveRuntimeMode() === "production";
const logPrefix = "[TresJS ▲ ■ ●] ";
function logWarning(...args) {
  if (typeof args[0] === "string") args[0] = logPrefix + args[0];
  else args.unshift(logPrefix);
  console.warn(...args);
}
function disposeMaterial(material) {
  const hasMap = (material$1) => "map" in material$1 && !!material$1.map;
  if (hasMap(material)) material.map.dispose();
  material.dispose();
}
function disposeObject3D(object) {
  if (object.parent) object.removeFromParent?.();
  delete object.__tres;
  [...object.children].forEach((child) => disposeObject3D(child));
  if (object instanceof Scene) ;
  else {
    const mesh = object;
    if (object) object.dispose?.();
    if (mesh.geometry) mesh.geometry.dispose();
    if (Array.isArray(mesh.material)) mesh.material.forEach((material) => disposeMaterial(material));
    else if (mesh.material) disposeMaterial(mesh.material);
  }
}
function useLoader(Loader$1, path, options) {
  const proto = new Loader$1(options?.manager);
  const progress = reactive({
    loaded: 0,
    total: 0,
    percentage: 0
  });
  if (options?.extensions) options.extensions(proto);
  const initialPath = toValue(path);
  const result = useAsyncState((path$1) => new Promise((resolve$1, reject) => {
    const assetPath = path$1 || initialPath || "";
    proto.load(assetPath, (result$1) => {
      resolve$1(result$1);
    }, (event) => {
      progress.loaded = event.loaded;
      progress.total = event.total;
      progress.percentage = progress.loaded / progress.total * 100;
    }, (err) => {
      reject(err);
    });
  }), options?.initialValue ?? null, {
    ...options?.asyncOptions,
    immediate: options?.asyncOptions?.immediate ?? true
  });
  watch(() => toValue(path), (newPath) => {
    if (newPath) {
      const value = result.state.value;
      if (value && typeof value === "object" && "scene" in value && value.scene) disposeObject3D(value.scene);
      result.execute(0, newPath);
    }
  });
  return {
    ...result,
    load: (path$1) => {
      result.execute(0, path$1);
    },
    progress
  };
}
const useCameraManager = ({ sizes }) => {
  const cameras = ref([]);
  const activeCamera = computed(() => cameras.value[0]);
  const setActiveCamera = (cameraOrUuid) => {
    const camera = isCamera(cameraOrUuid) ? cameraOrUuid : cameras.value.find((camera$1) => camera$1.uuid === cameraOrUuid);
    if (!camera) return;
    cameras.value = [camera, ...cameras.value.filter(({ uuid }) => uuid !== camera.uuid)];
  };
  const registerCamera = (camera, active = false) => {
    if (cameras.value.some(({ uuid }) => uuid === camera.uuid)) return;
    cameras.value.push(camera);
    if (active) setActiveCamera(camera.uuid);
  };
  const deregisterCamera = (camera) => {
    cameras.value = cameras.value.filter(({ uuid }) => uuid !== camera.uuid);
  };
  watchEffect(() => {
    if (sizes.aspectRatio.value) cameras.value.forEach((camera) => {
      if (isPerspectiveCamera(camera)) {
        camera.aspect = sizes.aspectRatio.value;
        camera.updateProjectionMatrix();
      }
    });
  });
  return {
    activeCamera,
    cameras,
    registerCamera,
    deregisterCamera,
    setActiveCamera
  };
};
function buildGraph(object) {
  const data = {
    nodes: {},
    materials: {},
    meshes: {}
  };
  if (object) object.traverse((obj) => {
    if (obj.name) data.nodes[obj.name] = obj;
    if (isMesh(obj)) {
      if (!data.meshes[obj.name]) data.meshes[obj.name] = obj;
      (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((material) => {
        if (material.name && !data.materials[material.name]) data.materials[material.name] = material;
      });
    }
  });
  return data;
}
function createPriorityEventHook() {
  const eventToPriority = /* @__PURE__ */ new Map();
  const ascending = /* @__PURE__ */ new Set();
  let ADD_COUNT = 0;
  let dirty = false;
  const sort = () => {
    const sorted = Array.from(eventToPriority.entries()).sort((a, b) => {
      const priorityDiff = a[1].priority - b[1].priority;
      return priorityDiff === 0 ? a[1].addI - b[1].addI : priorityDiff;
    });
    ascending.clear();
    sorted.forEach((entry) => ascending.add(entry[0]));
  };
  const off = (fn) => {
    eventToPriority.delete(fn);
    ascending.delete(fn);
  };
  const on = (fn, priority = 0) => {
    eventToPriority.set(fn, {
      priority,
      addI: ADD_COUNT++
    });
    const offFn = () => off(fn);
    tryOnScopeDispose(offFn);
    dirty = true;
    return { off: offFn };
  };
  const trigger = (...args) => {
    if (dirty) {
      sort();
      dirty = false;
    }
    return Promise.all(Array.from(ascending).map((fn) => fn(...args)));
  };
  const dispose = () => {
    eventToPriority.clear();
    ascending.clear();
  };
  return {
    on,
    off,
    trigger,
    dispose,
    get count() {
      return eventToPriority.size;
    }
  };
}
const catalogue = ref({});
const extend = (objects) => Object.assign(catalogue.value, objects);
const setPixelRatio = (renderer, systemDpr, userDpr) => {
  if (!isFunction(renderer.setPixelRatio)) return;
  let newDpr = 0;
  if (userDpr && Array.isArray(userDpr) && userDpr.length >= 2) {
    const [min, max] = userDpr;
    newDpr = MathUtils.clamp(systemDpr, min, max);
  } else if (isNumber(userDpr)) newDpr = userDpr;
  else newDpr = systemDpr;
  if (newDpr !== renderer.getPixelRatio?.()) renderer.setPixelRatio(newDpr);
};
const revision = Number.parseInt(REVISION.replace("dev", ""));
const TIMER_MIN_REVISION = 179;
function createTimer() {
  if (revision >= TIMER_MIN_REVISION) {
    const timer = new THREE.Timer();
    return {
      getDelta: () => timer.getDelta(),
      getElapsed: () => timer.getElapsed(),
      update: () => timer.update(),
      start: () => {
      },
      stop: () => timer.disconnect()
    };
  } else {
    const clock = new THREE.Clock();
    return {
      getDelta: () => clock.getDelta(),
      getElapsed: () => clock.elapsedTime,
      update: () => {
      },
      start: () => clock.start(),
      stop: () => clock.stop()
    };
  }
}
const useCreateRafLoop = (cycleFn, { fpsLimit } = {}) => {
  const timer = createTimer();
  const eventHooks = {
    before: createEventHook(),
    after: createEventHook()
  };
  const { pause, resume, isActive } = useRafFn(() => {
    timer.update();
    const context = {
      delta: timer.getDelta(),
      elapsed: timer.getElapsed()
    };
    eventHooks.before.trigger(context);
    cycleFn();
    eventHooks.after.trigger(context);
  }, {
    immediate: false,
    fpsLimit
  });
  const start = () => {
    timer.start();
    resume();
  };
  const stop = () => {
    timer.stop();
    pause();
  };
  return {
    start,
    stop,
    isActive,
    onBeforeLoop: eventHooks.before.on,
    onLoop: eventHooks.after.on
  };
};
var TresRendererError = class extends Error {
  name = "TresRendererError";
  constructor(message, code, options) {
    super(message, options);
    this.code = code;
  }
};
function useRendererManager({ scene, canvas, options, fpsLimit, contextParts: { sizes, camera } }) {
  const getRenderer = () => {
    if (isFunction(options.renderer)) return options.renderer({
      sizes,
      scene,
      camera,
      canvas
    });
    return new WebGLRenderer({
      ...options,
      canvas: unrefElement(canvas)
    });
  };
  const renderer = getRenderer();
  const frames = ref(toValue(options.renderMode) === "manual" ? 0 : 1);
  const maxFrames = 60;
  const canBeInvalidated = computed(() => toValue(options.renderMode) === "on-demand" && frames.value === 0);
  const forceMaterialUpdate = () => scene.value.traverse((child) => {
    if (child instanceof Mesh && child.material instanceof Material) child.material.needsUpdate = true;
  });
  const invalidate = (amountOfFramesToInvalidate = 1) => {
    if (!canBeInvalidated.value) return;
    frames.value = Math.min(maxFrames, frames.value + amountOfFramesToInvalidate);
  };
  const advance = () => {
    if (toValue(options.renderMode) !== "manual") throw new Error("advance can only be called in manual render mode.");
    frames.value = 1;
  };
  const invalidateOnDemand = () => {
    if (toValue(options.renderMode) === "on-demand") invalidate();
  };
  const isModeAlways = computed(() => toValue(options.renderMode) === "always");
  const isRenderer = (value) => isObject(value) && "isRenderer" in value && Boolean(value.isRenderer);
  const readyEventHook = createEventHook();
  const errorEventHook = createEventHook();
  let hasTriggeredReady = false;
  const isInitialized = ref(false);
  const error = ref(null);
  const initializeRenderer = async () => {
    try {
      if (isRenderer(renderer)) await renderer.init();
      isInitialized.value = true;
    } catch (e) {
      const rendererError = new TresRendererError(e instanceof Error ? e.message : "Unknown error", "INITIALIZATION_FAILED", { cause: e instanceof Error ? e : void 0 });
      error.value = rendererError;
      console.error(`[TresJS] Renderer initialization failed. This may occur if:
  - WebGPU is not supported by your browser
  - GPU is not available or lacks required features
  - GPU drivers are outdated
Error details: ${rendererError.message}`, rendererError);
      errorEventHook.trigger(rendererError);
    }
  };
  const renderEventHook = createEventHook();
  const notifyFrameRendered = () => {
    frames.value = isModeAlways.value ? 1 : Math.max(0, frames.value - 1);
    renderEventHook.trigger(renderer);
  };
  let renderFunction = (_notifyFrameRendered) => {
    if (camera.activeCamera.value) {
      renderer.render(scene.value, camera.activeCamera.value);
      _notifyFrameRendered();
    }
  };
  const replaceRenderFunction = (fn) => {
    renderFunction = fn;
  };
  const loop = useCreateRafLoop(() => {
    if (frames.value) renderFunction(notifyFrameRendered);
  }, { fpsLimit });
  readyEventHook.on(() => {
    if (isInitialized.value) loop.start();
  });
  watch([
    sizes.width,
    sizes.height,
    isInitialized
  ], () => {
    if (!isInitialized.value) return;
    renderer.setSize(sizes.width.value, sizes.height.value);
    if (!hasTriggeredReady && renderer.domElement.width && renderer.domElement.height) {
      hasTriggeredReady = true;
      nextTick(() => {
        readyEventHook.trigger(renderer);
      });
    }
    invalidateOnDemand();
  }, { immediate: true });
  watchEffect(() => {
    if (!isInitialized.value) return;
    setPixelRatio(renderer, sizes.pixelRatio.value, toValue(options.dpr));
  });
  initializeRenderer();
  if (toValue(options.renderMode) === "on-demand") invalidate();
  if (toValue(options.renderMode) === "manual") useTimeout(100, { callback: advance });
  const clearColorAndAlpha = computed(() => {
    const clearColor = toValue(options.clearColor);
    const clearAlpha = toValue(options.clearAlpha);
    const isClearColorWithAlpha = typeof clearColor === "string" && clearColor.length === 9 && clearColor.startsWith("#");
    if (isClearColorWithAlpha && clearAlpha !== void 0) logWarning(`clearColor with alpha (e.g. ${clearColor}) and clearAlpha cannot both be set, using clearColor as source of truth`);
    if (isClearColorWithAlpha) return {
      alpha: Number.parseInt(clearColor.slice(7, 9), 16) / 255,
      color: clearColor.slice(0, 7)
    };
    return {
      alpha: clearAlpha,
      color: clearColor
    };
  });
  watchEffect(() => {
    if (!isInitialized.value) return;
    const value = clearColorAndAlpha.value;
    if (value.color === void 0 || value.alpha === void 0) return;
    renderer.setClearColor(value.color, value.alpha);
  });
  watchEffect(() => {
    if (!isInitialized.value) return;
    const value = options.toneMapping;
    if (value) renderer.toneMapping = value;
  });
  watchEffect(() => {
    if (!isInitialized.value) return;
    const value = options.toneMappingExposure;
    if (value) renderer.toneMappingExposure = value;
  });
  watchEffect(() => {
    if (!isInitialized.value) return;
    const value = options.outputColorSpace;
    if (value) renderer.outputColorSpace = value;
  });
  watchEffect(() => {
    if (!isInitialized.value) return;
    const value = options.shadows;
    if (value === void 0) return;
    renderer.shadowMap.enabled = value;
    forceMaterialUpdate();
  });
  watchEffect(() => {
    if (!isInitialized.value) return;
    const value = options.shadowMapType;
    if (value === void 0) return;
    renderer.shadowMap.type = value;
    forceMaterialUpdate();
  });
  return {
    loop,
    instance: renderer,
    advance,
    onReady: readyEventHook.on,
    onRender: renderEventHook.on,
    onError: errorEventHook.on,
    invalidate,
    canBeInvalidated,
    mode: toValue(options.renderMode),
    replaceRenderFunction,
    isInitialized,
    error
  };
}
function useSizes(windowSize, canvas, debounceMs = 10) {
  const { pixelRatio } = useDevicePixelRatio();
  const reactiveSize = toValue(windowSize) ? useWindowSize() : useElementSize(computed(() => toValue(canvas).parentElement));
  const debouncedReactiveWidth = readonly(refDebounced(reactiveSize.width, debounceMs));
  const debouncedReactiveHeight = readonly(refDebounced(reactiveSize.height, debounceMs));
  return {
    width: debouncedReactiveWidth,
    height: debouncedReactiveHeight,
    pixelRatio,
    aspectRatio: computed(() => debouncedReactiveWidth.value / debouncedReactiveHeight.value)
  };
}
function useEventManager({ canvas, contextParts: { scene, camera, renderer } }) {
  const { update, destroy } = forwardHtmlEvents(toValue(canvas), () => toValue(camera.activeCamera), scene.value);
  const { off } = renderer.loop.onLoop(update);
  const voidObject = getVoidObject(scene.value);
  const pointerMissedEventHook = createEventHook();
  voidObject.addEventListener("click", pointerMissedEventHook.trigger);
  return { onPointerMissed: pointerMissedEventHook.on };
}
const [useTresContextProvider, _useTresContext] = createInjectionState(({ scene, canvas, fpsLimit, windowSize, rendererOptions }) => {
  const localScene = shallowRef(scene);
  const sizes = useSizes(windowSize, canvas);
  const camera = useCameraManager({ sizes });
  const renderer = useRendererManager({
    scene: localScene,
    canvas,
    options: rendererOptions,
    fpsLimit,
    contextParts: {
      sizes,
      camera
    }
  });
  const events = useEventManager({
    canvas,
    contextParts: {
      scene: localScene,
      camera,
      renderer
    }
  });
  const ctx = {
    sizes,
    scene: localScene,
    camera,
    renderer,
    controls: ref(null),
    extend,
    events
  };
  ctx.scene.value.__tres = {
    root: ctx,
    objects: [],
    isUnmounting: false
  };
  return ctx;
}, { injectionKey: "useTres" });
const useTresContext = () => {
  const ctx = _useTresContext();
  if (!ctx) throw new Error("useTresContext must be used together with useTresContextProvider.\n You probably tried to use it above or on the same level as a TresCanvas component.\n It should be used in child components of a TresCanvas instance.");
  return ctx;
};
function useTres() {
  const { scene, renderer, camera, sizes, controls, extend: extend$1, events } = useTresContext();
  return {
    scene,
    renderer: renderer.instance,
    camera: camera.activeCamera,
    sizes,
    controls,
    extend: extend$1,
    events,
    invalidate: renderer.invalidate,
    advance: renderer.advance
  };
}
const useLoop = () => {
  const tresContext = useTres();
  const { renderer: rendererManager } = useTresContext();
  const eventHookBeforeRender = createPriorityEventHook();
  const eventHookAfterRender = createPriorityEventHook();
  rendererManager.loop.onBeforeLoop((loopContext) => {
    eventHookBeforeRender.trigger({
      ...tresContext,
      ...loopContext
    });
  });
  rendererManager.loop.onLoop((loopContext) => {
    eventHookAfterRender.trigger({
      ...tresContext,
      ...loopContext
    });
  });
  const render = rendererManager.replaceRenderFunction;
  return {
    stop: rendererManager.loop.stop,
    start: rendererManager.loop.start,
    isActive: rendererManager.loop.isActive,
    onBeforeRender: eventHookBeforeRender.on,
    onRender: eventHookAfterRender.on,
    render
  };
};
defineComponent({
  name: "GlobalAudio",
  props: [
    "src",
    "loop",
    "volume",
    "playbackRate",
    "playTrigger",
    "stopTrigger"
  ],
  async setup(props, { expose, emit }) {
    const { camera, renderer } = useTresContext();
    const listener = new AudioListener();
    camera.activeCamera.value?.add(listener);
    const sound = new Audio(listener);
    const audioLoader = new AudioLoader();
    expose({ instance: sound });
    watch(() => [props.playbackRate], () => sound.setPlaybackRate(props.playbackRate ?? 1), { immediate: true });
    watch(() => [props.volume], () => sound.setVolume(props.volume ?? 0.5), { immediate: true });
    watch(() => [props.loop], () => sound.setLoop(props.loop ?? false), { immediate: true });
    watch(() => [props.src], async () => {
      const buffer = await audioLoader.loadAsync(props.src);
      sound.setBuffer(buffer);
    }, { immediate: true });
    useEventListener((void 0).getElementById(props.playTrigger ?? "") || renderer.instance.domElement, "click", () => {
      if (sound.isPlaying) sound.pause();
      else sound.play();
      emit("isPlaying", sound.isPlaying);
    });
    const btnStop = (void 0).getElementById(props.stopTrigger ?? "");
    if (btnStop) useEventListener(btnStop, "click", () => {
      sound.stop();
      emit("isPlaying", sound.isPlaying);
    });
    return null;
  }
});
function shaderMaterial(uniforms, vertexShader, fragmentShader, onInit) {
  const material = class extends ShaderMaterial {
    key = "";
    constructor(parameters = {}) {
      const entries = Object.entries(uniforms);
      super({
        uniforms: entries.reduce((acc, [name, value]) => {
          const uniform = UniformsUtils.clone({ [name]: { value } });
          return {
            ...acc,
            ...uniform
          };
        }, {}),
        vertexShader,
        fragmentShader
      });
      entries.forEach(([name]) => Object.defineProperty(this, name, {
        get: () => this.uniforms[name].value,
        set: (v) => this.uniforms[name].value = v
      }));
      Object.assign(this, parameters);
    }
  };
  material.key = MathUtils.generateUUID();
  return material;
}
function useTexture(path) {
  return useLoader(TextureLoader, path, { initialValue: new Texture() });
}
(function() {
  const geometry = new BufferGeometry();
  const interleavedBuffer = new InterleavedBuffer(new Float32Array([
    -1,
    -1,
    0,
    0,
    0,
    1,
    -1,
    0,
    1,
    0,
    1,
    1,
    0,
    1,
    1,
    -1,
    1,
    0,
    0,
    1
  ]), 5);
  geometry.setIndex([
    0,
    1,
    2,
    0,
    2,
    3
  ]);
  geometry.setAttribute("position", new InterleavedBufferAttribute(interleavedBuffer, 3, 0, false));
  geometry.setAttribute("uv", new InterleavedBufferAttribute(interleavedBuffer, 2, 3, false));
  return geometry;
})();
MathUtils.clamp;
MathUtils.lerp;
/* @__PURE__ */ shaderMaterial({
  screenspace: false,
  color: new Color("black"),
  opacity: 1,
  thickness: 0.05,
  size: new Vector2(1, 1)
}, `#include <common>
   #include <morphtarget_pars_vertex>
   #include <skinning_pars_vertex>
   uniform float thickness;
   uniform bool screenspace;
   uniform vec2 size;
   void main() {
     #if defined (USE_SKINNING)
       #include <beginnormal_vertex>
       #include <morphnormal_vertex>
       #include <skinbase_vertex>
       #include <skinnormal_vertex>
       #include <defaultnormal_vertex>
     #endif
     #include <begin_vertex>
     #include <morphtarget_vertex>
     #include <skinning_vertex>
     #include <project_vertex>
     vec4 tNormal = vec4(normal, 0.0);
     vec4 tPosition = vec4(transformed, 1.0);
     #ifdef USE_INSTANCING
       tNormal = instanceMatrix * tNormal;
       tPosition = instanceMatrix * tPosition;
     #endif
     if (screenspace) {
       vec3 newPosition = tPosition.xyz + tNormal.xyz * thickness;
       gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
     } else {
       vec4 clipPosition = projectionMatrix * modelViewMatrix * tPosition;
       vec4 clipNormal = projectionMatrix * modelViewMatrix * tNormal;
       vec2 offset = normalize(clipNormal.xy) * thickness / size * clipPosition.w * 2.0;
       clipPosition.xy += offset;
       gl_Position = clipPosition;
     }
   }`, `uniform vec3 color;
   uniform float opacity;
   void main(){
     gl_FragColor = vec4(color, opacity);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
   }`);
const _hoisted_1$50 = ["args", "material-uniforms-color-value"];
/* @__PURE__ */ defineComponent({
  __name: "Reflector",
  props: {
    color: {
      type: null,
      required: false,
      default: "#333"
    },
    textureWidth: {
      type: Number,
      required: false,
      default: 512
    },
    textureHeight: {
      type: Number,
      required: false,
      default: 512
    },
    clipBias: {
      type: Number,
      required: false,
      default: 0
    },
    multisample: {
      type: Number,
      required: false,
      default: 4
    },
    shader: {
      type: Object,
      required: false,
      default: Reflector.ReflectorShader
    }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const { extend: extend$1, invalidate } = useTres();
    const reflectorRef = shallowRef();
    extend$1({ Reflector });
    const { color, textureWidth, textureHeight, clipBias, multisample, shader } = toRefs(props);
    const colorValue = computed(() => new Color(color.value));
    watch(props, () => {
      invalidate();
    });
    __expose({ instance: reflectorRef });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("TresReflector", {
        ref_key: "reflectorRef",
        ref: reflectorRef,
        args: [void 0, {
          textureWidth: unref(textureWidth),
          textureHeight: unref(textureHeight),
          clipBias: unref(clipBias),
          multisample: unref(multisample),
          shader: unref(shader)
        }],
        "material-uniforms-color-value": colorValue.value
      }, [renderSlot(_ctx.$slots, "default", {}, () => [_cache[0] || (_cache[0] = createElementVNode("TresPlaneGeometry", { args: [5, 5] }, null, -1))])], 8, _hoisted_1$50);
    };
  }
});
new THREE.Vector3();
new THREE.Vector3();
new THREE.Vector3();
const environmentPresets = {
  sunset: "venice/venice_sunset_1k.hdr",
  studio: "studio/poly_haven_studio_1k.hdr",
  city: "city/canary_wharf_1k.hdr",
  umbrellas: "outdoor/outdoor_umbrellas_1k.hdr",
  night: "outdoor/satara_night_1k.hdr",
  forest: "outood/mossy_forest_1k.hdr",
  snow: "outdoor/snowy_forest_path_01_1k.hdr",
  dawn: "kiara/kiara_1_dawn_1k.hdr",
  hangar: "indoor/small_hangar_01_1k.hdr",
  urban: "indoor/abandoned_games_room_02_1k.hdr",
  modern: "city/modern_buildings_2_1k.hdr",
  shangai: "city/shanghai_bund_1k.hdr"
};
const PRESET_ROOT = "https://raw.githubusercontent.com/Tresjs/assets/main/textures/hdr/";
function toEuler(value) {
  if (value instanceof Euler) return value;
  if (Array.isArray(value)) return new Euler(value[0], value[1], value[2]);
  if (typeof value === "number") return new Euler(value, value, value);
  if (value instanceof Vector3) return new Euler(value.x, value.y, value.z);
  if (typeof value === "object" && "x" in value && "y" in value && "z" in value) return new Euler(value.x, value.y, value.z);
  return null;
}
function updateMaterials(scene) {
  scene.traverse((child) => {
    if (child instanceof Mesh && child.material) child.material.needsUpdate = true;
  });
}
async function useEnvironment(options, fbo) {
  const { scene, invalidate } = useTres();
  const { preset, blur, files = ref([]), path = ref(""), background, backgroundIntensity = ref(1), environmentIntensity = ref(1), backgroundRotation = ref([
    0,
    0,
    0
  ]), environmentRotation = ref([
    0,
    0,
    0
  ]), syncMaterials = ref(false) } = toRefs(options);
  watch(options, () => {
    invalidate();
  });
  const texture$1 = ref(null);
  const isCubeMap = computed(() => Array.isArray(files.value));
  const cubeTextureLoader = new CubeTextureLoader();
  const rgbeLoader = new RGBELoader();
  const loadTexture = async (files$1, path$1) => {
    return new Promise((resolve, reject) => {
      if (isCubeMap.value) {
        if (path$1) cubeTextureLoader.setPath(path$1);
        cubeTextureLoader.load(files$1, (texture$2) => {
          texture$2.mapping = CubeReflectionMapping;
          resolve(texture$2);
        }, void 0, (error) => reject(error));
      } else {
        if (path$1) rgbeLoader.setPath(path$1);
        rgbeLoader.load(files$1[0], (texture$2) => {
          texture$2.mapping = EquirectangularReflectionMapping;
          resolve(texture$2);
        }, void 0, (error) => reject(error));
      }
    });
  };
  watch([files, path], async ([files$1, path$1]) => {
    if (!files$1 || files$1.length === 0 || preset?.value) return;
    try {
      texture$1.value = await loadTexture(isCubeMap.value ? [...unref(files$1)] : [unref(files$1)], unref(path$1));
    } catch (error) {
      throw new Error(`Failed to load environment map: ${error}`);
    }
  }, { immediate: true });
  watch(texture$1, (value) => {
    if (scene.value && value) scene.value.environment = value;
  }, { immediate: true });
  watch([background, texture$1], ([background$1, texture$2]) => {
    if (scene.value) {
      const bTexture = fbo?.value ? fbo.value.texture : texture$2;
      if (bTexture) scene.value.background = background$1 ? bTexture : null;
    }
  }, { immediate: true });
  watch(() => blur?.value, (value) => {
    if (scene.value && value) scene.value.backgroundBlurriness = value;
  }, { immediate: true });
  watch(() => backgroundIntensity?.value, (value) => {
    if (scene.value) scene.value.backgroundIntensity = value ?? 1;
  }, { immediate: true });
  watch(() => environmentIntensity?.value, (value) => {
    if (scene.value) scene.value.environmentIntensity = value ?? 1;
  }, { immediate: true });
  watch(() => backgroundRotation?.value, (value) => {
    if (scene.value) {
      const euler = toEuler(value);
      if (euler) scene.value.backgroundRotation = euler;
    }
  }, { immediate: true });
  watch(() => environmentRotation?.value, (value) => {
    if (scene.value && !syncMaterials?.value) {
      const euler = toEuler(value);
      if (euler) {
        scene.value.environmentRotation = euler;
        updateMaterials(scene.value);
      }
    }
  }, { immediate: true });
  watch(() => preset?.value, async (value) => {
    if (value && value in environmentPresets) {
      const _path = PRESET_ROOT;
      const _files = environmentPresets[value];
      try {
        rgbeLoader.setPath(_path);
        texture$1.value = await new Promise((resolve, reject) => {
          rgbeLoader.load(_files, (texture$2) => {
            texture$2.mapping = EquirectangularReflectionMapping;
            resolve(texture$2);
          }, void 0, (error) => reject(error));
        });
        invalidate();
      } catch (error) {
        throw new Error(`Failed to load environment map: ${error}`);
      }
      if (texture$1.value) texture$1.value.mapping = EquirectangularReflectionMapping;
      invalidate();
    } else if (value && !(value in environmentPresets)) throw new Error(`Preset must be one of: ${Object.keys(environmentPresets).join(", ")}`);
  }, { immediate: true });
  watch([syncMaterials, backgroundRotation], ([sync, bgRotation]) => {
    if (sync && scene.value) {
      const euler = toEuler(bgRotation);
      if (euler) {
        scene.value.environmentRotation = euler;
        updateMaterials(scene.value);
      }
    }
  }, { immediate: true });
  return texture$1;
}
const ORBIT_LIKE_DEFAULTS = {
  makeDefault: false,
  autoRotate: false,
  autoRotateSpeed: 2,
  enableDamping: true,
  dampingFactor: 0.05,
  enablePan: true,
  keyPanSpeed: 7,
  maxAzimuthAngle: Number.POSITIVE_INFINITY,
  minAzimuthAngle: Number.NEGATIVE_INFINITY,
  maxPolarAngle: Math.PI,
  minPolarAngle: 0,
  minDistance: 0,
  maxDistance: Number.POSITIVE_INFINITY,
  minZoom: 0,
  maxZoom: Number.POSITIVE_INFINITY,
  enableZoom: true,
  zoomSpeed: 1,
  enableRotate: true,
  rotateSpeed: 1,
  target: () => [
    0,
    0,
    0
  ]
};
function useOrbitLikeControls(controlsRef, props, emit) {
  const { controls, invalidate } = useTres();
  watch(props, () => {
    invalidate();
  });
  whenever(controlsRef, (value) => {
    value.addEventListener("change", () => {
      invalidate();
      if (value) emit("change", controlsRef.value);
    });
    value.addEventListener("start", () => {
      controlsRef.value && emit("start", controlsRef.value);
    });
    value.addEventListener("end", () => {
      controlsRef.value && emit("end", controlsRef.value);
    });
    if (props.makeDefault) controls.value = value;
    else controls.value = null;
  }, { once: true });
  const { onBeforeRender } = useLoop();
  onBeforeRender(() => {
    if (controlsRef.value && controlsRef.value.enabled && (props.enableDamping || props.autoRotate)) controlsRef.value.update();
  });
}
const _hoisted_1$44 = [
  "args",
  "target",
  "auto-rotate",
  "auto-rotate-speed",
  "enable-damping",
  "damping-factor",
  "enable-pan",
  "key-pan-speed",
  "keys",
  "max-azimuth-angle",
  "min-azimuth-angle",
  "max-polar-angle",
  "min-polar-angle",
  "min-distance",
  "max-distance",
  "min-zoom",
  "max-zoom",
  "touches",
  "enable-zoom",
  "zoom-speed",
  "enable-rotate",
  "rotate-speed",
  "mouse-buttons",
  "screen-space-panning"
];
var OrbitControls_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "OrbitControls",
  props: /* @__PURE__ */ mergeDefaults({
    mouseButtons: {
      type: Object,
      required: false
    },
    makeDefault: {
      type: Boolean,
      required: false
    },
    camera: {
      type: Object,
      required: false
    },
    domElement: {
      type: null,
      required: false
    },
    target: {
      type: null,
      required: false
    },
    enableDamping: {
      type: Boolean,
      required: false
    },
    dampingFactor: {
      type: Number,
      required: false
    },
    autoRotate: {
      type: Boolean,
      required: false
    },
    autoRotateSpeed: {
      type: Number,
      required: false
    },
    enablePan: {
      type: Boolean,
      required: false
    },
    keyPanSpeed: {
      type: Number,
      required: false
    },
    keys: {
      type: Object,
      required: false
    },
    maxAzimuthAngle: {
      type: Number,
      required: false
    },
    minAzimuthAngle: {
      type: Number,
      required: false
    },
    maxPolarAngle: {
      type: Number,
      required: false
    },
    minPolarAngle: {
      type: Number,
      required: false
    },
    minDistance: {
      type: Number,
      required: false
    },
    maxDistance: {
      type: Number,
      required: false
    },
    minZoom: {
      type: Number,
      required: false
    },
    maxZoom: {
      type: Number,
      required: false
    },
    touches: {
      type: Object,
      required: false
    },
    enableZoom: {
      type: Boolean,
      required: false
    },
    zoomSpeed: {
      type: Number,
      required: false
    },
    enableRotate: {
      type: Boolean,
      required: false
    },
    rotateSpeed: {
      type: Number,
      required: false
    },
    screenSpacePanning: {
      type: Boolean,
      required: false
    }
  }, {
    ...ORBIT_LIKE_DEFAULTS,
    touches: () => ({
      ONE: TOUCH.ROTATE,
      TWO: TOUCH.DOLLY_PAN
    }),
    mouseButtons: () => ({
      LEFT: MOUSE.ROTATE,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.PAN
    }),
    screenSpacePanning: true
  }),
  emits: [
    "change",
    "start",
    "end"
  ],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { camera: activeCamera, renderer, extend: extend$1 } = useTres();
    const controlsRef = shallowRef(null);
    extend$1({ OrbitControls });
    useOrbitLikeControls(controlsRef, props, emit);
    __expose({ instance: controlsRef });
    return (_ctx, _cache) => {
      return (__props.camera || unref(activeCamera)) && (__props.domElement || unref(renderer).domElement) ? (openBlock(), createElementBlock("TresOrbitControls", {
        ref_key: "controlsRef",
        ref: controlsRef,
        key: (__props.camera || unref(activeCamera))?.uuid,
        args: [__props.camera || unref(activeCamera), __props.domElement || unref(renderer).domElement],
        target: __props.target,
        "auto-rotate": __props.autoRotate,
        "auto-rotate-speed": __props.autoRotateSpeed,
        "enable-damping": __props.enableDamping,
        "damping-factor": __props.dampingFactor,
        "enable-pan": __props.enablePan,
        "key-pan-speed": __props.keyPanSpeed,
        keys: __props.keys,
        "max-azimuth-angle": __props.maxAzimuthAngle,
        "min-azimuth-angle": __props.minAzimuthAngle,
        "max-polar-angle": __props.maxPolarAngle,
        "min-polar-angle": __props.minPolarAngle,
        "min-distance": __props.minDistance,
        "max-distance": __props.maxDistance,
        "min-zoom": __props.minZoom,
        "max-zoom": __props.maxZoom,
        touches: __props.touches,
        "enable-zoom": __props.enableZoom,
        "zoom-speed": __props.zoomSpeed,
        "enable-rotate": __props.enableRotate,
        "rotate-speed": __props.rotateSpeed,
        "mouse-buttons": __props.mouseButtons,
        "screen-space-panning": __props.screenSpacePanning
      }, null, 8, _hoisted_1$44)) : createCommentVNode("v-if", true);
    };
  }
});
var OrbitControls_default = OrbitControls_vue_vue_type_script_setup_true_lang_default;
function useGLTF(path, options) {
  const useLoaderOptions = {};
  const result = useLoader(GLTFLoader, path, useLoaderOptions);
  const nodes = computed(() => {
    return result.state.value?.scene ? buildGraph(result.state.value?.scene).nodes : {};
  });
  const materials = computed(() => {
    return result.state.value?.scene ? buildGraph(result.state.value?.scene).materials : {};
  });
  return {
    ...result,
    nodes,
    materials
  };
}
defineComponent({
  name: "BakeShadows",
  setup() {
    const { renderer } = useTres();
    watchEffect(() => {
      if (renderer instanceof WebGLRenderer) {
        renderer.shadowMap.autoUpdate = false;
        renderer.shadowMap.needsUpdate = true;
      }
    });
  }
});
new Vector3(0, 0, 0);
new Vector3(0, 0, 0);
new Vector3(0, 0, 0);
defineComponent({
  name: "Stats",
  props: { showPanel: {
    type: Number,
    default: 0
  } },
  setup(props, { expose }) {
    const stats = new StatsImpl();
    expose({ instance: stats });
    const node = (void 0).body;
    stats.showPanel(props.showPanel || 0);
    node?.appendChild(stats.dom);
    const { onBeforeRender, onRender } = useLoop();
    onBeforeRender(() => stats.begin(), Number.NEGATIVE_INFINITY);
    onRender(() => stats.end(), Number.POSITIVE_INFINITY);
  }
});
defineComponent({
  name: "StatsGl",
  props: [
    "logsPerSecond",
    "samplesLog",
    "samplesGraph",
    "precision",
    "horizontal",
    "minimal",
    "mode"
  ],
  setup(props, { expose }) {
    const statsGl = new StatsGlImpl({
      logsPerSecond: props.logsPerSecond,
      samplesLog: props.samplesLog,
      samplesGraph: props.samplesGraph,
      precision: props.precision,
      horizontal: props.horizontal,
      minimal: props.minimal,
      mode: props.mode
    });
    expose({ instance: statsGl });
    const node = (void 0).body;
    const statContainer = statsGl.container;
    node?.appendChild(statContainer);
    const { renderer } = useTresContext();
    const { onRender } = useLoop();
    statsGl.init(renderer.instance);
    onRender(() => statsGl.update(), Number.POSITIVE_INFINITY);
  }
});
/* @__PURE__ */ shaderMaterial({
  color: new Color(),
  blend: 2,
  alphaTest: 0.75,
  opacity: 0,
  map: null
}, `varying vec2 vUv;
   void main() {
     gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
     vUv = uv;
   }`, `varying vec2 vUv;
   uniform sampler2D map;
   uniform vec3 color;
   uniform float opacity;
   uniform float alphaTest;
   uniform float blend;
   void main() {
     vec4 sampledDiffuseColor = texture2D(map, vUv);
     gl_FragColor = vec4(color * sampledDiffuseColor.r * blend, max(0.0, (1.0 - (sampledDiffuseColor.r + sampledDiffuseColor.g + sampledDiffuseColor.b) / alphaTest)) * opacity);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
   }`);
var EnvironmentScene = class extends Object3D {
  virtualScene = null;
  constructor() {
    super();
    this.virtualScene = new Scene();
  }
  add(...object) {
    for (const obj of object) this.virtualScene.add(obj);
    return this;
  }
  dispose() {
    this.virtualScene.traverse((object) => {
      if (object instanceof Mesh) {
        object.geometry.dispose();
        object.material.dispose();
        if (object.material.map) object.material.map.dispose();
        this.virtualScene.remove(object);
      }
    });
    this.virtualScene = null;
  }
};
var EnvironmentScene_default = EnvironmentScene;
var component_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
  __name: "component",
  props: {
    background: {
      type: [Boolean, String],
      required: false,
      default: false
    },
    blur: {
      type: Number,
      required: false,
      default: 0
    },
    files: {
      type: [String, Array],
      required: false,
      default: () => []
    },
    path: {
      type: String,
      required: false,
      default: ""
    },
    preset: {
      type: null,
      required: false,
      default: void 0
    },
    resolution: {
      type: Number,
      required: false,
      default: 256
    },
    near: {
      type: Number,
      required: false,
      default: 1
    },
    far: {
      type: Number,
      required: false,
      default: 1e3
    },
    frames: {
      type: Number,
      required: false,
      default: Number.POSITIVE_INFINITY
    },
    backgroundIntensity: {
      type: Number,
      required: false,
      default: 1
    },
    backgroundRotation: {
      type: [
        Object,
        Array,
        Number
      ],
      required: false
    },
    environmentIntensity: {
      type: Number,
      required: false,
      default: 1
    },
    environmentRotation: {
      type: [
        Object,
        Array,
        Number
      ],
      required: false
    },
    syncMaterials: {
      type: Boolean,
      required: false
    }
  },
  async setup(__props, { expose: __expose }) {
    let __temp, __restore;
    const props = __props;
    const texture$1 = ref(null);
    __expose({ texture: texture$1 });
    const { extend: extend$1, renderer, scene } = useTresContext();
    extend$1({ EnvironmentScene: EnvironmentScene_default });
    let slots = null;
    const fbo = ref(null);
    let cubeCamera = null;
    const environmentScene = ref(null);
    const useEnvironmentTexture = ([__temp, __restore] = withAsyncContext(() => useEnvironment(props, fbo)), __temp = await __temp, __restore(), __temp);
    const { onBeforeRender } = useLoop();
    let count = 1;
    onBeforeRender(() => {
      if (cubeCamera && environmentScene.value && fbo.value) {
        if (props.frames === Number.POSITIVE_INFINITY || count < props.frames) {
          const autoClear = renderer.instance.autoClear;
          renderer.instance.autoClear = true;
          const rawScene = toRaw(environmentScene.value).virtualScene;
          cubeCamera.update(renderer.instance, rawScene);
          renderer.instance.autoClear = autoClear;
          count++;
        }
      }
    }, -1);
    watch([useEnvironmentTexture, environmentScene], ([texture$2, scene$1]) => {
      if (texture$2 && scene$1?.virtualScene) {
        const rawScene = toRaw(scene$1).virtualScene;
        let envMesh = rawScene.children.find((child) => child instanceof Mesh && child.userData.isEnvironment);
        if (!envMesh) {
          envMesh = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ side: BackSide }));
          envMesh.userData.isEnvironment = true;
          rawScene.add(envMesh);
        }
        rawScene.background = texture$2;
        rawScene.backgroundBlurriness = props.blur;
      }
    }, { immediate: true });
    const setTextureEnvAndBG = (fbo$1) => {
      if (fbo$1 && slots?.length) {
        scene.value.environment = fbo$1.texture;
        if (props.background) scene.value.background = fbo$1.texture;
      } else if (useEnvironmentTexture.value) {
        scene.value.environment = useEnvironmentTexture.value;
        if (props.background) scene.value.background = useEnvironmentTexture.value;
      }
    };
    watch(useEnvironmentTexture, () => {
      if (fbo.value) setTextureEnvAndBG(fbo.value);
    }, {
      immediate: true,
      deep: true
    });
    watch(() => useSlots().default, (value) => {
      if (value) {
        slots = value();
        if (Array.isArray(slots) && slots.length > 0) {
          extend$1({ EnvironmentScene: EnvironmentScene_default });
          fbo.value = new WebGLCubeRenderTarget(props.resolution);
          fbo.value.texture.type = HalfFloatType;
          cubeCamera = new CubeCamera(props.near, props.far, fbo.value);
          setTextureEnvAndBG(fbo.value);
          return;
        }
      }
      fbo.value?.dispose();
      fbo.value = null;
      setTextureEnvAndBG();
    }, {
      immediate: true,
      deep: true
    });
    texture$1.value = useEnvironmentTexture.value;
    return (_ctx, _cache) => {
      return fbo.value ? (openBlock(), createElementBlock("TresEnvironmentScene", {
        key: 0,
        ref_key: "environmentScene",
        ref: environmentScene
      }, [renderSlot(_ctx.$slots, "default")], 512)) : createCommentVNode("v-if", true);
    };
  }
});
var component_default$4 = component_vue_vue_type_script_setup_true_lang_default;
const _hoisted_1 = {
  key: 0,
  args: [
    0,
    1,
    64
  ]
};
const _hoisted_2 = {
  key: 1,
  args: [
    0.5,
    1,
    64
  ]
};
const _hoisted_3 = { key: 2 };
const _hoisted_4 = [
  "tone-mapped",
  "map",
  "side",
  "color"
];
/* @__PURE__ */ defineComponent({
  __name: "index",
  props: {
    args: {
      type: Array,
      required: false,
      default: null
    },
    form: {
      type: null,
      required: false,
      default: "rect"
    },
    toneMapped: {
      type: Boolean,
      required: false,
      default: false
    },
    map: {
      type: Object,
      required: false,
      default: null
    },
    intensity: {
      type: Number,
      required: false,
      default: 1
    },
    color: {
      type: null,
      required: false,
      default: new Color(16777215)
    }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const material = ref();
    const mesh = ref();
    watchEffect(() => {
      if (material.value) {
        material.value.color.copy(new Color(props.color));
        material.value.color.multiplyScalar(props.intensity);
        material.value.needsUpdate = true;
      }
    });
    __expose({ mesh });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("TresMesh", {
        ref_key: "mesh",
        ref: mesh
      }, [__props.form === "circle" ? (openBlock(), createElementBlock("TresRingGeometry", _hoisted_1)) : __props.form === "ring" ? (openBlock(), createElementBlock("TresRingGeometry", _hoisted_2)) : __props.form === "rect" ? (openBlock(), createElementBlock("TresPlaneGeometry", _hoisted_3)) : (openBlock(), createBlock(props.form, {
        key: 3,
        args: __props.args
      }, null, 8, ["args"])), createElementVNode("TresMeshBasicMaterial", {
        ref_key: "material",
        ref: material,
        "tone-mapped": __props.toneMapped,
        map: __props.map,
        side: unref(DoubleSide),
        color: __props.color
      }, null, 8, _hoisted_4)], 512);
    };
  }
});

export { OrbitControls_default as O, useTexture as a, useLoop as b, component_default$4 as c, useGLTF as u };
//# sourceMappingURL=trescientos-BWS9yc8F.mjs.map
