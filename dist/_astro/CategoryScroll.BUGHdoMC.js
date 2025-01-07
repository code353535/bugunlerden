import{a as k,f as w,t as S}from"./tr.BlmQmab2.js";import{_ as q}from"./_plugin-vue_export-helper.DlAUqK2U.js";import{r as n,c as I,o as P,a as s,b as t,F as T,d as B,e as _,t as u,f as l,g as L}from"./runtime-core.esm-bundler.G56gyFCp.js";const $={__name:"CategoryScroll",props:{categorySlug:{type:String,required:!0}},setup(v,{expose:g}){g();const x=v,r=(a,d)=>a?a.length>d?a.slice(0,d)+"...":a:"",i=n([]),h=n(!0),e=n(null),c=n(!1),b=n(null),f=n(!0),M=I(()=>i.value.slice(15)),C=async()=>{if(!c.value&&h.value){c.value=!0;try{await y()}catch(a){console.error("Veri yükleme hatası:",a)}finally{c.value=!1}}},y=async()=>{try{b.value=null;const a=f.value?15:6,d=await k.post("https://bugunlerde.com/api/wordpress/graphql",{query:`
          query GetPosts($first: Int!, $after: String, $categorySlug: String!) {
            posts(first: $first, after: $after, where: { categoryName: $categorySlug }) {
              nodes {
                id
                title
                slug
                excerpt
                date
                author {
                  node {
                    id
                    name
                    avatar {
                      url
                    }
                  }
                }
                categories {
                  nodes {
                    id
                    name
                    slug
                    description
                    parentId
                    children {
                      nodes {
                        id
                        name
                        slug
                      }
                    }
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
                hasNextPage
                endCursor
              }
            }
          }
        `,variables:{first:a,after:e.value,categorySlug:x.categorySlug}}),D=d.data.data.posts.nodes.map(o=>{const N=o.author?.node?.id?parseInt(atob(o.author?.node?.id).split(":")[1],10):null,j=w(new Date(o.date),{addSuffix:!0,locale:S}),m=o.categories?.nodes?.[0],U=m?.description||"",V=m?.slug||"general";return{...o,imageUrl:o.featuredImage?.node?.sourceUrl||null,altText:o.featuredImage?.node?.altText||"",imageTitle:o.featuredImage?.node?.title||"",authorId:N,formattedDate:j,author:o.author?.node?.name||"Bilinmeyen",categorydesc:U,category:m?m.name:"Genel",categorySlug:V}});i.value=[...i.value,...D],e.value=d.data.data.posts.pageInfo.endCursor,h.value=d.data.data.posts.pageInfo.hasNextPage,f.value&&(f.value=!1)}catch{b.value="Veriler yüklenirken bir hata oluştu."}finally{c.value=!1}};P(()=>{y()});const p={props:x,truncateText:r,posts:i,hasMorePosts:h,cursor:e,loading:c,error:b,initialLoad:f,filteredPosts:M,loadMore:C,fetchPosts:y,ref:n,computed:I,onMounted:P,get axios(){return k},get formatDistanceToNow(){return w},get tr(){return S}};return Object.defineProperty(p,"__isScriptSetup",{enumerable:!1,value:!0}),p}},F={class:"grid grid-cols-1 md:grid-cols-4 gap-8 min-h-16 mt-8 md:px-0 px-4"},G={class:"flex flex-col md:flex-row md:items-stretch"},z={class:"relative w-full md:w-1/3 h-[250px] md:h-auto overflow-hidden group"},A=["href"],H=["src","alt"],E={class:"relative flex flex-col justify-between p-4 dark:bg-[#212121] bg-gray-100 md:w-2/3"},O={class:"text-xs mb-1 md:mb-0"},Y={class:"inline-block font-semibold hover:bg-red-500 dark:bg-[#212121] dark:hover:text-red-500 dark:text-gray-500 text-black hover:text-white bg-gray-200 px-1 py-1"},J=["href"],K={class:"text-md md:text-xl baslik font-semibold"},Q=["href"],R=["innerHTML"],W={class:"flex justify-between items-center mt-4"},X={class:"text-xs"},Z={class:"inline-block font-semibold text-gray-500"},ee={class:"flex items-center"},te=["src","alt"],re={class:"text-sm"},ae={class:"block text-xs"},oe=["href"],se={class:"flex justify-center text-xs text-gray-500"},le={class:"flex justify-center items-center w-full my-8"},ne=["disabled"],de={key:2},ie={key:3};function ce(v,g,x,r,i,h){return l(),s(T,null,[t("section",F,[(l(!0),s(T,null,B(r.filteredPosts,e=>(l(),s("div",{key:e.id,id:"remainingPosts",class:"col-span-3 grid grid-cols-1 gap-8"},[t("div",G,[t("div",z,[e.imageUrl?(l(),s("a",{key:0,href:`/post/${e.slug}`},[t("img",{src:e.imageUrl,alt:e.altText,loading:"lazy",class:"w-full h-[250px] md:h-[200px] object-cover transition-transform duration-500 group-hover:scale-105"},null,8,H)],8,A)):_("",!0)]),t("div",E,[t("div",O,[t("span",Y,[t("a",{href:`/category/${e.categorySlug}`},u(e.category),9,J)])]),t("h2",K,[t("a",{href:`/post/${e.slug}`,class:"olink"},u(e.title),9,Q)]),t("p",{innerHTML:r.truncateText(e.excerpt,120),class:"max-md:my-2"},null,8,R),t("div",W,[t("div",X,[t("span",Z,[t("div",ee,[e.authorAvatar?(l(),s("img",{key:0,src:e.authorAvatar,alt:`${e.author} avatar`,class:"w-6 h-6 rounded-full mr-2"},null,8,te)):_("",!0),t("div",re,[t("span",ae,[t("a",{href:`/author/${e.authorId}`,class:"olink"},u(e.author),9,oe)])])])])]),t("p",se,u(e.formattedDate),1)]),g[0]||(g[0]=L('<div class="max-md:hidden absolute bottom-0 left-0 w-full h-full pointer-events-none"><div class="absolute left-0 bottom-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div><div class="absolute right-0 bottom-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div></div><div class="max-md:hidden absolute top-0 left-0 w-full h-full pointer-events-none"><div class="absolute left-0 top-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] rotate-90"></div><div class="absolute right-0 top-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] -rotate-90"></div></div>',2))])])]))),128))]),t("div",le,[r.hasMorePosts&&!r.loading?(l(),s("button",{key:0,onClick:r.loadMore,class:"bg-red-500 px-2 py-1 cursor-pointer text-white text-sm font-semibold shadow-sm shadow-slate-500/50"}," Daha Fazla Göster ")):r.loading?(l(),s("button",{key:1,disabled:r.loading,onClick:r.loadMore,class:"bg-red-500 px-2 py-1 text-white text-sm font-semibold shadow-sm shadow-slate-500/50"}," Yükleniyor... ",8,ne)):r.hasMorePosts?_("",!0):(l(),s("p",de)),r.error?(l(),s("p",ie,u(r.error),1)):_("",!0)])],64)}const fe=q($,[["render",ce]]);export{fe as default};
