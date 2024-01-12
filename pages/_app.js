import '../styles/globals.css'
import {DM_Serif_Display, DM_Sans} from '@next/font/google';
//导入css及字体

import { UserProvider } from '@auth0/nextjs-auth0/client'
import { PostProvider } from '../context/postsContext';
//导入auth0的provider及懒加载的provider

import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;
//修fontawesome的bug

const dmSerifDisplay = DM_Serif_Display({
  weight:["400"],
  subsets:["latin"],
  variable:"--font-dm-serif",
})
const dmSans = DM_Sans({
  weight:["400","500","700"],
  subsets:["latin"],
  variable:"--font-dm-sans",
})
//字体配置

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) =>page) //渲染之前先查找要渲染的component是否含有getLayout，如果有就用，没有就用原本的page，回调函数千万不要加花括号，否则没有数据return出来。
  return (
    <UserProvider>
      <PostProvider>
        <main className={`${dmSerifDisplay.variable} ${dmSans.variable} font-body`} >
          {getLayout(<Component {...pageProps} />, pageProps) /* getLayout有两个参数,一个page一个props，这里的page也就是component */}  
        </main>
      </PostProvider>
    </UserProvider>
  )
}

export default MyApp
