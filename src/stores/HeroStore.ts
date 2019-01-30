import { types, flow, applySnapshot } from "mobx-state-tree";
import {
  addHero,
  getHero,
  getHeroes,
  removeHero,
  updateHero
} from "./HeroService";
import { toJS } from "mobx";
import { array } from "prop-types";
import { HeroModel } from "../models/hero.model";

export const Hero = types.model("Hero", {
  key: types.string,
  id: types.identifier,
  firstName: types.string,
  lastName: types.string,
  house: types.string,
  knownAs: types.string
});

export const HeroStore = types
  .model("HeroStore", {
    heroes: types.optional(types.array(Hero), []),
    hero: types.model(),
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
  .actions(function(self) {
    async function fetchHeroes(): Promise<any> {
      const { data } = await getHeroes();
      return data;
    }
    return {
      // async loadHeroes() {
      //   try {
      //     const data = await fetchHeroes();
      //     applySnapshot(self.heroes, data);
      //   } catch (e) {
      //     self.error = ` error`;
      //   }
      // },

      loadHeroes: flow(function*() {
        let heroes: any = [];
        yield getHeroes().then(res => (heroes = res));

        console.table(heroes.data);
        self.heroes = heroes.data;
        // self.heroes = JSON.parse(heroes.data);
        // applySnapshot(self.heroes, toJS(heroes.data));
      }),

      async loadHero(id: string) {
        try {
          const { data } = await getHero(id);
          self.hero = data;
        } catch (e) {
          self.error = ` error`;
        }
      },
      async postHero(hero: any) {
        try {
          await addHero(hero).then(() => self.heroes.unshift(hero));
        } catch (e) {
          self.error = ` error`;
        }
      },
      async putHero(hero: any) {
        try {
          await updateHero(hero);
          // Applicable if a component(s) of the current page is rendering the array of heroes
          // This will update the properties hero inside the array of heroes
          const index = self.heroes.findIndex(h => h.id === hero.id);
          self.heroes[index] = hero;
        } catch (e) {
          self.error = ` error`;
        }
      },
      async deleteHero(id: string) {
        try {
          await removeHero(id);
          const index = self.heroes.findIndex(h => h.id === id);
          self.heroes.splice(index, 1);
        } catch (e) {
          self.error = ` error`;
        }
      }
    };
  })
  .create({
    heroes: [],
    hero: {},
    error: ""
  });

export default HeroStore;
