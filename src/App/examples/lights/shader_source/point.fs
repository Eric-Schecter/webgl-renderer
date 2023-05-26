#version 300 es

precision mediump float;

uniform vec4 u_color;

out vec4 f_color;

void main(){
    f_color=u_color;
}
