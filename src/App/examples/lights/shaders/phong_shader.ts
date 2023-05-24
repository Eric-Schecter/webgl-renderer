import { mat4, vec3 } from "gl-matrix";
import { Shader } from "../../../gl";
import { AmbientLight, Lights } from "../lights";

type AmbientLightUniforms = {
  color: WebGLUniformLocation | null,
  intensity: WebGLUniformLocation | null,
}

export class PhongShader extends Shader {
  private static updateShader(shader: string, lights: Lights) {
    shader.replace('#define AMBIENT_LIGHT_COUNT 1', `#define AMBIENT_LIGHT_COUNT ${lights.ambientLights.length}`);
    return shader;
  }
  private uProjectMatrix;
  private uViewMatrix;
  private uModelMatrix;
  private uColor;
  private uAmbientLight: AmbientLightUniforms[] = [];
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string, lights: Lights) {
    super(gl, vs, PhongShader.updateShader(fs, lights));
    this.uProjectMatrix = this.gl.getUniformLocation(this.id, 'u_projectMatrix');
    this.uViewMatrix = this.gl.getUniformLocation(this.id, 'u_viewMatrix');
    this.uModelMatrix = this.gl.getUniformLocation(this.id, 'u_modelMatrix');
    this.uColor = this.gl.getUniformLocation(this.id, 'u_color');

    this.uAmbientLight = lights.ambientLights.map((light, index) => {
      return {
        color: this.gl.getUniformLocation(this.id, `u_ambientLight[${index}].color`),
        intensity: this.gl.getUniformLocation(this.id, `u_ambientLight[${index}].intensity`),
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

  public updateAmbientLight = (lights: AmbientLight[]) => {
    for (let i = 0; i < lights.length; i++) {
      this.gl.uniform1f(this.uAmbientLight[i].intensity, lights[i].intensity);
      this.gl.uniform4fv(this.uAmbientLight[i].color, lights[i].color);
    }
    return this;
  }
}