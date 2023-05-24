import { mat4, vec3 } from "gl-matrix";
import { Shader } from "../../../gl";
import { AmbientLight, DirectionalLight, Lights } from "../lights";

type AmbientLightUniforms = {
  color: WebGLUniformLocation | null,
  intensity: WebGLUniformLocation | null,
}

type DirectionalLightUniforms = {
  color: WebGLUniformLocation | null,
  direction: WebGLUniformLocation | null,
  intensity: WebGLUniformLocation | null,
}

export class PhongShader extends Shader {
  private static updateShader(shader: string, lights: Lights) {
    shader.replace('#define AMBIENT_LIGHT_COUNT 1', `#define AMBIENT_LIGHT_COUNT ${lights.ambientLights.length}`);
    shader.replace('#define DIRECTIONAL_LIGHT_COUNT 1', `#define DIRECTIONAL_LIGHT_COUNT ${lights.ambientLights.length}`);
    return shader;
  }
  private uProjectMatrix;
  private uViewMatrix;
  private uModelMatrix;
  private uColor;
  private uAmbientLights: AmbientLightUniforms[] = [];
  private uDirectionalLights: DirectionalLightUniforms[] = [];
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string, lights: Lights) {
    super(gl, vs, PhongShader.updateShader(fs, lights));
    this.uProjectMatrix = this.gl.getUniformLocation(this.id, 'u_projectMatrix');
    this.uViewMatrix = this.gl.getUniformLocation(this.id, 'u_viewMatrix');
    this.uModelMatrix = this.gl.getUniformLocation(this.id, 'u_modelMatrix');
    this.uColor = this.gl.getUniformLocation(this.id, 'u_color');

    this.uAmbientLights = lights.ambientLights.map((light, index) => {
      return {
        color: this.gl.getUniformLocation(this.id, `u_ambientLight[${index}].color`),
        intensity: this.gl.getUniformLocation(this.id, `u_ambientLight[${index}].intensity`),
      }
    })

    this.uDirectionalLights = lights.directionalLighs.map((light, index) => {
      return {
        color: this.gl.getUniformLocation(this.id, `u_directionalLight[${index}].color`),
        direction: this.gl.getUniformLocation(this.id, `u_directionalLight[${index}].direction`),
        intensity: this.gl.getUniformLocation(this.id, `u_directionalLight[${index}].intensity`),
      }
    })
  }
  public updateProjectMatrix = (matrix: mat4) => {
    this.gl.uniformMatrix4fv(this.uProjectMatrix, false, matrix.values());
    return this;
  }

  public updateViewMatrix = (matrix: mat4) => {
    this.gl.uniformMatrix4fv(this.uViewMatrix, false, matrix.values());
    return this;
  }

  public updateModelMatrix = (matrix: mat4) => {
    this.gl.uniformMatrix4fv(this.uModelMatrix, false, matrix.values());
    return this;
  }

  public updateColor = (color: vec3) => {
    this.gl.uniform3fv(this.uColor, color);
    return this;
  }

  public updateAmbientLights = (lights: AmbientLight[]) => {
    for (let i = 0; i < lights.length; i++) {
      this.gl.uniform1f(this.uAmbientLights[i].intensity, lights[i].intensity);
      this.gl.uniform4fv(this.uAmbientLights[i].color, lights[i].color);
    }
    return this;
  }

  public updateDirectionalLights = (lights: DirectionalLight[]) => {
    for (let i = 0; i < lights.length; i++) {
      this.gl.uniform1f(this.uDirectionalLights[i].intensity, lights[i].intensity);
      this.gl.uniform3fv(this.uDirectionalLights[i].direction, lights[i].direction);
      this.gl.uniform4fv(this.uDirectionalLights[i].color, lights[i].color);
    }
    return this;
  }

}