import React from 'react'

interface SkeletonProps {
  className?: string
  width?: string
  height?: string
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4',
  rounded = 'md'
}) => {
  const roundedClass = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  }

  return (
    <div 
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${width} ${height} ${roundedClass[rounded]} ${className}`}
    />
  )
}

export default Skeleton
