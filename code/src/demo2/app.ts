export class App {
  public canvas: HTMLCanvasElement;
  public context: GPUCanvasContext;
  public devicePixelWidth: number;
  public devicePixelHeight: number;
  public adapter: GPUAdapter;
  public device: GPUDevice;
  public format: GPUTextureFormat = "bgra8unorm";
  public commandEncoder: GPUCommandEncoder;
  public renderPassEncoder: GPURenderPassEncoder;
  public uniformGroupLayout: GPUBindGroupLayout;
  public renderPipeline: GPURenderPipeline;

  public CreateCanvas(rootElement: HTMLElement) {
    let width = rootElement.clientWidth;
    let height = rootElement.clientHeight;
    this.devicePixelWidth = width * window.devicePixelRatio;
    this.devicePixelHeight = height * window.devicePixelRatio;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.devicePixelWidth;
    this.canvas.height = this.devicePixelHeight;
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    rootElement.appendChild(this.canvas);
  }

  public async InitWebGPU() {
    this.context = this.canvas.getContext("webgpu") as GPUCanvasContext;
    if (this.context) {
      console.info(`Congratulations! You've got a WebGPU context!`);
    } else {
      throw new Error("Your browser seems not support WebGPU!");
    }
    this.adapter = await navigator.gpu.requestAdapter({
      powerPreference: "high-performance",
    });
    this.device = await this.adapter.requestDevice();
    this.format = navigator.gpu.getPreferredCanvasFormat();
    this.context.configure({
      device: this.device,
      // rgba颜色格式
      format: this.format,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
  }

  public InitRenderPass(clearColor: GPUColorDict) {
    // 创建GPU指令编码器
    this.commandEncoder = this.device.createCommandEncoder();
    let renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          loadOp: "clear",
          storeOp: "store",
          // 清屏颜色
          clearValue: clearColor,
        },
      ],
    };
    this.renderPassEncoder =
      this.commandEncoder.beginRenderPass(renderPassDescriptor);
    this.renderPassEncoder.setViewport(
      0,
      0,
      this.devicePixelWidth,
      this.devicePixelHeight,
      0,
      1
    );
  }
  public InitRenderPipeline(vxCode: string, fxCode: string) {
    this.uniformGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {
            type: "uniform",
          },
        },
      ],
    });

    let layout: GPUPipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [this.uniformGroupLayout],
    });

    let vxModule: GPUShaderModule = this.device.createShaderModule({
      code: vxCode,
    });

    let fxModule: GPUShaderModule = this.device.createShaderModule({
      code: fxCode,
    });

    this.renderPipeline = this.device.createRenderPipeline({
      layout: layout,

      vertex: {
        buffers: [
          {
            arrayStride: 4 * 3,

            attributes: [
              // position

              {
                shaderLocation: 0,

                offset: 0,

                format: "float32x3",
              },
            ],
          },
        ],

        module: vxModule,

        entryPoint: "main",
      },

      // fragment: {
      //   module: fxModule,

      //   entryPoint: "main",

      //   targets: [
      //     {
      //       format: this.format,
      //     },
      //   ],
      // },

      primitive: {
        topology: "triangle-list",
      },
    });

    this.renderPassEncoder.setPipeline(this.renderPipeline);
  }

  public InitGPUBufferWithMultiBuffers(
    vxArray: Float32Array,
    colorArray: Float32Array,
    idxArray: Uint32Array,
    mxArray: Float32Array
  ) {
    let vertexBuffer = this._CreateGPUBuffer(vxArray, GPUBufferUsage.VERTEX);

    this.renderPassEncoder.setVertexBuffer(0, vertexBuffer);

    let colorBuffer = this._CreateGPUBuffer(colorArray, GPUBufferUsage.VERTEX);

    this.renderPassEncoder.setVertexBuffer(1, colorBuffer, 0);

    let indexBuffer = this._CreateGPUBuffer(idxArray, GPUBufferUsage.INDEX);

    this.renderPassEncoder.setIndexBuffer(indexBuffer, "uint32");

    let uniformBuffer = this._CreateGPUBuffer(mxArray, GPUBufferUsage.UNIFORM);

    let uniformBindGroup = this.device.createBindGroup({
      layout: this.uniformGroupLayout,

      entries: [
        {
          binding: 0,

          resource: { buffer: uniformBuffer },
        },
      ],
    });

    this.renderPassEncoder.setBindGroup(0, uniformBindGroup);
  }

  public InitPipelineWitMultiBuffers(vxCode: string, fxCode: string) {
    this.uniformGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,

          visibility: GPUShaderStage.VERTEX,

          buffer: {
            type: "uniform",
          },
        },
      ],
    });

    let layout: GPUPipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [this.uniformGroupLayout],
    });

    let vxModule: GPUShaderModule = this.device.createShaderModule({
      code: vxCode,
    });

    let fxModule: GPUShaderModule = this.device.createShaderModule({
      code: fxCode,
    });

    this.renderPipeline = this.device.createRenderPipeline({
      layout: layout,

      vertex: {
        buffers: [
          {
            arrayStride: 4 * 3,

            attributes: [
              // position

              {
                shaderLocation: 0,

                offset: 0,

                format: "float32x3",
              },
            ],

            stepMode: "vertex",
          },

          {
            arrayStride: 4 * 4,

            attributes: [
              // color
              {
                shaderLocation: 1,

                offset: 0,

                format: "float32x4",
              },
            ],

            stepMode: "instance",
          },
        ],

        module: vxModule,

        entryPoint: "main",
      },

      fragment: {
        module: fxModule,

        entryPoint: "main",

        targets: [
          {
            format: this.format,
          },
        ],
      },

      primitive: {
        topology: "triangle-list",
      },
    });

    this.renderPassEncoder.setPipeline(this.renderPipeline);
  }

  private _CreateGPUBuffer(typedArray: any, usage: GPUBufferUsageFlags) {
    let gpuBuffer = this.device.createBuffer({
      size: typedArray.byteLength,

      usage: usage | GPUBufferUsage.COPY_DST,

      mappedAtCreation: true,
    });

    let constructor = typedArray.constructor as new (
      buffer: ArrayBuffer
    ) => any;

    let view = new constructor(gpuBuffer.getMappedRange());

    view.set(typedArray, 0);

    gpuBuffer.unmap();

    return gpuBuffer;
  }

  public InitGPUBuffer(
    vxArray: Float32Array,
    idxArray: Uint32Array,
    mxArray: Float32Array
  ) {
    let vertexBuffer = this._CreateGPUBuffer(vxArray, GPUBufferUsage.VERTEX);

    this.renderPassEncoder.setVertexBuffer(0, vertexBuffer);

    let indexBuffer = this._CreateGPUBuffer(idxArray, GPUBufferUsage.INDEX);

    this.renderPassEncoder.setIndexBuffer(indexBuffer, "uint32");

    let uniformBuffer = this._CreateGPUBuffer(mxArray, GPUBufferUsage.UNIFORM);

    let uniformBindGroup = this.device.createBindGroup({
      layout: this.uniformGroupLayout,

      entries: [
        {
          binding: 0,

          resource: { buffer: uniformBuffer },
        },
      ],
    });

    this.renderPassEncoder.setBindGroup(0, uniformBindGroup);
  }
  public Draw(indexCount: number) {
    this.renderPassEncoder.drawIndexed(indexCount, 1, 0, 0, 0);
  }

  public Present() {
    this.renderPassEncoder.end();

    this.device.queue.submit([this.commandEncoder.finish()]);
  }
}
