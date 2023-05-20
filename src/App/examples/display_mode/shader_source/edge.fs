#version 300 es

precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_size;
uniform float u_hCoef[9];
uniform float u_vCoef[9];

out vec4 fColor;

void main(){
    vec2 uv=gl_FragCoord.xy/u_size;
    
    vec2 offset[9];
    offset[0]=vec2(-1.,-1.);
    offset[1]=vec2(0.,-1.);
    offset[2]=vec2(1.,-1.);
    offset[3]=vec2(-1.,0.);
    offset[4]=vec2(0.,0.);
    offset[5]=vec2(1.,0.);
    offset[6]=vec2(-1.,1.);
    offset[7]=vec2(0.,1.);
    offset[8]=vec2(1.,1.);
    
    vec3 horizonColor=vec3(0.);
    vec3 verticalColor=vec3(0.);
    
    horizonColor+=texture(u_texture,(uv+offset[0]/u_size)).rgb*u_hCoef[0];
    horizonColor+=texture(u_texture,(uv+offset[1]/u_size)).rgb*u_hCoef[1];
    horizonColor+=texture(u_texture,(uv+offset[2]/u_size)).rgb*u_hCoef[2];
    horizonColor+=texture(u_texture,(uv+offset[3]/u_size)).rgb*u_hCoef[3];
    horizonColor+=texture(u_texture,(uv+offset[4]/u_size)).rgb*u_hCoef[4];
    horizonColor+=texture(u_texture,(uv+offset[5]/u_size)).rgb*u_hCoef[5];
    horizonColor+=texture(u_texture,(uv+offset[6]/u_size)).rgb*u_hCoef[6];
    horizonColor+=texture(u_texture,(uv+offset[7]/u_size)).rgb*u_hCoef[7];
    horizonColor+=texture(u_texture,(uv+offset[8]/u_size)).rgb*u_hCoef[8];
    
    verticalColor+=texture(u_texture,(uv+offset[0]/u_size)).rgb*u_vCoef[0];
    verticalColor+=texture(u_texture,(uv+offset[1]/u_size)).rgb*u_vCoef[1];
    verticalColor+=texture(u_texture,(uv+offset[2]/u_size)).rgb*u_vCoef[2];
    verticalColor+=texture(u_texture,(uv+offset[3]/u_size)).rgb*u_vCoef[3];
    verticalColor+=texture(u_texture,(uv+offset[4]/u_size)).rgb*u_vCoef[4];
    verticalColor+=texture(u_texture,(uv+offset[5]/u_size)).rgb*u_vCoef[5];
    verticalColor+=texture(u_texture,(uv+offset[6]/u_size)).rgb*u_vCoef[6];
    verticalColor+=texture(u_texture,(uv+offset[7]/u_size)).rgb*u_vCoef[7];
    verticalColor+=texture(u_texture,(uv+offset[8]/u_size)).rgb*u_vCoef[8];
    
    vec4 color=vec4(vec3(sqrt(horizonColor*horizonColor+verticalColor*verticalColor)),1.);
    fColor=color;
}
