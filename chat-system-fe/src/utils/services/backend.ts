import axios from "axios";
import { BACKEND_URL } from "../config";

class BackendRestApi{
    private baseUrl:string;
    constructor(){
        this.baseUrl = BACKEND_URL;
    }

    public async login ({userName, password}:any){
        try{
            let data = JSON.stringify({
               userName, password
            });
              
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${this.baseUrl}/v1/login`,
                headers: { 
                    'Content-Type': 'application/json'
                },
                data : data
            };

            return await axios.request(config)  
        }catch(e){
            return e
        }
    }

    public async getPosts (access_token:string){
        try{
              
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${this.baseUrl}/v1/get-posts`,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${access_token}`
                },
            };

            return await axios.request(config)  
        }catch(e){
            return e
        }
    }

    public async getComments (access_token:string, postId:string){
        try{
              
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${this.baseUrl}/v1/get-comments?postId=${postId}`,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${access_token}`
                },
            };

            return await axios.request(config)  
        }catch(e){
            return e
        }
    }

    public async createPost (obj:any,access_token:string){
        try{

            let data = new FormData();
            data.append('title', obj.title);
            data.append('description', obj.description);
            data.append("file", obj.file);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:3000/v1/create-post',
                headers: { 
                  'Authorization':`Bearer ${access_token}`, 
                  "Content-Type": "multipart/form-data",

                },
                data : data
            };

            return await axios.request(config)  
        }catch(e){
            return e
        }
    }
}

export const backendRest = new BackendRestApi()