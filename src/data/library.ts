export type LibrarySeat={id:string,name:string,room_name:string,bookable:boolean,open_times:{start:string,end:string}[],rules:{min_minutes:number,max_minutes:number,step_minutes:number,daily_limit:number,checkin_early_minutes:number,checkin_late_minutes:number,cancel_minutes:number},occupied:{begin_ms:number,end_ms:number}[]}
export function minute(clock:string){const [h,m]=clock.split(':').map(Number);return h*60+m}
export function clock(value:number){return `${String(Math.floor(value/60)).padStart(2,'0')}:${String(value%60).padStart(2,'0')}`}
export function instant(date:string,time:string){return Date.parse(`${date}T${time}:00+08:00`)}
export function seatProblem(seat:LibrarySeat,date:string,start:string,end:string,now=Date.now()){
 if(!seat.bookable||!seat.open_times.length)return '座位未开放'
 if(!start||!end)return '请先选择预约时段'
 const a=minute(start),b=minute(end),rule=seat.rules,step=Math.max(1,rule.step_minutes)
 if(instant(date,start)<=now)return '开始时间已过，请重新选择'
 if(b-a<rule.min_minutes||b-a>rule.max_minutes||a%step||(b-a)%step)return '时长不符合座位规则'
 if(!seat.open_times.some(w=>a>=minute(w.start)&&b<=minute(w.end)))return '不在开放时段内'
 if(seat.occupied.some(r=>instant(date,start)<r.end_ms&&instant(date,end)>r.begin_ms))return '所选时段已被预约'
 return ''
}
