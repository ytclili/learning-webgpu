// 顶点着色器   
const vertex = /* wgsl */ `
@group(0) @binding(0) var<uniform> S:mat4x4<f32>;
@group(0) @binding(1) var<uniform> T:mat4x4<f32>;
@group(0) @binding(2) var<uniform> F:f32;
@vertex
fn main(@location(0) pos: vec3<f32>) -> @builtin(position) vec4<f32> {
    // var S:mat4x4<f32> = mat4x4<f32>(
    //     0.5,0.0,0.0,0.0,
    //     0.0,0.5,0.0,0.0,
    //     0.0,0.0,1.0,0.0,
    //     0.0,0.0,0.0,1.0
    // );
    // var T:mat4x4<f32> = mat4x4<f32>(
    //     1.0,0.0,0.0,0.0,
    //     0.0,1.0,0.0,0.0,
    //     0.0,0.0,1.0,0.0,
    //     -1.0,-1.0,0.0,1.0 ,
    // ); 

      var S1:mat4x4<f32> = mat4x4<f32>(
        F,0.0,0.0,0.0,
        0.0,F,0.0,0.0,
        0.0,0.0,1.0,0.0,
        0.0,0.0,0.0,1.0
    );
    return S * S1 * T * vec4<f32>(pos,1.0);
}
`

const fragment = /* wgsl */ ` 
@group(0) @binding(3) var<uniform> color:vec3<f32>;

@fragment
fn  main() -> @location(0) vec4<f32> {
    return vec4<f32>(color,1.0);
}   
`

export {
    vertex,
    fragment
}




// 顶点 -> 顶点着色器  -> 图元装配 => 光栅化 => > 片元着色器 => 深度测试 => 像素写入