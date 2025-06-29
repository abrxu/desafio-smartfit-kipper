import { Schedule } from "./schedule.interface";

export interface UnitLocation {
  id: number,
  title: string,
  content: string,
  opened: boolean,
  mask: string,
  towel: string,
  fountain: string,
  locker_room: string,
  schedules: Schedule[]
}