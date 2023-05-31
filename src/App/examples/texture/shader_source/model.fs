#version 300 es

precision mediump float;

uniform float u_alpha;
uniform sampler2D u_colorTexture;
uniform sampler2D u_normalTexture;
uniform sampler2D u_metalRoughnessTexture;
uniform sampler2D u_occlusionTexture;
uniform sampler2D u_emissiveTexture;
uniform vec3 u_camaraPos;

in vec3 v_worldPosition;
in vec3 v_normal;
in vec2 v_uv;
in mat3 v_TBN;

out vec4 fColor;

const vec3 lightPos=vec3(1.,1.,0.);
const vec4 lightColor=vec4(1.);
const float intensity=.5;
const float constant=1.;
const float linear=.09;
const float quadratic=.032;

float calcDiffuseLight(vec3 normal,vec3 lightDir){
    return clamp(dot(-lightDir,normal),0.f,1.f);
}

vec4 calcColor(vec3 viewDir,vec3 normal,vec3 lightDir,vec4 color,float intensity,float specular,float shininess){
    vec4 light=vec4(0.f);
    light+=calcDiffuseLight(normal,lightDir)*color;
    // light+=calcSpecularLight(viewDir,normal,lightDir,shininess)*specular*color;
    return light*intensity;
}

vec4 calcPointLight(vec3 viewDir,vec3 normal,vec3 worldPosition,float specular,float shininess){
    vec3 lightDir=normalize(worldPosition-lightPos);
    vec4 color=calcColor(viewDir,normal,lightDir,lightColor,intensity,specular,shininess);
    float dis=length(lightPos-worldPosition);
    float attenuation=1.f/(constant+linear*dis+quadratic*(dis*dis));
    return color*attenuation;
}

void main(){
    fColor=texture(u_colorTexture,v_uv);
    
    vec3 normal=texture(u_normalTexture,v_uv).xyz;
    normal=normalize(normal*2.-vec3(1.));
    normal=normalize(v_TBN*normal);
    
    vec3 viewDir=normalize(u_camaraPos-v_worldPosition);
    
    fColor+=calcPointLight(viewDir,normal,v_worldPosition,0.,0.);
    
    // fColor+=texture(u_metalRoughnessTexture,v_uv);
    
    fColor+=texture(u_emissiveTexture,v_uv);
    
    // float aoMapIntensity=1.;
    // fColor*=((texture(u_occlusionTexture,v_uv).r-1.)*aoMapIntensity+1.);
    
    fColor.a=u_alpha;
}
