import { vec2, vec3 } from 'gl-matrix';
import { Camera, OrthographicCamera } from "./camera";
import { WGLEvents, Disposable, EventInfo } from "./events";
import { clamp } from './utils';

class OrbitControlEvent implements Disposable {
  private startPos = vec2.create();
  constructor(private canvas: HTMLCanvasElement, private control: OrbitControl) {
    this.canvas.addEventListener('mousedown', this.mousedown);
    this.canvas.addEventListener('wheel', this.wheelDispatcher);
    WGLEvents.getInstance().register('wheel', this.canvas, this.wheel);
    this.canvas.addEventListener('contextmenu', this.disableContext);
  }

  public dispose = () => {
    this.canvas.removeEventListener('mousedown', this.mousedown);
    this.canvas.removeEventListener('contextmenu', this.disableContext);
  };

  private disableContext = (e: MouseEvent) => {
    e.preventDefault();
  }

  private wheelDispatcher = (e: MouseEvent) => WGLEvents.getInstance().dispatch(new EventInfo('wheel', this.canvas, e));

  private wheel = (e: WheelEvent) => {
    const { deltaY } = e;
    this.control.zoom(deltaY / 100);
  }

  private mousedown = (e: MouseEvent) => {
    this.canvas.addEventListener('mousemove', this.mousemoveDispatcher);
    WGLEvents.getInstance().register('mousemove', this.canvas, this.mousemove);
    this.canvas.addEventListener('mouseup', this.mouseupDispatcher);
    WGLEvents.getInstance().register('mouseup', this.canvas, this.mouseup);
    this.startPos = this.getMousePos(e);
  }

  private mousemoveDispatcher = (e: MouseEvent) => WGLEvents.getInstance().dispatch(new EventInfo('mousemove', this.canvas, e));

  private mousemove = (e: MouseEvent) => {
    const { buttons } = e;
    if (buttons === 1) {
      const currPos = this.getMousePos(e);
      const offset = vec2.sub(vec2.create(), currPos, this.startPos);
      this.control.rotateAzimuth(offset[0] * 0.01);
      this.control.rotatePolar(-offset[1] * 0.01);
      this.control.updateViewMatrix();
      this.startPos = currPos;
    } else if (buttons === 2) {
      const currPos = this.getMousePos(e);
      const offset = vec2.sub(vec2.create(), currPos, this.startPos);
      this.control.moveHorizontal(-offset[0] * 0.01);
      this.control.moveVertical(-offset[1] * 0.01);
      this.control.updateViewMatrix();
      this.startPos = currPos;
    }
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
  private m_minRadius = 0.1;
  private m_maxRadius = Infinity;
  private event: Disposable;
  constructor(
    canvas: HTMLCanvasElement,
    public camera: Camera,
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

  public updateViewMatrix() {
    this.camera.pos = this.getEye();
    this.camera.setViewMatrix(this.center);
    return this;
  }

  public zoom(by: number) {
    this.radius = clamp(this.radius + by, this.m_minRadius, this.m_maxRadius);
    this.camera.pos = this.getEye();
    if (this.camera instanceof OrthographicCamera) {
      const ratio = 10;
      this.camera.zoom(by / ratio);
    } else {
      this.camera.zoom(this.center);
    }
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
    this.polarAngle = clamp(this.polarAngle + radians, -piHalf, piHalf);
    return this;
  }

  public dispose = () => {
    this.event.dispose();
  };

  public get projectMatrix() {
    return this.camera.projectMatrix;
  }

  public get viewMatrix() {
    return this.camera.viewMatrix;
  }

  public set minRadius(value: number) {
    this.m_minRadius = value;
  };

  public set maxRadius(value: number) {
    this.m_maxRadius = value;
  };
}