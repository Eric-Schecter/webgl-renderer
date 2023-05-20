#version 300 es

precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_size;

out vec4 fColor;

void main(){
    vec2 uv=gl_FragCoord.xy/u_size;
    fColor=texture(u_texture,uv);
}
