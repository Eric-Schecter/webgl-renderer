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
        this.disableOthers(item);
        if (!value) {  // prevent call function when self click to false
          return;
        }
        cb(value);
      });
  }
  private disableOthers = (item: string) => {
    Object.keys(this.data).forEach(key => this.data[key] = key === item);
  }
}