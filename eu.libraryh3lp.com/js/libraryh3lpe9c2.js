!function(t){function e(e){for(var n,o,i=e[0],c=e[1],s=0,a=[];s<i.length;s++)o=i[s],Object.prototype.hasOwnProperty.call(r,o)&&r[o]&&a.push(r[o][0]),r[o]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(t[n]=c[n]);for(u&&u(e);a.length;)a.shift()()}var n={},r={1:0};function o(e){if(n[e])return n[e].exports;var r=n[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.e=function(t){var e=[],n=r[t];if(0!==n)if(n)e.push(n[2]);else{var i=new Promise((function(e,o){n=r[t]=[e,o]}));e.push(n[2]=i);var c,s=document.createElement("script");s.charset="utf-8",s.timeout=120,o.nc&&s.setAttribute("nonce",o.nc),s.src=function(t){return o.p+""+t+"."+{0:"0bf9fefaec6fd093c38e",2:"4935e10ffdb911b8a731",3:"dc7554d6a73dd16114f4"}[t]+".js"}(t);var u=new Error;c=function(e){s.onerror=s.onload=null,clearTimeout(a);var n=r[t];if(0!==n){if(n){var o=e&&("load"===e.type?"missing":e.type),i=e&&e.target&&e.target.src;u.message="Loading chunk "+t+" failed.\n("+o+": "+i+")",u.name="ChunkLoadError",u.type=o,u.request=i,n[1](u)}r[t]=void 0}};var a=setTimeout((function(){c({type:"timeout",target:s})}),12e4);s.onerror=s.onload=c,document.head.appendChild(s)}return Promise.all(e)},o.m=t,o.c=n,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o.oe=function(t){throw console.error(t),t};var i=window.libraryH3lpWebpackJsonp=window.libraryH3lpWebpackJsonp||[],c=i.push.bind(i);i.push=e,i=i.slice();for(var s=0;s<i.length;s++)e(i[s]);var u=c;o(o.s=0)}([function(t,e,n){"use strict";n.r(e);n(1);var r,o=(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),i=function(){return(i=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var o in e=arguments[n])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)},c=function(t,e,n,r){return new(n||(n=Promise))((function(o,i){function c(t){try{u(r.next(t))}catch(t){i(t)}}function s(t){try{u(r.throw(t))}catch(t){i(t)}}function u(t){t.done?o(t.value):new n((function(e){e(t.value)})).then(c,s)}u((r=r.apply(t,e||[])).next())}))},s=function(t,e){var n,r,o,i,c={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;c;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return c.label++,{value:i[1],done:!1};case 5:c.label++,r=i[1],i=[0];continue;case 7:i=c.ops.pop(),c.trys.pop();continue;default:if(!(o=c.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){c=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){c.label=i[1];break}if(6===i[0]&&c.label<o[1]){c.label=o[1],o=i;break}if(o&&c.label<o[2]){c.label=o[2],c.ops.push(i);break}o[2]&&c.ops.pop(),c.trys.pop();continue}i=e.call(t,c)}catch(t){i=[6,t],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}};function u(t){return t.getAttribute("data-lh3-jid")||t.getAttribute("jid")}function a(){return(jabber_resources||[]).some((function(t){return"available"===t.show||"chat"===t.show}))}function l(t){for(var e=function(){var e="lh3cb"+(new Date).getTime();return window[e]?"continue":(window[e]=function(){for(var n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];t.apply(void 0,n),delete window[e]},{value:e})};;){var n=e();if("object"==typeof n)return n.value}}NodeList.prototype.forEach||(NodeList.prototype.forEach=function(t,e){e=e||window;for(var n=0;n<this.length;++n)t.call(e,this[n],n,this)}),n.p="/presence/js/";var f,h=function(){function t(e,n){void 0===n&&(n={}),this.root=e,this.options=n,this.setRoot(e||t.defaultRoot)}return t.prototype.start=function(){this.options.presence&&document.write('<style type="text/css">\n                    .online, .libraryh3lp_online .offline { display: none; }\n                    .offline, .libraryh3lp_online .online { display: block; }\n                 </style>'),this.startPresence()},t.prototype.openChat=function(e,n){if(this.options.popup){var r=i({},n,{page:location.href}),o=e;r.chat=o+(o.indexOf("?")>=0?"&":"?")+"referer="+encodeURIComponent(r.page);var c=this.root.replace(/^https:/,location.protocol)+"/follow",s=new DOMParser,u=s.parseFromString('<form style="display:none" accept-charset="utf-8" method="post" action="'+c+'"></form>',"text/html").body.firstElementChild;for(var a in document.body.appendChild(u),r){var l=s.parseFromString('<input type="hidden" name="'+a+'" value="'+r[a]+'"/>',"text/html");u.appendChild(l.body.firstChild)}return u.submit(),!1}this.options=e;var f=i({width:400,height:320},this.options),h="",p="";for(var a in f)if(!(t.chatParams.indexOf(a)>=0)){var d=f[a];d&&(h+=""+p+a+"="+d,p=",")}return window.open(this.chatUrl(f),"libraryh3lp",h),!1},t.prototype.checkPresence=function(){},t.prototype.setRoot=function(e){this.root=e.replace("http://","https://"),"https://us.libraryh3lp.com"===this.root&&(this.root=t.defaultRoot),"https://us.refchatter.net"===this.root&&(this.root="https://refchatter.net"),n.p=this.root+"/presence/js/"},t.prototype.startPresence=function(){var t=this;this.options.poll&&(this.intervalId=setInterval((function(){return t.checkPresence()}),3e4)),this.checkPresence()},t.prototype.chatUrl=function(e){var n=u(document.getElementById("libraryh3lp")),r=this.root+"/chat/"+n,o="?";return t.chatParams.forEach((function(t){var n=e[t];n&&(r+=""+o+encodeURIComponent(t)+"="+encodeURIComponent(n),o="&")})),r},t.chatParams=["client_id","css","identity","lang","profile","referer","sounds","theme","title"],t.defaultRoot="https://libraryh3lp.com",t}(),p=function(t){function e(e,n){return void 0===n&&(n={}),t.call(this,e,n)||this}return o(e,t),e.prototype.checkPresence=function(){var t=this,e=document.getElementById("libraryh3lp");if(e){var n=l((function(){a()?e.classList.add("libraryh3lp_online"):(e.classList.remove("libraryh3lp_online"),t.intervalId||t.checkPresence())})),r=u(e).split("@"),o=r[0],i=r[1],c=this.root+"/presence/jid/"+o+"/"+i+"/js?cb="+n;jabber_client_id&&!this.intervalId&&(c=c+"&client_id="+jabber_client_id);var s=document.createElement("script");s.src=c,document.body.appendChild(s)}},e}(h),d=function(t){function e(e,n){return void 0===n&&(n={}),t.call(this,e,n)||this}return o(e,t),e.prototype.checkPresence=function(){var t={},e=[],n=document.querySelectorAll("[data-lh3-jid], [jid], .libraryh3lp");n.forEach((function(n){var r=u(n);t[r]||(e.push(r),t[r]=!0)})),this.checkPresenceMulti(n,e)},e.prototype.checkPresenceMulti=function(t,e){var n=this;if(e.length){var r=e.shift();if(r){var o=l((function(){a()?n.goOnline(t,r):(n.goOffline(t,r),n.checkPresenceMulti(t,e))})),i=r.split("@"),c=i[0],s=i[1],u=this.root+"/presence/jid/"+c+"/"+s+"/js?cb="+o,f=document.createElement("script");f.src=u,document.body.appendChild(f)}else this.checkPresenceMulti(t,e)}else this.goOnline(t,null)},e.prototype.goOnline=function(t,e){var n=this;t.forEach((function(t){u(t)==e?(t.style.display="",n.startProactiveTimer(t)):t.style.display="none"}))},e.prototype.goOffline=function(t,e){t.forEach((function(t){u(t)==e&&(t.style.display="none")}))},e.prototype.startProactiveTimer=function(t){var e=this;t.querySelectorAll("[data-lh3-proactive-timer]").forEach((function(t){return c(e,void 0,void 0,(function(){var e,r;return s(this,(function(o){switch(o.label){case 0:return(e=parseInt(t.getAttribute("data-lh3-proactive-timer")))>0?[4,Promise.all([n.e(0),n.e(3),n.e(2)]).then(n.bind(null,6))]:[3,2];case 1:r=o.sent().launchProactive,setTimeout((function(){return r(t)}),1e3*e),o.label=2;case 2:return[2]}}))}))}))},e}(h),v=function(t){function e(e,n){var r=t.call(this,e)||this;return r.fetchService(n),r}return o(e,t),e.prototype.fetchService=function(t){var e=this,n=new XMLHttpRequest;n.open("GET",this.root+"/presence/service/"+t),n.responseType="json",n.onreadystatechange=function(){if(4===n.readyState&&200<=n.status&&n.status<300){var t=n.response;"string"==typeof t&&(t=JSON.parse(t)),e.showService(t)}},n.setRequestHeader("Content-Type","application/json"),n.send()},e.prototype.showService=function(t){return c(this,void 0,void 0,(function(){var e;return s(this,(function(r){switch(r.label){case 0:return this.options=i({},this.options,t.options),(e=document.querySelectorAll(".needs-js")).length&&t.body.match(/<script/)?[4,n.e(0).then(n.t.bind(null,5,7))]:[3,2];case 1:r.sent(),r.label=2;case 2:return e.forEach((function(e){var n=document.createElement("div");n.innerHTML=t.body;var r=[];n.childNodes.forEach((function(t){return r.push(t)})),r.forEach((function(t){e.parentNode.insertBefore(t,e),t.querySelectorAll&&t.querySelectorAll("script").forEach((function(t){var e=document.createElement("script");e.text=t.text,t.parentNode.replaceChild(e,t)}))})),e.parentNode.removeChild(e)})),this.start(),[2]}}))}))},e}(d);window.libraryh3lp||(window.libraryh3lp={}),function t(e){var n=document.querySelectorAll(".needs-js");if(e||n.length||"loading"!=document.readyState){n.forEach((function(t){return t.style.display="none"}));var r,o,i="https://libraryh3lp.com",c=new RegExp("/js/libraryh3lp\\.js(\\?.*)?$");if(document.querySelectorAll("script").forEach((function(t){var e=t.src;e&&e.match(c)&&(i=e.replace(c,""),r=e.match(/\?([0-9]+)/),o=e.match(/\?([a-z,]+)/))})),r)return f=new v(i,r[1]),void(window.libraryh3lp.openChat=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return f.openChat.apply(f,t)});var s={};(o?o[1]:"presence,popup").split(",").forEach((function(t){return s[t]=!0}));var u=document.querySelectorAll("[data-lh3-jid], [jid], .libraryh3lp");(f=u.length?new d(i,s):new p(i,s)).start(),window.libraryh3lp.openChat=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return f.openChat.apply(f,t)}}else document.addEventListener("DOMContentLoaded",t)}()},function(t,e,n){"use strict";t.exports=n(2).polyfill()},function(t,e,n){(function(e,n){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.5+7f2b526d
 */var r;r=function(){"use strict";function t(t){return"function"==typeof t}var r=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)},o=0,i=void 0,c=void 0,s=function(t,e){d[o]=t,d[o+1]=e,2===(o+=2)&&(c?c(v):g())},u="undefined"!=typeof window?window:void 0,a=u||{},l=a.MutationObserver||a.WebKitMutationObserver,f="undefined"==typeof self&&void 0!==e&&"[object process]"==={}.toString.call(e),h="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel;function p(){var t=setTimeout;return function(){return t(v,1)}}var d=new Array(1e3);function v(){for(var t=0;t<o;t+=2)(0,d[t])(d[t+1]),d[t]=void 0,d[t+1]=void 0;o=0}var y,m,b,w,g=void 0;function _(t,e){var n=this,r=new this.constructor(P);void 0===r[E]&&I(r);var o=n._state;if(o){var i=arguments[o-1];s((function(){return q(o,r,i,n._result)}))}else M(n,r,t,e);return r}function j(t){if(t&&"object"==typeof t&&t.constructor===this)return t;var e=new this(P);return S(e,t),e}f?g=function(){return e.nextTick(v)}:l?(m=0,b=new l(v),w=document.createTextNode(""),b.observe(w,{characterData:!0}),g=function(){w.data=m=++m%2}):h?((y=new MessageChannel).port1.onmessage=v,g=function(){return y.port2.postMessage(0)}):g=void 0===u?function(){try{var t=Function("return this")().require("vertx");return void 0!==(i=t.runOnLoop||t.runOnContext)?function(){i(v)}:p()}catch(t){return p()}}():p();var E=Math.random().toString(36).substring(2);function P(){}var T={error:null};function A(t){try{return t.then}catch(t){return T.error=t,T}}function O(e,n,r){n.constructor===e.constructor&&r===_&&n.constructor.resolve===j?function(t,e){1===e._state?C(t,e._result):2===e._state?k(t,e._result):M(e,void 0,(function(e){return S(t,e)}),(function(e){return k(t,e)}))}(e,n):r===T?(k(e,T.error),T.error=null):void 0===r?C(e,n):t(r)?function(t,e,n){s((function(t){var r=!1,o=function(t,e,n,r){try{t.call(e,n,r)}catch(t){return t}}(n,e,(function(n){r||(r=!0,e!==n?S(t,n):C(t,n))}),(function(e){r||(r=!0,k(t,e))}),t._label);!r&&o&&(r=!0,k(t,o))}),t)}(e,n,r):C(e,n)}function S(t,e){var n,r;t===e?k(t,new TypeError("You cannot resolve a promise with itself")):(r=typeof(n=e),null===n||"object"!==r&&"function"!==r?C(t,e):O(t,e,A(e)))}function x(t){t._onerror&&t._onerror(t._result),L(t)}function C(t,e){void 0===t._state&&(t._result=e,t._state=1,0!==t._subscribers.length&&s(L,t))}function k(t,e){void 0===t._state&&(t._state=2,t._result=e,s(x,t))}function M(t,e,n,r){var o=t._subscribers,i=o.length;t._onerror=null,o[i]=e,o[i+1]=n,o[i+2]=r,0===i&&t._state&&s(L,t)}function L(t){var e=t._subscribers,n=t._state;if(0!==e.length){for(var r=void 0,o=void 0,i=t._result,c=0;c<e.length;c+=3)r=e[c],o=e[c+n],r?q(n,r,o,i):o(i);t._subscribers.length=0}}function q(e,n,r,o){var i=t(r),c=void 0,s=void 0,u=void 0,a=void 0;if(i){if((c=function(t,e){try{return t(e)}catch(t){return T.error=t,T}}(r,o))===T?(a=!0,s=c.error,c.error=null):u=!0,n===c)return void k(n,new TypeError("A promises callback cannot return that same promise."))}else c=o,u=!0;void 0!==n._state||(i&&u?S(n,c):a?k(n,s):1===e?C(n,c):2===e&&k(n,c))}var R=0;function I(t){t[E]=R++,t._state=void 0,t._result=void 0,t._subscribers=[]}var N=function(){function t(t,e){this._instanceConstructor=t,this.promise=new t(P),this.promise[E]||I(this.promise),r(e)?(this.length=e.length,this._remaining=e.length,this._result=new Array(this.length),0===this.length?C(this.promise,this._result):(this.length=this.length||0,this._enumerate(e),0===this._remaining&&C(this.promise,this._result))):k(this.promise,new Error("Array Methods must be provided an Array"))}return t.prototype._enumerate=function(t){for(var e=0;void 0===this._state&&e<t.length;e++)this._eachEntry(t[e],e)},t.prototype._eachEntry=function(t,e){var n=this._instanceConstructor,r=n.resolve;if(r===j){var o=A(t);if(o===_&&void 0!==t._state)this._settledAt(t._state,e,t._result);else if("function"!=typeof o)this._remaining--,this._result[e]=t;else if(n===F){var i=new n(P);O(i,t,o),this._willSettleAt(i,e)}else this._willSettleAt(new n((function(e){return e(t)})),e)}else this._willSettleAt(r(t),e)},t.prototype._settledAt=function(t,e,n){var r=this.promise;void 0===r._state&&(this._remaining--,2===t?k(r,n):this._result[e]=n),0===this._remaining&&C(r,this._result)},t.prototype._willSettleAt=function(t,e){var n=this;M(t,void 0,(function(t){return n._settledAt(1,e,t)}),(function(t){return n._settledAt(2,e,t)}))},t}(),F=function(){function e(t){this[E]=R++,this._result=this._state=void 0,this._subscribers=[],P!==t&&("function"!=typeof t&&function(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}(),this instanceof e?function(t,e){try{e((function(e){S(t,e)}),(function(e){k(t,e)}))}catch(e){k(t,e)}}(this,t):function(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}())}return e.prototype.catch=function(t){return this.then(null,t)},e.prototype.finally=function(e){var n=this.constructor;return t(e)?this.then((function(t){return n.resolve(e()).then((function(){return t}))}),(function(t){return n.resolve(e()).then((function(){throw t}))})):this.then(e,e)},e}();return F.prototype.then=_,F.all=function(t){return new N(this,t).promise},F.race=function(t){var e=this;return r(t)?new e((function(n,r){for(var o=t.length,i=0;i<o;i++)e.resolve(t[i]).then(n,r)})):new e((function(t,e){return e(new TypeError("You must pass an array to race."))}))},F.resolve=j,F.reject=function(t){var e=new this(P);return k(e,t),e},F._setScheduler=function(t){c=t},F._setAsap=function(t){s=t},F._asap=s,F.polyfill=function(){var t=void 0;if(void 0!==n)t=n;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(t){throw new Error("polyfill failed because global object is unavailable in this environment")}var e=t.Promise;if(e){var r=null;try{r=Object.prototype.toString.call(e.resolve())}catch(t){}if("[object Promise]"===r&&!e.cast)return}t.Promise=F},F.Promise=F,F},t.exports=r()}).call(this,n(3),n(4))},function(t,e){var n,r,o=t.exports={};function i(){throw new Error("setTimeout has not been defined")}function c(){throw new Error("clearTimeout has not been defined")}function s(t){if(n===setTimeout)return setTimeout(t,0);if((n===i||!n)&&setTimeout)return n=setTimeout,setTimeout(t,0);try{return n(t,0)}catch(e){try{return n.call(null,t,0)}catch(e){return n.call(this,t,0)}}}!function(){try{n="function"==typeof setTimeout?setTimeout:i}catch(t){n=i}try{r="function"==typeof clearTimeout?clearTimeout:c}catch(t){r=c}}();var u,a=[],l=!1,f=-1;function h(){l&&u&&(l=!1,u.length?a=u.concat(a):f=-1,a.length&&p())}function p(){if(!l){var t=s(h);l=!0;for(var e=a.length;e;){for(u=a,a=[];++f<e;)u&&u[f].run();f=-1,e=a.length}u=null,l=!1,function(t){if(r===clearTimeout)return clearTimeout(t);if((r===c||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(t);try{r(t)}catch(e){try{return r.call(null,t)}catch(e){return r.call(this,t)}}}(t)}}function d(t,e){this.fun=t,this.array=e}function v(){}o.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];a.push(new d(t,e)),1!==a.length||l||s(p)},d.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=v,o.addListener=v,o.once=v,o.off=v,o.removeListener=v,o.removeAllListeners=v,o.emit=v,o.prependListener=v,o.prependOnceListener=v,o.listeners=function(t){return[]},o.binding=function(t){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(t){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n}]);