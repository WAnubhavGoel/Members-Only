import JoinClubForm from '../components/JoinClubForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function JoinPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  if (currentUser.membership) {
    navigate('/');
    return null;
  }

  return (
    <div className="join-page">
      <JoinClubForm />
    </div>
  );
}

export default JoinPage;