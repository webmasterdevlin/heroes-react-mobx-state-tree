import { types, flow, applySnapshot, onPatch, destroy } from "mobx-state-tree";
import {
  addHero,
  getHero,
  getHeroes,
  removeHero,
  updateHero
} from "./HeroService";

import makeInspectable from "mobx-devtools-mst";
import { HeroModel } from "../models/hero.model";

export const Hero = types.model("Hero", {
  id: types.identifier,
  firstName: types.string,
  lastName: types.string,
  house: types.string,
  knownAs: types.string
});

const HeroStore = types
  .model("HeroStore", {
    heroes: types.optional(types.array(Hero), []),
    hero: types.model("Hero", {
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
    get heroesCount() {
      return self.heroes.length;
    },

    get selectedHero() {
      return self.hero;
    },

    get allHeroes() {
      return self.heroes;
    }
  }))
  .actions(self => ({
    loadHeroes: flow(function*() {
      try {
        let heroes: any = [];
        yield getHeroes().then(res => (heroes = res));
        applySnapshot(self.heroes, heroes.data);
      } catch (e) {
        self.error = e.message;
      }
    }),
    // async loadHero(id: string) {
    //   self.hero = await getHero(id);
    // },
    loadHero: flow(function*(id: string) {
      try {
        let hero: any = {};
        yield getHero(id).then(res => (hero = res));
        self.hero = hero.data;
      } catch (e) {
        self.error = e.message;
      }
    }),
    postHero: flow(function*(hero: any) {
      try {
        yield addHero(hero);
        self.heroes.unshift(hero);
      } catch (e) {
        self.error = e.message;
      }
    }),
    putHero: flow(function*(hero: any) {
      try {
        yield updateHero(hero);
        // Applicable if a component(s) of the current page is rendering the array of heroes
        // This will update the properties hero inside the array of heroes
        const index = self.heroes.findIndex(h => h.id === hero.id);
        self.heroes[index] = hero;
      } catch (e) {
        self.error = e.message;
      }
    }),
    deleteHero: flow(function*(hero: HeroModel) {
      try {
        yield removeHero(hero);
        /*
         const index = self.heroes.findIndex(h => h.id === id);
         self.heroes.splice(index, 1);
         */
        destroy(hero as any); // no need for splice if using destroy
      } catch (e) {
        self.error = e.message;
      }
    })
  }))
  .create({
    heroes: [],
    hero: {
      id: "",
      firstName: "",
      lastName: "",
      house: "",
      knownAs: ""
    },
    error: ""
  });

// Debugging tools
onPatch(HeroStore, patch => {
  console.log(patch);
});
makeInspectable(HeroStore);

export default HeroStore;
