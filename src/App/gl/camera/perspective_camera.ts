import { mat4, vec3 } from 'gl-matrix';
import { Camera } from './camera';

export class PerspectiveCamera extends Camera {
  private fov = 1;
  private near = 0.1;
  private far = 1000;
  public setView = (focus: vec3) => {
    mat4.lookAt(this.view, this.pos, focus, this.up);
    return this;
  }
  public setProjection = (fov: number, aspect: number, near: number, far: number) => {
    mat4.perspective(this.projection, fov, aspect, near, far);
    this.fov = fov;
    this.near = near;
    this.far = far;
    return this;
  }
  public updateAspect = (aspect: number) => {
    mat4.perspective(this.projection, this.fov, aspect, this.near, this.far);
    return this;
  }
  public zoom = (focus: vec3) => {
    this.setViewMatrix(focus);
  };
}