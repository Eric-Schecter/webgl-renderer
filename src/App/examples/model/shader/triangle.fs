#version 300 es

precision mediump float;

in vec3 v_pos;

out vec4 fColor;

void main(){
    vec3 color=(v_pos+vec3(1.f))/2.f;
    fColor=vec4(color,1.f);
}
