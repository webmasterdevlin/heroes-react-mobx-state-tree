import { types, Instance } from "mobx-state-tree";

// For Mobx purposes
export const VillainType = {
  id: "",
  firstName: "",
  lastName: "",
  house: "",
  knownAs: ""
};

export const VillainInitialState = {};

export type IVillain = Instance<typeof VillainType>;
