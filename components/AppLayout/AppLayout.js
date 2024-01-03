import Link from "next/link";
import Image from "next/image";
import {useUser} from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "../Logo";

export const AppLayout = ({children}) =>{
    const {user} = useUser();
    return(
        <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
            <div className="flex flex-col overflow-hidden text-white">
                <div className="bg-zinc-900 p-2">
                    <div>
                        <Logo />
                    </div>
                    <Link href="/post/new" className="btn">New Post</Link>
                    <Link href="/token-topup" className="block text-center py-2"> 
                    <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
                    <span className="pl-1 hover:underline">0 token available</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto bg-gradient-to-b from-zinc-900 to-slate-700">content list</div>
                <div className="bg-slate-700 flex items-center gap-3 border-t border-t-black/50 h-20 px-2">
                {!!user ? (<>
                            <div className="min-w-[50px]">
                                <Image src={user.picture.replace('s.gravatar.com', 'cravatar.cn')} alt={user.name} height={50} width={50} className="rounded-full" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium font-heading text-xl">{user.name}</div>
                                <Link href="/api/auth/logout" className="text-sm">Logout</Link>
                            </div>
                        </>):(<Link href="/api/auth/login">Login</Link>)}
                </div>
            </div>
            <div>{children}</div>

        </div>
    )
}