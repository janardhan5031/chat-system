import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendRest } from "../utils/services/backend";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/reducers/postsReducer";

export default function PostList(){
    const [selectedPost, setSelectedPost] = useState("");

    const navigate = useNavigate();
    const auth = useSelector((state:any)=>state.auth);
    const posts = useSelector((state:any)=>state.posts);

    const dispatch = useDispatch();

    useEffect(()=>{
        (async()=>{
            // get the latest post details
            const response:any = await backendRest.getPosts(auth.access_token)

            if(response.status ==200){
                const posts = response.data.result;

                dispatch(setPosts(posts))
            }
        })()
    },[])

    const handleClick = (id:any) => {
        setSelectedPost(id);
        navigate(`/home?id=${id}`);
      };
    
    return <div className="w-full h-full overflow-scroll flex items-center justify-start flex-col">
        <div className="w-full h-full flex flex-col gap-4 py-2 px-2">
            {posts.map((item:any)=>(
            <div 
                onClick={() => handleClick(item._id)}
                key={item._id} 
                className={`flex flex-col gap-2 p-4 bg-transparent rounded-lg shadow-md border ${selectedPost== item._id ? "border-gray-500 bg-gray-600" : "border-gray-600"} hover:border-gray-400`}
            >
                    <h1>{item.title}</h1>
                    <p className="text-sm text-gray-600">{item.description.slice(0,44)}{`${item.description.length>44?"...":""}`}</p>
            </div>  
            ))}
        </div>
       
    </div>
}