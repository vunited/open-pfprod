/** kit_admin-v1.0.9 MIT License By http://kit/zhengjinfan.cn e-mail:zheng_jinfan@126.com */
 ;layui.define(["layer","nprogress","utils"],function(e){var n=layui.jquery,t=layui.layer,i=layui.utils,o=function(){this.config={elem:"#container",openWait:!0},this.v="1.0.0"};(o.fn=o.prototype).set=function(e){var t=this;return n.extend(!0,t.config,e),t},o.fn.render=function(e,o){var r=this.config,a=n(r.elem),s=void 0;NProgress.start(),r.openWait&&(s=i.load());var u=i.getBodyContent(i.loadHtml(e+"?v="+(new Date).getTime(),function(){setTimeout(function(){NProgress.done(),r.openWait&&s&&t.close(s)},500),"function"==typeof o&&o()}));a.html(u)},e("spa",new o)});