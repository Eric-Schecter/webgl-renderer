#version 300 es

precision mediump float;

uniform vec3 u_color;

out vec4 f_color;

void main(){
    f_color=vec4(u_color,0.5f);
}
