// src/shaders/HolographicMaterial.jsx

import { useRef, useMemo } from 'react'
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import {
  Color,
  FrontSide,
  BackSide,
  DoubleSide,
  AdditiveBlending,
  NormalBlending
} from 'three'

// 1) Define the underlying shader material class:
const HolographicMaterialImpl = shaderMaterial(
  {
    time: 0,
    fresnelOpacity: 1.0,
    fresnelAmount: 0.45,
    scanlineSize: 8.0,
    hologramBrightness: 1.2,
    signalSpeed: 0.45,
    hologramColor: new Color('#51a4de'),
    enableBlinking: true,
    blinkFresnelOnly: true,
    hologramOpacity: 1.0
  },
  // vertex shader
  `
    #define STANDARD
    varying vec2 vUv;
    varying vec4 vPos;
    varying vec3 vNormalW;
    varying vec3 vPositionW;

    #include <common>
    #include <uv_pars_vertex>
    #include <fog_pars_vertex>
    #include <clipping_planes_pars_vertex>

    void main() {
      #include <uv_vertex>
      #include <begin_vertex>
      #include <project_vertex>
      #include <worldpos_vertex>
      vUv = uv;
      vPos = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      vPositionW = (modelMatrix * vec4(transformed, 1.0)).xyz;
      vNormalW = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      gl_Position = vPos;
    }
  `,
  // fragment shader
  `
    varying vec2 vUv;
    varying vec4 vPos;
    varying vec3 vNormalW;
    varying vec3 vPositionW;

    uniform float time;
    uniform float fresnelOpacity;
    uniform float scanlineSize;
    uniform float fresnelAmount;
    uniform float signalSpeed;
    uniform float hologramBrightness;
    uniform float hologramOpacity;
    uniform bool blinkFresnelOnly;
    uniform bool enableBlinking;
    uniform vec3 hologramColor;

    float flicker(float amt, float t) {
      return clamp(fract(cos(t) * 43758.5453), amt, 1.0);
    }

    void main() {
      // Normalize coords
      vec2 uv = vPos.xy / vPos.w * 0.5 + 0.5;
      // Base hologram color with brightness fading toward bottom
      vec4 holo = vec4(hologramColor, mix(hologramBrightness, vUv.y, 0.5));

      // Simple scanline effect
      float scan = sin(time * signalSpeed * 20.0 - uv.y * scanlineSize);
      holo.rgb += holo.rgb * scan * 0.05;

      // Fresnel rim effect
      vec3 viewDir = normalize(cameraPosition - vPositionW);
      float fres = clamp(fresnelAmount - dot(viewDir, vNormalW), 0.0, fresnelOpacity);

      // Optional blink/flicker
      float blink = enableBlinking
        ? flicker(0.6 - signalSpeed, time * signalSpeed * 0.02)
        : 1.0;

      // Combine scanlines and rim
      vec3 finalColor = blinkFresnelOnly
        ? holo.rgb + fres * blink
        : holo.rgb * blink + fres;

      gl_FragColor = vec4(finalColor, hologramOpacity);
    }
  `
)

// 2) Register the shader under the tag name <holographicMaterial />
extend({ holographicMaterial: HolographicMaterialImpl })

// 3) Export a hook to create & animate a single instance
export function useHolographicMaterial(overrides = {}) {
  const ref = useRef()
  const material = useMemo(() => new HolographicMaterialImpl(), [])
  // Apply any override props (e.g. hologramColor, scanlineSize, etc.)
  Object.assign(material, overrides)

  // Animate the `time` uniform each frame
  useFrame((_, delta) => {
    if (ref.current) ref.current.time += delta
  })

  return { material, ref }
}