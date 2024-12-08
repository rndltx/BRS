import { ForwardRefComponent } from 'framer-motion'

declare module 'framer-motion' {
  export interface MotionProps {
    className?: string
  }

  export const motion: {
    div: ForwardRefComponent<HTMLDivElement, MotionProps>
    // Add other HTML elements as needed
  }
}

