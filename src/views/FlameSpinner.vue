<!-- src/components/FlameSpinner.vue -->
<template>
  <div class="flame-spinner">
    <svg width="200" height="200" viewBox="0 0 200 200">
      <defs>
        <radialGradient id="flame-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#FFD700" />
          <stop offset="50%" stop-color="#FF8C00" />
          <stop offset="100%" stop-color="#FF4500" />
        </radialGradient>
        <filter id="flame-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
      </defs>
      <g class="flame" filter="url(#flame-blur)">
        <path class="flame-main" d="M100 20 C120 50 150 80 150 130 C150 180 120 195 100 195 C80 195 50 180 50 130 C50 80 80 50 100 20" fill="url(#flame-gradient)">
          <animate attributeName="d" dur="1.5s" repeatCount="indefinite" values="
            M100 20 C120 50 150 80 150 130 C150 180 120 195 100 195 C80 195 50 180 50 130 C50 80 80 50 100 20;
            M100 20 C120 40 160 90 160 130 C160 180 120 200 100 200 C80 200 40 180 40 130 C40 90 80 40 100 20;
            M100 20 C120 50 150 80 150 130 C150 180 120 195 100 195 C80 195 50 180 50 130 C50 80 80 50 100 20"
          />
        </path>
        <path class="flame-inner" d="M100 40 C115 60 130 80 130 120 C130 160 115 175 100 175 C85 175 70 160 70 120 C70 80 85 60 100 40" fill="#FFA500" opacity="0.8">
          <animate attributeName="d" dur="1s" repeatCount="indefinite" values="
            M100 40 C115 60 130 80 130 120 C130 160 115 175 100 175 C85 175 70 160 70 120 C70 80 85 60 100 40;
            M100 40 C115 55 140 90 140 120 C140 160 115 180 100 180 C85 180 60 160 60 120 C60 90 85 55 100 40;
            M100 40 C115 60 130 80 130 120 C130 160 115 175 100 175 C85 175 70 160 70 120 C70 80 85 60 100 40"
          />
        </path>
        <path class="flame-highlight" d="M100 60 C110 75 120 90 120 120 C120 150 110 165 100 165 C90 165 80 150 80 120 C80 90 90 75 100 60" fill="#FFFFFF" opacity="0.4">
          <animate attributeName="d" dur="0.8s" repeatCount="indefinite" values="
            M100 60 C110 75 120 90 120 120 C120 150 110 165 100 165 C90 165 80 150 80 120 C80 90 90 75 100 60;
            M100 60 C110 70 125 95 125 120 C125 150 110 170 100 170 C90 170 75 150 75 120 C75 95 90 70 100 60;
            M100 60 C110 75 120 90 120 120 C120 150 110 165 100 165 C90 165 80 150 80 120 C80 90 90 75 100 60"
          />
        </path>
      </g>
    </svg>
  </div>
</template>

<script setup>
// No script needed for this component
</script>

<style scoped>
.flame-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flame {
  transform-origin: center bottom;
}

@keyframes flicker {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
  100% { transform: scale(1); opacity: 1; }
}

.flame-main {
  animation: flicker 0.5s infinite alternate;
}

.flame-inner {
  animation: flicker 0.3s infinite alternate 0.1s;
}

.flame-highlight {
  animation: flicker 0.2s infinite alternate 0.2s;
}
</style>