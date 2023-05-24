#version 300 es

precision mediump float;

struct AmbientLight{
    vec4 color;
    float intensity;
};

struct DirectionalLight{
    vec4 color;
    vec3 direction;
    float intensity;
};

struct Material{
    float specular;
    float shininess;
};

#define AMBIENT_LIGHT_COUNT 1
#define DIRECTIONAL_LIGHT_COUNT 1

uniform AmbientLight u_ambientLight[AMBIENT_LIGHT_COUNT];
uniform DirectionalLight u_directionalLight[DIRECTIONAL_LIGHT_COUNT];
uniform Material u_material;
uniform vec3 u_color;

in vec3 v_normal;

out vec4 f_color;

float calcDiffuseLight(vec3 normal,vec3 lightDir){
    return clamp(dot(-lightDir,normal),0.f,1.f);
}

float calcSpecularLight(vec3 viewDir,vec3 normal,vec3 lightDir){
    vec3 halfwayDir=normalize(lightDir-viewDir);//Blinn-Phong
    return pow(max(dot(normal,halfwayDir),0.),u_material.shininess);
}

vec4 calcColor(vec3 viewDir,vec3 normal,vec3 lightDir,vec4 color,float intensity){
    vec4 light=vec4(0.f);
    light+=calcDiffuseLight(normal,lightDir)*color;
    // light+=calcSpecularLight(viewDir,normal,lightDir)*u_material.specular*color;
    return light*intensity;
}

vec4 calcDirectionalLight(vec3 viewDir,vec3 normal,DirectionalLight light){
    return calcColor(viewDir,normal,normalize(light.direction),light.color,light.intensity);
}

void main(){
    vec4 lightColor=vec4(0.);

    vec3 normal = v_normal;
    
    vec3 viewDir=vec3(1.,1.,1.);
    
    // ambient lights
    for(int i=0;i<AMBIENT_LIGHT_COUNT;++i){
        lightColor+=u_ambientLight[i].color*u_ambientLight[i].intensity;
    };
    
    // directional lights
    for(int i=0;i<DIRECTIONAL_LIGHT_COUNT;++i){
        lightColor+=calcDirectionalLight(viewDir,normal,u_directionalLight[i]);
    };
    
    f_color=vec4(u_color,1.f)*lightColor;
}
