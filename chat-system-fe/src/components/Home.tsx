import PostList from "./PostList";
import CreatePost from "./models/createPostModel";
import { useEffect, useState } from "react";
import OpenConversation from "./openConversation";
import { socketService } from "../utils/services/socketService";
import { useDispatch, useSelector } from "react-redux";

export default function Home(){
    const [open, setOpen] = useState(false);
    const auth = useSelector((state:any)=>state.auth);
    const dispatch = useDispatch();

    useEffect(()=>{
        // connect to socket
        socketService.connect(auth.access_token, dispatch);

        return ()=>{
            socketService.disconnect()
        }
    },[])

    return <>
        <div className="w-full h-full flex flex-col">
            <div className="w-full h-20 bg-zinc-800 flex items-center justify-between px-5">
                <span>{auth.userName}</span>
                <span>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Dashboard
                    </h1>
                </span>
                <span>
                    Logout
                </span>
            </div>
            <div className="w-full flex-grow">
                <div className="flex flex-row h-full">
                    <div className="w-1/3 h-full border-solid border-r-2 border-t-2 border-zinc-700">
                        <div className="h-12 w-full bg-zinc-800 flex items-center justify-center">
                            <button onClick={()=>setOpen(true)}>Add New Post</button>
                            {open && <CreatePost setOpen={setOpen}/>}
                        </div>
                        <div className="w-full" style={{height:"82vh"}}>
                            <PostList />
                        </div>
                    </div>
                    <div className="w-2/3 h-full">
                        <OpenConversation />
                    </div>
                </div>
            </div>

        </div>
    </>
}