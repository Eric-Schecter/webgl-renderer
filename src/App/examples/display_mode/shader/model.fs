#version 300 es

precision mediump float;

uniform float u_alpha;

in vec3 v_pos;

out vec4 fColor;

void main(){
    vec3 color=(v_pos+vec3(1.f))/2.f;
    fColor=vec4(color,u_alpha);
}
