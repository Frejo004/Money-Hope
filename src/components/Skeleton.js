import React from 'react';

export const SkeletonCard = ({ className = "" }) => (
  <div className={`bg-white rounded-xl p-4 shadow-sm animate-pulse ${className}`}>
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

export const SkeletonBalance = () => (
  <div className="bg-gradient-to-br from-gray-300 to-gray-400 text-white p-6 rounded-2xl shadow-xl animate-pulse">
    <div className="text-center">
      <div className="h-4 bg-white bg-opacity-30 rounded w-32 mx-auto mb-2"></div>
      <div className="h-10 bg-white bg-opacity-30 rounded w-40 mx-auto mb-4"></div>
      <div className="h-2 bg-white bg-opacity-30 rounded w-full mb-2"></div>
      <div className="h-3 bg-white bg-opacity-30 rounded w-24 mx-auto mb-6"></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-12 bg-white bg-opacity-30 rounded-xl"></div>
        <div className="h-12 bg-white bg-opacity-30 rounded-xl"></div>
      </div>
    </div>
  </div>
);

export const SkeletonStats = () => (
  <div className="grid grid-cols-2 gap-4">
    {[1, 2].map(i => (
      <div key={i} className="bg-white p-4 rounded-xl shadow-sm animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonList = ({ items = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: items }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonWheel = () => (
  <div className="card animate-pulse">
    <div className="mx-auto w-80 h-80 bg-gray-200 rounded-full"></div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex justify-between items-center py-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  </div>
);