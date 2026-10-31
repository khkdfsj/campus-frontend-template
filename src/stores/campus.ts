import {defineStore} from 'pinia'
import {computed,ref} from 'vue'
import {demoAgenda,demoDashboard,demoHistory,demoMonths,demoSeats,demoTransactions,localDate} from '../data/demo'

export const useCampus=defineStore('campus',()=>{
 const entered=ref(true),booting=ref(true),busy=ref(false),checking=ref(false),masked=ref(false)
 const authenticated=computed(()=>entered.value)
 const nickname=ref('演示同学'),studentId=ref('DEMO-USER'),room=ref('演示宿舍'),roomBinding=ref<any>({room_id:'demo-room',room_name:'演示楼 · 示例房间'})
 const agendaEnabled=ref(true),agendaVisible=ref(true),agendaDate=ref('')
 const dashboard=ref<any>(demoDashboard()),records=ref<any[]>([]),schedule=ref<any[]>(demoAgenda())
 const scheduleError=ref('本地虚构数据，仅用于界面演示'),libraryNeedsLogin=ref(false)
 const server=ref('离线演示 · 无网络请求'),lastChecked=ref('本地数据'),appActive=ref(true),showingCached=ref(false)
 const autoLoginEnabled=ref(false),autoLoginStatus=ref('演示版不保存账号密码')
 const reservations=ref<any[]>([])
 async function boot(){booting.value=false}
 async function login(){entered.value=true}
 async function logout(){entered.value=false;reservations.value=[];nickname.value='演示同学';room.value='演示宿舍';roomBinding.value={room_id:'demo-room',room_name:'演示楼 · 示例房间'};dashboard.value=demoDashboard();schedule.value=demoAgenda()}
 async function checkServer(){schedule.value=agendaEnabled.value?demoAgenda():[];server.value='离线演示 · 无网络请求'}
 async function fetchSchedule(_date?:string){return {items:agendaEnabled.value?demoAgenda():[],notice:'本地虚构数据，仅用于界面演示',sources:{course:{status:agendaEnabled.value?'available':'empty'}},lesson_meta:{}}}
 async function setAgendaEnabled(enabled:boolean){agendaEnabled.value=enabled;await checkServer()}
 async function configureAutoLogin(){autoLoginStatus.value='演示版不接收账号密码'}
 async function disableAutoLogin(){autoLoginEnabled.value=false}
 function foreground(){appActive.value=true}
 function background(){appActive.value=false}
 async function saveProfile(name:string,dorm:string){nickname.value=name.trim()||'演示同学';room.value=dorm.trim()}
 async function rooms(level:string,_fields:Record<string,string>={}){
  return level==='buildings'?[{building:'演示楼',factorycode:'demo'}]:level==='floors'?[{buildingid:'demo-floor',buildingname:'示例楼层'}]:[{buildingid:'demo-room',buildingname:'示例房间'}]
 }
 async function bindRoom(_fields:Record<string,string>){roomBinding.value={room_id:'demo-room',room_name:'演示楼 · 示例房间'}}
 async function electricityHistory(days:string){const points=demoHistory(days,'surplus');return {points,first:points[0],last:points[points.length-1],room:roomBinding.value,total_count:points.length}}
 async function networkDevices(){return {items:[]}}
 async function cardOverview(month:string,span=6){const months=demoMonths(span),selected=months.find(m=>m.month===month)||{month,expense:'0.00',gross_expense:'0.00',refund:'0.00',topup:'0.00',count:0,complete:true};return {card:dashboard.value.card,spending:{...dashboard.value.spending,month_total:selected.expense},syncing:false,months,selected,merchants:[{name:'演示食堂',amount:'96.00'},{name:'示例商店',amount:'24.00'}]}}
 async function cardHistory(days:string){return {points:demoHistory(days,'balance')}}
 async function cardTransactions(month:string,kind='all',page=1){const items=demoTransactions(month).filter(i=>kind==='all'||i.kind===kind);return {items:page===1?items:[],total:items.length,has_more:false,page}}
 async function cardBinding(){dashboard.value.card={...demoDashboard().card};return {status:'demo'}}
 async function cardUnbind(){dashboard.value.card={...dashboard.value.card,bound:false,cardinfo:{cardbal:null}}}
 async function libraryCatalog(){const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);return {today:localDate(),tomorrow:localDate(tomorrow),captcha_required:false,floors:[{id:'demo-floor',name:'演示楼层',total:24,areas:[{id:'demo-area',name:'示例阅览区',total:24}]}]}}
 async function librarySeats(_roomId:string,date:string){return {seats:demoSeats(date),observed_at:new Date().toISOString()}}
 async function libraryReservations(date:string){return {items:reservations.value.filter(i=>i.date===date)}}
 async function libraryCaptcha(){return {image:''}}
 async function libraryBook(data:any){const id=data.request_id||'demo-'+reservations.value.length;if(!reservations.value.some(r=>r.id===id))reservations.value.push({id,date:data.date,title:'模拟预约',area:'示例阅览区',seat:'演示座位',begin_ms:Date.parse(data.date+'T'+data.start+':00+08:00'),end_ms:Date.parse(data.date+'T'+data.end+':00+08:00'),reservation_status_text:'本地模拟',usage_status_text:'未提交真实预约',status_labels:['虚构记录']});return {request_id:id,status:'verified',message:'仅在内存中模拟成功，没有提交真实预约'}}
 async function libraryBookingStatus(id:string){return {request_id:id,status:'verified',message:'本地演示记录'}}
 async function libraryUnfinished(){return {items:[]}}
 return {authenticated,booting,busy,nickname,room,roomBinding,studentId,dashboard,records,schedule,scheduleError,libraryNeedsLogin,agendaEnabled,agendaVisible,agendaDate,setAgendaEnabled,fetchSchedule,server,checking,lastChecked,masked,autoLoginEnabled,autoLoginStatus,configureAutoLogin,disableAutoLogin,foreground,background,appActive,showingCached,saveProfile,rooms,bindRoom,electricityHistory,networkDevices,cardOverview,cardHistory,cardTransactions,cardBinding,cardUnbind,libraryCatalog,librarySeats,libraryReservations,libraryCaptcha,libraryBook,libraryBookingStatus,libraryUnfinished,checkServer,boot,login,logout}
})
