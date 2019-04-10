import { types, flow, applySnapshot, onPatch } from "mobx-state-tree";
import {
  addVillain,
  getVillain,
  getVillains,
  removeVillain,
  updateVillain
} from "./VillainService";
import makeInspectable from "mobx-devtools-mst";
import { VillainProperties } from "../models/types/villain.properties";

export const Villain = types.model("Villain", VillainProperties);

const VillainStore = types
  .model("VillainStore", {
    villains: types.optional(types.array(Villain), []),
    villain: types.model("Villain", VillainProperties),
    error: types.string
  })
  .views(self => ({
    // computed part of Mobx
    get villainsCount() {
      return self.villains.length;
    },

    get selectedVillain() {
      return self.villain;
    },

    get allVillains() {
      return self.villains;
    }
  }))
  .actions(self => ({
    loadVillains: flow(function*() {
      try {
        applySnapshot(self.villains, (yield getVillains()).data);
      } catch (e) {
        self.error = e.message;
      }
    }),
    loadVillain: flow(function*(id: string) {
      try {
        self.villain = (yield getVillain(id)).data;
      } catch (e) {
        self.error = e.message;
      }
    }),
    postVillain: flow(function*(villain: any) {
      try {
        yield addVillain(villain);
        self.villains.unshift(villain);
      } catch (e) {
        self.error = e.message;
      }
    }),
    putVillain: flow(function*(villain: any) {
      try {
        yield updateVillain(villain);
        // Applicable if a component(s) of the current page is rendering the array of villains
        // This will update the properties Villain inside the array of villains
        const index = self.villains.findIndex(h => h.id === villain.id);
        self.villains[index] = villain;
      } catch (e) {
        self.error = e.message;
      }
    }),
    deleteVillain: flow(function*(id: string) {
      try {
        yield removeVillain(id);
        const index = self.villains.findIndex(h => h.id === id);
        self.villains.splice(index, 1);
      } catch (e) {
        self.error = e.message;
      }
    })
  }))
  .create({
    villains: [],
    villain: {
      id: "",
      firstName: "",
      lastName: "",
      house: "",
      knownAs: ""
    },
    error: ""
  });

// Debugging tools
onPatch(VillainStore, patch => {
  console.log(patch);
});
makeInspectable(VillainStore);

export default VillainStore;
