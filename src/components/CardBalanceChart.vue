<script setup lang="ts">
import {computed,ref,watch} from 'vue'
const props=defineProps<{points:{at:string,balance:string}[],dark:boolean,masked:boolean}>()
const cursor=ref(0)
watch(()=>props.points,()=>cursor.value=Math.max(0,props.points.length-1),{immediate:true})
const chosen=computed(()=>props.points[cursor.value])
const dateText=(s:string)=>s.slice(5,16).replace('T',' ')
const chart=computed(()=>{
 const rows=props.points;if(!rows.length||props.masked)return ''
 const values=rows.map(p=>Number(p.balance)),low=Math.min(...values),high=Math.max(...values),spread=Math.max(high-low,1),min=low-spread*.18,max=high+spread*.25
 const begin=Date.parse(rows[0].at),end=Date.parse(rows[rows.length-1].at)
 const xy=rows.map((p,i)=>({x:rows.length===1?350:65+(end===begin?i/(rows.length-1):(Date.parse(p.at)-begin)/(end-begin))*550,y:20+(max-Number(p.balance))/(max-min)*190}))
 const line=xy.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),first=xy[0],last=xy[xy.length-1],selected=xy[Math.min(cursor.value,xy.length-1)],muted=props.dark?'#849caf':'#95a5b3',grid=props.dark?'#304558':'#e8f0ee'
 let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 250"><defs><linearGradient id="mint" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#35c8a0" stop-opacity=".35"/><stop offset="1" stop-color="#35c8a0" stop-opacity=".02"/></linearGradient></defs>'
 for(let i=0;i<3;i++){const y=20+i*95;svg+=`<path d="M64 ${y}H620" stroke="${grid}" stroke-dasharray="4 7"/><text x="0" y="${y+5}" font-family="sans-serif" font-size="17" fill="${muted}">${(max-(max-min)*i/2).toFixed(1)}</text>`}
 if(xy.length>1)svg+=`<polygon points="${first.x},212 ${line} ${last.x},212" fill="url(#mint)"/><polyline points="${line}" stroke="#26b68e" stroke-width="4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`
 svg+=`<path d="M${selected.x} 17V212" stroke="#35ba99" stroke-dasharray="4 5" opacity=".45"/><circle cx="${selected.x}" cy="${selected.y}" r="11" fill="#24ba94" opacity=".16"/><circle cx="${selected.x}" cy="${selected.y}" r="5" fill="#24ba94" stroke="${props.dark?'#1d3343':'white'}" stroke-width="3"/><text x="65" y="243" font-family="sans-serif" font-size="17" fill="${muted}">${rows[0].at.slice(5,10)}</text><text x="615" y="243" text-anchor="end" font-family="sans-serif" font-size="17" fill="${muted}">${rows[rows.length-1].at.slice(5,10)}</text></svg>`
 return 'data:image/svg+xml;base64,'+uni.arrayBufferToBase64(Uint8Array.from(svg,c=>c.charCodeAt(0)).buffer)
})
function select(e:any){cursor.value=Number(e.detail.value)}
</script>
<template><view class="balance-chart"><view v-if="chosen" class="point-readout"><text>{{dateText(chosen.at)}}</text><text>{{masked?'••••':'¥ '+chosen.balance}}</text></view><image v-if="chart" class="plot" :src="chart" mode="scaleToFill"/><view v-else class="empty">{{masked?'余额已隐藏':'首次同步后开始记录余额曲线'}}</view><slider v-if="points.length>1&&!masked" class="point-slider" :value="cursor" :min="0" :max="points.length-1" :step="1" activeColor="#31bd97" backgroundColor="#cfe8df" :block-size="14" @changing="select" @change="select"/><text class="caption">{{points.length===1?'已记录首次余额，后续采集将形成曲线':points.length>1?'拖动查看各次采集余额':'只记录真实采集值，不补造历史余额'}}</text></view></template>
<style scoped>
.point-readout{display:flex;justify-content:space-between;align-items:center;margin:18rpx 2rpx 23rpx;color:var(--muted);font-size:21rpx}.point-readout>text+text{color:#26b68e;font-size:29rpx;font-weight:650;font-variant-numeric:tabular-nums}.plot{display:block;width:100%;height:270rpx}.point-slider{margin:20rpx 10rpx 12rpx}.caption{display:block;font-size:19rpx;color:var(--muted);text-align:center;line-height:1.7}.empty{height:200rpx;display:flex;align-items:center;justify-content:center;font-size:23rpx;color:var(--muted)}
</style>
