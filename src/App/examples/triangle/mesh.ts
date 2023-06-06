import { Disposable } from "../../gl/events";
import { AbstractMesh } from "../../gl/mesh";

export class Mesh extends AbstractMesh implements Disposable{
  private vbo: WebGLBuffer;
  private ibo: WebGLBuffer;
  constructor(gl: WebGL2RenderingContext, vertices: number[], indices: number[]) {
    super(gl);
    this.size = indices.length;

    // init
    this.vao = this.gl.createVertexArray() as WebGLVertexArrayObject;
    this.vbo = this.gl.createBuffer() as WebGLBuffer;
    this.ibo = this.gl.createBuffer() as WebGLBuffer;
    // bind
    this.gl.bindVertexArray(this.vao);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    // pass data to buffer
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
    // bind buffer to variable in gpu
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 24, 0);
    this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, 24, 12);
    // enable varialbe
    this.gl.enableVertexAttribArray(0);
    this.gl.enableVertexAttribArray(1);
    // reset
    this.gl.bindVertexArray(null);
  }

  public dispose() {
    this.gl.deleteVertexArray(this.vao);
    this.gl.deleteBuffer(this.vbo);
    this.gl.deleteBuffer(this.ibo);
  }
}