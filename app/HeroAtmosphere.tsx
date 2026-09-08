"use client";

import { useEffect, useRef } from "react";

// Animate the supplied environment in image coordinates, so the shoreline and
// planet stay registered with the photograph at every viewport and crop.
const vertexSource = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const fragmentSource = `
precision highp float;
uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform vec2 u_imageSize;
uniform vec2 u_position;
uniform float u_time;
uniform float u_motion;

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  vec4 h = fract(sin(vec4(dot(i, vec2(127.1,311.7)),
    dot(i + vec2(1.,0.), vec2(127.1,311.7)),
    dot(i + vec2(0.,1.), vec2(127.1,311.7)),
    dot(i + vec2(1.,1.), vec2(127.1,311.7)))) * 43758.5453);
  return mix(mix(h.x,h.y,f.x),mix(h.z,h.w,f.x),f.y);
}

float waterMask(vec2 uv) {
  // Shoreline and foreground silhouettes measured from the supplied plate.
  float shore = 0.734;
  shore = mix(shore, 0.782, smoothstep(0.31,0.48,uv.x));
  shore = mix(shore, 0.832, smoothstep(0.65,0.76,uv.x));
  shore = mix(shore, 0.96, smoothstep(0.76,0.98,uv.x));
  float water = smoothstep(shore, shore + 0.014, uv.y);
  float frontLeft = smoothstep(0.80,0.98,uv.y) * (1.0-smoothstep(0.12,0.36,uv.x));
  float frontRight = smoothstep(0.86,0.96,uv.y) * smoothstep(0.57,0.72,uv.x);
  return water * (1.0-frontLeft) * (1.0-frontRight);
}

void main() {
  vec2 screen = vec2(gl_FragCoord.x, u_resolution.y-gl_FragCoord.y);
  float fit = max(u_resolution.x/u_imageSize.x, u_resolution.y/u_imageSize.y);
  vec2 extent = u_imageSize * fit;
  vec2 uv = (screen + (extent-u_resolution)*u_position) / extent;
  float t = u_time;
  float water = waterMask(uv) * u_motion;
  float depth = smoothstep(0.73,1.0,uv.y);

  // Two small irregular displacement fields refract the existing reflections.
  // There are no drawn horizontal strokes or synthetic light trails.
  float wave = sin(uv.y*330.0 + sin(uv.x*27.0+t*.55)*2.2 - t*1.65);
  float eddy = noise(vec2(uv.x*32.0+t*.17, uv.y*135.0-t*.32))-.5;
  float swell = sin(uv.y*74.0+uv.x*16.0-t*.85);
  vec2 offset = vec2((wave*.75+eddy*.65+swell*.35)*(.0014+depth*.0038),
    sin(uv.x*64.0+uv.y*48.0+t*1.25)*(.0009+depth*.0015));
  vec3 color = texture2D(u_image, uv + offset*water).rgb;

  // Broken, short specular glints occur only in illuminated water pixels.
  float reflection = smoothstep(.06,.33,dot(color,vec3(.24,.40,.36)));
  float facets = noise(vec2(uv.x*105.0+t*.22, uv.y*480.0-t*.70));
  float glint = pow(smoothstep(.48,.94,facets),3.0);
  float flicker = .5+.5*sin(t*1.8+uv.x*23.0+uv.y*55.0);
  color *= 1.0 + water*reflection*((facets-.45)*.75+swell*.20);
  color += water * reflection * glint * (.24+.34*flicker) * vec3(.65,.67,1.0);

  // The planet's measured arc is lit with a slow breathing halo and a broad
  // travelling highlight; brightness masking prevents illumination of rocks.
  vec2 p = uv*u_imageSize;
  vec2 fromCenter = p-vec2(1748.45,967.14);
  float edge = abs(length(fromCenter)-1012.14);
  float sky = 1.0-smoothstep(565.0,610.0,p.y);
  float lit = smoothstep(.08,.38,max(color.r,max(color.g,color.b)));
  float breathe = pow(.5+.5*sin(t*1.12),1.25);
  float travel = .5+.5*sin(atan(fromCenter.y,fromCenter.x)*7.0+t*.65);
  float arc = exp(-edge*edge/1500.0)*sky;
  // Dim the existing baked highlight during the low phase as well as adding
  // bloom at the peak, so the breath remains visible against the bright plate.
  color *= 1.0 + arc*lit*u_motion*(-.38+.60*breathe);
  float halo = exp(-edge*edge/3600.0)*.22;
  float rim = exp(-edge*edge/120.0)*.40;
  color += (halo+rim)*sky*(.35+.65*lit)*(.10+.90*breathe+.16*travel)*u_motion*vec3(.61,.40,1.0);
  gl_FragColor = vec4(color,1.0);
}
`;

export default function HeroAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) return; // CSS keeps the original image visible on unsupported GPUs.

    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("Environment shader:", gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      shaders.forEach(shader => gl.deleteShader(shader));
      if (program) gl.deleteProgram(program);
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach(shader => gl.deleteShader(shader));
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(program, "u_image"), 0);
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const imageSize = gl.getUniformLocation(program, "u_imageSize");
    const imagePosition = gl.getUniformLocation(program, "u_position");
    const time = gl.getUniformLocation(program, "u_time");
    const motion = gl.getUniformLocation(program, "u_motion");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 820px)");
    const image = new Image();
    let disposed = false, ready = false, visible = true, raf = 0, lastFrame = 0;

    const render = (now: number) => {
      if (disposed || !ready || gl.isContextLost()) return;
      gl.uniform1f(time, now / 1000);
      gl.uniform1f(motion, reduced.matches ? 0 : 1);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      canvas.dataset.ready = "true";
    };
    const tick = (now: number) => {
      raf = 0;
      if (disposed || !visible || document.hidden || reduced.matches || gl.isContextLost()) return;
      if (now-lastFrame >= 1000/30) { render(now); lastFrame = now; }
      raf = requestAnimationFrame(tick);
    };
    const syncPlayback = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      render(performance.now());
      if (ready && visible && !document.hidden && !reduced.matches) raf = requestAnimationFrame(tick);
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, mobile.matches ? 1 : 1.5);
      canvas.width = Math.max(1,Math.round(rect.width*ratio));
      canvas.height = Math.max(1,Math.round(rect.height*ratio));
      gl.viewport(0,0,canvas.width,canvas.height);
      gl.uniform2f(resolution,canvas.width,canvas.height);
      gl.uniform2f(imagePosition,mobile.matches ? .55 : .5,mobile.matches ? 0 : .42);
      render(performance.now());
    };
    image.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
      gl.uniform2f(imageSize,image.naturalWidth,image.naturalHeight);
      ready = true;
      resize();
      syncPlayback();
    };
    image.src = "/hero-environment-v2.png";
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const intersection = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? true;
      syncPlayback();
    });
    intersection.observe(canvas);
    const lost = () => { cancelAnimationFrame(raf); canvas.dataset.ready = "false"; };
    canvas.addEventListener("webglcontextlost", lost);
    reduced.addEventListener("change",syncPlayback);
    mobile.addEventListener("change",resize);
    document.addEventListener("visibilitychange",syncPlayback);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      image.onload = null;
      observer.disconnect();
      intersection.disconnect();
      reduced.removeEventListener("change",syncPlayback);
      mobile.removeEventListener("change",resize);
      document.removeEventListener("visibilitychange",syncPlayback);
      canvas.removeEventListener("webglcontextlost",lost);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      shaders.forEach(shader => gl.deleteShader(shader));
    };
  }, []);

  return <canvas ref={canvasRef} className="atmosphere-canvas" aria-hidden="true" />;
}
