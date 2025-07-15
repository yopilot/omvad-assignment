'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as Components from '@/components/auth/AuthStyles'

const authSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type AuthFormData = z.infer<typeof authSchema>

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isComponentReady, setIsComponentReady] = useState(false)
  const router = useRouter()

  // Prevent FOUC by waiting for component to be ready
  useEffect(() => {
    setIsComponentReady(true)
  }, [])

  // Separate forms for sign in and sign up
  const signInForm = useForm<AuthFormData>({
    resolver: zodResolver(authSchema)
  })

  const signUpForm = useForm<AuthFormData>({
    resolver: zodResolver(authSchema)
  })

  // Clear messages when switching between forms
  useEffect(() => {
    setError('')
    setSuccess('')
    signInForm.reset()
    signUpForm.reset()
  }, [isSignIn, signInForm, signUpForm])

  const handleSignIn = async (data: AuthFormData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are included in the request
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Login failed')
      }

      console.log('Login successful, cookie should be set')
      setSuccess('Login successful! Redirecting...')
      
      // Multiple approaches to ensure the redirect works with cookies
      setTimeout(() => {
        console.log('Attempting redirect...')
        // Try multiple methods for better browser compatibility
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      }, 500)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (data: AuthFormData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      setSuccess('Account created successfully! Please sign in.')
      
      // Switch to sign in form after successful registration
      setTimeout(() => {
        setIsSignIn(true)
        setSuccess('Account created! You can now sign in.')
      }, 1500)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading screen to prevent FOUC
  if (!isComponentReady) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="auth-page-loaded"
      style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        position: 'relative'
      }}
    >
      <Components.Container>
        <Components.SignUpContainer $signIn={isSignIn}>
          <Components.Form onSubmit={signUpForm.handleSubmit(handleSignUp)}>
            <Components.Title>Create Account</Components.Title>
            
            {error && !isSignIn && <Components.ErrorMessage>{error}</Components.ErrorMessage>}
            {success && !isSignIn && <Components.SuccessMessage>{success}</Components.SuccessMessage>}
            
            <Components.Input
              {...signUpForm.register('email')}
              type="email"
              placeholder="Email"
              autoComplete="email"
              disabled={isLoading}
            />
            {signUpForm.formState.errors.email && (
              <Components.ErrorMessage>
                {signUpForm.formState.errors.email.message}
              </Components.ErrorMessage>
            )}
            
            <Components.Input
              {...signUpForm.register('password')}
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              disabled={isLoading}
            />
            {signUpForm.formState.errors.password && (
              <Components.ErrorMessage>
                {signUpForm.formState.errors.password.message}
              </Components.ErrorMessage>
            )}
            
            <Components.Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Components.Button>
          </Components.Form>
        </Components.SignUpContainer>

        <Components.SignInContainer $signIn={isSignIn}>
          <Components.Form onSubmit={signInForm.handleSubmit(handleSignIn)}>
            <Components.Title>Welcome Back</Components.Title>
            
            {error && isSignIn && <Components.ErrorMessage>{error}</Components.ErrorMessage>}
            {success && isSignIn && <Components.SuccessMessage>{success}</Components.SuccessMessage>}
            
            <Components.Input
              {...signInForm.register('email')}
              type="email"
              placeholder="Email"
              autoComplete="email"
              disabled={isLoading}
            />
            {signInForm.formState.errors.email && (
              <Components.ErrorMessage>
                {signInForm.formState.errors.email.message}
              </Components.ErrorMessage>
            )}
            
            <Components.Input
              {...signInForm.register('password')}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              disabled={isLoading}
            />
            {signInForm.formState.errors.password && (
              <Components.ErrorMessage>
                {signInForm.formState.errors.password.message}
              </Components.ErrorMessage>
            )}
            
            <Components.Anchor href="#" onClick={(e) => e.preventDefault()}>
              Forgot your password?
            </Components.Anchor>
            
            <Components.Button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Components.Button>
          </Components.Form>
        </Components.SignInContainer>

        <Components.OverlayContainer $signIn={isSignIn}>
          <Components.Overlay $signIn={isSignIn}>
            <Components.LeftOverlayPanel $signIn={isSignIn}>
              <Components.Title>Welcome Back!</Components.Title>
              <Components.Paragraph>
                To keep connected with us please login with your personal info
              </Components.Paragraph>
              <Components.GhostButton
                type="button"
                onClick={() => setIsSignIn(true)}
                disabled={isLoading}
              >
                Sign In
              </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel $signIn={isSignIn}>
              <Components.Title>Hello, Friend!</Components.Title>
              <Components.Paragraph>
                Enter your personal details and start your journey with us
              </Components.Paragraph>
              <Components.GhostButton
                type="button"
                onClick={() => setIsSignIn(false)}
                disabled={isLoading}
              >
                Sign Up
              </Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>
    </div>
  )
}
