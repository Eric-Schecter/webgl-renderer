export abstract class WGLEvent {
  public abstract setup: () => void;
  public abstract dispose: () => void;
};