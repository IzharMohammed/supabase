import "./App.css";
import Auth from "./components/auth"
import { TaskManager } from "./components/task-manager"

const App = () => {
  return (
    <>
      <TaskManager />
      <Auth />
    </>
  )
}

export default App