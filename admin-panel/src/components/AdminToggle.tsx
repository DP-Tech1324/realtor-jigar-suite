
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AdminToggle = () => {
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = React.useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    localStorage.setItem('isAdmin', checked.toString());
    
    toast({
      title: checked ? "Admin Mode Enabled" : "Admin Mode Disabled",
      description: checked 
        ? "You now have administrator privileges." 
        : "Administrator privileges have been removed."
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="admin-mode"
        checked={isEnabled}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="admin-mode" className="text-sm font-medium">
        Admin Mode
      </Label>
    </div>
  );
};

export default AdminToggle;
