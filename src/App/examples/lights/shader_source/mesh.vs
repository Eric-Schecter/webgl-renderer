#version 300 es

#define SPOT_LIGHT_COUNT 0
#define DIRECTIONAL_LIGHT_COUNT 0

layout(location=0)in vec3 a_position;
layout(location=1)in vec3 a_normal;
layout(location=2)in vec3 a_uv;

uniform mat4 u_projectMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;
uniform mat4 u_normalMatrix;

#if SPOT_LIGHT_COUNT>0

struct SpotLight{
    mediump vec4 color;
    mediump vec3 pos;
    mediump vec3 direction;
    mediump float cutOff;
    mediump float outerCutOff;
    mediump float intensity;
    mediump mat4 projMatrix;
    mediump mat4 viewMatrix;
};

uniform SpotLight u_spotLight[SPOT_LIGHT_COUNT];

out vec4 v_spotLightSpacePos[SPOT_LIGHT_COUNT];

#endif

#if DIRECTIONAL_LIGHT_COUNT>0

struct DirectionalLight{
    mediump vec4 color;
    mediump vec3 direction;
    mediump float intensity;
    mediump mat4 projMatrix;
    mediump mat4 viewMatrix;
};

uniform DirectionalLight u_directionalLight[DIRECTIONAL_LIGHT_COUNT];

out vec4 v_directionalLightSpacePos[DIRECTIONAL_LIGHT_COUNT];

#endif

out vec3 v_normal;
out vec3 v_worldPosition;

void main(){
    v_normal=(u_normalMatrix*vec4(a_normal,1.)).xyz;
    v_worldPosition=(u_modelMatrix*vec4(a_position,1.)).xyz;
    
    #if SPOT_LIGHT_COUNT>0
    
    for(int i=0;i<SPOT_LIGHT_COUNT;++i){
        v_spotLightSpacePos[i]=u_spotLight[i].projMatrix*u_spotLight[i].viewMatrix*u_modelMatrix*vec4(a_position,1.);
    }
    
    #endif
    
    #if DIRECTIONAL_LIGHT_COUNT>0
    
    for(int i=0;i<DIRECTIONAL_LIGHT_COUNT;++i){
        v_directionalLightSpacePos[i]=u_directionalLight[i].projMatrix*u_directionalLight[i].viewMatrix*u_modelMatrix*vec4(a_position,1.);
    }
    
    #endif
    
    gl_Position=u_projectMatrix*u_viewMatrix*u_modelMatrix*vec4(a_position,1.f);
}
