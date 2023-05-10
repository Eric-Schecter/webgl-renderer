import { mat4, vec3 } from 'gl-matrix';

export class Camera {
  public projection = mat4.create();
  public view = mat4.create();
  public pos = vec3.create();
  public up = vec3.fromValues(0,1,0);
  public setView = (focus: vec3) => {
    mat4.lookAt(this.view, this.pos, focus, this.up);
  }
  public setProjection = (fov: number, aspect: number, near: number, far: number) => {
    mat4.perspective(this.projection, fov, aspect, near, far);
  }
}