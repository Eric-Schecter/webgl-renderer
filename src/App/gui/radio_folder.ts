import { Folder } from "./folder";

export class RadioFolder extends Folder {
  public addItem = (item: string, cb: Function, value = false) => {
    if (!this.data[item]) {
      this.data[item] = value;
    }
    this.folder
      .add(this.data, item)
      .name(item)
      .listen()
      .onChange((value: boolean) => {
        if (!value) {  // prevent self click to false
          return;
        }
        this.disableOthers(item);
        cb();
      });
  }
  private disableOthers = (item: string) => {
    Object.keys(this.data).forEach(key => this.data[key] = key === item);
  }
}