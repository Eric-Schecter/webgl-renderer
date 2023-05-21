#version 300 es

precision mediump float;

uniform float u_alpha;
uniform sampler2D u_colorTexture;

in vec3 v_pos;
in vec3 v_normal;
in vec2 v_uv;

out vec4 fColor;

void main(){
    // vec3 color=(v_pos+vec3(1.f))/2.f;
    fColor=texture(u_colorTexture,v_uv);
    fColor.a = u_alpha;
}
