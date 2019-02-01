import { BaseUrl } from "../utils/constants";
import { HeroModel } from "../models/hero.model";
import http from "./http-service";

export async function getHeroes(): Promise<any> {
  return await http.get(BaseUrl.heroes);
}

export async function getHero(id: string): Promise<any> {
  return await http.get(`${BaseUrl.heroes}${id}`);
}

export async function addHero(hero: HeroModel): Promise<any> {
  return await http.post(BaseUrl.heroes, hero);
}

export async function updateHero(hero: HeroModel): Promise<any> {
  return await http.put(`${BaseUrl.heroes}${hero.id}`, hero);
}

export async function removeHero(id: string): Promise<any> {
  return await http.delete(`${BaseUrl.heroes}${id}`);
}
