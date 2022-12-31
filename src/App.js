import './dashboardstyle.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/navbar-component/Navbar';
import Admin from './components/admin-component/Admin';
import Customers from './components/user-component/Customers';
import Services from './components/services-component/Services';
import Salons from './components/salons-component/Salons';
import Home from './components/home-component/Home';
import UpdateSalon from './components/salons-component/UpdateSalon';
import Offers from './components/offers-component/Offers';
import Notifications from './components/notif-component/Notifications';
import Reservations from './components/reservations-component/Reservations';
import Footer from './components/footer-component/Footer';
import EditContacts from './components/footer-component/EditContacts';
import { Route,Routes } from 'react-router-dom';

function App(){
  return(
    <>
      <Navbar></Navbar>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/customers' element={<Customers />} />
        <Route path='/services' element={<Services />} />
        <Route path='/salons' element={<Salons />} />
        <Route path='/salons/updatesalon' element={<UpdateSalon />} />
        <Route path='/offers' element={<Offers />} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/reservations' element={<Reservations />} />
        <Route path='/updatecontacts' element={<EditContacts />} />
      </Routes>
      <Footer></Footer>
    </>
  )
}

export default App