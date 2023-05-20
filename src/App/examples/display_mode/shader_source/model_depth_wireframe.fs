#version 300 es

precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_size;

void main(){
    vec2 uv=gl_FragCoord.xy/u_size;
    float z=texture(u_texture,uv).x;
    gl_FragDepth =gl_FragCoord.z <= z ? 0. : gl_FragCoord.z;
}
