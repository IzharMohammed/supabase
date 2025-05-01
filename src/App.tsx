import { useEffect, useState } from "react";
import "./App.css";
import Auth from "./components/auth"
import { TaskManager } from "./components/task-manager"
import { supabase } from "./supabase-client";

const App = () => {
  const [session, setsession] = useState<any>(null);

  const fetchSession = async () => {
    const { data } = await supabase.auth.getSession();
    setsession(data.session);
  }
  useEffect(() => {
    fetchSession();
    const {data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log(session);
        setsession(session);
      }
    )

    return ()=>{
      authListener.subscription.unsubscribe();
    }
    // fetchSession();
  }, []);
  const logout = async () => {
    await supabase.auth.signOut();

  }
  return (
    <>
      {
        session ?
          <>
            {`welcome ${session.user.user_metadata.email}`}
            <button onClick={logout}>Logout</button>
            <TaskManager />
          </> :
          <>
            <Auth />
          </>
      }
    </>
  )
}

export default App