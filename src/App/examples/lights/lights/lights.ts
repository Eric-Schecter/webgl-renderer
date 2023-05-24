import { AmbientLight } from "./ambient_light";
import { DirectionalLight } from "./directionallight";

export class Lights {
  public ambientLights: AmbientLight[] = [];
  public directionalLighs: DirectionalLight[] = [];
}