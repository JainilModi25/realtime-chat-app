import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Chat = () => {
  const {userInfo}: any = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if(!userInfo.profileSetup){
      toast("please setup profile to continue.")
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <div>Chat</div>
  )
}

export default Chat