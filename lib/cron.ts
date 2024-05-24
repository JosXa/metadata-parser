export type CronExpression =
  | `${string} ${string} ${string} ${string} ${string}`
  | `${string} ${string} ${string} ${string} ${string} ${string}`

// TODO: These are some experiments that didn't pan out because it's too complex for TS to represent :(

// type IntRange<From extends number, To extends number> =
//   | Exclude<{ [K in keyof number[]]: K }[From extends 0 ? never : From], { [K in keyof number[]]: K }[To]>
//   | To
//
// type Minute =
//   | "0"
//   | "1"
//   | "2"
//   | "3"
//   | "4"
//   | "5"
//   | "6"
//   | "7"
//   | "8"
//   | "9"
//   | "10"
//   | "11"
//   | "12"
//   | "13"
//   | "14"
//   | "15"
//   | "16"
//   | "17"
//   | "18"
//   | "19"
//   | "20"
//   | "21"
//   | "22"
//   | "23"
//   | "24"
//   | "25"
//   | "26"
//   | "27"
//   | "28"
//   | "29"
//   | "30"
//   | "31"
//   | "32"
//   | "33"
//   | "34"
//   | "35"
//   | "36"
//   | "37"
//   | "38"
//   | "39"
//   | "40"
//   | "41"
//   | "42"
//   | "43"
//   | "44"
//   | "45"
//   | "46"
//   | "47"
//   | "48"
//   | "49"
//   | "50"
//   | "51"
//   | "52"
//   | "53"
//   | "54"
//   | "55"
//   | "56"
//   | "57"
//   | "58"
//   | "59"
// type Hour =
//   | "0"
//   | "1"
//   | "2"
//   | "3"
//   | "4"
//   | "5"
//   | "6"
//   | "7"
//   | "8"
//   | "9"
//   | "10"
//   | "11"
//   | "12"
//   | "13"
//   | "14"
//   | "15"
//   | "16"
//   | "17"
//   | "18"
//   | "19"
//   | "20"
//   | "21"
//   | "22"
//   | "23"
// type DayOfMonth =
//   | "1"
//   | "2"
//   | "3"
//   | "4"
//   | "5"
//   | "6"
//   | "7"
//   | "8"
//   | "9"
//   | "10"
//   | "11"
//   | "12"
//   | "13"
//   | "14"
//   | "15"
//   | "16"
//   | "17"
//   | "18"
//   | "19"
//   | "20"
//   | "21"
//   | "22"
//   | "23"
//   | "24"
//   | "25"
//   | "26"
//   | "27"
//   | "28"
//   | "29"
//   | "30"
//   | "31"
// type Month = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12"
// type DayOfWeek = "0" | "1" | "2" | "3" | "4" | "5" | "6"
// type Minute = `${IntRange<0, 59>}`
// type Hour = `${IntRange<0, 23>}`
// type DayOfMonth = `${IntRange<1, 31>}`
// type Month = `${IntRange<1, 12>}`
// type DayOfWeek = `${IntRange<0, 6>}`

// type Range<T extends string> = `${T}-${T}`
// type List<T extends string> = `${T},${T}`
// type Step<T extends string> = `${T}/${number}`
//
// type CronField<T extends string> = T | "*" | Range<T> | List<T> | Step<T>
//
// type CronMinute = CronField<Minute>
// type CronHour = CronField<Hour>
// type CronDayOfMonth = CronField<DayOfMonth> | "?" | "L" | `${DayOfMonth}W`
// type CronMonth = CronField<Month>
// type CronDayOfWeek = CronField<DayOfWeek> | "?" | `${DayOfWeek}L` | `${DayOfWeek}#${1 | 2 | 3 | 4 | 5}`
//
// export type CronExpression = `${CronMinute} ${CronHour} ${CronDayOfMonth} ${CronMonth} ${CronDayOfWeek}`

// const example1: CronExpression = "* * * * *" // Every minute
// const example3: CronExpression = "0 0 1W * *" // The first weekday of every month at midnight
// const example4: CronExpression = "0 0 L * *" // The last day of every month at midnight
// const example5: CronExpression = "0 0 12 1/2 *" // Every second month on the 12th at midnight
// const example6: CronExpression = "0 0 12 1 1#2" // The second Monday of January at midnight
// const example7: CronExpression = "a 0 12 1 1#2"
