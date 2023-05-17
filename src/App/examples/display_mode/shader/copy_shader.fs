#version 300 es

precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_size;

out vec4 fColor;

void main(){
    vec2 uv=gl_FragCoord.xy/u_size;
    float z = texture(u_texture,uv).x;
    float n = 1.;
    float f = 1000.;
    float grey = (2.0 * n) / (f + n - z*(f-n));
    fColor=vec4(vec3(grey),1.);
}
