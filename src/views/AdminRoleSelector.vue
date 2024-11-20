<template>
  <div class="relative h-screen overflow-hidden">
    <canvas ref="canvas" class="absolute inset-0 w-full h-full"></canvas>
    <div class="relative z-10 h-full flex items-center justify-center">
      <div class="bg-black bg-opacity-70 backdrop-filter backdrop-blur-md rounded-xl p-8">
        <div class="max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col justify-center">
          <img 
            src="@/assets/naulogo.png" 
            alt="Company Logo" 
            class="h-24 md:h-28 w-auto mx-auto mb-4"
            loading="lazy"
          >
          <h1 class="text-2xl md:text-4xl font-bold text-white text-center mb-8">Select Your Admin Role</h1>
          <div class="grid md:grid-cols-2 gap-6 md:gap-8 w-full">
            <section 
              class="rounded-xl overflow-hidden transition-all duration-300 group"
            >
              <button 
                @click="selectRole('BFP')"
                :disabled="isLoading"
                class="w-full h-full p-6 md:p-8 flex flex-col items-center justify-center space-y-4 md:space-y-6 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 relative bg-black bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-xl hover:bg-opacity-40 glow-red transition-all duration-300"
                :aria-busy="isLoading && selectedRole === 'BFP'"
              >
                <div class="rounded-full bg-red-100 bg-opacity-80 p-4 md:p-6 group-hover:bg-red-200 transition-colors duration-300">
                  <template v-if="!(isLoading && selectedRole === 'BFP')">
                    <FlameIcon class="w-12 h-12 md:w-16 md:h-16 text-red-600" />
                  </template>
                  <svg v-else class="w-12 h-12 md:w-16 md:h-16 animate-spin text-red-600" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <div class="text-center">
                  <h2 class="text-xl md:text-2xl font-semibold text-white mb-2">BFP Admin</h2>
                  <p class="text-sm md:text-base text-gray-100">Manage Bureau of Fire Protection resources</p>
                </div>
              </button>
            </section>
            <section 
              class="rounded-xl overflow-hidden transition-all duration-300 group"
            >
              <button 
                @click="selectRole('NPS')"
                :disabled="isLoading"
                class="w-full h-full p-6 md:p-8 flex flex-col items-center justify-center space-y-4 md:space-y-6 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 relative bg-black bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-xl hover:bg-opacity-40 glow-blue transition-all duration-300"
                :aria-busy="isLoading && selectedRole === 'NPS'"
              >
                <div class="rounded-full bg-blue-100 bg-opacity-80 p-4 md:p-6 group-hover:bg-blue-200 transition-colors duration-300">
                  <template v-if="!(isLoading && selectedRole === 'NPS')">
                    <ShieldIcon class="w-12 h-12 md:w-16 md:h-16 text-blue-600" />
                  </template>
                  <svg v-else class="w-12 h-12 md:w-16 md:h-16 animate-spin text-blue-600" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    <path class="text-blue-600" fill="currentColor" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div class="text-center">
                  <h2 class="text-xl md:text-2xl font-semibold text-white mb-2">NPS Admin</h2>
                  <p class="text-sm md:text-base text-gray-100">Oversee Naujan Police Station crime reports</p>
                </div>
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { FlameIcon, ShieldIcon } from 'lucide-vue-next';

const canvas = ref(null);
let gl;
let width;
let height;
let program;
let metaballsHandle;
let animationFrameId;

const numMetaballs = 30;
const metaballs = [];

const mouse = { x: 0, y: 0 };

const isLoading = ref(false);
const selectedRole = ref(null);

