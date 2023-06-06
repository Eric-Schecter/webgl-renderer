#version 300 es

precision mediump float;

const float PI=3.14;

uniform vec3 u_color;

in vec2 v_uv;

out vec4 f_color;

mat2 rotate(float angle)
{
    angle*=PI/180.;
    float s=sin(angle),c=cos(angle);
    return mat2(c,-s,s,c);
}

void main(){
    vec2 uv=v_uv*rotate(-45.);
    float temp=fract(uv.y*60.);
    if(temp<1.&&temp>.5){
        f_color=vec4(vec3(0.),1.);
    }else{
        f_color=vec4(1.);
    }
}
