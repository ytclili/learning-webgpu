import { App } from "./app";
const main = () => {
  let app = new App();
  app.CreateCanvas(document.body);
  app.InitWebGPU();
};
window.addEventListener("DOMContentLoaded", main);
