<template>
  <p :class="$style.timer">
    <span v-if="current.hh !== '00'">{{ current.hh }}:</span>
    <span>{{ current.mm }}:</span>
    <span>{{ current.ss }}</span>
  </p>
</template>

<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { onMounted, onUnmounted } from "@vue/runtime-core";
import dayjs from "dayjs";

const props = defineProps<{ time: string }>();
const emits = defineEmits<{
  (e: "onFinish"): void;
}>();
const current = ref({ hh: "00", mm: "00", ss: "00" });
const timer = ref<NodeJS.Timer | null>(null);

const handleTimer = () => {
  const differenceSeconds = dayjs(props.time).diff(dayjs(), "s");
  if (differenceSeconds <= 0) {
    emits("onFinish");
    return;
  }
  const hh = Math.floor((differenceSeconds / 3600) % 24);
  const mm = Math.floor((differenceSeconds / 60) % 60);
  const ss = differenceSeconds % 60;

  const format = (val: number) => (val < 10 ? `0${val}` : val.toString());

  current.value = {
    hh: format(hh),
    mm: format(mm),
    ss: format(ss),
  };

  timer.value = setTimeout(handleTimer, 1000);
};

onMounted(() => {
  handleTimer();
});
</script>

<style module lang="scss">
.timer {
  display: inline;
}
</style>
