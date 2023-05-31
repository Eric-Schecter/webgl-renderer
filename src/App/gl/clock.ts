export class Clock {
  public current = performance.now();
  public elapsedTime = 0;

  public reset = () => {
    this.elapsedTime = 0;
    this.current = performance.now();
  }

  public update = () => {
    this.elapsedTime = (performance.now() - this.current) / 1000;
    this.current = performance.now() / 1000;
  }
}