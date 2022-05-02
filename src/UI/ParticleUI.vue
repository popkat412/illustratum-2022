<template>
  <Transition name="slide-left">
    <div v-if="particleComponent" class="sidebar">
      <span>
        Mass:
        <input
          v-model="dispMass"
          @input="massDirty = true"
          @keypress.enter="onMassConfirm"
        />
        <BaseDirtyIndicator v-show="massDirty" />
      </span>
      <br />
      <span>
        Fixed:
        <input type="checkbox" v-model="particleComponent.fixed" />
      </span>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent, inject, ref, watch } from "vue";
import type { Ref } from "vue";
import ParticleComponent from "../Components/ParticleComponent";
import BaseDirtyIndicator from "./components/BaseDirtyIndicator.vue";
import { PARTICLE_COMPONENT_PROVIDER } from "../constants";

export default defineComponent({
  components: {
    BaseDirtyIndicator,
  },
  setup() {
    const particleComponent = inject<Ref<ParticleComponent | null>>(
      PARTICLE_COMPONENT_PROVIDER
    )!;

    // mass
    const massDirty = ref(false);

    const dispMass = ref(particleComponent.value?.mass ?? "");
    watch(particleComponent, (newParticleComponent) => {
      if (!newParticleComponent) return;
      dispMass.value = newParticleComponent?.mass.toString();
    });

    const onMassConfirm = (ev: InputEvent) => {
      const newMass = parseFloat((ev.target as HTMLInputElement).value);

      if (isNaN(newMass)) return;

      massDirty.value = false;

      console.log(`Updating mass: ${newMass}`);
      console.assert(!!particleComponent.value);
      particleComponent.value!.mass = newMass;
    };

    return { particleComponent, dispMass, onMassConfirm, massDirty };
  },
});
</script>


<style lang="scss" scoped>
.sidebar {
  position: absolute;
  left: 0;
  top: 50vh;
  transform: translateY(-50%);

  background-color: rgba(200, 200, 200, 0.6);

  min-height: 200px;
  width: 300px;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-left-enter-from,
.slide-left-leave-to {
  // TODO: actually get this to do the slide in thing
  opacity: 0;
}
</style>
