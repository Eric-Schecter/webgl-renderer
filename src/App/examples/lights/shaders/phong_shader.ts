import { mat4, vec3 } from "gl-matrix";
import { Shader } from "../../../gl/shader";
import { AmbientLight, DirectionalLight, Lights, PointLight, SpotLight } from "../lights";

type AmbientLightUniforms = {
  color: WebGLUniformLocation | null,
  intensity: WebGLUniformLocation | null,
}

type DirectionalLightUniforms = {
  color: WebGLUniformLocation | null,
  direction: WebGLUniformLocation | null,
  intensity: WebGLUniformLocation | null,
}

type SpotLightUniforms = {
  color: WebGLUniformLocation | null,
  pos: WebGLUniformLocation | null,
  direction: WebGLUniformLocation | null,
  cutOff: WebGLUniformLocation | null,
  outerCutOff: WebGLUniformLocation | null,
  intensity: WebGLUniformLocation | null,
  shadowmap: WebGLUniformLocation | null,
  projectMatrix: WebGLUniformLocation | null,
  viewMatrix: WebGLUniformLocation | null,
}

type PointLightUniforms = {
  color: WebGLUniformLocation | null,
  pos: WebGLUniformLocation | null,
  intensity: WebGLUniformLocation | null,
  constant: WebGLUniformLocation | null,
  linear: WebGLUniformLocation | null,
  quadratic: WebGLUniformLocation | null,
}

