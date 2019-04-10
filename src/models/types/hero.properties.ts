import { types } from "mobx-state-tree";

// For Mobx purposes
export const HeroProperties = {
         // @ts-ignore
         id: types.identifier,
         // @ts-ignore
         firstName: types.string,
         // @ts-ignore
         lastName: types.string,
         // @ts-ignore
         house: types.string,
         // @ts-ignore
         knownAs: types.string
       };

export const HeroSnapshot = {
         id: "",
         firstName: "",
         lastName: "",
         house: "",
         knownAs: ""
       };
