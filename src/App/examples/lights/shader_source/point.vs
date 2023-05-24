#version 300 es

layout(location=0)in vec3 a_position;

uniform mat4 u_projectMatrix;
uniform mat4 u_viewMatrix;

void main(){
    gl_Position=u_projectMatrix*u_viewMatrix*vec4(a_position,1.f);
}
