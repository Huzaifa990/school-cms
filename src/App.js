import './App.css';
import MainHeader from './Components/MainHeader';
import MainSection from './Components/MainSection';
import Footer from './Components/Footer';
import Signup from './Components/Signup';
import Signin from './Components/Signin';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PeriodInfo from './Components/PeriodInfo';
import TeacherInfo from './Components/TeacherInfo';
import TeachersDashboard from './Components/TeachersDashboard';
import Subheader from './Components/Subheader';
import EditPeriodInfo from './Components/EditPeriodInfo';
import AdminPanel from './Components/AdminPanel';
import Shuffling from './Components/Shuffling';
import Pending from './Components/Pending';
import Rejected from './Components/Rejected';

function App() {  
  return (
   <div>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<> <MainHeader/> <MainSection/> <Footer/> </>}/>
        <Route path='/signup' element={<> <Signup/> </>}/>
        <Route path='/signin' element={<> <Signin/> </>}/>
        <Route path='/teacherinfo' element={<> <TeacherInfo/> </>}/>
        <Route path='/periodInfo' element={<> <PeriodInfo/> </>}/>
        <Route path='/teacherdashboard' element={<> <Subheader title="Your Dashboard"/> <TeachersDashboard/> <Footer/> </>}/>
        <Route path='/editPeriodInfo' element={<> <EditPeriodInfo/> </>}/>
        <Route path='/adminpanel' element={<> <Subheader title="Admin Panel"/> <AdminPanel/> <Footer/> </>}/>
        <Route path='/shuffle' element={<> <Subheader title="Shuffle Students"/> <Shuffling/> <Footer/> </>}/>
        <Route path='/pending' element={<> <Subheader title=""/> <Pending/> <Footer/> </>}/>
        <Route path='/rejected' element={<> <Subheader title=""/> <Rejected/> <Footer/> </>}/>
        
        
      </Routes>
    </BrowserRouter>
   </div>
  );
}

export default App;
