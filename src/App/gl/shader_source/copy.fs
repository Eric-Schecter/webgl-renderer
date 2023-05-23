#version 300 es

precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_size;
uniform int u_sslevel;

out vec4 fColor;

void main(){
    vec2 texelSize=vec2(1.)/u_size;
    vec2 uv=gl_FragCoord.xy/u_size;
    int sampleCount=u_sslevel/2;
    
    vec3 color=vec3(0.);
    for(int x=-sampleCount;x<=sampleCount;++x){
        for(int y=-sampleCount;y<=sampleCount;++y){
            color+=texture(u_texture,uv + vec2(x,y) * texelSize).rgb;
        }
    }
    
    float divider=pow(float(u_sslevel+1),2.);
    
    fColor=vec4(color/divider,1.);
}
