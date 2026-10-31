<script lang="ts">
import {useCampus} from './stores/campus'
import {installWebApp} from './utils/web-app'
export default {
 onLaunch(){installWebApp();void useCampus().boot()},
 onShow(){useCampus().foreground()},
 onHide(){useCampus().background()}
}
</script>
<style lang="scss">
/* #ifdef H5 */
@import './styles/web.scss';
/* #endif */
page { background:#f1f7fd; color:#15223a; font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif; font-size:28rpx; }
view,text,input,scroll-view { box-sizing:border-box; } button::after { border:0; } button { font-family:inherit; }
</style>
