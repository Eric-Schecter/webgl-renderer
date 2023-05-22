#version 300 es

precision mediump float;

uniform float u_alpha;
uniform sampler2D u_colorTexture;

in vec3 v_pos;
in vec3 v_normal;
in vec2 v_uv;
in mat3 v_TBN;

out vec4 fColor;

void main(){
    vec3 normal=texture(u_colorTexture,v_uv).xyz;
    normal=normalize(normal*2.-vec3(1.));
    normal=normalize(v_TBN*normal);
    fColor=vec4(normal,u_alpha);
    
    // vec3 color=(v_pos+vec3(1.f))/2.f;
    // fColor=texture(u_colorTexture,v_uv);
    // fColor.a=u_alpha;
}
