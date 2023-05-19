import { mat4, vec3 } from 'gl-matrix';
import { Camera } from './camera';

export class PerspectiveCamera extends Camera {
  private fov = 1;
  private aspect = 1;
  public setView = (focus: vec3) => {
    mat4.lookAt(this.view, this.pos, focus, this.up);
    return this;
  }
  public setProjection = (fov: number, aspect: number, near: number, far: number) => {
    this.aspect = aspect;
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.update();
    return this;
  }
  public updateAspect = (aspect: number) => {
    this.aspect = aspect;
    this.update();
    return this;
  }
  public update = () => {
    mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);
  }
  public zoom = (focus: vec3) => {
    this.setViewMatrix(focus);
  };
}