const vertexShaderSrc = `
  attribute vec2 position;

  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSrc = `
  precision highp float;

  uniform vec3 metaballs[${numMetaballs}];
  uniform vec2 resolution;

  void main(){
    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y;

    float sum = 0.0;
    for (int i = 0; i < ${numMetaballs}; i++) {
      vec3 metaball = metaballs[i];
      float dx = metaball.x - x;
      float dy = metaball.y - y;
      float radius = metaball.z;

      sum += (radius * radius) / (dx * dx + dy * dy);
    }

    if (sum >= 0.99) {
      vec2 uv = gl_FragCoord.xy / resolution;
      vec3 color = mix(vec3(0.0, 0.0, 0.5), vec3(1.0, 0.0, 0.0), uv.y);
      gl_FragColor = vec4(color, 1.0);
      return;
    }

    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
`;

function compileShader(shaderSource, shaderType) {
  const shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw "Shader compile failed with: " + gl.getShaderInfoLog(shader);
  }

  return shader;
}

function getUniformLocation(program, name) {
  const uniformLocation = gl.getUniformLocation(program, name);
  if (uniformLocation === null) {
    throw 'Can not find uniform ' + name + '.';
  }
  return uniformLocation;
}

function getAttribLocation(program, name) {
  const attributeLocation = gl.getAttribLocation(program, name);
  if (attributeLocation === -1) {
    throw 'Can not find attribute ' + name + '.';
  }
  return attributeLocation;
}

function createMetaballs() {
  for (let i = 0; i < numMetaballs; i++) {
    const radius = Math.random() * 60 + 10;
    metaballs.push({
      x: Math.random() * (width - 2 * radius) + radius,
      y: Math.random() * (height - 2 * radius) + radius,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      r: radius * 0.75
    });
  }
}

function setupGL() {
  gl = canvas.value.getContext('webgl');
  
  const vertexShader = compileShader(vertexShaderSrc, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(fragmentShaderSrc, gl.FRAGMENT_SHADER);

  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  const vertexData = new Float32Array([
    -1.0,  1.0,
    -1.0, -1.0,
     1.0,  1.0,
     1.0, -1.0,
  ]);
  const vertexDataBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

  const positionHandle = getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(positionHandle);
  gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, gl.FALSE, 2 * 4, 0);

  metaballsHandle = getUniformLocation(program, 'metaballs');
  const resolutionHandle = getUniformLocation(program, 'resolution');
  gl.uniform2f(resolutionHandle, width, height);
}

function loop() {
  for (let i = 0; i < numMetaballs; i++) {
    const metaball = metaballs[i];
    metaball.x += metaball.vx;
    metaball.y += metaball.vy;

    if (metaball.x < metaball.r || metaball.x > width - metaball.r) metaball.vx *= -1;
    if (metaball.y < metaball.r || metaball.y > height - metaball.r) metaball.vy *= -1;
  }

  const dataToSendToGPU = new Float32Array(3 * numMetaballs);
  for (let i = 0; i < numMetaballs; i++) {
    const baseIndex = 3 * i;
    const mb = metaballs[i];
    dataToSendToGPU[baseIndex + 0] = mb.x;
    dataToSendToGPU[baseIndex + 1] = mb.y;
    dataToSendToGPU[baseIndex + 2] = mb.r;
  }
  gl.uniform3fv(metaballsHandle, dataToSendToGPU);
  
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  animationFrameId = requestAnimationFrame(loop);
}

function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.value.width = width;
  canvas.value.height = height;
  gl.viewport(0, 0, width, height);

  const resolutionHandle = getUniformLocation(program, 'resolution');
  gl.uniform2f(resolutionHandle, width, height);
}

function handleMouseMove(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function selectRole(role) {
  selectedRole.value = role;
  isLoading.value = true;
  // Simulate loading
  setTimeout(() => {
    isLoading.value = false;
    // Redirect based on the selected role
    if (role === 'NPS') {
      window.location.href = '/npslogin';
    } else if (role === 'BFP') {
      window.location.href = '/bfplogin';
    }
  }, 2000);
}

onMounted(() => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.value.width = width;
  canvas.value.height = height;

  createMetaballs();
  setupGL();
  loop();

  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style scoped>
canvas {
  display: block;
  width: 100%;
  height: 100%;
  background-color: black;
}
.glow-red:hover {
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.7);
  outline: 2px solid rgba(255, 0, 0, 0.7);
  outline-offset: -2px;
}

.glow-blue:hover {
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.7);
  outline: 2px solid rgba(0, 0, 255, 0.7);
  outline-offset: -2px;
}
</style>