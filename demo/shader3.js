// 顶点着色器   
const vertex = /* wgsl */ `
// @group(0) @binding(0) var<uniform> S:mat4x4<f32>;
// @group(0) @binding(1) var<uniform> T:mat4x4<f32>;
@group(0) @binding(2) var<uniform> M:mat4x4<f32>;
@vertex
fn main(@location(0) pos: vec3<f32>) -> @builtin(position) vec4<f32> {
    // return S * T * vec4<f32>(pos,1.0);
    return M * vec4<f32>(pos,1.0);
}
`

const fragment = /* wgsl */ ` 
@fragment
fn  main() -> @location(0) vec4<f32> {
    return vec4<f32>(1.0,0.0,0.0,1.0);
}   
`

export {
    vertex,
    fragment
}




// 顶点 -> 顶点着色器  -> 图元装配 => 光栅化 => > 片元着色器 => 深度测试 => 像素写入