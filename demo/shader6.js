// 顶点着色器   
const vertex =  /* wgsl */`
@vertex
fn main(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 3>(
    vec2(0.0, 0.5),
    vec2(-0.5, -0.5),
    vec2(0.5, -0.5)
  );

  return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
}
`

const fragment = /* wgsl */` 
@fragment
fn  main() -> @location(0) vec4<f32> {
    return vec4<f32>(1.0,0.0,0.0,1.0);
}   
`

export {vertex,fragment}




// 顶点 -> 顶点着色器  -> 图元装配 => 光栅化 => > 片元着色器 => 深度测试 => 像素写入