import Mesh from "../graphics/Mesh.js";
import { gl } from "../Engine.js";
import BaseGeometry, { AttributeInfo } from "./BaseGeometry.js";

//Shaders
const vsShader = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`;

const fsShader = `
  precision mediump float;

  uniform vec4 uColor;

    void main() {
        gl_FragColor = uColor;
    }
`;

const textureVsShader = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
    }
`;

const textureFsShader = `
  precision mediump float;

  uniform sampler2D uSampler;
  
  varying highp vec2 vTextureCoord;

    void main() {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
`;

export default class BoxGeometry extends BaseGeometry {
  constructor({ texture = undefined }) {
    super();

    this.texture = texture;

    //Reset the sources if the texture exists
    if (this.texture) {
      this.vsSource = textureVsShader;
      this.fsSource = textureFsShader;
    } else {
      //Set to the normal
      this.vsSource = vsShader;
      this.fsSource = fsShader;
    }

    this.textureName = "aTextureCoord";
    this.textureCoordinates = [
      // Front
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Back
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Top
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Bottom
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Right
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      // Left
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ];

    this.vertexName = "aVertexPosition";
    this.vertexPositionData = [
      // Front face
      -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

      // Back face
      -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

      // Top face
      -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

      // Right face
      1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

      // Left face
      -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ];

    this.indicesName = "indices";
    this.indices = [
      0,
      1,
      2,
      0,
      2,
      3, // front
      4,
      5,
      6,
      4,
      6,
      7, // back
      8,
      9,
      10,
      8,
      10,
      11, // top
      12,
      13,
      14,
      12,
      14,
      15, // bottom
      16,
      17,
      18,
      16,
      18,
      19, // right
      20,
      21,
      22,
      20,
      22,
      23, // left
    ];

    this.locations = { uProjectionMatrix: null, uModelViewMatrix: null };
  }

  /**
   * @param {Mesh} mesh
   */
  SetLocations(mesh) {
    const uProjectionMatrix =
      mesh.shader.GetUniformLocation("uProjectionMatrix");

    const uModelViewMatrix = mesh.shader.GetUniformLocation("uModelViewMatrix");

    this.locations = { uProjectionMatrix, uModelViewMatrix };
  }

  /**
   * @param {Mesh} mesh
   */
  BufferAllData(mesh) {
    mesh.BufferData(this.vertexName, this.vertexPositionData);
    mesh.BufferData(this.indicesName, this.indices);

    if (this.texture) {
      mesh.BufferData(this.textureName, this.textureCoordinates);
    }
  }

  /**
   * @param {Mesh} mesh
   */
  AddAttributeInfo(mesh) {
    const vertexLocation = mesh.shader.GetAttributeLocation(this.vertexName);
    mesh.AddAttribute(new AttributeInfo(vertexLocation, 0, 3, this.vertexName));

    if (this.texture) {
      const textureLocation = mesh.shader.GetAttributeLocation(
        this.textureName
      );

      mesh.AddAttribute(
        new AttributeInfo(textureLocation, 0, 2, this.textureName)
      );
    }
  }

  /**
   * @param {Mesh} mesh
   */
  Draw(mesh) {
    mesh.BindBuffer(this.vertexName);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 36);

    mesh.BindBuffer(this.indicesName);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    if (this.texture) {
      const sampler = mesh.shader.GetUniformLocation("uSampler");

      // Tell WebGL we want to affect texture unit 0
      gl.activeTexture(gl.TEXTURE0);

      // Bind the texture to texture unit 0
      gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);

      // Tell the shader we bound the texture to texture unit 0
      gl.uniform1i(sampler, 0);
    }
  }
}
