import { BrowserRouter as Routes, Route } from "react-router-dom";
import RegistrationForm from "./components/registration-form/RegistrationForm";
import AuthorizationForm from "./components/authorization-from/AuthorizationForm";
import { Home, SendEmail } from "./pages";
import "./App.css";

function App() {
  return (
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<AuthorizationForm />} />
        <Route path="/" element={<Home />} />
        <Route path="/send-email" element={<SendEmail />} />
      </Routes>
  );
}

export default App;
