import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

// This guard deliberately contains no list of private hosts or real routes.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const files=[]
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 const p=path.join(dir,entry.name)
 if(entry.isSymbolicLink())throw new Error('Symlink is not allowed in public source')
 if(entry.isDirectory()){if(!['.git','node_modules','dist','unpackage'].includes(entry.name))walk(p)}
 else files.push(p)
}}
walk(root)
const failures=[]
const checks=[
 ['private key',/-----BEGIN (?:[A-Z ]*PRIVATE KEY|CERTIFICATE)-----/],
 ['access credential',/\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[A-Z0-9]{16})\b/],
 ['absolute local path',/[A-Za-z]:[\\/](?:Users|www|phpstudy)[\\/]/i],
 ['IP address',/\b(?:\d{1,3}\.){3}\d{1,3}\b/],
 ['network transport',/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\s*\(|uni\s*\.\s*(?:request|uploadFile|downloadFile|connectSocket)\s*\(|\b(?:openURL|createDownload)\s*\(/],
 ['service route',/["'`]\/(?:api|auth|updates|downloads|card|library|electricity|network)\//i],
 ['credential storage',/credential-vault|UPDATE_PUBLIC_KEY|Bearer\s|access_token|refresh_token/],
 ['email address',/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i]
]
for(const p of files){
 const name=path.relative(root,p).replaceAll('\\','/')
 if(/(?:^|\/)(?:backend|bridge|tools|artifacts|\.env(?:\..*)?|AGENTS\.md)(?:\/|$)|\.(?:apk|wgt|pem|key|jks|keystore|log|db|sqlite|zip)$/i.test(name))failures.push([name,'excluded artifact'])
 if(name.endsWith('.png'))continue
 const text=fs.readFileSync(p,'utf8')
 // Dependency metadata has public package registries, integrity hashes and funding URLs.
 if(name==='package-lock.json'){
  const lock=JSON.parse(text)
  for(const [pkg,value] of Object.entries(lock.packages||{})){
   if(value.resolved&&!value.resolved.startsWith('https://registry.npmjs.org/'))failures.push([name,'unexpected dependency origin: '+pkg])
  }
  continue
 }
 if(name==='scripts/audit-public.mjs')continue
 for(const [label,pattern] of checks){
  const inspected=(label==='IP address'&&(name==='vite.config.ts'||name==='README.md'))?text.replaceAll('127.0.0.1',''):text
  if(pattern.test(inspected))failures.push([name,label])
 }
 if(name.startsWith('src/')){
  const withoutNamespace=text.replaceAll('http://www.w3.org/2000/svg','')
  if(/(?:https?|wss?):\/\//i.test(withoutNamespace))failures.push([name,'remote URL'])
 }
}
for(const name of ['src/manifest.json','src/static/pwa/manifest.webmanifest']){
 const manifest=JSON.parse(fs.readFileSync(path.join(root,name),'utf8'))
 if(manifest.name!=='[应用名称]')failures.push([name,'application name must remain a placeholder'])
}
if(failures.length){for(const [file,reason] of failures)console.error(`${file}: ${reason}`);process.exitCode=1}
else console.log(`Public-source guard passed (${files.length} files). Review new assets and Git history separately before publishing.`)
