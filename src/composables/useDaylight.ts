import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
export const periods = [
 {id:'dawn', label:'清晨', hour:7, title:'早安', hints:['记得吃早餐。', '看看今天的安排。', '新的一天开始了。']},
 {id:'noon', label:'中午', hour:12, title:'午安', hints:['午餐时间。', '记得喝水。', '午休片刻。']},
 {id:'afternoon', label:'下午', hour:15, title:'下午好', hints:['记得喝水。', '看看接下来的安排。', '起身活动一下。']},
 {id:'dusk', label:'傍晚', hour:18, title:'傍晚好', hints:['晚餐时间。', '看看今晚的安排。', '休息一会儿。']},
 {id:'evening', label:'晚上', hour:21, title:'晚上好', hints:['看看明天的安排。', '留点时间休息。', '晚上好。']},
 {id:'midnight', label:'深夜', hour:1, title:'夜深了', hints:['早点休息。', '晚安。', '明天见。']}
] as const
export function periodIndex(hour:number) { return hour>=5&&hour<10?0:hour>=10&&hour<14?1:hour>=14&&hour<17?2:hour>=17&&hour<19?3:hour>=19&&hour<23?4:5 }
const now=ref(new Date()),override=ref<number|null>(null),quoteTick=ref(0)
let initialized=false,consumers=0,tick:ReturnType<typeof setInterval>|undefined,quote:ReturnType<typeof setInterval>|undefined
watch(override,value=>{try{uni.setStorageSync('campus-demo.theme.period',value===null?'auto':value)}catch{}},{flush:'sync'})
export function useDaylight() {
 if(!initialized){initialized=true;try{const saved=uni.getStorageSync('campus-demo.theme.period');if(typeof saved==='number'&&Number.isInteger(saved)&&saved>=0&&saved<periods.length)override.value=saved}catch{}}
 const index=computed(()=>override.value??periodIndex(now.value.getHours()))
 const period=computed(()=>periods[index.value]), dark=computed(()=>index.value>=4)
 const hour=computed(()=>override.value===null?now.value.getHours()+now.value.getMinutes()/60:period.value.hour)
 const orb=computed(()=>{
  // 时间装饰轨迹：白天 05:00—19:00，夜间 19:00—次日 05:00，并非天文观测位置。
  const night=dark.value, h=hour.value
  const progress=night?((h>=19?h-19:h+5)/10):Math.min(1,Math.max(0,(h-5)/14))
  return {left:`${10+progress*78}%`,top:`${18+Math.pow(progress-.5,2)*100}%`}
 })
 const hint=computed(()=>period.value.hints[(Math.floor(now.value.getDate()/2)+quoteTick.value)%period.value.hints.length])
 const wallpaperStyle=computed(()=>({left:`${index.value%2*-100}%`,top:`${Math.floor(index.value/2)*-100}%`}))
 onMounted(()=>{consumers++;now.value=new Date();if(!tick)tick=setInterval(()=>now.value=new Date(),15000);if(!quote)quote=setInterval(()=>quoteTick.value++,45000)})
 onUnmounted(()=>{consumers--;if(consumers===0){clearInterval(tick);clearInterval(quote);tick=undefined;quote=undefined}})
 return {now,override,index,period,dark,orb,hint,wallpaperStyle}
}
