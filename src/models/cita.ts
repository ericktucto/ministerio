import Model, { Attribute } from "./model";

export default class Cita extends Model {
  @Attribute
  protected date: string = '';
  @Attribute
  protected revisitaId: string = '';
  @Attribute
  protected description: string = '';
  @Attribute
  protected nextDate: string = '';

  setDate(date: string) {
    this.date = date;
  }
  getDate(): string {
    return this.date;
  }
  setDateObj(date: Date) {
    this.date = date.toString();
  }
  getDateObj(): Date {
    return new Date(this.date);
  }
  setRevisitaId(id: string) {
    this.revisitaId = id;
  }
  getRevisitaId(): string {
    return this.revisitaId;
  }
  setDescription(description: string) {
    this.description = description;
  }
  getDescription(): string {
    return this.description;
  }
  setNextDate(date: string) {
    this.nextDate = date;
  }
  getNextDate(): string {
    return this.nextDate;
  }
  setNextDateObj(date: Date) {
    this.nextDate = date.toString();
  }
  getNextDateObj(): Date {
    return new Date(this.nextDate);
  }
}

