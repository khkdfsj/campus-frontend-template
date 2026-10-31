import {ref} from 'vue'
export const webUpdateReady=ref(false)
export const isWeb=ref(false)
export const iosBrowser=ref(false)
export const standalone=ref(false)
let installed=false
export function installWebApp(){
 // #ifdef H5
 isWeb.value=true
 iosBrowser.value=/iPhone|iPad|iPod/.test(navigator.userAgent)||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1
 standalone.value=!!(navigator as any).standalone||matchMedia('(display-mode: standalone)').matches
 if(installed)return;installed=true
 const updateViewport=()=>{const viewport=window.visualViewport;const focused=/INPUT|TEXTAREA/.test(document.activeElement?.tagName||'');const keyboard=focused?Math.max(0,window.innerHeight-(viewport?.height||window.innerHeight)-(viewport?.offsetTop||0)):0;document.documentElement.style.setProperty('--keyboard-inset',keyboard>100?keyboard+'px':'0px')}
 window.visualViewport?.addEventListener('resize',updateViewport);window.visualViewport?.addEventListener('scroll',updateViewport);window.addEventListener('focusout',()=>setTimeout(updateViewport,80));window.addEventListener('pageshow',updateViewport);updateViewport()
 // #endif
}
export async function checkWebUpdate(){}
export function reloadWebApp(){
 // #ifdef H5
 location.reload()
 // #endif
}
export async function requestPersistentStorage(){
 // #ifdef H5
 try{if(navigator.storage?.persist)await navigator.storage.persist()}catch{}
 // #endif
}
