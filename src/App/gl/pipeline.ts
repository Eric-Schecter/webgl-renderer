import { Mesh } from "../examples/model/mesh";
import { Shader } from "./shader";

export abstract class Pipeline {
  protected shader?: Shader;
  protected mesh?: Mesh;
  public abstract bind: (...args: any) => Pipeline;
  public abstract render: () => Pipeline;
  public abstract unbind: () => void;
  public setShader(t_shader: Shader) {
    this.shader = t_shader;
    return this;
  }
  public setMesh(t_mesh: Mesh) {
    this.mesh = t_mesh;
    return this;
  }
}
