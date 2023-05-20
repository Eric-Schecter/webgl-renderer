import { Mesh } from "../examples/model/mesh";
import { RenderPass } from "./renderpass";
import { Shader } from "./shader";

export abstract class Pipeline {
  protected shader?: Shader;
  protected mesh?: Mesh;
  protected renderpass?: RenderPass;
  public abstract bind: (...args: any) => Pipeline;
  public abstract clear: () => Pipeline;
  public abstract update: (...args: any) => Pipeline;
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
  public setRenderPass(t_renderpass: RenderPass | undefined) {
    this.renderpass = t_renderpass;
    return this;
  }
}
