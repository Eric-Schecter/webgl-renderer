#version 300 es

precision mediump float;

uniform vec4 u_plane;
uniform int u_needrenderplane;

in vec3 v_pos;

out vec4 f_color;

void main(){
    if(u_needrenderplane==1&&dot(v_pos,u_plane.xyz)>u_plane.w){
        discard;
    }
    vec3 color=(v_pos+vec3(1.f))/2.f;
    f_color=vec4(color,1.f);
}
