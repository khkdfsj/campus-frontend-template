export type ScheduleItem={id:string,time:string,title:string,subtitle:string,service:string,source:string,kind?:'course'|'practice'|'internship'|'exam',all_day?:boolean,status?:string,library?:{reservation_status_text:string,usage_status_text:string,status_labels?:string[],resvStatus:number,seat:string,begin:string,end:string}}
export const kindLabels={course:'课程',practice:'实践',internship:'实习',exam:'考试'}
export function scheduleBadge(item:ScheduleItem){return item.library?.usage_status_text||item.library?.reservation_status_text||''}
export function badgeTone(text:string){return /取消|违约|拒绝|失败|未到/.test(text)?'danger':/结束|完成/.test(text)?'muted':/签到成功|已签到|使用中|开始成功/.test(text)?'success':'waiting'}
