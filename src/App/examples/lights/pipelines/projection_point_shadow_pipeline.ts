import { mat4, vec3 } from "gl-matrix";
import { DepthCubeRenderPass, DepthRenderPass } from "../../../gl";
import { Pipeline } from '../../../gl/pipeline';
import { Mesh } from "../mesh";
import { ProjectionPointShadowShader } from "../shaders";

export class ProjectionPointShadowPipeline extends Pipeline {
  protected shader?: ProjectionPointShadowShader;
  protected mesh?: Mesh;
  protected renderpass?: DepthRenderPass | DepthCubeRenderPass;
  constructor(private gl: WebGL2RenderingContext) {
    super();
  }
  public bind = (width: number, height: number, index?: number) => {
    if (this.renderpass) {
      this.gl.viewport(0, 0, this.renderpass.width, this.renderpass.height);
    } else {
      this.gl.viewport(0, 0, width, height);
    }
    this.gl.enable(this.gl.DEPTH_TEST);
    if (this.renderpass instanceof DepthRenderPass) {
      this.renderpass?.bind();
    } else if (index !== undefined) {
      this.renderpass?.bind(index);
    }
    return this;
  }
  public clear = () => {
    if (this.renderpass) {
      this.renderpass.clear();
    } else {
      this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
    }
    return this;
  }
  public update = (projectMatrix: mat4, viewMatrix: mat4, modelMatrix: mat4, lightPos: vec3, far: number) => {
    if (!this.shader || !this.mesh) {
      return this;
    }

    this.shader
      .bind()
      .updateProjectMatrix(projectMatrix)
      .updateViewMatrix(viewMatrix)
      .updateModelMatrix(modelMatrix)
      .updateLightPos(lightPos)
      .updateFar(far);

    this.mesh.bind()

    return this;
  }
  public render = () => {
    this.mesh?.render();
    return this;
  }
  public unbind = () => {
    this.mesh?.unbind();
    this.shader?.unbind();
    this.renderpass?.unbind();
  }
}
