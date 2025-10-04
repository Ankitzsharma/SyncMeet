// import logo from './logo.svg';
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import LandingPage from './pages/landing';
import Authentication from './pages/authentication';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import VideoMeetComponent from './pages/VideoMeet';

function App() {
  return (
    <> 
      <Router>

        <AuthProvider>

          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* Add more routes here as needed */}
            <Route path='/auth' element={<Authentication />} />  
             
            <Route path='/:url' element={<VideoMeetComponent />} />
          
          </Routes>

        </AuthProvider>

      </Router>
    
    </>
  );
}

export default App;
