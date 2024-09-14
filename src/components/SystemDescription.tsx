import React from 'react';

const SystemDescription: React.FC = () => {
  return (
    <div className="fixed text-white top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-5 rounded-lg bg-transparent">
      <h1 className="text-4xl font-bold mb-4">Enhancing Campus Life</h1>
      <p className="text-lg mb-4">
        A seamless blend of technology and convenience, providing real-time
        navigation, efficient infrastructure management, dynamic event
        coordination, and personalized dining experiences.
      </p>
      <p className="text-xl font-semibold mb-2">Secure. Scalable. User-friendly.</p>
      <p className="text-base">
        All in one platform, designed for a better campus experience.
      </p>
    </div>
  );
};

export default SystemDescription;