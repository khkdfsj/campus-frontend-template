<script setup lang="ts">
import { ref, computed,watch } from 'vue'
import { onLoad, onShow, onBackPress, onPullDownRefresh } from '@dcloudio/uni-app'
import { useCampus } from '../../stores/campus'
import { useDaylight } from '../../composables/useDaylight'
import AppIcon from '../../components/AppIcon.vue'
import DateSheet from '../../components/DateSheet.vue'
import {topInset} from '../../utils/layout'
import { scheduleBadge, badgeTone, kindLabels, type ScheduleItem } from '../../data/schedule'
const campus=useCampus(),daylight=useDaylight(),items=ref<ScheduleItem[]>([]),loading=ref(false),error=ref(''),notice=ref('')
const top=uni.getSystemInfoSync().statusBarHeight||0
function iso(d:Date){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
const selected=ref(iso(new Date()))
const showDate=ref(false)
const sources=ref<Record<string,any>>({}),lessonMeta=ref<any>({})
let requestId=0
const label=computed(()=>{const d=new Date(selected.value+'T12:00:00');return `${d.getMonth()+1}月${d.getDate()}日　星期${['日','一','二','三','四','五','六'][d.getDay()]}`})
async function load(){if(!campus.authenticated){error.value='请返回首页进入演示';return}const request=++requestId;loading.value=true;error.value='';items.value=[];notice.value='';try{const result=await campus.fetchSchedule(selected.value);if(request!==requestId)return;items.value=result.items;notice.value=result.notice||'';sources.value=result.sources||{};lessonMeta.value=result.lesson_meta||{}}catch(e){if(request===requestId){error.value=(e as Error).message;items.value=[]}}finally{if(request===requestId){loading.value=false;uni.stopPullDownRefresh()}}}
function sourceDetails(){
 const labels:Record<string,string>={library:'图书馆',lesson:'课表日程',...kindLabels}
 const states:Record<string,string>={available:'有安排',empty:'当天无安排',not_open:'预约尚未开放',authorization_required:'登录已过期',not_authorized:'未授权',not_synced:'尚未导入',stale:'缓存待更新',partial:'部分数据待核对',unavailable:'暂不可用'}
 const optional=new Set(['practice','internship','exam'])
 const lines=Object.entries(sources.value).map(([key,value])=>`${labels[key]||key}${optional.has(key)?'（可选）':''}：${states[value.status]||value.status}${value.updated_at?'\n更新于 '+value.updated_at:''}`)
 lines.push('实践、实习和考试均为可选来源，无数据不影响使用。')
 lines.push('所有日程均为本地虚构数据。')
 uni.showModal({title:'日程来源',content:lines.join('\n\n'),showCancel:false,confirmText:'知道了'})
}
function shift(n:number){const d=new Date(selected.value+'T12:00:00');d.setDate(d.getDate()+n);selected.value=iso(d);load()}
function today(){selected.value=iso(new Date());load()}
function goBack(){campus.agendaDate=selected.value;uni.navigateBack()}
function applyStatus(){
 // #ifdef APP-PLUS
 const p=(globalThis as any).plus;p?.navigator?.setStatusBarStyle(daylight.dark.value?'light':'dark')
 // #endif
}
watch(()=>daylight.dark.value,applyStatus)
function selectDate(value:string){selected.value=value;load()}
function showItem(item:ScheduleItem){const lib=item.library;uni.showModal({title:item.title,content:lib?`${selected.value} ${lib.begin}–${lib.end}\n座位：${lib.seat}\n预约：${lib.reservation_status_text}\n使用：${lib.usage_status_text}\n${lib.status_labels?.join(' · ')||''}`:`${selected.value} ${item.time}\n${item.subtitle}`,showCancel:false,confirmText:'知道了'})}
onLoad((q:any)=>{if(q?.date&&/^\d{4}-\d{2}-\d{2}$/.test(q.date))selected.value=q.date})
onShow(async()=>{campus.agendaVisible=false;applyStatus();setTimeout(applyStatus,250);if(campus.booting)await campus.boot();load()})
onBackPress(()=>{if(showDate.value){showDate.value=false;return true}campus.agendaDate=selected.value;return false})
onPullDownRefresh(load)
</script>
<template><view class="day-page" :class="['period-'+daylight.period.value.id,{dark:daylight.dark.value}]"><view class="day-nav" :style="{paddingTop:topInset(16,top)}"><view class="day-back" @click="goBack"><AppIcon name="back" :size="38"/></view><text>日程安排</text><view class="today" @click="today">今天</view></view><view class="day-content"><view class="day-calendar"><view @click="shift(-1)"><AppIcon name="back" :size="31"/></view><view class="day-date-button" @click="showDate=true"><text>{{label}}</text><text class="date-picker-arrow">⌄</text></view><view @click="shift(1)"><AppIcon name="chevron" :size="31"/></view></view><view class="day-summary"><text>{{loading?'正在同步日程':`${items.length} 项安排`}}</text><text @click="sourceDetails">数据状态 ›</text></view><text v-if="notice" class="day-notice">{{notice}}</text><view v-if="error" class="day-empty" @click="load"><text>{{error}}</text><text>点击重试</text></view><view v-else-if="!loading&&!items.length" class="day-empty"><AppIcon name="calendar" :size="70"/><text>{{notice?'暂无可显示的日程，请检查数据状态':'这一天暂无日程'}}</text></view><view v-else class="day-list"><view v-for="item in items" :key="item.id" class="day-row" @click="showItem(item)"><view class="day-time"><text>{{item.time}}</text><view class="day-dot" :class="{library:!!item.library}"/></view><view class="day-event"><view class="day-event-heading"><text>{{item.title}}</text><AppIcon :name="item.library?'book':'chevron'" :size="27"/></view><text class="day-subtitle">{{item.subtitle}}</text><text v-if="item.kind" class="kind-label">{{kindLabels[item.kind]}}</text><view v-if="item.library" class="day-library"><text class="day-reservation">{{item.library.reservation_status_text}}</text><text class="day-state" :class="badgeTone(scheduleBadge(item))">{{scheduleBadge(item)}}</text><text class="day-duration">{{item.library.begin}}–{{item.library.end}}</text></view></view></view></view></view><DateSheet :open="showDate" :value="selected" :dark="daylight.dark.value" @close="showDate=false" @select="selectDate"/></view></template>
<style lang="scss">
.day-notice{display:block;color:#a18b6a;font-size:21rpx;line-height:1.6;margin:18rpx 8rpx}.kind-label{display:inline-block;color:#4889d5;background:#eaf3ff;font-size:19rpx;padding:5rpx 10rpx;border-radius:8rpx;margin-top:12rpx}
.day-page{--day-bg:#f1f7fd;--day-panel:#fff;--day-ink:#15223a;--day-muted:#8c97aa;--day-line:#e2eaf5;min-height:100vh;background:var(--day-bg);color:var(--day-ink);padding-bottom:calc(30rpx + env(safe-area-inset-bottom))}.day-page.dark{--day-bg:#121e34;--day-panel:#1e2d46;--day-ink:#edf3ff;--day-muted:#9aaac4;--day-line:#34435c}.day-nav{display:flex;align-items:center;justify-content:space-between;padding:0 30rpx 25rpx;font-size:31rpx;font-weight:600}.day-back{width:60rpx;height:60rpx;border-radius:50%;background:var(--day-panel);display:flex;align-items:center;justify-content:center}.today{font-size:24rpx;font-weight:500;color:#3184ed;padding:12rpx}.day-content{padding:10rpx 29rpx;max-width:1000rpx;margin:auto}.day-eyebrow{font-size:24rpx;color:var(--day-muted);display:block;margin:10rpx 4rpx 25rpx}.day-calendar{display:flex;align-items:center;justify-content:space-between;background:var(--day-panel);padding:24rpx 20rpx;border-radius:25rpx}.day-calendar>view{padding:10rpx}.day-calendar .day-date-button{font-size:27rpx;font-weight:650}.date-picker-arrow{margin-left:14rpx;color:var(--day-muted)}.day-summary{display:flex;justify-content:space-between;font-size:22rpx;color:var(--day-muted);margin:27rpx 8rpx}.day-summary>text:first-child{font-size:25rpx;color:var(--day-ink);font-weight:600}.day-row{display:flex;gap:22rpx;min-height:150rpx}.day-time{position:relative;width:100rpx;flex-shrink:0;text-align:center;padding-top:23rpx;font-size:25rpx;font-weight:550;color:var(--day-muted)}.day-time:after{content:'';position:absolute;top:67rpx;bottom:-11rpx;width:2rpx;right:4rpx;background:var(--day-line)}.day-row:last-child .day-time:after{display:none}.day-dot{position:absolute;right:-3rpx;top:33rpx;width:15rpx;height:15rpx;border-radius:50%;background:#b7c7db;box-shadow:0 0 0 6rpx var(--day-bg)}.day-dot.library{background:#287bf5}.day-event{background:var(--day-panel);border-radius:24rpx;padding:24rpx;flex:1;margin-bottom:18rpx;min-width:0}.day-event-heading{display:flex;justify-content:space-between;align-items:center;gap:10rpx;font-size:27rpx;font-weight:600}.day-subtitle{display:block;font-size:22rpx;color:var(--day-muted);margin-top:11rpx;line-height:1.5}.day-library{display:flex;flex-wrap:wrap;align-items:center;gap:9rpx;margin-top:18rpx}.day-reservation,.day-state{font-size:18rpx;padding:5rpx 10rpx;border-radius:7rpx;background:#edf4ff;color:#5a8ccb}.day-state.success{background:#e3f7ed;color:#329b76}.day-state.waiting{background:#fff3dc;color:#c39034}.day-state.muted{background:#f0f3f7;color:#929ead}.day-state.danger{background:#fff0ec;color:#d57c69}.day-duration{font-size:18rpx;color:var(--day-muted);margin-left:auto}.day-foot{display:block;text-align:center;color:var(--day-muted);font-size:20rpx;line-height:1.8;margin:27rpx 15rpx}.day-empty{background:var(--day-panel);border-radius:25rpx;display:flex;flex-direction:column;align-items:center;gap:20rpx;padding:70rpx 20rpx;font-size:25rpx;color:var(--day-muted)}
.day-page.period-dawn{--day-bg:#f9f6f1}.day-page.period-dusk{--day-bg:#fbf2ef}.day-page.period-midnight{--day-bg:#0b1326;--day-panel:#17233b}
</style>
