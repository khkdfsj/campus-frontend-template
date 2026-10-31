export function topInset(extra:number,nativeTop=0){
 // #ifdef H5
 return `calc(env(safe-area-inset-top, 0px) + ${extra}px)`
 // #endif
 // #ifndef H5
 return `${nativeTop+extra}px`
 // #endif
}
