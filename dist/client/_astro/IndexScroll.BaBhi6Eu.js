import{a as p,f as y,t as w}from"./tr.BlmQmab2.js";import{_ as V}from"./_plugin-vue_export-helper.DlAUqK2U.js";import{r as n,c as k,o as I,a as o,b as t,F as P,d as B,e as m,t as g,f as l,g as L}from"./runtime-core.esm-bundler.BMTxGt4Q.js";const q={__name:"IndexScroll",setup(T,{expose:i}){i();const b=(a,d)=>a?a.length>d?a.slice(0,d)+"...":a:"",r=n([]),c=n(!0),u=n(null),e=n(!1),_=n(null),f=n(!0),M=k(()=>r.value.slice(15)),S=async()=>{if(!e.value&&c.value){e.value=!0;try{await x()}catch(a){console.error("Veri yükleme hatası:",a)}finally{e.value=!1}}},x=async()=>{try{_.value=null;const a=f.value?15:6,d=await p.post("https://bugunlerde.com/api/wordpress/graphql",{query:`
              query GetPosts($first: Int!, $after: String) {
                posts(first: $first, after: $after) {
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
            `,variables:{first:a,after:u.value}}),D=d.data.data.posts.nodes.map(s=>{const N=s.author?.node?.id?parseInt(atob(s.author?.node?.id).split(":")[1],10):null,j=y(new Date(s.date),{addSuffix:!0,locale:w}),h=s.categories?.nodes?.[0],C=h?.description||"",U=h?.slug||"general";return{...s,imageUrl:s.featuredImage?.node?.sourceUrl||null,altText:s.featuredImage?.node?.altText||"",imageTitle:s.featuredImage?.node?.title||"",authorId:N,formattedDate:j,author:s.author?.node?.name||"Bilinmeyen",categorydesc:C,category:h?h.name:"Genel",categorySlug:U}});r.value=[...r.value,...D],u.value=d.data.data.posts.pageInfo.endCursor,c.value=d.data.data.posts.pageInfo.hasNextPage,f.value&&(f.value=!1)}catch{_.value="Veriler yüklenirken bir hata oluştu."}finally{e.value=!1}};I(()=>{x()});const v={truncateText:b,posts:r,hasMorePosts:c,cursor:u,loading:e,error:_,initialLoad:f,filteredPosts:M,loadMore:S,fetchPosts:x,ref:n,computed:k,onMounted:I,get axios(){return p},get formatDistanceToNow(){return y},get tr(){return w}};return Object.defineProperty(v,"__isScriptSetup",{enumerable:!1,value:!0}),v}},F={class:"grid grid-cols-1 md:grid-cols-4 gap-8 min-h-16 mt-8 md:px-0 px-4"},G={class:"flex flex-col md:flex-row md:items-stretch"},z={class:"relative w-full md:w-1/3 h-[250px] md:h-auto overflow-hidden group"},A=["href"],H=["src","alt"],E={class:"relative flex flex-col justify-between p-4 dark:bg-[#212121] bg-gray-100 md:w-2/3"},O={class:"text-md md:text-xl baslik font-semibold"},Y=["href"],$=["innerHTML"],J={class:"flex justify-between items-center mt-4"},K={class:"text-xs"},Q={class:"inline-block font-semibold text-gray-500"},R={class:"flex items-center"},W=["src","alt"],X={class:"text-sm"},Z={class:"block text-xs"},ee=["href"],te={class:"flex justify-center text-xs text-gray-500"},re={class:"flex justify-center items-center w-full my-8"},ae=["disabled"],se={key:2},oe={key:3};function le(T,i,b,r,c,u){return l(),o(P,null,[t("section",F,[(l(!0),o(P,null,B(r.filteredPosts,e=>(l(),o("div",{key:e.id,id:"remainingPosts",class:"md:col-span-3 grid grid-cols-1 gap-8"},[t("div",G,[t("div",z,[e.imageUrl?(l(),o("a",{key:0,href:`/post/${e.slug}`},[t("img",{src:e.imageUrl,alt:e.altText,loading:"lazy",class:"w-full h-[250px] md:h-[200px] object-cover transition-transform duration-500 group-hover:scale-105"},null,8,H)],8,A)):m("",!0)]),t("div",E,[t("h2",O,[t("a",{href:`/post/${e.slug}`,class:"olink"},g(e.title),9,Y)]),t("p",{innerHTML:r.truncateText(e.excerpt,120),class:"max-md:my-2"},null,8,$),t("div",J,[t("div",K,[t("span",Q,[t("div",R,[e.authorAvatar?(l(),o("img",{key:0,src:e.authorAvatar,alt:`${e.author} avatar`,class:"w-6 h-6 rounded-full mr-2"},null,8,W)):m("",!0),t("div",X,[t("span",Z,[t("a",{href:`/author/${e.authorId}`,class:"olink"},g(e.author),9,ee)])])])])]),t("p",te,g(e.formattedDate),1)]),i[0]||(i[0]=L('<div class="max-md:hidden absolute bottom-0 left-0 w-full h-full pointer-events-none"><div class="absolute left-0 bottom-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div><div class="absolute right-0 bottom-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px]"></div></div><div class="max-md:hidden absolute top-0 left-0 w-full h-full pointer-events-none"><div class="absolute left-0 top-0 border-l-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] rotate-90"></div><div class="absolute right-0 top-0 border-r-4 border-b-4 border-gray-200 dark:border-gray-800 w-[20px] h-[20px] -rotate-90"></div></div>',2))])])]))),128))]),t("div",re,[r.hasMorePosts&&!r.loading?(l(),o("button",{key:0,onClick:r.loadMore,class:"bg-red-500 px-2 py-1 cursor-pointer text-white text-sm font-semibold shadow-sm shadow-slate-500/50"}," Daha Fazla Göster ")):r.loading?(l(),o("button",{key:1,disabled:r.loading,onClick:r.loadMore,class:"bg-red-500 px-2 py-1 text-white text-sm font-semibold shadow-sm shadow-slate-500/50"}," Yükleniyor... ",8,ae)):r.hasMorePosts?m("",!0):(l(),o("p",se)),r.error?(l(),o("p",oe,g(r.error),1)):m("",!0)])],64)}const ce=V(q,[["render",le]]);export{ce as default};
