import { Folder } from "./folder";

export class OptionFolder extends Folder {
  public addItem = (item: string, cb: Function, value = false) => {
    if (!this.data[item]) {
      this.data[item] = value;
    }
    this.folder
      .add(this.data, item)
      .name(item)
      .listen()
      .onChange((value: boolean) => {
        this.data[item] = value;
        cb(value);
      });
  }
}