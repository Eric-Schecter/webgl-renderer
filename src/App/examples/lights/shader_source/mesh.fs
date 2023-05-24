#version 300 es

precision mediump float;

struct AmbientLight{
    vec4 color;
    float intensity;
};

#define AMBIENT_LIGHT_COUNT 1

uniform AmbientLight u_ambientLight[AMBIENT_LIGHT_COUNT];
uniform vec3 u_color;

out vec4 f_color;

void main(){
    vec4 lightColor=vec4(0.);
    
    // ambient lights
    for(int i=0;i<AMBIENT_LIGHT_COUNT;++i){
        lightColor+=u_ambientLight[i].color*u_ambientLight[i].intensity;
    };
    
    f_color=vec4(u_color,1.f)*lightColor;
}
