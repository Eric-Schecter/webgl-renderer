export class Clock {
  public current = 0;
  private pre = performance.now();

  public reset = () => {
    this.current = 0;
    this.pre = performance.now();
  }

  public update = () => {
    this.current = (performance.now() - this.pre) / 1000;
    this.pre = performance.now();
  }
}