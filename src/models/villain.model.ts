export interface VillainModel {
  [key: string]: string; // Add index signature,
  id: string;
  firstName: string;
  lastName: string;
  house: string;
  knownAs: string;
}
