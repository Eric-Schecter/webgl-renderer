#version 300 es

layout(location = 0) in vec3 a_position;

uniform mat4 u_viewMatrix;
uniform mat4 u_projectMatrix;
uniform mat4 u_modelMatrix;

out vec3 v_position;

void main() {
    v_position = (u_modelMatrix * vec4(a_position,1.)).xyz;
    gl_Position = u_projectMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position,1.);
}
