
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface AddVibeDialogProps {
  onAddVibe: (name: string, color: string) => void;
  disabled?: boolean;
}

import { getVibeColor } from '@/utils/vibeColor';

import { colorOptions } from './colorOptions';

const AddVibeDialog: React.FC<AddVibeDialogProps> = ({ onAddVibe, disabled }) => {
  const [open, setOpen] = useState(false);
  const [vibeName, setVibeName] = useState('');
  const [error, setError] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].hex);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vibeName.trim()) {
      setError('Vibe name cannot be empty');
      return;
    }
    if (!selectedColor) {
      setError('Please select a color');
      return;
    }
    onAddVibe(vibeName.trim(), selectedColor);
    setVibeName('');
    setError('');
    setSelectedColor(colorOptions[0].hex);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className={"flex items-center gap-2 " + (disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : "")} disabled={disabled}>
          <Plus className="w-4 h-4" />
          Add Vibe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new vibe</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                id="name"
                value={vibeName}
                onChange={(e) => {
                  setVibeName(e.target.value);
                  setError('');
                }}
                className={error ? "border-red-500" : ""}
                autoComplete="off"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <div className="grid gap-2">
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((col) => (
  <button
    key={col.hex}
    type="button"
    className={`w-7 h-7 rounded-full border-2 ${selectedColor === col.hex ? 'border-primary' : 'border-transparent'}`}
    style={{ backgroundColor: col.hex }}
    aria-label={`Pick color ${col.hex}`}
    onClick={() => setSelectedColor(col.hex)}
  >
    {selectedColor === col.hex && <span className="inline-block w-3 h-3 bg-white rounded-full" />}
  </button>
))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Vibe</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVibeDialog;
