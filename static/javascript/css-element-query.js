!function(a,b){"function"==typeof define&&define.amd?define(b):"object"==typeof exports?module.exports=b():a.ResizeSensor=b()}(this,function(){function b(a,b){var c=Object.prototype.toString.call(a),d="[object Array]"===c||"[object NodeList]"===c||"[object HTMLCollection]"===c||"[object Object]"===c||"undefined"!=typeof jQuery&&a instanceof jQuery||"undefined"!=typeof Elements&&a instanceof Elements,e=0,f=a.length;if(d)for(;e<f;e++)b(a[e]);else b(a)}if("undefined"==typeof window)return null;var a=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(a){return window.setTimeout(a,20)},c=function(d,e){function f(){var a=[];this.add=function(b){a.push(b)};var b,c;this.call=function(){for(b=0,c=a.length;b<c;b++)a[b].call()},this.remove=function(d){var e=[];for(b=0,c=a.length;b<c;b++)a[b]!==d&&e.push(a[b]);a=e},this.length=function(){return a.length}}function g(a,b){return a.currentStyle?a.currentStyle[b]:window.getComputedStyle?window.getComputedStyle(a,null).getPropertyValue(b):a.style[b]}function h(b,c){if(b.resizedAttached)return void b.resizedAttached.add(c);b.resizedAttached=new f,b.resizedAttached.add(c),b.resizeSensor=document.createElement("div"),b.resizeSensor.className="resize-sensor";var d="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;",e="position: absolute; left: 0; top: 0; transition: 0s;";b.resizeSensor.style.cssText=d,b.resizeSensor.innerHTML='<div class="resize-sensor-expand" style="'+d+'"><div style="'+e+'"></div></div><div class="resize-sensor-shrink" style="'+d+'"><div style="'+e+' width: 200%; height: 200%"></div></div>',b.appendChild(b.resizeSensor),"static"==g(b,"position")&&(b.style.position="relative");var k,l,m,n,h=b.resizeSensor.childNodes[0],i=h.childNodes[0],j=b.resizeSensor.childNodes[1],o=b.offsetWidth,p=b.offsetHeight,q=function(){i.style.width="100000px",i.style.height="100000px",h.scrollLeft=1e5,h.scrollTop=1e5,j.scrollLeft=1e5,j.scrollTop=1e5};q();var r=function(){l=0,k&&(o=m,p=n,b.resizedAttached&&b.resizedAttached.call())},s=function(){m=b.offsetWidth,n=b.offsetHeight,k=m!=o||n!=p,k&&!l&&(l=a(r)),q()},t=function(a,b,c){a.attachEvent?a.attachEvent("on"+b,c):a.addEventListener(b,c)};t(h,"scroll",s),t(j,"scroll",s)}b(d,function(a){h(a,e)}),this.detach=function(a){c.detach(d,a)}};return c.detach=function(a,c){b(a,function(a){a.resizedAttached&&"function"==typeof c&&(a.resizedAttached.remove(c),a.resizedAttached.length())||a.resizeSensor&&(a.contains(a.resizeSensor)&&a.removeChild(a.resizeSensor),delete a.resizeSensor,delete a.resizedAttached)})},c}),function(a,b){"function"==typeof define&&define.amd?define(["./ResizeSensor.js"],b):"object"==typeof exports?module.exports=b(require("./ResizeSensor.js")):(a.ElementQueries=b(a.ResizeSensor),a.ElementQueries.listen())}(this,function(a){var b=function(){function e(a){a||(a=document.documentElement);var b=window.getComputedStyle(a,null).fontSize;return parseFloat(b)||16}function f(a,b){var c=b.split(/\d/),d=c[c.length-1];switch(b=parseFloat(b),d){case"px":return b;case"em":return b*e(a);case"rem":return b*e();case"vw":return b*document.documentElement.clientWidth/100;case"vh":return b*document.documentElement.clientHeight/100;case"vmin":case"vmax":var f=document.documentElement.clientWidth/100,g=document.documentElement.clientHeight/100;return b*(0,Math["vmin"===d?"min":"max"])(f,g);default:return b}}function g(a){this.element=a,this.options={};var b,c,g,h,i,j,k,d=0,e=0;this.addOption=function(a){var b=[a.mode,a.property,a.value].join(",");this.options[b]=a};var l=["min-width","min-height","max-width","max-height"];this.call=function(){d=this.element.offsetWidth,e=this.element.offsetHeight,i={};for(b in this.options)this.options.hasOwnProperty(b)&&(c=this.options[b],g=f(this.element,c.value),h="width"==c.property?d:e,k=c.mode+"-"+c.property,j="","min"==c.mode&&h>=g&&(j+=c.value),"max"==c.mode&&h<=g&&(j+=c.value),i[k]||(i[k]=""),j&&-1===(" "+i[k]+" ").indexOf(" "+j+" ")&&(i[k]+=" "+j));for(var a in l)l.hasOwnProperty(a)&&(i[l[a]]?this.element.setAttribute(l[a],i[l[a]].substr(1)):this.element.removeAttribute(l[a]))}}function h(b,e){b.elementQueriesSetupInformation?b.elementQueriesSetupInformation.addOption(e):(b.elementQueriesSetupInformation=new g(b),b.elementQueriesSetupInformation.addOption(e),b.elementQueriesSensor=new a(b,function(){b.elementQueriesSetupInformation.call()})),b.elementQueriesSetupInformation.call(),c&&d.indexOf(b)<0&&d.push(b)}function j(a,b,c,d){void 0===i[b]&&(i[b]={}),void 0===i[b][c]&&(i[b][c]={}),void 0===i[b][c][d]?i[b][c][d]=a:i[b][c][d]+=","+a}function k(){var a;if(document.querySelectorAll&&(a=document.querySelectorAll.bind(document)),a||"undefined"==typeof $$||(a=$$),a||"undefined"==typeof jQuery||(a=jQuery),!a)throw"No document.querySelectorAll, jQuery or Mootools's $$ found.";return a}function l(){var a=k();for(var b in i)if(i.hasOwnProperty(b))for(var c in i[b])if(i[b].hasOwnProperty(c))for(var d in i[b][c])if(i[b][c].hasOwnProperty(d))for(var e=a(i[b][c][d]),f=0,g=e.length;f<g;f++)h(e[f],{mode:b,property:c,value:d})}function m(b){function o(){var c,a=!1;for(c in e)e.hasOwnProperty(c)&&f[c].minWidth&&b.offsetWidth>f[c].minWidth&&(a=c);if(a||(a=h),i!=a)if(j[a])e[i].style.display="none",e[a].style.display="block",i=a;else{var d=new Image;d.onload=function(){e[a].src=g[a],e[i].style.display="none",e[a].style.display="block",j[a]=!0,i=a},d.src=g[a]}else e[a].src=g[a]}var e=[],f=[],g=[],h=0,i=-1,j=[];for(var k in b.children)if(b.children.hasOwnProperty(k)&&b.children[k].tagName&&"img"===b.children[k].tagName.toLowerCase()){e.push(b.children[k]);var l=b.children[k].getAttribute("min-width")||b.children[k].getAttribute("data-min-width"),m=b.children[k].getAttribute("data-src")||b.children[k].getAttribute("url");g.push(m);var n={minWidth:l};f.push(n),l?b.children[k].style.display="none":(h=e.length-1,b.children[k].style.display="block")}i=h,b.resizeSensor=new a(b,o),o(),c&&d.push(b)}function n(){for(var a=k(),b=a("[data-responsive-image],[responsive-image]"),c=0,d=b.length;c<d;c++)m(b[c])}function q(a){var b,c;for(a=a.replace(/'/g,'"');null!==(b=o.exec(a));)for(c=b[1]+b[3],attrs=b[2];null!==(attrMatch=p.exec(attrs));)j(c,attrMatch[1],attrMatch[2],attrMatch[3])}function r(a){var b="";if(a)if("string"==typeof a)a=a.toLowerCase(),-1===a.indexOf("min-width")&&-1===a.indexOf("max-width")||q(a);else for(var c=0,d=a.length;c<d;c++)1===a[c].type?(b=a[c].selectorText||a[c].cssText,-1!==b.indexOf("min-height")||-1!==b.indexOf("max-height")?q(b):-1===b.indexOf("min-width")&&-1===b.indexOf("max-width")||q(b)):4===a[c].type&&r(a[c].cssRules||a[c].rules)}var c=!1,d=[],i={},o=/,?[\s\t]*([^,\n]*?)((?:\[[\s\t]*?(?:min|max)-(?:width|height)[\s\t]*?[~$\^]?=[\s\t]*?"[^"]*?"[\s\t]*?])+)([^,\n\s\{]*)/gim,p=/\[[\s\t]*?(min|max)-(width|height)[\s\t]*?[~$\^]?=[\s\t]*?"([^"]*?)"[\s\t]*?]/gim,s=!1;this.init=function(a){c=void 0!==a&&a;for(var b=0,d=document.styleSheets.length;b<d;b++)try{r(document.styleSheets[b].cssRules||document.styleSheets[b].rules||document.styleSheets[b].cssText)}catch(a){if("SecurityError"!==a.name)throw a}if(!s){var e=document.createElement("style");e.type="text/css",e.innerHTML="[responsive-image] > img, [data-responsive-image] {overflow: hidden; padding: 0; } [responsive-image] > img, [data-responsive-image] > img { width: 100%;}",document.getElementsByTagName("head")[0].appendChild(e),s=!0}l(),n()},this.update=function(a){this.init(a)},this.detach=function(){if(!this.withTracking)throw"withTracking is not enabled. We can not detach elements since we don not store it.Use ElementQueries.withTracking = true; before domready or call ElementQueryes.update(true).";for(var a;a=d.pop();)b.detach(a);d=[]}};b.update=function(a){b.instance.update(a)},b.detach=function(a){a.elementQueriesSetupInformation?(a.elementQueriesSensor.detach(),delete a.elementQueriesSetupInformation,delete a.elementQueriesSensor):a.resizeSensor&&(a.resizeSensor.detach(),delete a.resizeSensor)},b.withTracking=!1,b.init=function(){b.instance||(b.instance=new b),b.instance.init(b.withTracking)};var c=function(a){if(document.addEventListener)document.addEventListener("DOMContentLoaded",a,!1);else if(/KHTML|WebKit|iCab/i.test(navigator.userAgent))var b=setInterval(function(){/loaded|complete/i.test(document.readyState)&&(a(),clearInterval(b))},10);else window.onload=a};return b.listen=function(){c(b.init)},b});