'use strict';var _exports;function init(){function a(){for(let C in r.info(`projectManager.js cleanProjects`),x)x[C].watcher&&x[C].watcher.close();x={}}function b(C){let D=C.hash;if(!x[D]){B.project=C,1<Object.keys(x).length&&a(),r.info(`manager.js initProject projectid ${C.projectid}`);let E={cache:{},wxmlFileList:[],jsFileList:[]};x[D]=E,E.watcher=o.watch(C.projectpath,{ignored:[/node_modules/],ignoreInitial:!0,ignorePermissionErrors:!0,followSymlinks:!0,interval:1000,binaryInterval:1000}).on('all',(F,G,H)=>{let I=k.extname(G);s.whiteFileExtName[I]&&(G=k.relative(C.projectpath,G),c(C,F,G,H))}),E.watcher.on('error',F=>{F&&!A&&(r.error(`projectManager.js obj.watcher error ${F.toString()}`),A=!0,a(),b(C))})}}function c(C,D,E,F){let G=C.hash,H=x[G].cache;E=E.replace(/\\/g,'/'),'app.json'===E&&(x[G].cache={}),E&&H[E]&&(delete H[E],delete H['app-config.json']);let I=k.extname(E);'.wxml'===I?(clearTimeout(y),x[G].wxmlFileList=[],y=setTimeout(()=>{d(C)},20)):'.js'===I&&(clearTimeout(z),x[G].jsFileList=[],z=setTimeout(()=>{f(C)},20)),B.fileChange(C,D,E,F)}function d(C,D){try{let E=n.sync(`./**/*.wxml`,{nodir:!0,cwd:C.projectpath,ignore:['node_modules/**/*'],nosort:!0,strict:!1,silent:!0}),F=C.hash;x[F].wxmlFileList=E,D&&D(null,E)}catch(E){r.error(`projectManager.js findAllWXMLFiles ${E.toString()}`),D&&D(E,[])}}function f(C,D){try{let E=n.sync(`**/*.js`,{nodir:!0,cwd:C.projectpath,ignore:['node_modules/**/*'],nosort:!0,strict:!1,silent:!0}),F=C.hash;x[F].jsFileList=E,D&&D(null,E)}catch(E){r.error(`projectManager.js findAllJSFiles ${E.toString()}`),D&&D(E,[])}}function g(C,D){b(C);let E=C.hash,F=l.parse(D),G=F.pathname.replace(/^\//,''),H=k.extname(G),I=H?G.replace(H,'.json'):`${G}.json`,J=x[E].cache;if(J[I])return J[I];let K=C.projectpath,L=h(C),M=k.join(K,I),N=j.existsSync(M),O={};if(N){let P=j.readFileSync(M,'utf8');try{O=JSON.parse(P)}catch(Q){throw{e:Q,data:P,type:u.JSON_PARSE_ERROR,file:I}}}return J[I]=Object.assign({},L.window,O),J[I]}function h(C){b(C);let D=C.hash,E='app.json',F=x[D].cache,G=F[E];if(G)return G;let J,H=C.projectpath,I=k.join(H,'app.json');try{J=j.readFileSync(I,'utf8')}catch(N){throw{e:N,type:u.JSON_FILE_ERROR,file:'app.json'}}try{G=JSON.parse(J)}catch(N){throw{e:N,type:u.JSON_PARSE_ERROR,file:'app.json',data:J}}let K=G.pages;if(!K||0===K.length)throw{type:u.JSON_ENTRANCE_ERROR,file:'app.json',data:J};let L=G.tabBar;if(L){let N=[];if('[object Array]'!=Object.prototype.toString.call(L.list))N.push('tabBar.list \u5E94\u4E3A\u6570\u7EC4');else if(!L.list||2>L.list.length)N.push('tabBar.list \u9700\u81F3\u5C11\u5305\u542B\u4E24\u4E2A\u9879\u76EE');else if(5<L.list.length)N.push('tabBar.list \u4E0D\u80FD\u8D85\u8FC7 5 \u4E2A\u914D\u7F6E\u9879');else for(var M=0;M<L.list.length;M++){let O=L.list[M];if('[object Object]'!=Object.prototype.toString.call(O)){N.push(`tabBar.list[${M}] 需为 Object`);continue}let P=L.list[M].pagePath;if('[object String]'!=Object.prototype.toString.call(P)){N.push(`tabBar.list[${M}].pagePath 需为 String`);continue}2<=P.split('?').length?N.push(`tabBar.list[${M}].pagePath 不应该包含'?'`):2<=P.split('.').length&&N.push(`tabBar.list[${M}].pagePath 不应该包含'.'`)}if(0<N.length)throw{type:u.JSON_CONTENT_ERROR,file:'app.json',data:N.join('\n')}}return G.window||(G.window={}),F[E]=G,G}const j=require('fs'),k=require('path'),l=require('url'),m=require('events').EventEmitter,n=require('glob'),o=require('chokidar'),q=require('babel-core'),r=require('../../common/log/log.js'),s=require('./tools.js'),t=require('../../stores/projectStores.js'),u=require('../../config/config.js'),v=require('babel-code-frame'),w=s.noBrowser.join(',');var x={},y,z,A=!1;t.on('PROJECT_STORES_CONFIG_CHANGE',C=>{let D=C.hash;r.info(`projectManager.js project config change`),x[D]&&(x[D]={cache:{},wxmlFileList:{},jsFileList:{}})});var B=Object.assign({},m.prototype,{fileChange:function(C,D,E,F){this.emit('FILE_CHANGE',C,D,E,F)},stopWatch:function(){a()},restartWatch:function(){b(this.project)}});_exports={manager:B,getFile:function(D,E,F){b(D);let G=D.hash,H=x[G].cache;if(H[E])return void process.nextTick(()=>{F(H[E].error,H[E].data)});let I=k.join(D.projectpath,E);j.readFile(I,(J,K)=>{J||(H[E]={error:J,data:K}),F(J,K)})},getAllWXMLFileList:function(D,E){b(D);let F=D.hash,G=x[F].wxmlFileList;G.length?process.nextTick(()=>{E(null,G)}):d(D,E)},getAllJSFileList:function(D,E){b(D);let F=D.hash,G=x[F].jsFileList;G.length?process.nextTick(()=>{E(null,G)}):f(D,E)},getScripts:function(D,E){let F=D.project,G=F.hash;b(F);let H=decodeURIComponent(D.fileName),I=x[G].cache;if(I[H])return void process.nextTick(()=>{E(I[H].error,I[H].data)});let J=F.es6,K=D.needRequire,L=k.join(F.projectpath,H);j.readFile(L,'utf8',(M,N)=>{if(M)return void E({e:M,type:u.PAGEJS_FILE_ERROR,file:H});if(J){let O=k.basename(H);try{let P=q.transform(N,{presets:['es2015'],sourceMaps:'inline',sourceFileName:O,babelrc:!1});N=P.code.replace('sourceMappingURL=data:application/json;','sourceMappingURL=data:application/json;charset=utf-8;')}catch(P){let Q=v(N,P.loc.line,0<P.loc.column?P.loc.column:1);return void E({msg:`${P.toString()}\n${Q}`,sourceFileName:O},N)}}N=`define("${H}", function(require, module, exports, ${w}){ ${N}\n});`,K&&(N+=`require("${H}")`),I[H]={error:null,data:N},E(null,N)})},getAppJSONSync:h,getAppEntranceSync:function(D,E={}){let F=s.getBaseURL(D);if(E.justHost)return F;let G=h(D)||{},H=G.pages||[],I=`${H[0]}.html`,J=D.initPath;if(J&&J.enable){let K=J.page||H[0];I=`${K}.html?${J.query}`}return l.resolve(F,I)},getPageJSONSync:g,getAppConfigJSONSync:function(D){let E=D.hash,F=x[E].cache,G='app-config.json',H=F[G];if(H)return H;H={};let I=h(D)||{};H.pages=I.pages||[],H.entryPagePath=`${I.pages[0]}.html`,H.debug=I.debug||!1,H.networkTimeout=I.networkTimeout||{},H.global={window:I.window||{}},H.page={};var J=I.pages;for(var K=0;K<J.length;K++){var L=J[K],M=g(D,L)||{};H.page[`${L}.html`]={window:M}}if('[object Object]'==Object.prototype.toString.call(I.tabBar)){var N=Object.assign({},I.tabBar),O=[].concat(N.list||[]),P=[];for(var K=0;K<O.length;K++){var Q=Object.assign({},O[K]);Q.pagePath+='.html',P.push(Q)}N.list=P,H.tabBar=N}return F[G]=H,H},isProjectPage:function(D,E){let F=h(D),G=F.pages||[];E=E.replace(/\\/g,'/');let H=G.findIndex(I=>{return I===E});return-1!==H}}}init(),module.exports=_exports;