import { mat4 } from 'gl-matrix';
import { clamp } from '../utils';
import { Camera } from './camera';

export class OrthographicCamera extends Camera {
  private left = -1;
  private right = 1;
  private bottom = -1;
  private top = 1;
  private near = 0.1;
  private far = 1000;
  private _zoom = 1;
  private aspect = 1;

  public setProjection = (width: number, height: number, aspect: number, near: number, far: number) => {
    this.aspect = aspect;
    this.left = -width * aspect / (2 * this._zoom);
    this.right = width * aspect / (2 * this._zoom);
    this.bottom = -height / (2 * this._zoom);
    this.top = height / (2 * this._zoom);
    this.near = near;
    this.far = far;

    mat4.ortho(this.projection, this.left, this.right, this.bottom, this.top, near, far);
    return this;
  }
  public updateAspect = (aspect: number) => {
    const aspectTemp = aspect / this.aspect;
    mat4.ortho(this.projection, this.left * aspectTemp, this.right * aspectTemp, this.bottom, this.top, this.near, this.far);
    return this;
  }
  public zoom = (by: number) => {
    this._zoom = clamp(this._zoom - by, 0.01, 1000);
    const width = this.right - this.left;
    const height = this.bottom - this.top;
    const left = -width / (2 * this._zoom);
    const right = width / (2 * this._zoom);
    const bottom = height / (2 * this._zoom);
    const top = -height / (2 * this._zoom);

    mat4.ortho(this.projection, left, right, bottom, top, this.near, this.far);
  };
}