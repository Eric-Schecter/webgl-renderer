import { GUI } from "dat.gui";
import { throwErrorIfInvalid } from "../gl/utils";
import { Folder } from "./folder";

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
  public createFolder = (folderName: string, folderType: { new(gui: GUI): Folder }) => {
    return new folderType(throwErrorIfInvalid(this.gui).addFolder(folderName));
  }
  public dispose = () => {
    this.gui = undefined;
  }
}