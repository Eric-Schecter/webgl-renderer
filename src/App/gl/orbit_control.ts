import { vec2, vec3 } from 'gl-matrix';
import { Camera } from "./camera";
import { WGLEvents, Disposable, EventInfo } from "./events";

class OrbitControlEvent implements Disposable {
  private startPos = vec2.create();
  constructor(private canvas: HTMLCanvasElement, private control: OrbitControl) {
    this.canvas.addEventListener('mousedown', this.mousedown);
  }

  public dispose = () => {
    this.canvas.removeEventListener('mousedown', this.mousedown);
  };

  private mousedown = (e: MouseEvent) => {
    this.canvas.addEventListener('mousemove', this.mousemoveDispatcher);
    WGLEvents.getInstance().register('mousemove', this.canvas, this.mousemove);
    this.canvas.addEventListener('mouseup', this.mouseupDispatcher);
    WGLEvents.getInstance().register('mouseup', this.canvas, this.mouseup);
    this.startPos = this.getMousePos(e);
  }

  private mousemoveDispatcher = (e: MouseEvent) => WGLEvents.getInstance().dispatch(new EventInfo('mousemove', this.canvas, e));

  private mousemove = (e: MouseEvent) => {
    const currPos = this.getMousePos(e);
    const offset = vec2.sub(vec2.create(), currPos, this.startPos);
    this.control.rotateAzimuth(offset[0] * 0.01);
    this.control.rotatePolar(-offset[1] * 0.01);
    this.control.setViewMatrix();
    this.startPos = currPos;
  }

  private mouseupDispatcher = (e: MouseEvent) => WGLEvents.getInstance().dispatch(new EventInfo('mouseup', this.canvas, e));

  private mouseup = () => {
    this.canvas.removeEventListener('mousemove', this.mousemoveDispatcher);
    WGLEvents.getInstance().unregister('mousemove', this.canvas, this.mousemove);
    this.canvas.removeEventListener('mouseup', this.mouseupDispatcher);
    WGLEvents.getInstance().unregister('mouseup', this.canvas, this.mouseup);
  }

  private getMousePos = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    return vec2.fromValues(clientX, -clientY);
  }
}

export class OrbitControl implements Disposable {
  private camera = new Camera();
  private minRadius = -Infinity;
  private maxRadius = Infinity;
  private event: Disposable;
  constructor(
    canvas: HTMLCanvasElement,
    private center: vec3,
    up: vec3,
    private radius: number,
    private azimuthAngle: number,
    private polarAngle: number
  ) {
    this.event = new OrbitControlEvent(canvas, this);
    this.camera.pos = this.getEye();
    this.camera.up = up;
  }
  public getEye() {
    const sineAzimuth = Math.sin(this.azimuthAngle);
    const cosineAzimuth = Math.cos(this.azimuthAngle);
    const sinePolar = Math.sin(this.polarAngle);
    const cosinePolar = Math.cos(this.polarAngle);

    const x = this.center[0] + this.radius * cosinePolar * cosineAzimuth;
    const y = this.center[1] + this.radius * sinePolar;
    const z = this.center[2] + this.radius * cosinePolar * sineAzimuth;

    return vec3.fromValues(x, y, z);
  }

  public getNormalizedViewVector() {
    return vec3.normalize(vec3.create(), vec3.sub(vec3.create(), vec3.clone(this.center), this.getEye()));
  }

  public setViewMatrix() {
    this.camera.pos = this.getEye();
    this.camera.setView(this.center);
    return this;
  }

  public setProjectMatrix(fov: number, aspect: number, near: number, far: number) {
    this.camera.setProjection(fov, aspect, near, far);
    return this;
  }

  public zoom(by: number) {
    this.radius = this.clamp(this.radius + by, this.minRadius, this.maxRadius);
    return this;
  }

  public moveHorizontal(distance: number) {
    const viewDir = this.getNormalizedViewVector();
    const strafeDir = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), viewDir, this.camera.up));
    vec3.add(this.center, vec3.clone(this.center), vec3.mul(vec3.create(), strafeDir, vec3.fromValues(distance, distance, distance)));
    return this;
  }

  public moveVertical(distance: number) {
    vec3.add(this.center, vec3.clone(this.center), vec3.mul(vec3.create(), this.camera.up, vec3.fromValues(distance, distance, distance)));
    return this;
  }

  public rotateAzimuth(radians: number) {
    const pi2 = Math.PI * 2;
    this.azimuthAngle = (this.azimuthAngle + radians) % pi2;
    if (this.azimuthAngle < 0) {
      this.azimuthAngle += pi2;
    }
    return this;
  }

  public rotatePolar(radians: number) {
    const piHalf = Math.PI / 2;
    this.polarAngle = this.clamp(this.polarAngle + radians, -piHalf, piHalf);
    return this;
  }

  private clamp = (value: number, min: number, max: number) => {
    return value < min
      ? min
      : value > max
        ? max
        : value;
  }

  public dispose = () => {
    this.event.dispose();
  };

  public get projectMatrix() {
    return this.camera.projection;
  }

  public get viewMatrix() {
    return this.camera.view;
  }
}