import { GUI } from "dat.gui";

export abstract class Folder {
  protected data: { [prop: string]: boolean } = {};
  constructor(protected folder: GUI, isOpened = true) {
    isOpened && this.folder.open();
  }
  public abstract addItem: (item: string, cb: Function, value: boolean) => void;
}