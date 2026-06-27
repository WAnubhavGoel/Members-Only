import NewMessageForm from '../components/NewMessageForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CreateMessagePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleMessageAdded = () => {
    navigate('/');
  };

  return (
    <div className="join-page">
      <NewMessageForm onMessageAdded={handleMessageAdded} />
    </div>
  );
}

export default CreateMessagePage;
