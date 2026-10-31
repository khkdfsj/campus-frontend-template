export type ServiceId='network'|'power'|'card'|'spend'|'library'
export const services = [
 {id:'network' as ServiceId,title:'校园网余额',icon:'wifi',color:'blue',unit:'元'},
 {id:'power' as ServiceId,title:'宿舍剩余电量',icon:'bolt',color:'amber',unit:'度'},
 {id:'card' as ServiceId,title:'校园卡余额',icon:'card',color:'green',unit:'元'},
 {id:'spend' as ServiceId,title:'本月支出',icon:'chart',color:'coral',unit:'元'}
]
