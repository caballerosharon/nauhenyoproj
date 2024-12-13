<template>
  <ChoroplethMapChart :chart-data="chartData" :options="chartOptions" />
</template>

<script setup>
import { defineProps, onMounted } from 'vue';
import { ChoroplethMapChart } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend } from 'chart.js';
import { ChoroplethController, ProjectionScale, ColorScale, GeoFeature } from 'chartjs-chart-geo';

ChartJS.register(Title, Tooltip, Legend, ChoroplethController, ProjectionScale, ColorScale, GeoFeature);

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  chartOptions: {
    type: Object,
    default: () => ({})
  }
});

onMounted(() => {
  console.log('ChoroplethMap component mounted');
});
</script>