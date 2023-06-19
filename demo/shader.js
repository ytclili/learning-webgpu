// 顶点着色器   
const vertex =  /* wgsl */`
@vertex
fn main(@location(0) pos: vec3<f32>) -> @builtin(position) vec4<f32> {
    // var pos2 = vec4<f32>(pos,1.0);
    // pos2.x -= 1;
    // return pos2;
    return vec4<f32>(pos,1.0);
}
`

const fragment = /* wgsl */` 
@fragment
fn  main() -> @location(0) vec4<f32> {
    return vec4<f32>(1.0,0.0,0.0,1.0);
}   
`

export {vertex,fragment}