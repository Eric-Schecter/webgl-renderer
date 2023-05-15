export class EventInfo {
  private m_type: string;
  constructor(type: string, dispatcher: Object, private m_data?: any) {
    this.m_type = type + dispatcher.toString();
  }
  public get type() {
    return this.m_type;
  }
  public get data() {
    return this.m_data;
  }
}