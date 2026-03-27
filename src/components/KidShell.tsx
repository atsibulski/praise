import { useEffect } from 'react';
import { Outlet, useParams, Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import KidBottomNav from './KidBottomNav';

export default function KidShell() {
  const { kidName } = useParams();
  const kids = useStore((s) => s.kids);
  const setActiveKid = useStore((s) => s.setActiveKid);

  const kid = kids.find((k) => k.name.toLowerCase() === kidName?.toLowerCase());

  useEffect(() => {
    if (kid) {
      setActiveKid(kid.id);
    }
  }, [kid, setActiveKid]);

  if (!kid) return <Navigate to="/" replace />;

  return (
    <>
      <Outlet />
      <KidBottomNav />
    </>
  );
}
