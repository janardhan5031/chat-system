import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "../utils/ui/button";
import { useSelector } from "react-redux";
import { socketService } from "../utils/services/socketService";
import { backendRest } from "../utils/services/backend";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function OpenConversation(){
    const [message, setMessage]= useState("");
    const [comments, setComments] = useState([]as any);
    const commentsEndRef = useRef<HTMLDivElement>(null);


    const posts = useSelector((state:any)=>state.posts);
    const auth = useSelector((state:any)=>state.auth);
    const query = useQuery();
    const navigate = useNavigate();
    const postId = query.get('id');

    useEffect(()=>{
        // clear the previous post comments from state
        setComments([]);

        // fetch post comments from backend
        (async()=>{
            const response:any = await backendRest.getComments(auth.access_token, postId as string)

            if(response.status ==200){
                const comments = response.data.result;
                setComments(comments);
            }
        })()

        const listener = (data:any)=>{
            if(postId && postId.toString() == data.postId.toString()){
                setComments((comments:any)=>[...comments,data])
            }
        }

        // add the lister to socket
        socketService.addCommentsListener(listener)

    },[postId])

    useEffect(() => {
        // Scroll to the bottom of the comments
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);

    const handleSendMessage = (e:any)=>{
        e.preventDefault();
        if(!message) return;

        const comment = {
            postId,
            userId:auth._id,
            comment:message
        }

        setComments((comments:any)=>{
            return[
                ...comments,
                {
                    ...comment,
                    _id: Date.now(),
                    userName:auth.userName
                }
            ]
        })
        setMessage("")

        socketService.addComment(comment)  
    }

    return <div className="w-full h-full flex items-center justify-start flex-col">
        <div className="w-full" style={{height:"82vh"}}>
            {postId && <div className="w-full h-full overflow-scroll flex items-center justify-start flex-col">
                <div className="flex-col p-4 bg-gray-500 rounded-lg mt-2" style={{width:"30rem"}}>
                    {posts.filter((post:any)=>post._id ==postId).map((matchedPost:any)=>(
                        <>
                            <div className="h-80" >
                                <img className="object-fill w-full h-full rounded-lg" src={matchedPost?.url} alt={matchedPost.title} />
                            </div>
                            <div className="px-2 pt-2 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <h1>{matchedPost?.title}</h1>
                                    <span>{matchedPost?.createdAt}</span>
                                </div>
                                <p>{matchedPost?.description}</p>
                                <div className="flex items-center justify-end">
                                    <p>Posted By : {matchedPost?.metaData?.userName}</p>
                                </div>
                            </div>
                        </>
                    ))}
                    
                </div>
                
                <div className="w-full ">
                    <div className="flex items-center justify-center my-2"> 
                        <h2>Comments</h2>
                    </div>
                        {comments.map((comment:any)=>(
                            <div className={`flex flex-col items-${comment.userName==auth.userName ? "end":"start"} mb-2 mx-2`}>
                                <div 
                                    key={comment.id} 
                                    className="flex items-start justify-between p-2 flex-col bg-gray-500 rounded-lg" 
                                    style={{width:"24rem"}}
                                >
                                    <p>{comment.comment}</p>
                                    <div className="flex items-center justify-end w-full">
                                        <p>Commented By : {comment.userName}</p>
                                    </div>
                                    
                                </div>
                            </div>
                        ))}
                        <div ref={commentsEndRef} />
                </div>
            </div>}
            {!postId && <>
                <div className="w-full h-full flex items-center justify-center">
                    <h1>No Post opened</h1>
                </div>
            </>}
        </div>
        <div className="w-full h-16 bg-zinc-800 flex items-center justify-center">
            <form onSubmit={handleSendMessage} className="w-full">
                <div className="w-full flex items-center justify-center px-5 gap-4">
                    <div className="grid gap-1 w-4/5">
                        <textarea 
                            id="description" 
                            rows={1} 
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Write Your comment here ..."
                            onChange={(e:any)=>{
                                setMessage(e.target.value);
                            }}
                            value={message}
                            onKeyDown={(e:any)=>{
                                if(e.key === "Escape"){
                                    navigate(`/home`);
                                }else if(e.key === "Enter"){
                                    handleSendMessage(e)
                                }
                            }}
                        >
                        </textarea> 
                    </div>
                    <Button className="bg-zinc-700 w-40">
                        Send
                    </Button>
                </div>
            </form>
        </div>
    </div>
}