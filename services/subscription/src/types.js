import dayjs from 'dayjs'

export class ISODate {
  constructor(dayjs_obj) {
    this.dayjs_obj = dayjs_obj
  }

  toString() {
    return this.dayjs_obj.format('YYYY-MM-DD')
  }

  toJSON() {
    return this.dayjs_obj.format('YYYY-MM-DD')
  }

  format() {
    return this.dayjs_obj.format(...arguments)
  }

  isSame() {
    return this.dayjs_obj.isSame(...arguments)
  }

  isBefore() {
    return this.dayjs_obj.isBefore(...arguments)
  }

  isAfter() {
    return this.dayjs_obj.isAfter(...arguments)
  }

  add() {
    return new ISODate(this.dayjs_obj.add(...arguments))
  }

  subtract() {
    return new ISODate(this.dayjs_obj.subtract(...arguments))
  }

  static parse(input) {
    return new ISODate(dayjs(input))
  }

  static today() {
    return new ISODate(dayjs())
  }
}
