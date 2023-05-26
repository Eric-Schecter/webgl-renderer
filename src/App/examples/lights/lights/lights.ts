import { Layer } from "../../../gl";
import { AmbientLight } from "./ambient_light";
import { DirectionalLight } from "./directional_light";
import { PointLight } from "./point_light";
import { SpotLight } from "./spot_light";

export class Lights {
  public ambientLights: AmbientLight[] = [];
  public directionalLighs: DirectionalLight[] = [];
  public spotLights: SpotLight[] = [];
  public pointLights: PointLight[] = [];

  public update = (layers: Layer[]) => {
    this.directionalLighs.forEach(light => light.update(layers));
    this.spotLights.forEach(light => light.update(layers));
    this.pointLights.forEach(light => light.update(layers));
  }
}