import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import AppLayout from "./AppLayout"
import Login from "./pages/Login/Login"
import ProtectedRoute from "./components/ProtectedRoute"

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes> 
          <Route path="/login" element={<Login />} />

          {/* Protected route: all other content */}
          <Route path="/*" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
