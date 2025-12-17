import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ⚠️ Quan trọng: Không có dòng này toast sẽ bị vỡ giao diện
import AppRoutes from "./routes/UserRoute";

function App() {
  return (
    <>
      <AppRoutes />

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
