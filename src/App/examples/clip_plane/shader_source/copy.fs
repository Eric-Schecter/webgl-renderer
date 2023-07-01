#version 300 es

precision mediump float;

uniform sampler2D u_textureBorder;
uniform sampler2D u_texturePattern;
uniform vec2 u_size;

out vec4 fColor;

void main(){
    vec2 uv=gl_FragCoord.xy/u_size;
    vec4 boderColor=texture(u_textureBorder,uv);
    vec4 patternColor=texture(u_texturePattern,uv);
    fColor=boderColor+patternColor;
    
    // set black color to transparent
    if(fColor.r==0.&&fColor.g==0.&&fColor.b==0.){
        fColor.a=0.f;
    }
}
