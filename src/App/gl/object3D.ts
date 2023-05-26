import { mat4, quat, vec3 } from "gl-matrix";

export class Object3D {
  public modelMatrix = mat4.create();

  private quaternion = quat.create();
  private rotateMatrix = mat4.create();

  public rotateByAxis = (axis: vec3) => {
    quat.fromEuler(this.quaternion, axis[0], axis[1], axis[2]);
    mat4.fromQuat(this.rotateMatrix, this.quaternion);
    mat4.multiply(this.modelMatrix, this.rotateMatrix, this.modelMatrix);
  }
}