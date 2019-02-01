import { types, flow, applySnapshot } from "mobx-state-tree";
import {
  addVillain,
  getVillain,
  getVillains,
  removeVillain,
  updateVillain
} from "./VillainService";
import { VillainModel } from "../models/villain.model";

export const Villain = types.model("Villain", {
  id: types.identifier,
  firstName: types.string,
  lastName: types.string,
  house: types.string,
  knownAs: types.string
});

export const VillainStore = types
  .model("VillainStore", {
    villains: types.optional(types.array(Villain), []),
    villain: types.model("Villain", {
      id: types.identifier,
      firstName: types.string,
      lastName: types.string,
      house: types.string,
      knownAs: types.string
    }),
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
        let villains: any = [];
        yield getVillains().then(res => (villains = res));
        applySnapshot(self.villains, villains.data);
      } catch (e) {
        self.error = yield e;
      }
    }),
    // async loadVillain(id: string) {
    //   self.Villain = await getVillain(id);
    // },
    loadVillain: flow(function*(id: string) {
      try {
        let villain: any = {};
        yield getVillain(id).then(res => (villain = res));
        self.villain = villain.data;
      } catch (e) {
        self.error = yield e;
      }
    }),
    postVillain: flow(function*(villain: any) {
      try {
        yield addVillain(villain);
        self.villains.unshift(villain);
      } catch (e) {
        self.error = yield e;
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
        self.error = yield e;
      }
    }),
    deleteVillain: flow(function*(id: string) {
      try {
        yield removeVillain(id);
        const index = self.villains.findIndex(h => h.id === id);
        self.villains.splice(index, 1);
      } catch (e) {
        self.error = yield e;
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

export default VillainStore;
