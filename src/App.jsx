import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AppRouter from '@/router/index'
import { fetchMe } from '@/store/slices/authSlice'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(fetchMe())
    }
  }, [dispatch])

  return <AppRouter />
}

export default App
