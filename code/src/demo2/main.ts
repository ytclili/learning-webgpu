import { App } from "./app";
import { Matrix4, PerspectiveCamera } from "three";
import vxCode from "./shader/vertex.wgsl";
import fxCode from "./shader/fragment.wgsl";

const triangleVertex = new Float32Array([
  0.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0,
]);
// 索引
const triangleIndex = new Uint32Array([0, 1, 2]);

const triangleMVMatrix = new Matrix4().makeTranslation(-1.5, 0.0, -7.0);

const squareVertex = new Float32Array([
  1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0,
]);

const squareIndex = new Uint32Array([0, 1, 2, 1, 2, 3]);
const squareMVMatrix = new Matrix4().makeTranslation(1.5, 0.0, -7.0);

const main = async () => {
  let camera = new PerspectiveCamera(
    45,
    document.body.clientWidth / document.body.clientHeight,
    0.1,
    100
  );

  let pMatrix = camera.projectionMatrix;

  let triangleUniformBufferView = new Float32Array(
    pMatrix.toArray().concat(triangleMVMatrix.toArray())
  );

  let squareUniformBufferView = new Float32Array(
    pMatrix.toArray().concat(squareMVMatrix.toArray())
  );

  let backgroundColor = { r: 0, g: 0, b: 0, a: 1.0 };

  let app = new App();
  app.CreateCanvas(document.body);
  await app.InitWebGPU();
  app.InitRenderPass(backgroundColor);
  app.InitRenderPipeline(vxCode, fxCode);
  app.InitGPUBuffer(triangleVertex, triangleIndex, triangleUniformBufferView);
  app.Draw(triangleIndex.length);
  app.InitGPUBuffer(squareVertex, squareIndex, squareUniformBufferView);

  app.Draw(squareIndex.length);

  app.Present();
};
window.addEventListener("DOMContentLoaded", main);
