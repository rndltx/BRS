(()=>{var e={};e.id=908,e.ids=[908],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},47885:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>i.a,__next_app__:()=>c,pages:()=>u,routeModule:()=>p,tree:()=>d});var n=r(70260),a=r(28203),o=r(25155),i=r.n(o),s=r(67292),l={};for(let e in s)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>s[e]);r.d(t,l);let d=["",{children:["admin",{children:["help",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,17716)),"C:\\Users\\Khairunnisa\\OneDrive\\Dokumen\\saufi\\app\\admin\\help\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,54899)),"C:\\Users\\Khairunnisa\\OneDrive\\Dokumen\\saufi\\app\\admin\\layout.tsx"]}]},{layout:[()=>Promise.resolve().then(r.bind(r,19611)),"C:\\Users\\Khairunnisa\\OneDrive\\Dokumen\\saufi\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,19937,23)),"next/dist/client/components/not-found-error"]}],u=["C:\\Users\\Khairunnisa\\OneDrive\\Dokumen\\saufi\\app\\admin\\help\\page.tsx"],c={require:r,loadChunk:()=>Promise.resolve()},p=new n.AppPageRouteModule({definition:{kind:a.RouteKind.APP_PAGE,page:"/admin/help/page",pathname:"/admin/help",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},48493:(e,t,r)=>{Promise.resolve().then(r.bind(r,17716))},12109:(e,t,r)=>{Promise.resolve().then(r.bind(r,44848))},44848:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>ew});var n=r(45512),a=r(58009),o=r.t(a,2),i=r(55744);function s(e,t=[]){let r=[],o=()=>{let t=r.map(e=>a.createContext(e));return function(r){let n=r?.[e]||t;return a.useMemo(()=>({[`__scope${e}`]:{...r,[e]:n}}),[r,n])}};return o.scopeName=e,[function(t,o){let i=a.createContext(o),s=r.length;r=[...r,o];let l=t=>{let{scope:r,children:o,...l}=t,d=r?.[e]?.[s]||i,u=a.useMemo(()=>l,Object.values(l));return(0,n.jsx)(d.Provider,{value:u,children:o})};return l.displayName=t+"Provider",[l,function(r,n){let l=n?.[e]?.[s]||i,d=a.useContext(l);if(d)return d;if(void 0!==o)return o;throw Error(`\`${r}\` must be used within \`${t}\``)}]},function(...e){let t=e[0];if(1===e.length)return t;let r=()=>{let r=e.map(e=>({useScope:e(),scopeName:e.scopeName}));return function(e){let n=r.reduce((t,{useScope:r,scopeName:n})=>{let a=r(e)[`__scope${n}`];return{...t,...a}},{});return a.useMemo(()=>({[`__scope${t.scopeName}`]:n}),[n])}};return r.scopeName=t.scopeName,r}(o,...t)]}function l(...e){return t=>e.forEach(e=>{"function"==typeof e?e(t):null!=e&&(e.current=t)})}function d(...e){return a.useCallback(l(...e),e)}var u=a.forwardRef((e,t)=>{let{children:r,...o}=e,i=a.Children.toArray(r),s=i.find(f);if(s){let e=s.props.children,r=i.map(t=>t!==s?t:a.Children.count(e)>1?a.Children.only(null):a.isValidElement(e)?e.props.children:null);return(0,n.jsx)(c,{...o,ref:t,children:a.isValidElement(e)?a.cloneElement(e,void 0,r):null})}return(0,n.jsx)(c,{...o,ref:t,children:r})});u.displayName="Slot";var c=a.forwardRef((e,t)=>{let{children:r,...n}=e;if(a.isValidElement(r)){let e=function(e){let t=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,r=t&&"isReactWarning"in t&&t.isReactWarning;return r?e.ref:(r=(t=Object.getOwnPropertyDescriptor(e,"ref")?.get)&&"isReactWarning"in t&&t.isReactWarning)?e.props.ref:e.props.ref||e.ref}(r);return a.cloneElement(r,{...function(e,t){let r={...t};for(let n in t){let a=e[n],o=t[n];/^on[A-Z]/.test(n)?a&&o?r[n]=(...e)=>{o(...e),a(...e)}:a&&(r[n]=a):"style"===n?r[n]={...a,...o}:"className"===n&&(r[n]=[a,o].filter(Boolean).join(" "))}return{...e,...r}}(n,r.props),ref:t?l(t,e):e})}return a.Children.count(r)>1?a.Children.only(null):null});c.displayName="SlotClone";var p=({children:e})=>(0,n.jsx)(n.Fragment,{children:e});function f(e){return a.isValidElement(e)&&e.type===p}function m(e,t,{checkForDefaultPrevented:r=!0}={}){return function(n){if(e?.(n),!1===r||!n.defaultPrevented)return t?.(n)}}function h(e){let t=a.useRef(e);return a.useEffect(()=>{t.current=e}),a.useMemo(()=>(...e)=>t.current?.(...e),[])}function x({prop:e,defaultProp:t,onChange:r=()=>{}}){let[n,o]=function({defaultProp:e,onChange:t}){let r=a.useState(e),[n]=r,o=a.useRef(n),i=h(t);return a.useEffect(()=>{o.current!==n&&(i(n),o.current=n)},[n,o,i]),r}({defaultProp:t,onChange:r}),i=void 0!==e,s=i?e:n,l=h(r);return[s,a.useCallback(t=>{if(i){let r="function"==typeof t?t(e):t;r!==e&&l(r)}else o(t)},[i,e,o,l])]}r(55740);var v=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","span","svg","ul"].reduce((e,t)=>{let r=a.forwardRef((e,r)=>{let{asChild:a,...o}=e,i=a?u:t;return"undefined"!=typeof window&&(window[Symbol.for("radix-ui")]=!0),(0,n.jsx)(i,{...o,ref:r})});return r.displayName=`Primitive.${t}`,{...e,[t]:r}},{}),g=globalThis?.document?a.useLayoutEffect:()=>{},y=e=>{let{present:t,children:r}=e,n=function(e){var t,r;let[n,o]=a.useState(),i=a.useRef({}),s=a.useRef(e),l=a.useRef("none"),[d,u]=(t=e?"mounted":"unmounted",r={mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}},a.useReducer((e,t)=>r[e][t]??e,t));return a.useEffect(()=>{let e=b(i.current);l.current="mounted"===d?e:"none"},[d]),g(()=>{let t=i.current,r=s.current;if(r!==e){let n=l.current,a=b(t);e?u("MOUNT"):"none"===a||t?.display==="none"?u("UNMOUNT"):r&&n!==a?u("ANIMATION_OUT"):u("UNMOUNT"),s.current=e}},[e,u]),g(()=>{if(n){let e;let t=n.ownerDocument.defaultView??window,r=r=>{let a=b(i.current).includes(r.animationName);if(r.target===n&&a&&(u("ANIMATION_END"),!s.current)){let r=n.style.animationFillMode;n.style.animationFillMode="forwards",e=t.setTimeout(()=>{"forwards"===n.style.animationFillMode&&(n.style.animationFillMode=r)})}},a=e=>{e.target===n&&(l.current=b(i.current))};return n.addEventListener("animationstart",a),n.addEventListener("animationcancel",r),n.addEventListener("animationend",r),()=>{t.clearTimeout(e),n.removeEventListener("animationstart",a),n.removeEventListener("animationcancel",r),n.removeEventListener("animationend",r)}}u("ANIMATION_END")},[n,u]),{isPresent:["mounted","unmountSuspended"].includes(d),ref:a.useCallback(e=>{e&&(i.current=getComputedStyle(e)),o(e)},[])}}(t),o="function"==typeof r?r({present:n.isPresent}):a.Children.only(r),i=d(n.ref,function(e){let t=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,r=t&&"isReactWarning"in t&&t.isReactWarning;return r?e.ref:(r=(t=Object.getOwnPropertyDescriptor(e,"ref")?.get)&&"isReactWarning"in t&&t.isReactWarning)?e.props.ref:e.props.ref||e.ref}(o));return"function"==typeof r||n.isPresent?a.cloneElement(o,{ref:i}):null};function b(e){return e?.animationName||"none"}y.displayName="Presence";var w=o["useId".toString()]||(()=>void 0),N=0;function j(e){let[t,r]=a.useState(w());return g(()=>{e||r(e=>e??String(N++))},[e]),e||(t?`radix-${t}`:"")}var C="Collapsible",[R,k]=s(C),[A,_]=R(C),P=a.forwardRef((e,t)=>{let{__scopeCollapsible:r,open:o,defaultOpen:i,disabled:s,onOpenChange:l,...d}=e,[u=!1,c]=x({prop:o,defaultProp:i,onChange:l});return(0,n.jsx)(A,{scope:r,disabled:s,contentId:j(),open:u,onOpenToggle:a.useCallback(()=>c(e=>!e),[c]),children:(0,n.jsx)(v.div,{"data-state":S(u),"data-disabled":s?"":void 0,...d,ref:t})})});P.displayName=C;var O="CollapsibleTrigger",M=a.forwardRef((e,t)=>{let{__scopeCollapsible:r,...a}=e,o=_(O,r);return(0,n.jsx)(v.button,{type:"button","aria-controls":o.contentId,"aria-expanded":o.open||!1,"data-state":S(o.open),"data-disabled":o.disabled?"":void 0,disabled:o.disabled,...a,ref:t,onClick:m(e.onClick,o.onOpenToggle)})});M.displayName=O;var I="CollapsibleContent",D=a.forwardRef((e,t)=>{let{forceMount:r,...a}=e,o=_(I,e.__scopeCollapsible);return(0,n.jsx)(y,{present:r||o.open,children:({present:e})=>(0,n.jsx)(E,{...a,ref:t,present:e})})});D.displayName=I;var E=a.forwardRef((e,t)=>{let{__scopeCollapsible:r,present:o,children:i,...s}=e,l=_(I,r),[u,c]=a.useState(o),p=a.useRef(null),f=d(t,p),m=a.useRef(0),h=m.current,x=a.useRef(0),y=x.current,b=l.open||u,w=a.useRef(b),N=a.useRef();return a.useEffect(()=>{let e=requestAnimationFrame(()=>w.current=!1);return()=>cancelAnimationFrame(e)},[]),g(()=>{let e=p.current;if(e){N.current=N.current||{transitionDuration:e.style.transitionDuration,animationName:e.style.animationName},e.style.transitionDuration="0s",e.style.animationName="none";let t=e.getBoundingClientRect();m.current=t.height,x.current=t.width,w.current||(e.style.transitionDuration=N.current.transitionDuration,e.style.animationName=N.current.animationName),c(o)}},[l.open,o]),(0,n.jsx)(v.div,{"data-state":S(l.open),"data-disabled":l.disabled?"":void 0,id:l.contentId,hidden:!b,...s,ref:f,style:{"--radix-collapsible-content-height":h?`${h}px`:void 0,"--radix-collapsible-content-width":y?`${y}px`:void 0,...e.style},children:b&&i})});function S(e){return e?"open":"closed"}var T=a.createContext(void 0),U="Accordion",$=["Home","End","ArrowDown","ArrowUp","ArrowLeft","ArrowRight"],[q,H,L]=function(e){let t=e+"CollectionProvider",[r,o]=function(e,t=[]){let r=[],o=()=>{let t=r.map(e=>a.createContext(e));return function(r){let n=r?.[e]||t;return a.useMemo(()=>({[`__scope${e}`]:{...r,[e]:n}}),[r,n])}};return o.scopeName=e,[function(t,o){let i=a.createContext(o),s=r.length;function l(t){let{scope:r,children:o,...l}=t,d=r?.[e][s]||i,u=a.useMemo(()=>l,Object.values(l));return(0,n.jsx)(d.Provider,{value:u,children:o})}return r=[...r,o],l.displayName=t+"Provider",[l,function(r,n){let l=n?.[e][s]||i,d=a.useContext(l);if(d)return d;if(void 0!==o)return o;throw Error(`\`${r}\` must be used within \`${t}\``)}]},function(...e){let t=e[0];if(1===e.length)return t;let r=()=>{let r=e.map(e=>({useScope:e(),scopeName:e.scopeName}));return function(e){let n=r.reduce((t,{useScope:r,scopeName:n})=>{let a=r(e)[`__scope${n}`];return{...t,...a}},{});return a.useMemo(()=>({[`__scope${t.scopeName}`]:n}),[n])}};return r.scopeName=t.scopeName,r}(o,...t)]}(t),[i,s]=r(t,{collectionRef:{current:null},itemMap:new Map}),l=e=>{let{scope:t,children:r}=e,o=a.useRef(null),s=a.useRef(new Map).current;return(0,n.jsx)(i,{scope:t,itemMap:s,collectionRef:o,children:r})};l.displayName=t;let c=e+"CollectionSlot",p=a.forwardRef((e,t)=>{let{scope:r,children:a}=e,o=d(t,s(c,r).collectionRef);return(0,n.jsx)(u,{ref:o,children:a})});p.displayName=c;let f=e+"CollectionItemSlot",m="data-radix-collection-item",h=a.forwardRef((e,t)=>{let{scope:r,children:o,...i}=e,l=a.useRef(null),c=d(t,l),p=s(f,r);return a.useEffect(()=>(p.itemMap.set(l,{ref:l,...i}),()=>void p.itemMap.delete(l))),(0,n.jsx)(u,{[m]:"",ref:c,children:o})});return h.displayName=f,[{Provider:l,Slot:p,ItemSlot:h},function(t){let r=s(e+"CollectionConsumer",t);return a.useCallback(()=>{let e=r.collectionRef.current;if(!e)return[];let t=Array.from(e.querySelectorAll(`[${m}]`));return Array.from(r.itemMap.values()).sort((e,r)=>t.indexOf(e.ref.current)-t.indexOf(r.ref.current))},[r.collectionRef,r.itemMap])},o]}(U),[W,B]=s(U,[L,k]),F=k(),K=a.forwardRef((e,t)=>{let{type:r,...a}=e;return(0,n.jsx)(q.Provider,{scope:e.__scopeAccordion,children:"multiple"===r?(0,n.jsx)(z,{...a,ref:t}):(0,n.jsx)(Q,{...a,ref:t})})});K.displayName=U;var[V,G]=W(U),[Z,Y]=W(U,{collapsible:!1}),Q=a.forwardRef((e,t)=>{let{value:r,defaultValue:o,onValueChange:i=()=>{},collapsible:s=!1,...l}=e,[d,u]=x({prop:r,defaultProp:o,onChange:i});return(0,n.jsx)(V,{scope:e.__scopeAccordion,value:d?[d]:[],onItemOpen:u,onItemClose:a.useCallback(()=>s&&u(""),[s,u]),children:(0,n.jsx)(Z,{scope:e.__scopeAccordion,collapsible:s,children:(0,n.jsx)(ee,{...l,ref:t})})})}),z=a.forwardRef((e,t)=>{let{value:r,defaultValue:o,onValueChange:i=()=>{},...s}=e,[l=[],d]=x({prop:r,defaultProp:o,onChange:i}),u=a.useCallback(e=>d((t=[])=>[...t,e]),[d]),c=a.useCallback(e=>d((t=[])=>t.filter(t=>t!==e)),[d]);return(0,n.jsx)(V,{scope:e.__scopeAccordion,value:l,onItemOpen:u,onItemClose:c,children:(0,n.jsx)(Z,{scope:e.__scopeAccordion,collapsible:!0,children:(0,n.jsx)(ee,{...s,ref:t})})})}),[X,J]=W(U),ee=a.forwardRef((e,t)=>{let{__scopeAccordion:r,disabled:o,dir:i,orientation:s="vertical",...l}=e,u=d(a.useRef(null),t),c=H(r),p="ltr"===function(e){let t=a.useContext(T);return e||t||"ltr"}(i),f=m(e.onKeyDown,e=>{if(!$.includes(e.key))return;let t=e.target,r=c().filter(e=>!e.ref.current?.disabled),n=r.findIndex(e=>e.ref.current===t),a=r.length;if(-1===n)return;e.preventDefault();let o=n,i=a-1,l=()=>{(o=n+1)>i&&(o=0)},d=()=>{(o=n-1)<0&&(o=i)};switch(e.key){case"Home":o=0;break;case"End":o=i;break;case"ArrowRight":"horizontal"===s&&(p?l():d());break;case"ArrowDown":"vertical"===s&&l();break;case"ArrowLeft":"horizontal"===s&&(p?d():l());break;case"ArrowUp":"vertical"===s&&d()}let u=o%a;r[u].ref.current?.focus()});return(0,n.jsx)(X,{scope:r,disabled:o,direction:i,orientation:s,children:(0,n.jsx)(q.Slot,{scope:r,children:(0,n.jsx)(v.div,{...l,"data-orientation":s,ref:u,onKeyDown:o?void 0:f})})})}),et="AccordionItem",[er,en]=W(et),ea=a.forwardRef((e,t)=>{let{__scopeAccordion:r,value:a,...o}=e,i=J(et,r),s=G(et,r),l=F(r),d=j(),u=a&&s.value.includes(a)||!1,c=i.disabled||e.disabled;return(0,n.jsx)(er,{scope:r,open:u,disabled:c,triggerId:d,children:(0,n.jsx)(P,{"data-orientation":i.orientation,"data-state":ec(u),...l,...o,ref:t,disabled:c,open:u,onOpenChange:e=>{e?s.onItemOpen(a):s.onItemClose(a)}})})});ea.displayName=et;var eo="AccordionHeader",ei=a.forwardRef((e,t)=>{let{__scopeAccordion:r,...a}=e,o=J(U,r),i=en(eo,r);return(0,n.jsx)(v.h3,{"data-orientation":o.orientation,"data-state":ec(i.open),"data-disabled":i.disabled?"":void 0,...a,ref:t})});ei.displayName=eo;var es="AccordionTrigger",el=a.forwardRef((e,t)=>{let{__scopeAccordion:r,...a}=e,o=J(U,r),i=en(es,r),s=Y(es,r),l=F(r);return(0,n.jsx)(q.ItemSlot,{scope:r,children:(0,n.jsx)(M,{"aria-disabled":i.open&&!s.collapsible||void 0,"data-orientation":o.orientation,id:i.triggerId,...l,...a,ref:t})})});el.displayName=es;var ed="AccordionContent",eu=a.forwardRef((e,t)=>{let{__scopeAccordion:r,...a}=e,o=J(U,r),i=en(ed,r),s=F(r);return(0,n.jsx)(D,{role:"region","aria-labelledby":i.triggerId,"data-orientation":o.orientation,...s,...a,ref:t,style:{"--radix-accordion-content-height":"var(--radix-collapsible-content-height)","--radix-accordion-content-width":"var(--radix-collapsible-content-width)",...e.style}})});function ec(e){return e?"open":"closed"}eu.displayName=ed;let ep=(0,r(73258).A)("ChevronDown",[["polyline",{points:"6 9 12 15 18 9",key:"1do0m2"}]]);var ef=r(7702);let em=a.forwardRef(({className:e,...t},r)=>(0,n.jsx)(ea,{ref:r,className:(0,ef.cn)("border-b",e),...t}));em.displayName="AccordionItem";let eh=a.forwardRef(({className:e,children:t,...r},a)=>(0,n.jsx)(ei,{className:"flex",children:(0,n.jsxs)(el,{ref:a,className:(0,ef.cn)("flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",e),...r,children:[t,(0,n.jsx)(ep,{className:"h-4 w-4 shrink-0 transition-transform duration-200"})]})}));eh.displayName=el.displayName;let ex=a.forwardRef(({className:e,children:t,...r},a)=>(0,n.jsx)(eu,{ref:a,className:(0,ef.cn)("overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",e),...r,children:(0,n.jsx)("div",{className:"pb-4 pt-0",children:t})}));ex.displayName=eu.displayName;var ev=r(63451),eg=r(43517),ey=r(26008),eb=r(8866);let ew=(0,i.r)(function(){let[e,t]=(0,a.useState)(null);return(0,n.jsxs)("div",{className:"container mx-auto px-4 py-8",children:[(0,n.jsx)("h1",{className:"text-3xl font-bold mb-6",children:"Admin Help Center"}),(0,n.jsx)("p",{className:"text-gray-600 dark:text-gray-300 mb-8",children:"Welcome to the CV. Berkat Rahmat Sejahtera admin help center. Here you can find answers to common questions and guidance on using the admin panel."}),(0,n.jsxs)("div",{className:"grid md:grid-cols-2 gap-6 mb-8",children:[(0,n.jsxs)(ev.Zp,{children:[(0,n.jsxs)(ev.aR,{children:[(0,n.jsx)(ev.ZB,{children:"Quick Links"}),(0,n.jsx)(ev.BT,{children:"Shortcuts to important admin pages"})]}),(0,n.jsx)(ev.Wu,{children:(0,n.jsxs)("ul",{className:"space-y-2",children:[(0,n.jsx)("li",{children:(0,n.jsx)(ey.default,{href:"/admin/dashboard",className:"text-blue-600 hover:underline",children:"Dashboard"})}),(0,n.jsx)("li",{children:(0,n.jsx)(ey.default,{href:"/admin/vision-mission",className:"text-blue-600 hover:underline",children:"Vision & Mission"})}),(0,n.jsx)("li",{children:(0,n.jsx)(ey.default,{href:"/admin/products",className:"text-blue-600 hover:underline",children:"Products"})}),(0,n.jsx)("li",{children:(0,n.jsx)(ey.default,{href:"/admin/gallery",className:"text-blue-600 hover:underline",children:"Gallery"})}),(0,n.jsx)("li",{children:(0,n.jsx)(ey.default,{href:"/admin/settings",className:"text-blue-600 hover:underline",children:"Settings"})})]})})]}),(0,n.jsxs)(ev.Zp,{children:[(0,n.jsxs)(ev.aR,{children:[(0,n.jsx)(ev.ZB,{children:"Need More Help?"}),(0,n.jsx)(ev.BT,{children:"Contact our support team"})]}),(0,n.jsxs)(ev.Wu,{children:[(0,n.jsx)("p",{className:"mb-4",children:"If you can't find the answer you're looking for, our support team is here to help."}),(0,n.jsxs)(eg.$,{children:[(0,n.jsx)(eb.A,{className:"mr-2 h-4 w-4"}),"Contact Support"]})]})]})]}),(0,n.jsx)("h2",{className:"text-2xl font-semibold mb-4",children:"Frequently Asked Questions"}),(0,n.jsx)(K,{type:"single",collapsible:!0,className:"w-full",children:[{question:"How do I update the Vision & Mission statements?",answer:"Go to the Vision & Mission page in the admin panel. You&apos;ll find forms to edit both the vision and mission statements. After making your changes, click the &apos;Save Changes&apos; button to update the content."},{question:"How can I add new products to the website?",answer:"Navigate to the Products page in the admin panel. You&apos;ll find an &apos;Add New Product&apos; button. Click it, fill in the product details in the form, and submit to add a new product to the website."},{question:"How do I manage the image gallery?",answer:"The Gallery page in the admin panel allows you to upload, delete, and reorder images. To add new images, use the &apos;Upload Image&apos; button. To remove an image, click the delete icon next to it."},{question:"How can I change my admin password?",answer:"Go to the Profile page in the admin panel. You&apos;ll find a section to change your password. Enter your current password, then your new password twice to confirm. Click &apos;Update Password&apos; to save the changes."},{question:"How do I add or remove admin users?",answer:"User management is handled in the Settings page. You can add new admin users by providing their email and an initial password. To remove an admin, find their name in the list of users and click the &apos;Remove&apos; button."}].map((e,t)=>(0,n.jsxs)(em,{value:`item-${t}`,children:[(0,n.jsx)(eh,{children:e.question}),(0,n.jsx)(ex,{children:e.answer})]},t))})]})})},43517:(e,t,r)=>{"use strict";r.d(t,{$:()=>o});var n=r(45512),a=r(7702);function o({className:e,variant:t="default",...r}){return(0,n.jsx)("button",{className:(0,a.cn)("px-4 py-2 rounded-lg font-medium transition-all duration-200",{"bg-blue-500 hover:bg-blue-600 text-white":"default"===t,"bg-red-500 hover:bg-red-600 text-white":"destructive"===t,"border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800":"outline"===t},e),...r})}r(58009)},63451:(e,t,r)=>{"use strict";r.d(t,{BT:()=>d,Wu:()=>u,ZB:()=>l,Zp:()=>i,aR:()=>s,wL:()=>c});var n=r(45512),a=r(58009),o=r(7702);let i=a.forwardRef(({className:e,...t},r)=>(0,n.jsx)("div",{ref:r,className:(0,o.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",e),...t}));i.displayName="Card";let s=a.forwardRef(({className:e,...t},r)=>(0,n.jsx)("div",{ref:r,className:(0,o.cn)("flex flex-col space-y-1.5 p-6",e),...t}));s.displayName="CardHeader";let l=a.forwardRef(({className:e,...t},r)=>(0,n.jsx)("h3",{ref:r,className:(0,o.cn)("text-2xl font-semibold leading-none tracking-tight",e),...t}));l.displayName="CardTitle";let d=a.forwardRef(({className:e,...t},r)=>(0,n.jsx)("p",{ref:r,className:(0,o.cn)("text-sm text-muted-foreground",e),...t}));d.displayName="CardDescription";let u=a.forwardRef(({className:e,...t},r)=>(0,n.jsx)("div",{ref:r,className:(0,o.cn)("p-6 pt-0",e),...t}));u.displayName="CardContent";let c=a.forwardRef(({className:e,...t},r)=>(0,n.jsx)("div",{ref:r,className:(0,o.cn)("flex items-center p-6 pt-0",e),...t}));c.displayName="CardFooter"},7702:(e,t,r)=>{"use strict";r.d(t,{cn:()=>o});var n=r(82281),a=r(94805);function o(...e){return(0,a.QP)((0,n.$)(e))}},8866:(e,t,r)=>{"use strict";r.d(t,{A:()=>n});let n=(0,r(73258).A)("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]])},17716:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>n});let n=(0,r(46760).registerClientReference)(function(){throw Error("Attempted to call the default export of \"C:\\\\Users\\\\Khairunnisa\\\\OneDrive\\\\Dokumen\\\\saufi\\\\app\\\\admin\\\\help\\\\page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"C:\\Users\\Khairunnisa\\OneDrive\\Dokumen\\saufi\\app\\admin\\help\\page.tsx","default")}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[989,336,298,821,889],()=>r(47885));module.exports=n})();