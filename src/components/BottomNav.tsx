import { NavLink } from 'react-router-dom';
import { BarChart3, Bell, ChartSpline, Table2, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function BottomNav() {
  const navItems = [
    { name: 'ATTENDANCE', path: '/attendance', icon: BarChart3 },
    { name: 'ALERTS', path: '/alerts', icon: Bell },
    { name: 'GRADES', path: '/grades', icon: ChartSpline },
    { name: 'TIME TABLE', path: '/timetable', icon: Table2 },
    { name: 'PROFILE', path: '/profile', icon: User },
  ];
  // Safari bug workaround: if any ancestor has transform, fixed children can behave like absolute.
  // Render the fixed bottom nav into document.body via a portal so it's outside transformed stacking contexts.
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client
    const el = document.createElement('div');
    containerRef.current = el;
    document.body.appendChild(el);
    setMounted(true);

    return () => {
      if (containerRef.current && containerRef.current.parentNode) {
        containerRef.current.parentNode.removeChild(containerRef.current);
      }
      containerRef.current = null;
    };
  }, []);

  const nav = (
    <div className="fixed bottom-0 left-0 flex w-screen items-center justify-between gap-1 bg-muted px-2 py-4 sm:gap-0 sm:px-4">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `flex-1 overflow-hidden text-clip whitespace-nowrap text-sm text-muted-foreground ${
              isActive ? 'opacity-100' : 'opacity-70'
            }`
          }
        >
          {({ isActive }) => {
            const Icon = item.icon;
            return (
              <div className="flex flex-col items-center">
                <div
                  className={`flex w-full items-center justify-center rounded-xl p-1 hover:bg-primary ${
                    isActive ? 'bg-primary' : ''
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                  />
                </div>
                <p className="text-left text-xs max-[370px]:text-[0.6rem] max-[390px]:text-[0.7rem]">
                  {item.name}
                </p>
              </div>
            );
          }}
        </NavLink>
      ))}
    </div>
  );

  if (!mounted || !containerRef.current) return null;

  return createPortal(nav, containerRef.current);
}
