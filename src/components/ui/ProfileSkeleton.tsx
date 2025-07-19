import React from 'react'
import { Skeleton } from './Skeleton'

export const ProfileSkeleton: React.FC = () => {
  return (
    <main className="flex-grow flex items-center justify-center px-4 py-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-5xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          {/* Header skeleton */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Skeleton width="w-16" height="h-16" rounded="full" />
              <div className="space-y-2">
                <Skeleton width="w-32" height="h-8" />
                <Skeleton width="w-48" height="h-4" />
              </div>
            </div>
            <Skeleton width="w-32" height="h-10" rounded="lg" />
          </div>
          
          {/* Information sections skeleton */}
          <div className="space-y-8">
            {/* Información Personal */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                <Skeleton width="w-5" height="h-5" />
                <Skeleton width="w-40" height="h-6" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Skeleton fields */}
                {[...Array(3)].map((_, index) => (
                  <div 
                    key={index}
                    className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 h-20 flex items-center ${
                      index === 2 ? 'md:col-span-2' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <Skeleton width="w-5" height="h-5" />
                      <div className="space-y-2 flex-1">
                        <Skeleton width="w-24" height="h-3" />
                        <Skeleton width="w-32" height="h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Información de Cuenta */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                <Skeleton width="w-5" height="h-5" />
                <Skeleton width="w-40" height="h-6" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div 
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 h-20 flex items-center"
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <Skeleton width="w-5" height="h-5" />
                      <div className="space-y-2 flex-1">
                        <Skeleton width="w-16" height="h-3" />
                        <Skeleton width="w-20" height="h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Estado de la sesión skeleton */}
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-2 mb-4">
              <Skeleton width="w-5" height="h-5" />
              <Skeleton width="w-32" height="h-5" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(2)].map((_, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <Skeleton width="w-16" height="h-4" className="mb-2" />
                  <Skeleton width="w-full" height="h-3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProfileSkeleton
