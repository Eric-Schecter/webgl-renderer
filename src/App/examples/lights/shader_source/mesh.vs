#version 300 es

layout(location=0)in vec3 a_position;
layout(location=1)in vec3 a_normal;
layout(location=2)in vec3 a_uv;

uniform mat4 u_projectMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;
uniform mat4 u_normalMatrix;

out vec3 v_normal;
out vec3 v_worldPosition;

void main(){
    v_normal = (u_normalMatrix*vec4(a_normal,1.)).xyz;
    v_worldPosition=(u_modelMatrix*vec4(a_position,1.)).xyz;

    gl_Position=u_projectMatrix*u_viewMatrix*u_modelMatrix*vec4(a_position,1.f);
}
