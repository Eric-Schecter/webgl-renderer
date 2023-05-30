#version 300 es

precision mediump float;

uniform vec3 u_lightPos;
uniform float u_far;

in vec3 v_position;

void main(){
  float dis=length(v_position-u_lightPos);
  gl_FragDepth=dis/u_far;
}
