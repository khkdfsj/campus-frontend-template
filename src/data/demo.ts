import type {LibrarySeat} from './library'
// All values below are invented, never exported from a user account or server.
export function localDate(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
export function demoAgenda(){return [
 {id:'demo-course',time:'08:30',title:'示例课程',subtitle:'演示教学楼 · 示例教室',service:'lesson',source:'local',kind:'course' as const},
 {id:'demo-practice',time:'14:00',title:'示例实践',subtitle:'本地虚构日程',service:'lesson',source:'local',kind:'practice' as const}
]}
export function demoDashboard(){return {
 network:{status:'connected',primary_metric:'traffic',remaining_gb:42,balance:'20.00',plan_label:'演示套餐',plan_name:'虚构校园套餐',base_quota_gb:50,gift_gb:0,used_gb:18,balance_traffic_gb:10,device_limit:2,monthly_price:10,observed_at:new Date().toISOString(),period:{start:localDate(new Date(new Date().getFullYear(),new Date().getMonth(),1)),end:localDate(new Date(new Date().getFullYear(),new Date().getMonth()+1,0))}},
 electricity:{status:'connected',surplus:'42.00',supply_status:'演示供电状态',observed_at:new Date().toISOString(),cached:false},
 card:{enabled:true,bound:true,status:'connected',cardinfo:{cardbal:'80.00'},observed_at:new Date().toISOString(),syncing:false},
 spending:{enabled:true,month_total:'120.00',complete:true},library:{status:'connected'}
}}
export function demoMonths(span:number){return Array.from({length:span},(_,i)=>{const d=new Date(new Date().getFullYear(),new Date().getMonth()-span+1+i,1);return {month:localDate(d).slice(0,7),expense:'120.00',gross_expense:'122.00',refund:'2.00',topup:'150.00',count:3,complete:true}})}
export function demoHistory(days:string,field:'balance'|'surplus'){const count=days==='all'?30:Math.min(90,Math.max(1,Number(days)||30));return Array.from({length:count},(_,i)=>{const d=new Date();d.setDate(d.getDate()-count+1+i);return {at:localDate(d)+'T12:00:00+08:00',[field]:(field==='balance'?80+count-1-i:42+(count-1-i)*0.5).toFixed(2)}})}
export function demoTransactions(month:string){return [
 {id:'demo-1',at:month+'-01T08:00:00+08:00',kind:'expense',merchant:'演示食堂',amount:'-96.00',summary:'虚构汇总示例'},
 {id:'demo-2',at:month+'-01T09:00:00+08:00',kind:'expense',merchant:'示例商店',amount:'-26.00',summary:'虚构汇总示例'},
 {id:'demo-3',at:month+'-01T10:00:00+08:00',kind:'refund',merchant:'示例商店',amount:'2.00',summary:'虚构退款'},
 {id:'demo-4',at:month+'-01T07:00:00+08:00',kind:'topup',merchant:'演示充值',amount:'150.00',summary:'虚构充值'}
]}
export function demoSeats(date:string):LibrarySeat[]{return Array.from({length:24},(_,i)=>({
 id:'demo-seat-'+i,name:'D'+String(i+1).padStart(3,'0'),room_name:'示例阅览区',bookable:i%7!==0,
 open_times:[{start:'08:00',end:'22:00'}],
 rules:{min_minutes:30,max_minutes:240,step_minutes:30,daily_limit:2,checkin_early_minutes:10,checkin_late_minutes:15,cancel_minutes:30},
 occupied:i%5===0?[{begin_ms:Date.parse(date+'T08:00:00+08:00'),end_ms:Date.parse(date+'T22:00:00+08:00')}]:[]
}))}
