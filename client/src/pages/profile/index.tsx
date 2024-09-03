import { useAppStore } from "@/store"

const Profile = () => {
  const { userInfo }: any  = useAppStore();
  return (
    <div>Profile</div>
  )
}

export default Profile