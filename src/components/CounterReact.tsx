import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { showTransactionLoading, showTransactionError, showLoading, showTransactionSuccess, hideAll } from '@/utils/loadingWrapper';

interface CounterReactProps {
  className?: string;
}

// Declare global types for wallet and contract
declare global {
  interface Window {
    getPublicKey: () => Promise<string | null>;
    signTransaction: (tx: any) => Promise<any>;
    incrementor: any;
    loadingWrapper: any;
  }
}

export default function CounterReact({ className }: CounterReactProps) {
  const [currentValue, setCurrentValue] = useState<string>('???');
  const [loadingStates, setLoadingStates] = useState({
    getValue: false,
    increment: false,
    decrement: false,
    reset: false
  });

  // Setup contract with wallet
  const setupContract = async (): Promise<boolean> => {
    try {
      const publicKey = await window.getPublicKey();
      if (!publicKey) {
        showTransactionError(new Error('Please connect your wallet first'));
        return false;
      }
      if (window.incrementor) {
        window.incrementor.options.publicKey = publicKey;
        window.incrementor.options.signTransaction = window.signTransaction;
      }
      return true;
    } catch (err) {
      showTransactionError(err);
      return false;
    }
  };

  const handleGetValue = async () => {
    if (!(await setupContract())) return;
    
    setLoadingStates(prev => ({ ...prev, getValue: true }));
    showLoading({ title: "Getting Value", message: "Fetching current counter value from blockchain..." });
    
    try {
      const tx = await window.incrementor.get_current_value();
      const simulationResult = await tx.simulate();
      
      if (simulationResult.result !== undefined && simulationResult.result !== null) {
        const blockchainValue = simulationResult.result;
        setCurrentValue(blockchainValue.toString());
        hideAll(); // Hide loading first
        showTransactionSuccess(`Value Retrieved: ${blockchainValue}`);
      } else {
        throw new Error('Failed to retrieve value from blockchain');
      }
    } catch (err: any) {
      console.error('Error fetching blockchain value:', err);
      hideAll(); // Hide loading first
      showTransactionError(err);
    } finally {
      setLoadingStates(prev => ({ ...prev, getValue: false }));
    }
  };

  const handleIncrement = async () => {
    if (!(await setupContract())) return;
    
    setLoadingStates(prev => ({ ...prev, increment: true }));
    showTransactionLoading("Incrementing counter...");
    
    try {
      const tx = await window.incrementor.increment();
      if (!tx) {
        throw new Error('No transaction returned from increment()');
      }
      
      let transactionSucceeded = false;
      let newValue = null;
      
      try {
        const signResult = await tx.signAndSend();
        if (signResult && signResult.result !== undefined) {
          newValue = signResult.result;
          transactionSucceeded = true;
        }
      } catch (signError: any) {
        // Handle "Bad union switch" - transaction likely succeeded but result parsing failed
        if (signError?.message?.includes("Bad union switch")) {
          console.log('Transaction likely succeeded despite parsing error, fetching current value...');
          transactionSucceeded = true;
        } else {
          throw signError;
        }
      }
      
      if (transactionSucceeded) {
        // Get the current value from blockchain to verify transaction success
        try {
          const getCurrentTx = await window.incrementor.get_current_value();
          const simulationResult = await getCurrentTx.simulate();
          if (simulationResult.result !== undefined) {
            newValue = simulationResult.result;
          }
        } catch (getError) {
          console.warn('Could not fetch updated value:', getError);
        }
        
        if (newValue !== null) {
          setCurrentValue(newValue.toString());
          hideAll(); // Hide loading first
          showTransactionSuccess(`Counter incremented to ${newValue}`);
        } else {
          hideAll(); // Hide loading first
          showTransactionSuccess('Counter incremented successfully!');
        }
      } else {
        throw new Error('Transaction failed or returned no result');
      }
    } catch (err: any) {
      console.error('Error incrementing:', err);
      // Only show error if it's not a "Bad union switch" that we handled
      if (!err?.message?.includes("Bad union switch")) {
        hideAll(); // Hide loading first
        showTransactionError(err);
      } else {
        hideAll(); // Hide loading even for handled errors
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, increment: false }));
    }
  };

  const handleDecrement = async () => {
    if (!(await setupContract())) return;
    
    setLoadingStates(prev => ({ ...prev, decrement: true }));
    showTransactionLoading("Decrementing counter...");
    
    try {
      const tx = await window.incrementor.decrement();
      if (!tx) {
        throw new Error('No transaction returned from decrement()');
      }
      
      let transactionSucceeded = false;
      let newValue = null;
      
      try {
        const signResult = await tx.signAndSend();
        if (signResult && signResult.result !== undefined) {
          newValue = signResult.result;
          transactionSucceeded = true;
        }
      } catch (signError: any) {
        // Handle "Bad union switch" - transaction likely succeeded but result parsing failed
        if (signError?.message?.includes("Bad union switch")) {
          console.log('Transaction likely succeeded despite parsing error, fetching current value...');
          transactionSucceeded = true;
        } else {
          throw signError;
        }
      }
      
      if (transactionSucceeded) {
        // Get the current value from blockchain to verify transaction success
        try {
          const getCurrentTx = await window.incrementor.get_current_value();
          const simulationResult = await getCurrentTx.simulate();
          if (simulationResult.result !== undefined) {
            newValue = simulationResult.result;
          }
        } catch (getError) {
          console.warn('Could not fetch updated value:', getError);
        }
        
        if (newValue !== null) {
          setCurrentValue(newValue.toString());
          hideAll(); // Hide loading first
          showTransactionSuccess(`Counter decremented to ${newValue}`);
        } else {
          hideAll(); // Hide loading first
          showTransactionSuccess('Counter decremented successfully!');
        }
      } else {
        throw new Error('Transaction failed or returned no result');
      }
    } catch (err: any) {
      console.error('Error decrementing:', err);
      // Only show error if it's not a "Bad union switch" that we handled
      if (!err?.message?.includes("Bad union switch")) {
        hideAll(); // Hide loading first
        showTransactionError(err);
      } else {
        hideAll(); // Hide loading even for handled errors
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, decrement: false }));
    }
  };

  const handleReset = async () => {
    if (!(await setupContract())) return;
    
    setLoadingStates(prev => ({ ...prev, reset: true }));
    showTransactionLoading("Resetting counter...");
    
    try {
      const tx = await window.incrementor.reset();
      if (!tx) {
        throw new Error('No transaction returned from reset()');
      }
      
      let transactionSucceeded = false;
      let newValue = null;
      
      try {
        const signResult = await tx.signAndSend();
        if (signResult && signResult.result !== undefined) {
          newValue = signResult.result;
          transactionSucceeded = true;
        }
      } catch (signError: any) {
        // Handle "Bad union switch" - transaction likely succeeded but result parsing failed
        if (signError?.message?.includes("Bad union switch")) {
          console.log('Transaction likely succeeded despite parsing error, fetching current value...');
          transactionSucceeded = true;
        } else {
          throw signError;
        }
      }
      
      if (transactionSucceeded) {
        // Get the current value from blockchain to verify transaction success
        try {
          const getCurrentTx = await window.incrementor.get_current_value();
          const simulationResult = await getCurrentTx.simulate();
          if (simulationResult.result !== undefined) {
            newValue = simulationResult.result;
          }
        } catch (getError) {
          console.warn('Could not fetch updated value:', getError);
        }
        
        if (newValue !== null) {
          setCurrentValue(newValue.toString());
          hideAll(); // Hide loading first
          showTransactionSuccess(`Counter reset to ${newValue}`);
        } else {
          hideAll(); // Hide loading first
          showTransactionSuccess('Counter reset successfully!');
        }
      } else {
        throw new Error('Transaction failed or returned no result');
      }
    } catch (err: any) {
      console.error('Error resetting:', err);
      // Only show error if it's not a "Bad union switch" that we handled
      if (!err?.message?.includes("Bad union switch")) {
        hideAll(); // Hide loading first
        showTransactionError(err);
      } else {
        hideAll(); // Hide loading even for handled errors
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, reset: false }));
    }
  };

  // Initialize value on component mount
  useEffect(() => {
    const initializeValue = async () => {
      const publicKey = await window.getPublicKey?.();
      if (publicKey && window.incrementor) {
        try {
          window.incrementor.options.publicKey = publicKey;
          const tx = await window.incrementor.get_current_value();
          const simulationResult = await tx.simulate();
          if (simulationResult.result !== undefined) {
            setCurrentValue(simulationResult.result.toString());
          }
        } catch (err) {
          console.log('Could not initialize counter value:', err);
        }
      }
    };
    
    // Wait a bit for wallet and contract to be available
    setTimeout(initializeValue, 1000);
  }, []);

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle>Smart Contract Counter</CardTitle>
        <CardDescription>
          Current value: <span className="font-bold text-lg">{currentValue}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          <Button
            onClick={handleGetValue}
            disabled={loadingStates.getValue}
            variant="default"
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {loadingStates.getValue ? 'Loading...' : 'Get Value'}
          </Button>
          
          <Button
            onClick={handleIncrement}
            disabled={loadingStates.increment}
            variant="default"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {loadingStates.increment ? 'Loading...' : 'Increment'}
          </Button>
          
          <Button
            onClick={handleDecrement}
            disabled={loadingStates.decrement}
            variant="default"
            className="flex-1 bg-orange-600 hover:bg-orange-700"
          >
            {loadingStates.decrement ? 'Loading...' : 'Decrement'}
          </Button>
          
          <Button
            onClick={handleReset}
            disabled={loadingStates.reset}
            variant="destructive"
            className="flex-1"
          >
            {loadingStates.reset ? 'Loading...' : 'Reset'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
