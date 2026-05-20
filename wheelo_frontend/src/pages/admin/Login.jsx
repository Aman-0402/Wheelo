import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { HiLockClosed, HiUser } from 'react-icons/hi'
import { useAuth } from '@/context/AuthContext'

const schema = z.object({
  username: z.string().min(1, 'Username required'),
  password: z.string().min(1, 'Password required'),
})

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      await login(data)
      navigate('/admin/dashboard', { replace: true })
    } catch {
      toast.error('Invalid username or password.')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0F0F0F' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,107,0,0.06) 0%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
            <span className="text-white">Whee</span>
            <span style={{ color: '#FF6B00' }}>lo</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#B0B0B0' }}>Admin Panel</p>
        </div>

        {/* Card */}
        <div className="p-6 rounded-2xl" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
          <h2 className="text-lg font-semibold text-white mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
            Sign In
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#B0B0B0' }}>
                Username
              </label>
              <div className="relative">
                <HiUser
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#B0B0B0' }}
                />
                <input
                  {...register('username')}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-[#FF6B00]"
                  style={{ background: '#0F0F0F', border: '1px solid #2A2A2A' }}
                />
              </div>
              {errors.username && (
                <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#B0B0B0' }}>
                Password
              </label>
              <div className="relative">
                <HiLockClosed
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#B0B0B0' }}
                />
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-[#555] outline-none focus:ring-1 focus:ring-[#FF6B00]"
                  style={{ background: '#0F0F0F', border: '1px solid #2A2A2A' }}
                />
              </div>
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 mt-2"
              style={{ background: '#FF6B00' }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#555' }}>
          Wheelo Admin © {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  )
}
