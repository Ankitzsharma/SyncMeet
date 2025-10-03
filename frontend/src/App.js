// import logo from './logo.svg';
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import LandingPage from './pages/landing';
import Authentication from './pages/authentication';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <> 
      <Router>

        <AuthProvider>

          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Add more routes here as needed */}
            <Route path='/auth' element={<Authentication />} />  
          </Routes>

        </AuthProvider>

      </Router>
    
    </>
  );
}

export default App;
