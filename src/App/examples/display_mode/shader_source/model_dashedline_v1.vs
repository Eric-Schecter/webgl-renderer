#version 300 es

layout(location=0)in vec3 a_position;

uniform mat4 u_projectMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

out vec3 v_pos;
flat out vec3 v_startPos;

// https://stackoverflow.com/questions/52928678/dashed-line-in-opengl3
void main(){
    v_pos=a_position;
    v_startPos=a_position;
    gl_Position=u_projectMatrix*u_viewMatrix*u_modelMatrix*vec4(a_position,1.f);
}
