'use client'
import Image from 'next/image'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/app/firebase/config'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'

export default function Home() {
  const [user] = useAuthState(auth)
  const router = useRouter()

  const handleSignup = () => {
    router.push('/sign-up')
  }

  const handleSignin = () => {
    router.push('/sign-in')
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/image1.jpg')" }}
    >
      <h1 className="text-7xl font-bold text-white-600 mb-20 text-decoration-style: wavy ">Learning App</h1>

      <div className="flex space-x-4">
        <button 
          onClick={handleSignup} 
          className="px-6 py-3 bg-blue-400 font-bold text-black rounded-lg hover:bg-sky-600"
        >
          Register
        </button>
        <button 
          onClick={handleSignin} 
          className="px-6 py-3 bg-green-300 font-bold text-black rounded-lg hover:bg-green-500"
        >
          Login
        </button>
      </div>
      
     
       
          
        
    </main>
  )
}
