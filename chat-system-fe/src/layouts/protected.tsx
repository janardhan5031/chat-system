import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom";
import { RouteConstants } from "../utils/constants/routes";

export default function ProtectedLayout(){

    const auth = useSelector((state:any)=>state.auth);
    console.log(auth);

    if(!auth?.userName?.length){
        return <Navigate to={RouteConstants.LOGIN}/>
    }
    
    return <Outlet />  
}