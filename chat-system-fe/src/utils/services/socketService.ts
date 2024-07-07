import { io } from 'socket.io-client';
import { addPost } from '../../redux/reducers/postsReducer';
import { BACKEND_URL } from '../config';

class SocketService{
    private url:string;
    private socket:any;
    private dispatch:any;
    private commentsListener:any;

    constructor(url:string){
        this.url = url;
    }

    public connect(access_token:string, dispatch:any){
        this.socket = io('http://localhost:3000', {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            transports: ['websocket'],
            auth:{
                access_token:access_token
            }
          });

        this.socket.on('news_post_listen', (data:any) => {
            console.log('Received news post:', data);
            dispatch(addPost(data));
        });

        this.socket.on('add_comment_listen', (data:any) => {
            console.log('Received news comment:', data);
            // dispatch(addPost(data));
            if(this.commentsListener){
                this.commentsListener(data)
            }
        });
    }

    public sendNewPost(data:any){
        this.socket.emit('news_post', data);
    }

    public addCommentsListener(listener:Function){
        this.commentsListener = listener
    }

    public addComment(data:any){
        this.socket.emit('add_commnet', data);
    }

    public disconnect(){
        this.socket.disconnect();
    }

}

export const socketService = new SocketService(BACKEND_URL);