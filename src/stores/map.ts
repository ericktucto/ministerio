import Revisita from "@/models/revisita";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMap = defineStore('map', () => {
  const revisitas = ref<Revisita[]>([]);
  function setRevisitas(newRevisitas: Revisita[]) {
    revisitas.value = newRevisitas;
  }
  return {
    revisitas,
    setRevisitas,
  };
});
