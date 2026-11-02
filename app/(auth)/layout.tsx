import React from 'react'

const AuthLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='min-h-screen flex items-center justify-center px-12 py-4 sm:px-4 lg:px-6 bg-slate-950'>
      {children}
    </div>
  )
};

export default AuthLayout;
