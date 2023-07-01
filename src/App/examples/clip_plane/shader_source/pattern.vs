#version 300 es

layout(location=0)in vec3 a_position;
layout(location=1)in vec2 a_uv;

uniform mat4 u_projectMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

out vec2 v_uv;

void main(){
    v_uv=a_uv;
    gl_Position=u_projectMatrix*u_viewMatrix*u_modelMatrix*vec4(a_position,1.f);
}
