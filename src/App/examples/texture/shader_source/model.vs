#version 300 es

layout(location=0)in vec3 a_position;
layout(location=1)in vec3 a_normal;
layout(location=2)in vec2 a_uv;
layout(location=3)in vec3 a_tangent;
layout(location=4)in vec3 a_biTangent;

uniform mat4 u_projectMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;
uniform mat4 u_normalMatrix;

out vec3 v_worldPosition;
out vec3 v_normal;
out vec2 v_uv;
out mat3 v_TBN;

void main(){
    v_normal=(u_normalMatrix*vec4(a_normal,1.)).xyz;
    v_worldPosition=(u_modelMatrix*vec4(a_position,1.)).xyz;
    v_uv=a_uv;
    
    vec3 T=normalize(u_normalMatrix*vec4(a_tangent,1.f)).xyz;
    vec3 N=normalize(u_normalMatrix*vec4(a_normal,1.f)).xyz;
    vec3 B=normalize(u_normalMatrix*vec4(a_biTangent,1.f)).xyz;
    v_TBN=mat3(T,B,N);
    
    gl_Position=u_projectMatrix*u_viewMatrix*u_modelMatrix*vec4(a_position,1.f);
}
