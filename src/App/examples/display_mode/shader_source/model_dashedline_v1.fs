#version 300 es

precision mediump float;

uniform float u_alpha;
uniform vec2 u_resolution;
uniform float u_dashSize;
uniform float u_gapSize;
uniform vec3 u_color;

in vec3 v_pos;
flat in vec3 v_startPos;

out vec4 fColor;

void main(){
    vec2 dir=(v_pos.xy-v_startPos.xy)*u_resolution/2.;
    float dist=length(dir);
    
    if(fract(dist/(u_dashSize+u_gapSize))>(u_dashSize/(u_dashSize+u_gapSize))){
        discard;
    }
    
    fColor=vec4(u_color,u_alpha);
}
