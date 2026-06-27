import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

function JoinClubForm() {
  const { currentUser, setCurrentUser } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users/join', { passcode });
      if (response.data.success) {
        setCurrentUser(response.data.user);
        navigate('/');  
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect passcode');
    }
  };

  if (!currentUser || currentUser.membership) return null;

  return (
    <div className="form-container join-club-box">
      <h2>Become a Member</h2>
      <p>Enter the secret passcode to see who wrote the messages.</p>
      <form onSubmit={handleSubmit} className="standard-form">
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Secret Passcode"
          required
        />
        <button type="submit" className="btn-primary">Unlock</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default JoinClubForm;