
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
fn main(@builtin(position) fragCoord:vec4<f32>) -> @location(0) vec4<f32> {
    // var x = fragCoord.x;
    // var y = fragCoord.y;
    // if(x < 400.0 && y < 150.0){
    //     return vec4<f32>(1.0,0.0,0.0,1.0);
    // }else {
    //     return vec4<f32>(0.0,0.0,1.0,1.0);
    // }
    // z 为深度值 范围 0-1  x为屏幕坐标值
    var z = fragCoord.z;
    // var per = (x-300.0) / 300.0;
    // return vec4<f32>(per,0.0,1.0 - per,1.0);
    // if(z > 0.5){
    //     return vec4<f32>(1.0,0.0,0.0,1.0);
    // }else {
    //     return vec4<f32>(0.0,0.0,1.0,1.0);
    // }
    return vec4<f32>(z,0.0, 1.0-z, 1.0);
}   
`

export {vertex,fragment}




// 顶点 -> 顶点着色器  -> 图元装配 => 光栅化 => > 片元着色器 => 深度测试 => 像素写入