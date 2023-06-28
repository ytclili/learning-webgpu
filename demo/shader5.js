// 顶点着色器   
const vertex =  /* wgsl */`
struct Out {
    @builtin(position) position: vec4<f32>,
    @location(0) vPosition: vec4<f32>,
    // @location(0) vPosition: vec3<f32>,
    @location(1) vColor: vec3<f32>,
}
struct Input {
    @location(0) pos: vec4<f32>,
    @location(1) vColor:vec3<f32>
}
@group(0) @binding(0) var<uniform> modelMatrix: mat4x4<f32>;
@vertex
fn main(input: Input) -> Out {
    var out: Out;
    out.position = modelMatrix * input.pos;
    // out.vPosition = pos;
    // out.vPosition = (modelMatrix * vec4<f32>(pos,1.0)).xyz ;
    out.vPosition = modelMatrix * input.pos;
    out.vColor = input.vColor;
    return out;
}
`

const fragment = /* wgsl */` 
struct Input {
    @location(0) vPosition:vec4<f32>,
    @location(1) vColor:vec3<f32>
}
@fragment
fn main(input: Input) -> @location(0) vec4<f32> {
    // if(vPosition.x > 0.5){
    //     return vec4<f32>(1.0,0.0,0.0,1.0);
    // }else {
    //     return vec4<f32>(0.0,0.0,1.0,1.0);
    // }
    // return vec4<f32>(vPosition.x, 0.0, 1.0-vPosition.x, 1.0);

    return vec4<f32>(input.vColor,1.0);
}   
`

export {vertex,fragment}




// 顶点 -> 顶点着色器  -> 图元装配 => 光栅化 => > 片元着色器 => 深度测试 => 像素写入