'use client'
import { useAuth } from '@/app/provider/AuthProvider';
import { User } from '@/app/types'
import Link from 'next/link';
import { usePathname } from 'next/navigation';


interface HeaderProps {
  user: User | null;
}

const Header = ({ user }: HeaderProps) => {
  const pathname = usePathname();
  const {logout} = useAuth();
  const navigation = [
    { name: 'Home', href: '/', show: true },
    { name: 'Dashboard', href: '/dashboard', show: true },
  ].filter((item) => item.show);

  const getNavItemsClass = (href: string) => {
    let isActive = false;
    if (href === '/') {
      isActive = pathname === "/";
    } else if (href === '/dashboard') {
      isActive = pathname.startsWith(href);
    }
    return `px-3 py-2 rounded text-sm font-medium transition-colors ${isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`;
  }

  return (
    <header className='bg-slate-900 border-b border-slate-700'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          {/* logo */}
          <Link href={'/'} className='font-bold text-xl text-white'>Team Access</Link>
          {/* navigation */}
          <nav className='flex items-center space-x-6'>
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getNavItemsClass(item.href)}>
                {item.name}
              </Link>
            ))
            }
          </nav>
          {/* User Profile */}
          <div className='flex items-center space-x-4'>
            {user ? (<>
              <span className='text-slate-300 text-sm'> <b>Welcome {user.name} ({user.role})</b> </span>
              <button
                onClick={logout} 
                className='px-3 py-2 text-white text-sm rounded bg-red-500 hover:bg-red-700 transition-colors'>
                Logout
              </button>
            </>) :
              (<>
                <Link href='/login' className='px-3 py-2 text-slate-300 text-sm hover:bg-slate-800 hover:text-white rounded transition-colors'>Login</Link>
                <Link href='/register' className='px-3 py-2 bg-blue-600 text-white text-sm hover:bg-slate-700  rounded transition-colors'>Register</Link>
              </>)}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
