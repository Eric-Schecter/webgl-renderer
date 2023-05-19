#version 300 es

precision mediump float;

const float PI = 3.14;

uniform sampler2D u_texture;
uniform float u_nearestDepth;

in vec2 v_uv;

out vec4 fColor;

mat2 rotate(float angle)
{
    angle*=PI/180.;
    float s=sin(angle),c=cos(angle);
    return mat2(c,-s,s,c);
}

void main(){
    float depth=texture(u_texture,v_uv).x;
    if(depth>u_nearestDepth){
        discard;
    }
    
    vec2 uv = v_uv * rotate(-45.);
    float temp=fract(uv.y*60.);
    if(temp<1.&&temp>.5){
        fColor=vec4(vec3(0.),1.);
    }else{
        fColor=vec4(1.);
    }
}
