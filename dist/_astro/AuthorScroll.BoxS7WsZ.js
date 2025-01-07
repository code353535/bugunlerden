import{a as y,f as k,t as w}from"./tr.BlmQmab2.js";import{_ as C}from"./_plugin-vue_export-helper.DlAUqK2U.js";import{r as s,c as I,o as S,a,b as r,F as P,d as T,e as p,t as f,f as o,g as U}from"./runtime-core.esm-bundler.G56gyFCp.js";const V={__name:"AuthorScroll",props:{authorId:{type:String,required:!0}},setup(_,{expose:d}){d();const g=_,t=s([]),n=s(!0),i=s(null),e=s(!1),h=s(null),c=s(!0),D=I(()=>t.value.slice(12)),M=async()=>{if(!e.value&&n.value){e.value=!0;try{await m()}catch(u){console.error("Veri yükleme hatası:",u)}finally{e.value=!1}}},m=async()=>{try{h.value=null;const u=c.value?12:8,b=await y.post("https://bugunlerde.com/api/wordpress/graphql",{query:`
        query GetAuthor($first: Int!, $after: String, $id: Int!) {
          posts(first: $first, after: $after, where: { author: $id }) {
            nodes {
              id
              title
              slug
              date
              author {
                node {
                  id
                }
              }
              categories {
                nodes {
                  id
                  name
                  slug
                }
              }
              featuredImage {
                node {
                  sourceUrl
                  altText
                  title
                }
              }
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      `,variables:{first:u,after:i.value,id:parseInt(g.authorId,10)}}),N=b.data.data.posts.nodes.map(l=>{const j=k(new Date(l.date),{addSuffix:!0,locale:w}),x=l.categories?.nodes?.[0];return{...l,imageUrl:l.featuredImage?.node?.sourceUrl||null,altText:l.featuredImage?.node?.altText||"",formattedDate:j,category:x?x.name:"Genel",categorySlug:x?.slug||"general"}});t.value=[...t.value,...N],i.value=b.data.data.posts.pageInfo.endCursor,n.value=b.data.data.posts.pageInfo.hasNextPage,c.value&&(c.value=!1)}catch{h.value="Veriler yüklenirken bir hata oluştu."}finally{e.value=!1}};S(()=>{m()});const v={props:g,posts:t,hasMorePosts:n,cursor:i,loading:e,error:h,initialLoad:c,filteredPosts:D,loadMore:M,fetchAuthor:m,ref:s,computed:I,onMounted:S,get axios(){return y},get formatDistanceToNow(){return k},get tr(){return w}};return Object.defineProperty(v,"__isScriptSetup",{enumerable:!1,value:!0}),v}},q={id:"remainingPosts",class:"grid grid-cols-1 md:grid-cols-4 min-h-16 gap-4 md:gap-[10px] mt-4 md:px-0 px-4"},A={class:"flex flex-col h-full"},B={class:"relative w-full h-[250px] md:h-[200px] overflow-hidden group"},F=["href"],G=["src","alt"],$={class:"relative flex flex-col justify-between flex-grow p-4 dark:bg-[#212121] bg-gray-100"},z={class:"text-md baslik font-semibold"},L=["href"],E={class:"flex justify-between items-center mt-4"},O={class:"text-xs"},Y={class:"inline-block font-semibold hover:bg-red-500 dark:bg-[#212121] dark:hover:text-red-500 dark:text-gray-500 text-black hover:text-white bg-gray-200 px-1 py-1"},H=["href"],J={class:"flex justify-center text-xs text-gray-500"},K={class:"flex justify-center items-center my-8"},Q=["disabled"],R={key:2},W={key:3};function X(_,d,g,t,n,i){return o(),a(P,null,[r("div",q,[(o(!0),a(P,null,T(t.filteredPosts,e=>(o(),a("div",{key:e.id,class:"col-span-1"},[r("div",A,[r("div",B,[e.imageUrl?(o(),a("a",{key:0,href:`/post/${e.slug}`},[r("img",{src:e.imageUrl,alt:e.altText,loading:"lazy",class:"w-full h-[250px] md:h-[200px] object-cover transition-transform duration-500 group-hover:scale-105"},null,8,G)],8,F)):p("",!0)]),r("div",$,[r("h3",z,[r("a",{href:`/post/${e.slug}`,class:"olink"},f(e.title),9,L)]),r("div",E,[r("div",O,[r("span",Y,[r("a",{href:`/category/${e.categorySlug}`},f(e.category),9,H)])]),r("p",J,f(e.formattedDate),1)]),d[0]||(d[0]=U('<div class="max-md:hidden absolute bottom-0 left-0 w-full h-full pointer-events-none"><div class="absolute left-0 bottom-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div><div class="absolute right-0 bottom-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div></div><div class="max-md:hidden absolute top-0 left-0 w-full h-full pointer-events-none"><div class="absolute left-0 top-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] rotate-90"></div><div class="absolute right-0 top-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] -rotate-90"></div></div>',2))])])]))),128))]),r("div",K,[t.hasMorePosts&&!t.loading?(o(),a("button",{key:0,onClick:t.loadMore,class:"bg-red-500 px-2 py-1 cursor-pointer text-white text-sm font-semibold shadow-sm shadow-slate-500/50"}," Daha Fazla Göster ")):t.loading?(o(),a("button",{key:1,disabled:t.loading,onClick:t.loadMore,class:"bg-red-500 px-2 py-1 text-white text-sm font-semibold shadow-sm shadow-slate-500/50"}," Yükleniyor... ",8,Q)):t.hasMorePosts?p("",!0):(o(),a("p",R)),t.error?(o(),a("p",W,f(t.error),1)):p("",!0)])],64)}const re=C(V,[["render",X]]);export{re as default};