export class PhongShader extends Shader {
  private static updateShader(shader: string, lights: Lights) {
    shader = shader.replaceAll('#define AMBIENT_LIGHT_COUNT 0', '');
    shader = shader.replaceAll('#define DIRECTIONAL_LIGHT_COUNT 0', '');
    shader = shader.replaceAll('#define SPOT_LIGHT_COUNT 0', '');
    shader = shader.replaceAll('#define POINT_LIGHT_COUNT 0', '');

    shader = shader.replaceAll('AMBIENT_LIGHT_COUNT', lights.ambientLights.length.toString());
    shader = shader.replaceAll('DIRECTIONAL_LIGHT_COUNT', lights.ambientLights.length.toString());
    shader = shader.replaceAll('SPOT_LIGHT_COUNT', lights.spotLights.length.toString());
    shader = shader.replaceAll('POINT_LIGHT_COUNT', lights.pointLights.length.toString());

    return shader;
  }
  private uProjectMatrix;
  private uViewMatrix;
  private uModelMatrix;
  private uNormalMatrix;
  private uColor;
  private uAmbientLights: AmbientLightUniforms[] = [];
  private uDirectionalLights: DirectionalLightUniforms[] = [];
  private uSpotLights: SpotLightUniforms[] = [];
  private uPointLights: PointLightUniforms[] = [];
  constructor(gl: WebGL2RenderingContext, vs: string, fs: string, lights: Lights) {
    super(gl, PhongShader.updateShader(vs, lights), PhongShader.updateShader(fs, lights));
    this.uProjectMatrix = this.gl.getUniformLocation(this.id, 'u_projectMatrix');
    this.uViewMatrix = this.gl.getUniformLocation(this.id, 'u_viewMatrix');
    this.uModelMatrix = this.gl.getUniformLocation(this.id, 'u_modelMatrix');
    this.uNormalMatrix = this.gl.getUniformLocation(this.id, 'u_normalMatrix');
    this.uColor = this.gl.getUniformLocation(this.id, 'u_color');

    this.uAmbientLights = lights.ambientLights.map((light, index) => {
      return {
        color: this.gl.getUniformLocation(this.id, `u_ambientLight[${index}].color`),
        intensity: this.gl.getUniformLocation(this.id, `u_ambientLight[${index}].intensity`),
      }
    })

    this.uDirectionalLights = lights.directionalLights.map((light, index) => {
      return {
        color: this.gl.getUniformLocation(this.id, `u_directionalLight[${index}].color`),
        direction: this.gl.getUniformLocation(this.id, `u_directionalLight[${index}].direction`),
        intensity: this.gl.getUniformLocation(this.id, `u_directionalLight[${index}].intensity`),
      }
    })

    this.uSpotLights = lights.spotLights.map((light, index) => {
      return {
        color: this.gl.getUniformLocation(this.id, `u_spotLight[${index}].color`),
        pos: this.gl.getUniformLocation(this.id, `u_spotLight[${index}].pos`),
        direction: this.gl.getUniformLocation(this.id, `u_spotLight[${index}].direction`),
        cutOff: this.gl.getUniformLocation(this.id, `u_spotLight[${index}].cutOff`),
        outerCutOff: this.gl.getUniformLocation(this.id, `u_spotLight[${index}].outerCutOff`),
        intensity: this.gl.getUniformLocation(this.id, `u_spotLight[${index}].intensity`),
        projectMatrix: this.gl.getUniformLocation(this.id, `u_spotLight[${index}].projMatrix`),
        viewMatrix: this.gl.getUniformLocation(this.id, `u_spotLight[${index}].viewMatrix`),
        shadowmap: this.gl.getUniformLocation(this.id, `u_spotLightShadowMap[${index}]`),
      }
    })

    this.uPointLights = lights.pointLights.map((light, index) => {
      return {
        color: this.gl.getUniformLocation(this.id, `u_pointLight[${index}].color`),
        pos: this.gl.getUniformLocation(this.id, `u_pointLight[${index}].pos`),
        intensity: this.gl.getUniformLocation(this.id, `u_pointLight[${index}].intensity`),
        constant: this.gl.getUniformLocation(this.id, `u_pointLight[${index}].constant`),
        linear: this.gl.getUniformLocation(this.id, `u_pointLight[${index}].linear`),
        quadratic: this.gl.getUniformLocation(this.id, `u_pointLight[${index}].quadratic`),
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

  public updateNormalMatrix = (matrix: mat4) => {
    this.gl.uniformMatrix4fv(this.uNormalMatrix, false, matrix.values());
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

  public updateSpotLights = (lights: SpotLight[]) => {
    for (let i = 0; i < lights.length; i++) {
      this.gl.uniform1f(this.uSpotLights[i].intensity, lights[i].intensity);
      this.gl.uniform3fv(this.uSpotLights[i].pos, lights[i].pos);
      this.gl.uniform3fv(this.uSpotLights[i].direction, lights[i].direction);
      this.gl.uniform1f(this.uSpotLights[i].cutOff, lights[i].cutOff);
      this.gl.uniform1f(this.uSpotLights[i].outerCutOff, lights[i].outerCutOff);
      this.gl.uniform4fv(this.uSpotLights[i].color, lights[i].color);
      this.gl.uniformMatrix4fv(this.uSpotLights[i].viewMatrix, false, lights[i].viewMatrix);
      this.gl.uniformMatrix4fv(this.uSpotLights[i].projectMatrix, false, lights[i].projMatrix);

      const id = 0; // todo: need to be dynamic
      const { shadowmap } = lights[i];
      if (shadowmap) {
        this.gl.uniform1i(this.uSpotLights[i].shadowmap, id);
        shadowmap.bindForRead(id);
      }
    }
    return this;
  }

  public updatePointLights = (lights: PointLight[]) => {
    for (let i = 0; i < lights.length; i++) {
      this.gl.uniform1f(this.uPointLights[i].intensity, lights[i].intensity);
      this.gl.uniform3fv(this.uPointLights[i].pos, lights[i].pos);
      this.gl.uniform1f(this.uPointLights[i].constant, lights[i].constant);
      this.gl.uniform1f(this.uPointLights[i].linear, lights[i].linear);
      this.gl.uniform1f(this.uPointLights[i].quadratic, lights[i].quadratic);
      this.gl.uniform4fv(this.uPointLights[i].color, lights[i].color);
    }
    return this;
  }
}