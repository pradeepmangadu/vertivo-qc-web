import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function Header({ back }: { back?: boolean }) {
  const { user, logout } = useAuth();
  return (
    <header>
      <div className="topbar">
        <div>
          <h1>Vertivo Delivery QC</h1>
          <p>Material Quality &amp; Delivery Checklist · Mobile-ready site inspection</p>
          {back && <Link className="linkbtn no-print" to="/">All deliveries</Link>}
        </div>
        {user && (
          <div className="who no-print">
            <div>{user.name || user.email}</div>
            <button type="button" className="linkbtn" onClick={() => void logout()}>Sign out</button>
          </div>
        )}
      </div>
    </header>
  );
}
