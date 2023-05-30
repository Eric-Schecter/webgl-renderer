#version 300 es

precision mediump float;

#define AMBIENT_LIGHT_COUNT 0
#define DIRECTIONAL_LIGHT_COUNT 0
#define SPOT_LIGHT_COUNT 0
#define POINT_LIGHT_COUNT 0

#if DIRECTIONAL_LIGHT_COUNT>0||SPOT_LIGHT_COUNT>0||POINT_LIGHT_COUNT>0

float calcDiffuseLight(vec3 normal,vec3 lightDir){
    return clamp(dot(-lightDir,normal),0.f,1.f);
}

float calcSpecularLight(vec3 viewDir,vec3 normal,vec3 lightDir,float shininess){
    vec3 halfwayDir=normalize(lightDir-viewDir);//Blinn-Phong
    return pow(max(dot(normal,halfwayDir),0.),shininess);
}

vec4 calcColor(vec3 viewDir,vec3 normal,vec3 lightDir,vec4 color,float intensity,float specular,float shininess,float shadowFactor){
    vec4 light=vec4(0.f);
    light+=calcDiffuseLight(normal,lightDir)*color;
    // light+=calcSpecularLight(viewDir,normal,lightDir,shininess)*specular*color;
    return light*intensity*shadowFactor;
}

#endif

#if DIRECTIONAL_LIGHT_COUNT>0||SPOT_LIGHT_COUNT>0

float calcShadowFactor(vec4 lightSpacePos,vec3 normal,vec3 lightDir,sampler2D shadowMap){
    vec3 projCoords=lightSpacePos.xyz/lightSpacePos.w;
    projCoords=projCoords*.5+.5;
    float currentDepth=projCoords.z;
    if(currentDepth>1.){
        return 0.;
    }
    float bias=max(.0002*(1.-dot(normal,-lightDir)),.0001);
    
    //sample directly
    // float closestDepth=texture(shadowMap,projCoords.xy).x;
    // return currentDepth-bias>closestDepth?0.:1.;
    
    //PCF sample
    float shadow=0.;
    ivec2 texelSize=ivec2(1)/textureSize(shadowMap,0);
    for(int x=-1;x<=1;++x)
    {
        for(int y=-1;y<=1;++y)
        {
            float pcfDepth=texture(shadowMap,projCoords.xy+vec2(x,y)*vec2(texelSize)).r;
            shadow+=currentDepth-bias>pcfDepth?0.:1.;
        }
    }
    shadow/=9.;
    
    return shadow;
}

#endif

#if AMBIENT_LIGHT_COUNT>0

struct AmbientLight{
    vec4 color;
    float intensity;
};

uniform AmbientLight u_ambientLight[AMBIENT_LIGHT_COUNT];

#endif

#if DIRECTIONAL_LIGHT_COUNT>0

struct DirectionalLight{
    vec4 color;
    vec3 direction;
    float intensity;
    mat4 projMatrix;
    mat4 viewMatrix;
};

uniform sampler2D u_directionalLightShadowMap[DIRECTIONAL_LIGHT_COUNT];
uniform DirectionalLight u_directionalLight[DIRECTIONAL_LIGHT_COUNT];
in vec4 v_directionalLightSpacePos[1];

vec4 calcDirectionalLight(vec3 viewDir,vec3 normal,DirectionalLight light,float specular,float shininess,vec4 lightSpacePos,sampler2D shadowMap){
    float shadowFactor=calcShadowFactor(lightSpacePos,normal,light.direction,shadowMap);
    return calcColor(viewDir,normal,normalize(light.direction),light.color,light.intensity,specular,shininess,shadowFactor);
}

#endif

#if SPOT_LIGHT_COUNT>0

struct SpotLight{
    vec4 color;
    vec3 pos;
    vec3 direction;
    float cutOff;
    float outerCutOff;
    float intensity;
    mat4 projMatrix;
    mat4 viewMatrix;
};

uniform sampler2D u_spotLightShadowMap[SPOT_LIGHT_COUNT];
uniform SpotLight u_spotLight[SPOT_LIGHT_COUNT];
in vec4 v_spotLightSpacePos[SPOT_LIGHT_COUNT];

