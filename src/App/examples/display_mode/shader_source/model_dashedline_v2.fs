#version 300 es

precision mediump float;

uniform float u_alpha;
uniform float u_dashSize;
uniform float u_gapSize;

in vec3 v_pos;
in float v_lineDistance;

out vec4 fColor;

void main(){
    if(mod(v_lineDistance,(u_dashSize+u_gapSize))>u_dashSize){
        discard;
    }
    fColor=vec4(vec3(1.f),u_alpha);
}
