import { mat4, vec3, vec4 } from 'gl-matrix';

export class Camera {
  public projection = mat4.create();
  public view = mat4.create();
  public viewport = vec4.create();
  public pos = vec3.create();
  public up = vec3.fromValues(0,1,0);
  public setView = (focus: vec3) => {
    mat4.lookAt(this.view, this.pos, focus, this.up);
  }
  public setViewport = (x: number, y: number, width: number, height: number) => {
    this.viewport[0] = x;
    this.viewport[1] = y;
    this.viewport[2] = width;
    this.viewport[3] = height;
  }
  public setProjection = (fov: number, aspect: number, near: number, far: number) => {
    mat4.perspective(this.projection, fov, aspect, near, far);
  }
}