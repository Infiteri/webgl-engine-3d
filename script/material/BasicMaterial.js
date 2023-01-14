import { gl } from "../Engine.js";
import { AttributeInfo } from "../geometry/BaseGeometry.js";
import Color from "../graphics/Color.js";
import Mesh from "../graphics/Mesh.js";
import { BindingColorTypes } from "../types.js";

export default class BasicMaterial {
  constructor(color = new Color(255, 0, 255, 255)) {
    this.color = color;

    this.bindingType = BindingColorTypes.uniform;
    this.lastType = this.bindingType;
  }

  SetTypeIfTexture(texture) {
    if (texture) {
      this.bindingType = BindingColorTypes.texture;
    }
  }

  /**
   * @param {Mesh} mesh
   */
  Bind(mesh) {
    if (this.bindingType === BindingColorTypes.attribute) {
    } else if (this.bindingType === BindingColorTypes.texture) {
    } else {
      const yes = mesh.shader.GetUniformLocation("uColor");

      gl.uniform4f(
        yes,
        this.color.floatR,
        this.color.floatG,
        this.color.floatB,
        this.color.floatA
      );
    }
  }
}
