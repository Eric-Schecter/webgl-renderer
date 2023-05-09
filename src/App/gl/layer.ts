import { Window } from "./window";

export abstract class Layer {
  constructor(protected window:Window){}
  abstract update(time: number): void;
}