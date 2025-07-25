<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps<{
  modelValue: string,
  options: string[],
}>()
const emit = defineEmits<{
  'update:modelValue': [value: string],
}>()
function scrollToDiv(divElement: HTMLDivElement) {
  const dataValue = (divElement.dataset.value as string);
  divElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  emit('update:modelValue', dataValue);
}
function scrollToCenter(event: Event) {
  scrollToDiv(
    (event.target as HTMLDivElement)
  );
}
const scrollContainer = ref<HTMLDivElement|null>(null);
const items = ref<HTMLDivElement[]>([]);
async function scrollBoot() {
  if (!scrollContainer.value) {
    await nextTick();
    if (!scrollContainer.value) {
      return;
    }
  }
  detectCenterElement(
    scrollContainer.value,
    items.value,
  );
  const divElement: HTMLDivElement|null = scrollContainer.value.querySelector(`div[data-value="${props.modelValue}"]`);
  // @todo: verificar cuando no existe el elemento dentro de las opciones
  if (divElement) {
    scrollToDiv(divElement);
  }
}

const isScrolling = ref<boolean>(false);
// detect div center when scroll
let observer: IntersectionObserver | null = null;
let scrollTimeout: number | null = null;
function detectCenterElement(
  scrollDiv: HTMLDivElement,
  itemElements: HTMLDivElement[]
): void {
  function calcCenter(container: HTMLDivElement, div: HTMLDivElement): boolean {
    const rect = div.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const containerCenter = containerRect.top + containerRect.height / 2;

    return Math.abs(itemCenter - containerCenter) < rect.height / 2
  }
  observer = new IntersectionObserver((entries) => {
    if (isScrolling.value) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const elm = items.value.find(
            (item) => calcCenter(scrollDiv, item)
          );
          if (elm) {
            emit('update:modelValue', (elm.dataset.value as string));
          }
        }
      });
    }
  }, {
    root: scrollDiv,
    threshold: 1.0, // Detecta cuando el elemento está completamente visible
  });

  itemElements.forEach((item) => observer?.observe(item));
}
function handleScroll() {
  isScrolling.value = true;
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  scrollTimeout = window.setTimeout(() => {
    isScrolling.value = false;
  }, 500);
}
onMounted(() => {
  scrollBoot();
});
onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
  }
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
});
</script>
<template>
  <div
    ref="scrollContainer"
    class="overflow-y-scroll relative"
    @scroll="handleScroll"
  >
    <div
      ref="items"
      v-for="(item, index) in options"
      :key="`option-${index}`"
      @click="scrollToCenter"
      class="px-4 py-2 text-center cursor-pointer select-none text-gray-600"
      :class="{
        'bg-blue-500 text-white': modelValue === item,
      }"
      :data-value="item"
    >{{ item }}</div>
  </div>
</template>
