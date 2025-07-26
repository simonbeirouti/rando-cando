import React from 'react';

interface WelcomeCardProps {
  greeting: string;
  className?: string;
}

export default function WelcomeCard({ greeting, className }: WelcomeCardProps) {
  return (
    <div className={`text-center space-y-4 my-12 ${className}`}>
      <h1 className="text-6xl font-bold leading-none text-white mb-4">
        {greeting}
      </h1>
      <p className="text-gray-300 text-lg">
        Welcome to DeFi Unite - Your gateway to decentralized finance on Stellar
      </p>
      <p className="text-gray-400">
        Connect your wallet and start exploring the world of DeFi
      </p>
    </div>
  );
}