vec4 calcSpotLight(vec3 viewDir,vec3 normal,vec3 worldPosition,SpotLight light,float specular,float shininess,vec4 lightSpacePos,sampler2D shadowMap){
    vec4 color=vec4(0.);
    vec3 lightDir=normalize(worldPosition-light.pos);
    float thetaLight=dot(lightDir,normalize(light.direction));
    float thetaNormal=dot(-lightDir,normal);
    float epsilon=light.cutOff-light.outerCutOff;
    float index=clamp((thetaLight-light.outerCutOff)/epsilon,0.,1.f);
    float shadowFactor=calcShadowFactor(lightSpacePos,normal,lightDir,shadowMap);
    if(thetaLight>light.cutOff&&thetaNormal>0.f){
        color+=calcColor(viewDir,normal,lightDir,light.color,light.intensity,specular,shininess,shadowFactor)*index;
    }
    return color;
}

#endif

#if POINT_LIGHT_COUNT>0

struct PointLight{
    vec4 color;
    vec3 pos;
    float intensity;
    float constant;
    float linear;
    float quadratic;
    float far;
};

uniform PointLight u_pointLight[POINT_LIGHT_COUNT];
uniform samplerCube u_pointLightShadowMap[POINT_LIGHT_COUNT];

float calcShadowPoint(vec3 normal,vec3 posToLight,float far,samplerCube shadowMap){
    float closestDepth=texture(shadowMap,posToLight).r;
    closestDepth*=far;
    float currentDepth=length(posToLight);
    float bias=.01;
    return currentDepth-bias>closestDepth?0.:1.;
}

vec4 calcPointLight(vec3 viewDir,vec3 normal,vec3 worldPosition,PointLight light,float specular,float shininess,samplerCube shadowMap){
    vec3 lightDir=normalize(worldPosition-light.pos);
    float shadowFactor=calcShadowPoint(normal,worldPosition-light.pos,light.far,shadowMap);
    vec4 color=calcColor(viewDir,normal,lightDir,light.color,light.intensity,specular,shininess,shadowFactor);
    float dis=length(light.pos-worldPosition);
    float attenuation=1.f/(light.constant+light.linear*dis+light.quadratic*(dis*dis));
    return color*attenuation;
}

#endif

struct Material{
    float specular;
    float shininess;
};

uniform Material u_material;
uniform vec3 u_color;

in vec3 v_normal;
in vec3 v_worldPosition;

out vec4 f_color;

void main(){
    vec4 lightColor=vec4(0.);
    
    float faceDirection=gl_FrontFacing?1.:-1.;
    
    vec3 normal=v_normal*faceDirection;
    
    vec3 viewDir=vec3(1.,1.,1.);
    
    // ambient lights
    #if AMBIENT_LIGHT_COUNT>0
    for(int i=0;i<AMBIENT_LIGHT_COUNT;++i){
        lightColor+=u_ambientLight[i].color*u_ambientLight[i].intensity;
    };
    #endif
    
    // directional lights
    #if DIRECTIONAL_LIGHT_COUNT>0
    // todo: need to generate dynamic for shadowmap
    for(int i=0;i<DIRECTIONAL_LIGHT_COUNT;++i){
        lightColor+=calcDirectionalLight(viewDir,normal,u_directionalLight[i],u_material.specular,u_material.shininess,v_directionalLightSpacePos[i],u_directionalLightShadowMap[0]);
    };
    #endif
    
    // spot lights
    #if SPOT_LIGHT_COUNT>0
    // todo: need to generate dynamic for shadowmap
    for(int i=0;i<SPOT_LIGHT_COUNT;++i){
        lightColor+=calcSpotLight(viewDir,normal,v_worldPosition,u_spotLight[i],u_material.specular,u_material.shininess,v_spotLightSpacePos[i],u_spotLightShadowMap[0]);
    };
    #endif
    
    // point lights
    #if POINT_LIGHT_COUNT>0
    // todo: need to generate dynamic for shadowmap
    for(int i=0;i<POINT_LIGHT_COUNT;++i){
        lightColor+=calcPointLight(viewDir,normal,v_worldPosition,u_pointLight[i],u_material.specular,u_material.shininess,u_pointLightShadowMap[0]);
    };
    #endif
    
    f_color=vec4(u_color,1.f)*lightColor;
}
