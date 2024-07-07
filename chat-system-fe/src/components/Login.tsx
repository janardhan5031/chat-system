import { Label } from "@radix-ui/react-label";
import wellcomeImage from "../assets/wellcome.jpg";
import { Input } from "../utils/ui/input";
import { Button } from "../utils/ui/button";
import { Icons } from "../utils/ui/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouteConstants } from "../utils/constants/routes";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/reducers/authReducer";
import { backendRest } from "../utils/services/backend";
import toast from "react-hot-toast";
import { socketService } from "../utils/services/socketService";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    const response:any = await backendRest.login({userName, password})
    console.log(response)
    
    if(response.status==200){
      const loginResponse = response.data

      dispatch(setUser({
        userName: loginResponse.userName,
        _id: loginResponse._id,
        access_token: loginResponse.access_token,
      }))
      
      toast.success(loginResponse.message)
      
      setTimeout(() => {
        navigate(RouteConstants.HOME)
      }, 500);
    }else{
      toast.error(response.response.data.message)
    }
    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center h-full w-full">
        <div className="w-4/6 h-4/6 bg-zinc-900 shadow-xl rounded-xl flex">
          <div className="w-1/2 h-full rounded-l-xl flex items-center justify-center">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="text-xs text-muted-foreground">
                Login to your account to continue.
              </p>
            <form onSubmit={handleLogin}>
            <div className="grid gap-4 pt-5">
              <div className="grid gap-1">
                <Input
                  id="email"
                  placeholder="Enter your unique username"
                  type="text"
                  disabled={isLoading}
                  onChange={(e:any)=>setUserName(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Input
                  id="email"
                  placeholder="Enter your unique password"
                  type="text"
                  disabled={isLoading}
                  onChange={(e:any)=>setPassword(e.target.value)}
                />
              </div>
              <Button disabled={isLoading} className="bg-zinc-700">
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Continue
              </Button>
            </div>
          </form>
          </div>
          </div>
          <div className="w-1/2 h-ful">
            <img src={wellcomeImage} alt="Welcome" className="object-cover h-full w-full rounded-r-xl" />
          </div>
        </div>
    </div>
  )
}