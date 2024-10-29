import React from 'react';

const SystemDescription: React.FC = () => {
  return (
    <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-5 rounded-lg bg-transparent flex flex-col items-start space-y-4">
      <h1 className="text-2xl md:text-3xl font-bold text-left text-white">
        Enhancing Campus Life
      </h1>
      <p className="text-sm md:text-base text-left text-white whitespace-normal">
        A seamless blend of technology and convenience, providing real-time
        navigation, efficient infrastructure management, dynamic event
        coordination, and personalized dining experiences.
      </p>
      <p className="text-base md:text-lg font-semibold text-left text-white whitespace-normal">
        Secure. Scalable. User-friendly.
      </p>
      <p className="text-xs md:text-sm text-left text-white whitespace-normal">
        All in one platform, designed for a better campus experience.
      </p>
    </div>
  );
};

export default SystemDescription;
