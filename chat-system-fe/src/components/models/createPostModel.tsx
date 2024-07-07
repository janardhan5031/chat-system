import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { Input } from "../../utils/ui/input";
import { backendRest } from "../../utils/services/backend";
import { useDispatch, useSelector } from "react-redux";
import { socketService } from "../../utils/services/socketService";
import { Icons } from "../../utils/ui/icons";
import { addPost } from "../../redux/reducers/postsReducer";

const maxFileSize = 30 * 1024 * 1024;

export default function createPost({setOpen}:any){ 
    const [message, setMessage]= useState("");
    const [title, setTitle]= useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const auth = useSelector((state:any)=>state.auth)
    const dispatch = useDispatch();


    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
          const file = event.target.files[0];
          console.log(file)
          if (file.size > maxFileSize) {
            toast.error("File size exceeds 30 MB")
          } else if (file.size <= maxFileSize) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              if (ev.target === null || ev.target.result === null) return;
              setSelectedFile(file)
            };
    
            reader.readAsDataURL(file);
          } 
        }
      };
    
    const onSubmit = async ()=>{
        if(!title ||!message ||!selectedFile){
            toast.error("All fields are required")
            return
        }
        setIsLoading(true)        
        // call backend to create post
        const response:any = await backendRest.createPost({title, description:message, file:selectedFile},auth.access_token)
        if(response.status ==200){
            const post = response.data.result;

            dispatch(addPost(post))

            socketService.sendNewPost(post)
        }else{
            toast.error("Failed to create post")
        }
        setIsLoading(false)
        setOpen(false)
    }
    return <>
    <div className="fixed top-0 left-0 h-full w-full bg-gray-800 z-10 opacity-80"></div>
        <div id="crud-modal" 
            className="overflow-y-auto overflow-x-hidden absolute top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full max-h-full flex"
        >
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Create New Post
                        </h3>
                        <button 
                            onClick={()=>{
                                if (isLoading) return;
                                setOpen(false)
                            }}
                            type="button" 
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" 
                            data-modal-toggle="crud-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form className="p-4 md:p-5">
                        <div className="grid gap-4 mb-4 grid-cols-1">
                            <div className="col-span-2">
                                <label 
                                    htmlFor="Title" 
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Post Title
                                </label>
                                <Input
                                    id="Title"
                                    placeholder="Enter your post title here ..."
                                    type="text"
                                    className="border-gray-400"
                                    onChange={(e:any)=>setTitle(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        
                            <div className="col-span-2">
                                <label 
                                    htmlFor="description" 
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Product Description
                                </label>
                                <textarea 
                                    id="description" 
                                    rows={4} 
                                    onChange={(e)=>setMessage(e.target.value)}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    placeholder="Write post description here ..."
                                >
                                </textarea>                    
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="Import-contacts-file">
                                    <div
                                    className={`flex items-center justify-center w-full h-8 border border-gray-400 rounded-lg text-gray-300 `}   
                                    >
                                    <div className="">Select Your file</div>
                                    </div>
                                </label>
                                <input
                                    id="Import-contacts-file"
                                    name="Import-contacts-file"
                                    className="hidden"
                                    type="file"
                                    accept="image/*,video/*"
                                    multiple={false}
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <button 
                                type="button" 
                                onClick={onSubmit}
                                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                
                                {isLoading ? (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                ): <svg 
                                    className="me-1 -ms-1 w-5 h-5" 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        fillRule="evenodd" 
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
                                        clipRule="evenodd"
                                    >
                                    </path>
                                </svg>}
                                {
                                    isLoading ?"Creating...": "Create"
                                }

                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div> 

    </>
}