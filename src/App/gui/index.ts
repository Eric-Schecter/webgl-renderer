import { GUI } from "dat.gui";
import { throwErrorIfInvalid } from "../gl/utils";
import { RadioFolder } from "./radio_folder";

export class GUIHandler {
  private gui?: GUI;
  private static instance?: GUIHandler;
  public static getInstance = () => {
    if (!this.instance) {
      this.instance = new GUIHandler();
    }
    return this.instance;
  }
  private constructor() { }
  public append = (container: HTMLDivElement) => {
    if (this.gui) {
      console.log('gui has been added');
      return;
    }
    const gui = new GUI();
    container.appendChild(gui.domElement);
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '0';
    gui.domElement.style.right = '0';
    this.gui = gui;
  }
  public createRadioFolder = (folderName: string) => {
    const gui = throwErrorIfInvalid(this.gui);
    const folder = gui.addFolder(folderName);
    return new RadioFolder(folder);
  }
  public dispose = () => {
    this.gui = undefined;
  }
}