import { types, Instance } from "mobx-state-tree";

// For Mobx purposes
export const HeroType = {
  id: types.optional(types.string, ""),
  firstName: types.optional(types.string, ""),
  lastName: types.optional(types.string, ""),
  house: types.optional(types.string, ""),
  knownAs: types.optional(types.string, "")
};

export const HeroInitialState = {
  id: "",
  firstName: "",
  lastName: "",
  house: "",
  knownAs: ""
};

export type IHero = Instance<typeof HeroType>;
