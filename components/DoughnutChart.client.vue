<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart, Title, Tooltip, Legend, ArcElement } from 'chart.js'

Chart.register(Title, Tooltip, Legend, ArcElement)

defineProps<{
  data: any
  options?: any
}>()
</script>

<template>
  <Doughnut :data="data" :options="options" />
</template>
