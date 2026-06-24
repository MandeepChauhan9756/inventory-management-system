import { Route } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Dashboard from "./pages/dashboard/Dashboard";
import CreateOrder from "./pages/orders/Orders";
import { ToastContainer} from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"
import "react-toastify/ReactToastify.css"

function App(){
  return (
    <>
      <AppRoutes />
      <ToastContainer />    
    </>
  );
}



export default App;