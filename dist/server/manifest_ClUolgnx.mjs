import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_C99e_h7r.mjs';
import 'es-module-lexer';
import { n as decodeKey } from './chunks/astro/server_w720HbFP.mjs';
import 'clsx';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || undefined,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : undefined,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///var/www/html/bugunlerden/","adapterName":"@astrojs/node","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"gizlilik-politikasi/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/gizlilik-politikasi","isIndex":false,"type":"page","pattern":"^\\/gizlilik-politikasi\\/?$","segments":[[{"content":"gizlilik-politikasi","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/gizlilik-politikasi.astro","pathname":"/gizlilik-politikasi","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"hakkimizda/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/hakkimizda","isIndex":false,"type":"page","pattern":"^\\/hakkimizda\\/?$","segments":[[{"content":"hakkimizda","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/hakkimizda.astro","pathname":"/hakkimizda","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"kullanim-kosullari/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/kullanim-kosullari","isIndex":false,"type":"page","pattern":"^\\/kullanim-kosullari\\/?$","segments":[[{"content":"kullanim-kosullari","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/kullanim-kosullari.astro","pathname":"/kullanim-kosullari","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"reklam/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/reklam","isIndex":false,"type":"page","pattern":"^\\/reklam\\/?$","segments":[[{"content":"reklam","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/reklam.astro","pathname":"/reklam","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.D2ytOAYA.js"}],"styles":[{"type":"inline","content":"[data-astro-image]{width:100%;height:auto;-o-object-fit:var(--fit);object-fit:var(--fit);-o-object-position:var(--pos);object-position:var(--pos);aspect-ratio:var(--w) / var(--h)}[data-astro-image=responsive]{max-width:calc(var(--w) * 1px);max-height:calc(var(--h) * 1px)}[data-astro-image=fixed]{width:calc(var(--w) * 1px);height:calc(var(--h) * 1px)}\n"}],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.D2ytOAYA.js"}],"styles":[{"type":"external","src":"/_astro/_id_.XT2sSEhA.css"},{"type":"external","src":"/_astro/_id_.B-4keeRo.css"},{"type":"inline","content":"[data-astro-image]{width:100%;height:auto;-o-object-fit:var(--fit);object-fit:var(--fit);-o-object-position:var(--pos);object-position:var(--pos);aspect-ratio:var(--w) / var(--h)}[data-astro-image=responsive]{max-width:calc(var(--w) * 1px);max-height:calc(var(--h) * 1px)}[data-astro-image=fixed]{width:calc(var(--w) * 1px);height:calc(var(--h) * 1px)}\n"}],"routeData":{"route":"/author/[id]","isIndex":false,"type":"page","pattern":"^\\/author\\/([^/]+?)\\/?$","segments":[[{"content":"author","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/author/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.D2ytOAYA.js"}],"styles":[{"type":"external","src":"/_astro/_id_.XT2sSEhA.css"},{"type":"external","src":"/_astro/_id_.B-4keeRo.css"},{"type":"inline","content":"[data-astro-image]{width:100%;height:auto;-o-object-fit:var(--fit);object-fit:var(--fit);-o-object-position:var(--pos);object-position:var(--pos);aspect-ratio:var(--w) / var(--h)}[data-astro-image=responsive]{max-width:calc(var(--w) * 1px);max-height:calc(var(--h) * 1px)}[data-astro-image=fixed]{width:calc(var(--w) * 1px);height:calc(var(--h) * 1px)}\n"}],"routeData":{"route":"/category/[slug]","isIndex":false,"type":"page","pattern":"^\\/category\\/([^/]+?)\\/?$","segments":[[{"content":"category","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/category/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.D2ytOAYA.js"}],"styles":[{"type":"external","src":"/_astro/_id_.XT2sSEhA.css"},{"type":"external","src":"/_astro/_id_.B-4keeRo.css"},{"type":"inline","content":"[data-astro-image]{width:100%;height:auto;-o-object-fit:var(--fit);object-fit:var(--fit);-o-object-position:var(--pos);object-position:var(--pos);aspect-ratio:var(--w) / var(--h)}[data-astro-image=responsive]{max-width:calc(var(--w) * 1px);max-height:calc(var(--h) * 1px)}[data-astro-image=fixed]{width:calc(var(--w) * 1px);height:calc(var(--h) * 1px)}\n"}],"routeData":{"route":"/post/[slug]","isIndex":false,"type":"page","pattern":"^\\/post\\/([^/]+?)\\/?$","segments":[[{"content":"post","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/post/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://bugunlerde.com","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/var/www/html/bugunlerden/src/pages/404.astro",{"propagation":"none","containsHead":true}],["/var/www/html/bugunlerden/src/pages/author/[id].astro",{"propagation":"none","containsHead":true}],["/var/www/html/bugunlerden/src/pages/category/[slug].astro",{"propagation":"none","containsHead":true}],["/var/www/html/bugunlerden/src/pages/gizlilik-politikasi.astro",{"propagation":"none","containsHead":true}],["/var/www/html/bugunlerden/src/pages/hakkimizda.astro",{"propagation":"none","containsHead":true}],["/var/www/html/bugunlerden/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/var/www/html/bugunlerden/src/pages/kullanim-kosullari.astro",{"propagation":"none","containsHead":true}],["/var/www/html/bugunlerden/src/pages/post/[slug].astro",{"propagation":"none","containsHead":true}],["/var/www/html/bugunlerden/src/pages/reklam.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/author/[id]@_@astro":"pages/author/_id_.astro.mjs","\u0000@astro-page:src/pages/category/[slug]@_@astro":"pages/category/_slug_.astro.mjs","\u0000@astro-page:src/pages/gizlilik-politikasi@_@astro":"pages/gizlilik-politikasi.astro.mjs","\u0000@astro-page:src/pages/hakkimizda@_@astro":"pages/hakkimizda.astro.mjs","\u0000@astro-page:src/pages/kullanim-kosullari@_@astro":"pages/kullanim-kosullari.astro.mjs","\u0000@astro-page:src/pages/post/[slug]@_@astro":"pages/post/_slug_.astro.mjs","\u0000@astro-page:src/pages/reklam@_@astro":"pages/reklam.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_ClUolgnx.mjs","/var/www/html/bugunlerden/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DdYbnIQU.mjs","/var/www/html/bugunlerden/src/components/AuthorScroll.vue":"_astro/AuthorScroll.DNLdlZT8.js","/var/www/html/bugunlerden/src/components/CategoryScroll.vue":"_astro/CategoryScroll.BA-hTnIU.js","/var/www/html/bugunlerden/src/components/IndexScroll.vue":"_astro/IndexScroll.BaBhi6Eu.js","/var/www/html/bugunlerden/src/components/ScrollProgress.vue":"_astro/ScrollProgress.E8n0kJbD.js","/var/www/html/bugunlerden/src/components/MobileMenu.vue":"_astro/MobileMenu.yqJVUiUS.js","@astrojs/vue/client.js":"_astro/client.0dl6PZEk.js","astro:scripts/page.js":"_astro/page.D2ytOAYA.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/_id_.XT2sSEhA.css","/_astro/_id_.B-4keeRo.css","/_astro/AuthorScroll.DNLdlZT8.js","/_astro/CategoryScroll.BA-hTnIU.js","/_astro/IndexScroll.BaBhi6Eu.js","/_astro/MobileMenu.yqJVUiUS.js","/_astro/ScrollProgress.E8n0kJbD.js","/_astro/_id_.OPo6AcM1.css","/_astro/_plugin-vue_export-helper.DlAUqK2U.js","/_astro/client.0dl6PZEk.js","/_astro/page.D2ytOAYA.js","/_astro/runtime-core.esm-bundler.BMTxGt4Q.js","/_astro/runtime-dom.esm-bundler.VVbNyDLO.js","/_astro/tr.BlmQmab2.js","/js/theme.js","/_astro/page.D2ytOAYA.js","/404.html","/gizlilik-politikasi/index.html","/hakkimizda/index.html","/kullanim-kosullari/index.html","/reklam/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"5fZT7C21hzkdb+yuORAJXBFf/pvvYNI6ZDbLMarpfEQ="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
