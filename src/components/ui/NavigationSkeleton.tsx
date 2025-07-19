import React from 'react'
import { Skeleton } from './Skeleton'

export const MobileMenuSkeleton: React.FC = () => {
  return (
    <ul className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <li key={index}>
          <div className="py-3 px-4 rounded-md">
            <Skeleton width="w-24" height="h-4" />
          </div>
        </li>
      ))}
    </ul>
  )
}

export const NavSkeleton: React.FC = () => {
  return (
    <div className="flex items-center space-x-6 lg:space-x-8">
      <Skeleton width="w-16" height="h-4" />
      <Skeleton width="w-20" height="h-4" />
      <Skeleton width="w-12" height="h-4" />
      <Skeleton width="w-24" height="h-8" rounded="md" />
    </div>
  )
}
