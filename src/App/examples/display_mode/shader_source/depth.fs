#version 300 es

precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_size;
uniform float u_depth_min;
uniform float u_depth_max;

out vec4 fColor;

// https://learnopengl.com/Advanced-OpenGL/Depth-testing
float linearizeDepth(float z,float n,float f){
    // z = z * 2. - 1.;
    return(2.*n)/(f+n-z*(f-n));
}

void main(){
    vec2 uv=gl_FragCoord.xy/u_size;
    float z=texture(u_texture,uv).x;
    float depth=linearizeDepth(z,u_depth_min,u_depth_max);
    fColor=vec4(vec3(z),1.);
}
