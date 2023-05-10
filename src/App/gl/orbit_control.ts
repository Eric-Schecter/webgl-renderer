import { vec2, vec3 } from 'gl-matrix';
import { Camera } from "./camera";
import { events, WGLEvent } from "./events";

class OrbitControlEvent extends WGLEvent {
  private startPos = vec2.create();
  constructor(private canvas: HTMLCanvasElement, private control: OrbitControl) {
    super();
  }
  public setup = () => {
    this.canvas.addEventListener('mousedown', this.mousedown);
  };

  public dispose = () => {
    this.canvas.removeEventListener('mousedown', this.mousedown);
  };

  private mousedown = (e: MouseEvent) => {
    this.canvas.addEventListener('mousemove', this.mousemove);
    this.canvas.addEventListener('mouseup', this.mouseup);
    this.startPos = this.getMousePos(e);
  }

  private mousemove = (e: MouseEvent) => {
    const currPos = this.getMousePos(e);
    const offset = vec2.sub(vec2.create(), currPos, this.startPos);
    this.control.rotateAzimuth(offset[0] * 0.01);
    this.control.rotatePolar(offset[1] * 0.01);
    this.control.setViewMatrix();
    this.startPos = currPos;
  }

  private mouseup = () => {
    this.canvas.removeEventListener('mousemove', this.mousemove);
    this.canvas.removeEventListener('mouseup', this.mouseup);
  }

  private getMousePos = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    return vec2.fromValues(clientX, -clientY);
  }
}

export class OrbitControl {
  private camera = new Camera();
  private minRadius = -Infinity;
  private maxRadius = Infinity;
  constructor(
    canvas: HTMLCanvasElement,
    private center: vec3,
    up: vec3,
    private radius: number,
    private azimuthAngle: number,
    private polarAngle: number
  ) {
    events.attach(new OrbitControlEvent(canvas, this));
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

  public get projectMatrix() {
    return this.camera.projection;
  }

  public get viewMatrix() {
    return this.camera.view;
  }
}