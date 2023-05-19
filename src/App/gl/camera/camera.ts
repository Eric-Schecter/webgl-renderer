import { mat4, vec3 } from 'gl-matrix';

export abstract class Camera {
  protected projection = mat4.create();
  protected view = mat4.create();
  public pos = vec3.create();
  public up = vec3.fromValues(0, 1, 0);
  public near = 0.1;
  public far = 1000;
  public setViewMatrix = (focus: vec3) => {
    mat4.lookAt(this.view, this.pos, focus, this.up);
    return this;
  }
  public get projectMatrix() {
    return this.projection;
  }

  public get viewMatrix() {
    return this.view;
  }
  public abstract setProjection: (...args: number[]) => Camera;
  public abstract updateAspect: (aspect: number) => Camera;
  public abstract update: () => void;
  public abstract zoom: (arg: any) => void;
}