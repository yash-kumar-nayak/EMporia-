'use client'

import { Component, Suspense, lazy, type ReactNode } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

interface SceneErrorBoundaryProps {
  children: ReactNode
}

interface SceneErrorBoundaryState {
  hasError: boolean
}

/**
 * `@splinetool/react-spline` rethrows a rejected `Application.load()` during the
 * render phase, and <Suspense> does not catch render-phase throws. A blocked CDN,
 * a 404'd scene or a device without WebGL would therefore unmount the whole island
 * root and leave a large empty dark hole. Error boundaries must be class
 * components, so this is one. On error we render nothing and let the hero collapse.
 */
class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  state: SceneErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(): void {
    // Decorative scene only — swallow so nothing is logged as an app error.
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <SceneErrorBoundary>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <span className="loader"></span>
          </div>
        }
      >
        <Spline scene={scene} className={className}>
          {/* react-spline renders its children as its own loading placeholder
              ({isLoading && children}) while the ~1MB .splinecode downloads and
              the canvas is still display:none. Without this the spinner would
              disappear the moment the lazy chunk resolved. */}
          <span className="loader"></span>
        </Spline>
      </Suspense>
    </SceneErrorBoundary>
  )
}
