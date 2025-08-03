import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays } from 'lucide-react';

interface RescheduleDialogProps {
  session: any;
  onReschedule: (sessionId: number, newDate: string, newTime: string) => void;
}

const RescheduleDialog = ({ session, onReschedule }: RescheduleDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const availableTimes = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handleReschedule = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Erro",
        description: "Selecione uma data e horário válidos",
        variant: "destructive"
      });
      return;
    }

    const newDate = selectedDate.toISOString().split('T')[0];
    onReschedule(session.id, newDate, selectedTime);
    setOpen(false);
    setSelectedDate(undefined);
    setSelectedTime('');
    
    toast({
      title: "Sessão reagendada",
      description: `Nova data: ${newDate} às ${selectedTime}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="font-inter text-xs">
          Reagendar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-inter">Reagendar Sessão</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="font-inter text-sm font-medium">Selecione uma nova data</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>
          <div>
            <Label className="font-inter text-sm font-medium">Horário</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um horário" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleReschedule} className="flex-1">
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleDialog;