import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import './App.css'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import { useState, useEffect } from 'react'
import { apiClient } from './lib/api-client'
import { GET_USERINFO_ROUTE } from './utils/constants'


const PrivateRoute = ({ children }: any) => {
  const {userInfo}: any = useAppStore();
  const isAuthenticated = !!userInfo;
  if(isAuthenticated){
    return children;
  }
  else{
    return <Navigate to="/auth" />
  }
}

const AuthRoute = ({ children }: any) => {
  const {userInfo}: any = useAppStore();
  const isAuthenticated = !!userInfo;
  if(isAuthenticated){
    return <Navigate to="/chat" />;
  }
  else{
    return children;
  }}


function App() {
  const { userInfo, setUserInfo }: any = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USERINFO_ROUTE, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching user data
  }

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/auth" element={ <AuthRoute><Auth /></AuthRoute> } />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute> } />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/auth" />} />    //for all other routes requested by user
      </Routes>      
      </BrowserRouter>
    </>
  )
}

export default App;
