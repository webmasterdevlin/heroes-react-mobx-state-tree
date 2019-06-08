import { types, flow, applySnapshot, onPatch } from "mobx-state-tree";
import {
  addVillain,
  getVillain,
  getVillains,
  removeVillain,
  updateVillain
} from "./VillainService";
import makeInspectable from "mobx-devtools-mst";
import { VillainType, VillainInitialState } from "../types/villain.type";
import { getHeroes } from "./HeroService";

export const Villain = types.model("Villain", VillainType);

const VillainStore = types
  .model("VillainStore", {
    villains: types.optional(types.array(Villain), []),
    villain: types.model("Villain", VillainType),
    isLoading: types.boolean,
    error: types.string
  })
  .views(self => ({
    // computed property
    get villainsCount() {
      return self.villains.length;
    }
  }))
  .actions(self => ({
    loadVillains: flow(function*() {
      self.isLoading = true;
      try {
        self.villains = (yield getVillains()).data;
      } catch (e) {
        self.error = e.message;
      }
      self.isLoading = false;
    }),
    loadVillain: flow(function*(id: string) {
      self.isLoading = true;
      try {
        self.villain = (yield getVillain(id)).data;
      } catch (e) {
        self.error = e.message;
      }
      self.isLoading = false;
    }),
    postVillain: flow(function*(villain: any) {
      self.isLoading = true;
      try {
        yield addVillain(villain);
        self.villains.push(villain);
      } catch (e) {
        self.error = e.message;
      }
      self.isLoading = false;
    }),
    putVillain: flow(function*(villain: any) {
      self.isLoading = true;
      try {
        yield updateVillain(villain);
        // Applicable if a component(s) of the current page is rendering the array of villains
        // This will update the properties Villain inside the array of villains
        const index = self.villains.findIndex(h => h.id === villain.id);
        self.villains[index] = villain;
      } catch (e) {
        self.error = e.message;
      }
      self.isLoading = false;
    }),
    deleteVillain: flow(function*(id: string) {
      self.isLoading = true;
      try {
        yield removeVillain(id);
        const index = self.villains.findIndex(h => h.id === id);
        self.villains.splice(index, 1);
      } catch (e) {
        self.error = e.message;
      }
      self.isLoading = false;
    })
  }))
  .create({
    villains: [],
    villain: VillainInitialState,
    isLoading: false,
    error: ""
  });

// Debugging tools
onPatch(VillainStore, patch => {
  console.log(patch);
});
makeInspectable(VillainStore);

export default VillainStore;
