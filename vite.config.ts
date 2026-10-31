import { defineConfig, type Plugin } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// Some framework styles preload a remote decorative image. Remove external
// CSS resources so the published demo stays local even before CSP blocks them.
function offlineStyles():Plugin{
 return {name:'offline-styles',enforce:'post',generateBundle(_options,bundle){
  for(const asset of Object.values(bundle)){
   if(asset.type==='asset'&&asset.fileName.endsWith('.css')&&typeof asset.source==='string'){
    asset.source=asset.source.replace(/url\(\s*["']?https?:\/\/[^)]*\)/gi,'none')
   }
  }
 }}
}
export default defineConfig({ plugins: [uni(),offlineStyles()], server: { host: '127.0.0.1', port: 5178 } })
