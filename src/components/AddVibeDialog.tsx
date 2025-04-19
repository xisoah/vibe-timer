
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
  onAddVibe: (name: string) => void;
}

const AddVibeDialog: React.FC<AddVibeDialogProps> = ({ onAddVibe }) => {
  const [open, setOpen] = useState(false);
  const [vibeName, setVibeName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vibeName.trim()) {
      setError('Vibe name cannot be empty');
      return;
    }
    
    onAddVibe(vibeName.trim());
    setVibeName('');
    setError('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Vibe</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new vibe</DialogTitle>
          <DialogDescription>
            Create a new vibe to track your time. Give it a descriptive name.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Vibe name</Label>
              <Input
                id="name"
                value={vibeName}
                onChange={(e) => {
                  setVibeName(e.target.value);
                  setError('');
                }}
                placeholder="e.g., Reading, Meditation, Gaming"
                className={error ? "border-red-500" : ""}
                autoComplete="off"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
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
