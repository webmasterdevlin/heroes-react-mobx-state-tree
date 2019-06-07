import { types } from "mobx-state-tree";

// For Mobx purposes
export const HeroType = {
  id: types.identifier,
  firstName: types.string,
  lastName: types.string,
  house: types.string,
  knownAs: types.string
};

export const HeroInitialState = {
  id: "",
  firstName: "",
  lastName: "",
  house: "",
  knownAs: ""
};
