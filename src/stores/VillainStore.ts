import { types } from "mobx-state-tree";
import {
  addVillain,
  getVillain,
  getVillains,
  removeVillain,
  updateVillain
} from "./VillainService";

export const Villain = types.model("Villain", {
  key: types.string,
  id: types.identifier,
  firstName: types.string,
  lastName: types.string,
  house: types.string,
  knownAs: types.string
});

export const VillainStore = types
  .model("VillainStore", {
    villains: types.array(Villain),
    villain: types.model(),
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
    async loadVillains() {
      try {
        const { data } = await getVillains();
        self.villains = data.reverse();
      } catch (e) {
        self.error = ` error`;
      }
    },
    async loadVillain(id: string) {
      try {
        const { data } = await getVillain(id);
        self.villain = data;
      } catch (e) {
        self.error = ` error`;
      }
    },
    async postVillain(villain: any) {
      try {
        await addVillain(villain).then(() => self.villains.unshift(villain));
      } catch (e) {
        self.error = ` error`;
      }
    },
    async putVillain(villain: any) {
      try {
        await updateVillain(villain);
        // Applicable if a component(s) of the current page is rendering the array of villains
        // This will update the properties villain  inside the array of villains
        const index = self.villains.findIndex(v => v.id === villain.id);
        self.villains[index] = villain;
      } catch (e) {
        self.error = ` error`;
      }
    },
    async deleteVillain(id: string) {
      try {
        await removeVillain(id);
        const index = self.villains.findIndex(v => v.id === id);
        self.villains.splice(index, 1);
      } catch (e) {
        self.error = ` error`;
      }
    }
  }))
  .create({
    villains: [],
    villain: {},
    error: ""
  });

export default VillainStore;
