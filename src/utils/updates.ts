import {ref} from 'vue'
export const updateStatus=ref('离线演示版，请从源码自行构建')
export const pendingVersion=ref('')
export async function checkForUpdate(manual=false){
 if(manual)uni.showToast({title:'演示版不连接更新服务',icon:'none'})
}
