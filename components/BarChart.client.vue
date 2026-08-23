<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

defineProps<{
  data: any
  options?: any
}>()
</script>

<template>
  <Bar :data="data" :options="options" />
</template>
