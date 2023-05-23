#version 300 es

precision mediump float;

uniform float u_alpha;
uniform sampler2D u_colorTexture;
uniform sampler2D u_normalTexture;
uniform sampler2D u_metalRoughnessTexture;
uniform sampler2D u_occlusionTexture;
uniform sampler2D u_emissiveTexture;

in vec3 v_pos;
in vec3 v_normal;
in vec2 v_uv;
in mat3 v_TBN;

out vec4 fColor;

void main(){
    fColor=vec4(1.);

    // vec3 normal=texture(u_normalTexture,v_uv).xyz;
    // normal=normalize(normal*2.-vec3(1.));
    // normal=normalize(v_TBN*normal);
    // fColor=vec4(normal,u_alpha);
    
    fColor=texture(u_colorTexture,v_uv);
    
    // fColor+=texture(u_metalRoughnessTexture,v_uv);
    
    // fColor+=texture(u_occlusionTexture,v_uv);
    
    fColor+=texture(u_emissiveTexture,v_uv);
    
    fColor.a=u_alpha;
}
