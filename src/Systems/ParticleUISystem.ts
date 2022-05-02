import ParticleComponent from "../Components/ParticleComponent";
import PixiGraphicsRenderComponent from "../Components/PIXIGraphicsRenderComponent";
import ECSSystem from "../EntityComponentSystem/System";
import ECSEntity from "../EntityComponentSystem/Entity";
import { App as VueApp, createApp, ref } from "vue";
import EntityManager from "../EntityComponentSystem/EntityManager";
import SelectableComponent from "../Components/SelectableComponent";
import ParticleUI from "../UI/ParticleUI.vue";
import { PARTICLE_COMPONENT_PROVIDER } from "../constants";

export default class ParticleUISystem<E> extends ECSSystem<E> {
  static readonly PARTICLE_COMPONENT_PROVIDER = "particleComponent";

  private vueApp: VueApp;

  private particleComponentRef = ref<ParticleComponent | null>(null);
  private currentlySelectedEntity: ECSEntity | null = null;

  constructor(entityManager: EntityManager, environment: E) {
    super(entityManager, environment);

    this.vueApp = createApp(ParticleUI);
    this.vueApp.provide(PARTICLE_COMPONENT_PROVIDER, this.particleComponentRef);
    this.vueApp.mount("#particle-ui");
  }

  setup() {
    // register event listeners
    for (const [
      entity,
      pixiGraphicsComponent,
    ] of this.entityManager.allEntitiesWithComponent<PixiGraphicsRenderComponent>(
      PixiGraphicsRenderComponent
    )) {
      const particleComponent =
        this.entityManager.getComponent<ParticleComponent>(
          entity,
          ParticleComponent
        );
      const selectableComponent =
        this.entityManager.getComponent<SelectableComponent>(
          entity,
          SelectableComponent
        );

      if (particleComponent && selectableComponent) {
        const { pixiGraphics } = pixiGraphicsComponent;
        pixiGraphics.on("pointerup", () => {
          if (this.particleComponentRef.value && this.currentlySelectedEntity) {
            const oldSelectableComponent =
              this.entityManager.getComponent<SelectableComponent>(
                this.currentlySelectedEntity,
                SelectableComponent
              );
            if (oldSelectableComponent) {
              console.log("remove isSelected");
              oldSelectableComponent.isSelected = false;
            }
            if (entity == this.currentlySelectedEntity) {
              console.log("same entity, deselecting...");
              this.particleComponentRef.value = null;
              this.currentlySelectedEntity = null;
              return;
            }
          }

          selectableComponent.isSelected = true;

          this.particleComponentRef.value = particleComponent;
          this.currentlySelectedEntity = entity;

          console.log({ particleComponentRef: this.particleComponentRef });
        });
      }
    }
  }

  update(_deltaTime: number) {}
}
