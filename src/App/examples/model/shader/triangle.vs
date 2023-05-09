#version 300 es

layout(location=0)in vec3 a_position;

out vec3 v_pos;

void main(){
    v_pos=a_position;
    gl_Position=vec4(a_position,1.f);
}
