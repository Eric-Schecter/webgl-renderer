#version 300 es

layout(location=0)in vec3 a_position;

uniform mat4 u_projectMatrix;
uniform mat4 u_viewMatrix;

out vec3 v_pos;

void main(){
    v_pos=a_position;
    gl_Position=u_projectMatrix*u_viewMatrix*vec4(a_position,1.f);
}
