'use client'
import React, { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/app/firebase/config'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'





export default function CrudOperations() {
  const [user] = useAuthState(auth)
  const router = useRouter()

  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState({ name: '', quantity: '' })
  const [total, setTotal] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [recipe, setRecipe] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')

  // Redirect to sign-in if the user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/sign-in')
    }
  }, [user, router])

  useEffect(() => {
    const newTotal = items.reduce((sum, item) => sum + parseFloat(item.quantity), 0)
    setTotal(newTotal.toFixed(2))
  }, [items])

  const addItem = async (e) => {
    e.preventDefault()
    if (newItem.name && newItem.quantity) {
      setItems([
        ...items,
        { id: items.length + 1, name: newItem.name, quantity: parseFloat(newItem.quantity) },
      ])
      setNewItem({ name: '', quantity: '' })
    }
  }

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const generateRecipe = async () => {
    const itemNames = items.map((item) => item.name).join(', ')

    try {
      const response = await fetch('/api/generateRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: itemNames }),
      })

      if (response.ok) {
        const data = await response.json()
        setRecipe(data.recipe)
      } else {
        console.error('Failed to fetch recipe')
      }
    } catch (error) {
      console.error('Error fetching recipe:', error)
    }
  }

  const handleCourseClick = (course) => {
    switch (course) {
      case 'CS1':
        setSelectedCourse('This is the Computer Science 1 course.');
        break;
      case 'DS1':
        setSelectedCourse('This is the Data Science 1 course.');
        break;
      case 'IT2':
        setSelectedCourse('This is the Information Technology 2 course.');
        break;
      default:
        setSelectedCourse('No course details available.');
    }
  }

  return (
    <main className='flex min-h-screen flex-col items-center'>
      <div className='w-full max-w-5xl flex justify-between items-center p-4'>
        <p className='text-xl font-bold text-rose-200'>Hello, {user?.displayName || 'User'}!</p>
        <button
          onClick={() => {
            signOut(auth)
            sessionStorage.removeItem('user')
            router.push('/sign-in')
          }}
          className='bg-red-600 text-white rounded-lg hover:bg-red-700 p-3'
        >
          Log Out
        </button>
      </div>

      <h1 className='text-5xl p-10 text-yellow-400 text-center'>Welcome to My-Learning</h1>

     
      

      <div className='flex justify-start w-full max-w-5xl mb-4'>
        <div 
          className='p-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700 m-2'
          onClick={() => handleCourseClick('CS1')}
        >
          CS1
        </div>
        <div 
          className='p-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700 m-2'
          onClick={() => handleCourseClick('DS1')}
        >
          DS1
        </div>
        <div 
          className='p-4 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700 m-2'
          onClick={() => handleCourseClick('IT2')}
        >
          IT2
        </div>
      </div>

      {selectedCourse && (
        <div className='bg-white p-4 rounded-lg w-full max-w-5xl mb-4'>
          <h2 className='text-xl font-bold'>Course Details</h2>
          <p>{selectedCourse}</p>
        </div>
      )}

      <div className='bg-blue-100 p-9 rounded-lg w-full max-w-5xl'>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full p-3 mb-4 bg-yellow-100 border border-blue-900 rounded text-blue-900 font-bold'
          type='text'
          placeholder='Search for an item'
        />
        <form className='grid grid-cols-6 items-center text-blue-900 font-bold'>
          <input
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className='col-span-3 p-3 border'
            type='text'
            placeholder='Enter Item'
          />
          <input
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            className='col-span-2 p-3 border mx-3'
            type='number'
            placeholder='Enter quantity'
          />
          <button
            onClick={addItem}
            className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl'
            type='submit'
          >
            +
          </button>
        </form>
        <ul>
          {filteredItems.map((item) => (
            <li
              key={item.id}
              className='my-4 w-full flex justify-between bg-slate-950 items-center'
            >
              <div className='p-4 w-full flex justify-between items-center'>
                <span className='capitalize'>{item.name}</span>
                <span>{item.quantity}</span>
              </div>
              <div className='flex items-center'>
                <button
                  onClick={() => deleteItem(item.id)}
                  className='ml-4 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16'
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        {items.length > 0 && (
          <div className='flex justify-between p-3'>
            <span>Total Quantity</span>
            <span>{total}</span>
          </div>
        )}
      </div>
    </main>
  )
}
