import {
  types,
  flow,
  applySnapshot,
  onPatch,
  destroy,
  IAnyStateTreeNode
} from "mobx-state-tree";
import {
  addHero,
  getHero,
  getHeroes,
  removeHero,
  updateHero
} from "./HeroService";

import makeInspectable from "mobx-devtools-mst";
import { HeroType, HeroInitialState, IHero } from "../types/hero.type";

export const Hero = types.model("Hero", HeroType);

const HeroStore = types
  .model("HeroStore", {
    heroes: types.optional(types.array(Hero), []),
    hero: types.model("Hero", HeroType),
    isLoading: types.boolean,
    error: types.string
  })
  .views(self => ({
    // computed property
    get heroesCount() {
      return self.heroes.length;
    }
  }))
  .actions(self => ({
    loadHeroes: flow(function*() {
      self.isLoading = true;
      try {
        // applySnapshot(self.heroes, (yield getHeroes()).data);
        self.heroes = (yield getHeroes()).data;
      } catch (e) {
        self.error = e.message;
      }
      self.isLoading = false;
    }),
    loadHero: flow(function*(id: string) {
      self.isLoading = true;
      try {
        self.hero = (yield getHero(id)).data;
      } catch (e) {
        self.error = e.message;
      }
      self.isLoading = false;
    }),
    postHero: flow(function*(hero: any) {
      self.isLoading = true;
      try {
        yield addHero(hero);
        self.heroes.push(hero);
      } catch (e) {
        self.error = e.message;
      }
      self.isLoading = false;
    }),
    putHero: flow(function*(hero: any) {
      self.isLoading = true;
      try {
        yield updateHero(hero);
        /* Applicable if a component(s) of the current page is rendering the array of heroes
        This will update the properties hero inside the array of heroes */
        const index = self.heroes.findIndex(h => h.id === hero.id);
        self.heroes[index] = hero;
      } catch (e) {
        self.error = e.message;
      }
      self.isLoading = false;
    }),
    deleteHero: flow(function*(hero: IHero) {
      self.isLoading = true;
      try {
        yield removeHero(hero);
        /* const index = self.heroes.findIndex(h => h.id === id);
         self.heroes.splice(index, 1); */
        destroy(hero as IAnyStateTreeNode); // no need for splice if using destroy
      } catch (e) {
        self.error = e.message;
      }
      self.isLoading = false;
    })
  }))
  .create({
    heroes: [],
    hero: HeroInitialState,
    isLoading: false,
    error: ""
  });

// Debugging tools
onPatch(HeroStore, patch => {
  console.log(patch);
});
makeInspectable(HeroStore);

export default HeroStore;
