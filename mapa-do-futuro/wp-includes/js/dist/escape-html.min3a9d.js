/*! This file is auto-generated */
(()=>{"use strict";var e={d:(t,r)=>{for(var n in r)e.o(r,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:r[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{escapeAmpersand:()=>n,escapeAttribute:()=>u,escapeEditableHTML:()=>i,escapeHTML:()=>c,escapeLessThan:()=>o,escapeQuotationMark:()=>a,isValidAttributeName:()=>p});const r=/[\u007F-\u009F "'>/="\uFDD0-\uFDEF]/;function n(e){return e.replace(/&(?!([a-z0-9]+|#[0-9]+|#x[a-f0-9]+);)/gi,"&amp;")}function a(e){return e.replace(/"/g,"&quot;")}function o(e){return e.replace(/</g,"&lt;")}function u(e){return function(e){return e.replace(/>/g,"&gt;")}(a(n(e)))}function c(e){return o(n(e))}function i(e){return o(e.replace(/&/g,"&amp;"))}function p(e){return!r.test(e)}(window.wp=window.wp||{}).escapeHtml=t})();