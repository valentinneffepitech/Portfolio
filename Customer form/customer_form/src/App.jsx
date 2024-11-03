import { Routes, Route } from 'react-router-dom'
import './App.css'
import CustomerForm from './CustomerForm/CustomerForm';
import Navbar from './Navbar/Navbar';
import Login from './Login/Login';
import { AuthProvider, RequireAuth } from './AuthContext';
import AdminPanel from './AdminPanel/AdminPanel';
import FormModifer from './modifyForm/formModifer';

function App() {

  return (
    <>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={
            <RequireAuth>
              <AdminPanel />
            </RequireAuth>
          } />
          <Route path="/update" element={
            <RequireAuth>
              <FormModifer />
            </RequireAuth>
          } />
          <Route path="/*" element={
            <CustomerForm action={'register'} />}
          />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App
