#version 300 es

layout(location=0)in vec3 a_position;
layout(location=1)in vec3 a_normal;
layout(location=2)in float a_lineDistance;

uniform mat4 u_projectMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;
// uniform float scale;
const float scale=1.f;

out vec3 v_pos;
out float v_lineDistance;

// https://stackoverflow.com/questions/52928678/dashed-line-in-opengl3
// https://webglfundamentals.org/webgl/lessons/webgl-qna-pure-webgl-dashed-line.html
void main(){
    v_pos=a_position;
    v_lineDistance=scale*a_lineDistance;
    gl_Position=u_projectMatrix*u_viewMatrix*u_modelMatrix*vec4(a_position,1.f);
}
