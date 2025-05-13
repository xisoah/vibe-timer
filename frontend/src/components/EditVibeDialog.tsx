import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { colorOptions } from '@/components/colorOptions';
import { useVibe } from '@/contexts/VibeContext';

interface EditVibeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName: string;
  initialColor: string;
  onSubmit: (name: string, color: string) => void;
  vibeId: string;
}

const EditVibeDialog: React.FC<EditVibeDialogProps> = ({ open, onOpenChange, initialName, initialColor, onSubmit, vibeId }) => {
  const { deleteVibe } = useVibe();
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      setError('Vibe name cannot be empty');
      return;
    }
    setError('');
    onSubmit(name.trim(), color);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
  <DialogTitle>Edit Vibe</DialogTitle>
  <DialogDescription>Change the name or color for this vibe.</DialogDescription>
</DialogHeader>
        <div className="space-y-4">
          <label className="block text-sm font-medium mb-1" htmlFor="edit-vibe-name">Vibe Name</label>
          <Input
            id="edit-vibe-name"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={32}
            autoFocus
          />
          <div>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((col) => (
                <button
                  key={col.hex}
                  type="button"
                  className={`w-7 h-7 rounded-full border-2 ${color === col.hex ? 'border-primary' : 'border-transparent'}`}
                  style={{ backgroundColor: col.hex }}
                  aria-label={`Pick color ${col.hex}`}
                  onClick={() => setColor(col.hex)}
                >
                  {color === col.hex && <span className="inline-block w-3 h-3 bg-white rounded-full" />}
                </button>
              ))}
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
        <DialogFooter>
          <div className="flex w-full items-center justify-between gap-2">
            <Button type="button" variant="destructive" onClick={() => {
              if (window.confirm('Are you sure you want to delete this vibe? This action cannot be undone.')) {
                deleteVibe(vibeId);
                onOpenChange(false);
              }
            }}>
              Delete Vibe
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditVibeDialog;
