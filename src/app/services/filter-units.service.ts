import { Injectable } from '@angular/core';
import { UnitLocation } from '../types/location.interface';

const OPENING_HOURS = {
  morning: {
    first: '06',
    last: '12'
  },
  afternoon: {
    first: '12',
    last: '18'
  },
  night: {
    first: '18',
    last: '23'
  }
}

type HOUR_INDEXES = 'morning' | 'afternoon' | 'night'

@Injectable({
  providedIn: 'root'
})
export class FilterUnitsService {

  constructor() { }

  transformWeekday(weekday: number) {
    switch (weekday) {
      case 0:
        return 'Dom.'
      case 6:
        return 'Sáb.'
      default:
        return 'Seg. à Sex.'
    }
  }

  filterUnits(unit: UnitLocation, open_hour: string, close_hour: string): boolean {
    if (!unit.schedules) return true;
    
    const open_hour_filter = parseInt(open_hour, 10);
    const close_hour_filter = parseInt(close_hour, 10);

    const todays_weekday = this.transformWeekday(new Date().getDay());

    for (const schedule of unit.schedules) {
      if (schedule.weekdays === todays_weekday) {
        if (schedule.hour === 'Fechada') {
          return false;
        }

        const [unit_open_hour, unit_close_hour] = schedule.hour.split(' às ');
        const unit_open_hour_int = parseInt(unit_open_hour.replace('h', ''), 10);
        const unit_close_hour_int = parseInt(unit_close_hour.replace('h', ''), 10);

        if (unit_open_hour_int < close_hour_filter && unit_close_hour_int > open_hour_filter) {
          return true;
        } else {
          return false;
        }
      }
    }

    return false;
  }

  filter(results: UnitLocation[], showClosed: boolean, hour: string) {
    let intermediateResults = results;

    if (!showClosed) {
      intermediateResults = results.filter(location => location.opened == true)
    }

    if (hour) {
      const OPEN_HOUR = OPENING_HOURS[hour as HOUR_INDEXES].first; // 6
      const CLOSED_HOUR = OPENING_HOURS[hour as HOUR_INDEXES].last; // 12
      return intermediateResults.filter(location => this.filterUnits(location, OPEN_HOUR, CLOSED_HOUR))
    } else {
      return intermediateResults
    }
  }
}
