import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface ResetTimersButtonProps {
  onReset: () => void;
  disabled?: boolean;
}

const ResetTimersButton: React.FC<ResetTimersButtonProps> = ({ onReset, disabled }) => {
  return (
    <Button
      variant="outline"
      onClick={onReset}
      className={"ml-2 flex items-center " + (disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : "")}
      title="Reset all timers"
      disabled={disabled}
    >
      <RotateCcw className="w-4 h-4 mr-2" />
      Reset
    </Button>
  );
};

export default ResetTimersButton;
