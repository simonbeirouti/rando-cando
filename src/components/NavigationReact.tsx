import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Wallet } from 'lucide-react';
import '../types/global.d.ts'; // Import TypeScript declarations for appkit-button

interface NavigationReactProps {
  className?: string;
}

// Declare global types for wallet functions
declare global {
  interface Window {
    getPublicKey: () => Promise<string | null>;
    connect: (callback?: () => Promise<void>) => Promise<void>;
    disconnect: (callback?: () => Promise<void>) => Promise<void>;
  }
}

export default function NavigationReact({ className }: NavigationReactProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check wallet connection status
  const updateWalletState = async () => {
    try {
      const key = await window.getPublicKey?.();
      setPublicKey(key);
      setIsConnected(!!key);
    } catch (error) {
      console.error('Error checking wallet state:', error);
      setIsConnected(false);
      setPublicKey(null);
    }
  };

  // Connect wallet
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await window.connect?.(updateWalletState);
      await updateWalletState();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const handleDisconnect = async () => {
    try {
      await window.disconnect?.(updateWalletState);
      await updateWalletState();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  // Initialize wallet state on component mount
  useEffect(() => {
    const initializeWallet = async () => {
      // Wait a bit for wallet functions to be available
      setTimeout(updateWalletState, 1000);
    };
    
    initializeWallet();
    
    // Listen for wallet state changes
    const handleWalletChange = () => updateWalletState();
    window.addEventListener('walletConnected', handleWalletChange);
    window.addEventListener('walletDisconnected', handleWalletChange);
    
    return () => {
      window.removeEventListener('walletConnected', handleWalletChange);
      window.removeEventListener('walletDisconnected', handleWalletChange);
    };
  }, []);

  // Format public key for display
  const formatPublicKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  const navigationLinks = [
    { href: '/', label: 'Home' },
  ];

  return (
    <nav className={`bg-gray-900/50 backdrop-blur-sm border-b border-purple-300/20 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-white hover:text-purple-300 transition-colors">
              DeFi Unite
            </a>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
            {/* Stellar Wallet Button */}
            <Button 
              className={isConnected ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"}
              onClick={isConnected ? handleDisconnect : handleConnect}
              disabled={isConnecting}
              size="sm"
            >
              <Wallet size={16} className="mr-2" />
              <span className="text-xs">XLM</span>
              <span className="ml-1">
                {isConnecting ? 'Connecting...' : isConnected ? (publicKey ? formatPublicKey(publicKey) : 'Connected') : 'Connect'}
              </span>
            </Button>
            {/* Reown AppKit EVM Wallet Button */}
            <div className="flex items-center">
              <appkit-button />
            </div>
          </div>
          
          {/* Mobile menu and wallet buttons */}
          <div className="md:hidden flex items-center gap-2">
            {/* Stellar Wallet Button */}
            <Button
              size="sm"
              className={isConnected ? "bg-green-600 hover:bg-green-700 p-2" : "bg-purple-600 hover:bg-purple-700 p-2"}
              onClick={isConnected ? handleDisconnect : handleConnect}
              disabled={isConnecting}
              aria-label={isConnected ? 'Disconnect Stellar Wallet' : 'Connect Stellar Wallet'}
            >
              <Wallet size={16} />
            </Button>
            {/* Reown AppKit EVM Wallet Button - Mobile */}
            <div className="flex items-center">
              <appkit-button />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800/80 backdrop-blur-sm rounded-lg mt-2">
              {navigationLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-700/50 px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
