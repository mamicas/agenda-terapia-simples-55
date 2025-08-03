import React, { useState, useMemo, useEffect } from 'react';
import WhatsAppFloat from './WhatsAppFloat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  LogOut, 
  Settings,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  DollarSign,
  ShoppingCart,
  X,
  User,
  MessageCircle
} from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
  onScheduleAppointment: (appointments: Array<{date: string, time: string}>) => void;
}

const Dashboard = ({ onLogout, onScheduleAppointment }: DashboardProps) => {
  const [currentPeriod, setCurrentPeriod] = useState(0); // 0 = próximos 5 dias, 1 = próximos 5, etc
  const [selectedSlots, setSelectedSlots] = useState<Array<{date: string, time: string}>>([]);

  // Simulação de dados - vem do banco
  const sessionPrice = 150;
  const maxAppointments = 4;
  const psychologistInfo = {
    name: "Dra. Maria Silva",
    specialty: "Psicologia Clínica",
    photo: "/placeholder-photo.jpg"
  };

  const appointments = [
    { id: 1, date: "2024-02-15", time: "14:00", status: "confirmed" },
    { id: 2, date: "2024-02-20", time: "16:00", status: "completed" },
  ];

  // Feriados brasileiros 2024/2025
  const brazilianHolidays = [
    '2024-01-01', // Confraternização Universal
    '2024-02-12', // Carnaval
    '2024-02-13', // Carnaval
    '2024-03-29', // Sexta-feira Santa
    '2024-04-21', // Tiradentes
    '2024-05-01', // Dia do Trabalhador
    '2024-09-07', // Independência do Brasil
    '2024-10-12', // Nossa Senhora Aparecida
    '2024-11-02', // Finados
    '2024-11-15', // Proclamação da República
    '2024-12-25', // Natal
    '2025-01-01', // Confraternização Universal
    '2025-03-03', // Carnaval
    '2025-03-04', // Carnaval
    '2025-04-18', // Sexta-feira Santa
    '2025-04-21', // Tiradentes
    '2025-05-01', // Dia do Trabalhador
    '2025-09-07', // Independência do Brasil
    '2025-10-12', // Nossa Senhora Aparecida
    '2025-11-02', // Finados
    '2025-11-15', // Proclamação da República
    '2025-12-25', // Natal
  ];

  const isHoliday = (dateStr: string) => {
    return brazilianHolidays.includes(dateStr);
  };

  // Gerar horários disponíveis para período específico (memoizado para evitar regeneração)
  const availableSlots = useMemo(() => {
    const slots: Array<{date: string, time: string, day: number}> = [];
    const today = new Date();
    
    for (let i = 1 + (currentPeriod * 5); i <= 5 + (currentPeriod * 5); i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Pular finais de semana
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      const dateStr = date.toISOString().split('T')[0];
      const daySlots = [
        '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
      ];
      
      daySlots.forEach(time => {
        // Usar seed baseado na data para horários consistentes
        const seed = `${dateStr}-${time}`;
        const hash = seed.split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0);
        const isBooked = Math.abs(hash) % 10 > 6; // ~30% dos horários ocupados
        
        if (!isBooked) {
          slots.push({ date: dateStr, time, day: date.getDate() });
        }
      });
    }
    
    return slots;
  }, [currentPeriod]);

  const removeSlot = (dateToRemove: string, timeToRemove: string) => {
    setSelectedSlots(selectedSlots.filter(slot => 
      !(slot.date === dateToRemove && slot.time === timeToRemove)
    ));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: '2-digit', 
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCompactDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const handleSlotClick = (date: string, time: string) => {
    console.log('Slot clicado:', { date, time });
    console.log('Slots selecionados antes:', selectedSlots);
    
    const slotKey = `${date}-${time}`;
    const existingIndex = selectedSlots.findIndex(slot => `${slot.date}-${slot.time}` === slotKey);
    
    console.log('Index existente:', existingIndex);
    
    if (existingIndex >= 0) {
      // Remove se já está selecionado
      const newSlots = selectedSlots.filter((_, index) => index !== existingIndex);
      console.log('Removendo slot, novos slots:', newSlots);
      setSelectedSlots(newSlots);
    } else if (selectedSlots.length < maxAppointments) {
      // Adiciona se não atingiu o limite
      const newSlots = [...selectedSlots, { date, time }];
      console.log('Adicionando slot, novos slots:', newSlots);
      setSelectedSlots(newSlots);
    } else {
      console.log('Limite de appointments atingido');
    }
  };

  const isSlotSelected = (date: string, time: string) => {
    return selectedSlots.some(slot => slot.date === date && slot.time === time);
  };

  const goToNextPeriod = () => {
    setCurrentPeriod(currentPeriod + 1);
  };

  const goToPrevPeriod = () => {
    if (currentPeriod > 0) {
      setCurrentPeriod(currentPeriod - 1);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedSlots.length > 0) {
      onScheduleAppointment(selectedSlots);
    }
  };

  const totalPrice = selectedSlots.length * sessionPrice;

  return (
    <div className="px-4 py-4 space-y-4">
        {/* Valor da Sessão */}
        <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="text-sm font-inter text-muted-foreground mb-1">
              Valor por sessão
            </p>
            <div className="flex items-center justify-center space-x-2 text-primary">
              <DollarSign className="w-5 h-5" />
              <span className="text-lg font-inter font-semibold">
                R$ {sessionPrice},00
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Calendário de Agendamentos */}
        <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-sm">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg font-inter">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Horários Disponíveis
              </CardTitle>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPeriod}
                  disabled={currentPeriod === 0}
                  className="p-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPeriod}
                  className="p-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="bg-primary/5 rounded-lg p-3 mt-3">
              <p className="text-sm text-foreground font-inter font-medium text-center">
                👆 Toque nos horários para selecionar até {maxAppointments} sessões
              </p>
              <p className="text-xs text-muted-foreground font-inter text-center mt-1">
                Selecionados: {selectedSlots.length}/{maxAppointments}
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-4">
              {availableSlots.length > 0 ? (
                <div className="space-y-4">
                  {/* Agrupar por data */}
                  {Object.entries(
                    availableSlots.reduce((acc, slot) => {
                      if (!acc[slot.date]) acc[slot.date] = [];
                      acc[slot.date].push(slot);
                      return acc;
                    }, {} as Record<string, Array<{date: string, time: string, day: number}>>)
                  ).map(([date, slots]) => (
                    <div key={date} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-inter font-semibold text-sm text-foreground">
                          {formatDate(date)}
                        </h3>
                        {isHoliday(date) && (
                          <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 border-amber-200">
                            🎉 Feriado
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {slots.map((slot) => (
                          <Button
                            key={`${slot.date}-${slot.time}`}
                            variant={isSlotSelected(slot.date, slot.time) ? "default" : "outline"}
                            className={`h-10 font-inter text-sm transition-all duration-200 ${
                              isSlotSelected(slot.date, slot.time) 
                                ? "bg-primary text-primary-foreground shadow-lg" 
                                : "hover:bg-primary/10"
                            }`}
                            onClick={() => handleSlotClick(slot.date, slot.time)}
                            disabled={!isSlotSelected(slot.date, slot.time) && selectedSlots.length >= maxAppointments}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-inter text-sm">
                    Não há horários disponíveis neste período
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Carrinho de Compras */}
        {selectedSlots.length > 0 && (
          <Card className="border-0 shadow-lg bg-primary/10 backdrop-blur-sm border-primary/20">
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <span className="font-inter font-semibold text-primary text-lg">
                    Suas Sessões Selecionadas
                  </span>
                </div>
              </div>
              
              {/* Lista de Sessões Individuais */}
              <div className="space-y-2 mb-4">
                {selectedSlots.map((slot, index) => (
                  <div 
                    key={`${slot.date}-${slot.time}`}
                    className="bg-card/60 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div>
                        <p className="font-inter font-medium text-sm text-foreground">
                          {formatCompactDate(slot.date)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {slot.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-inter font-semibold text-sm text-primary">
                        R$ {sessionPrice}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSlot(slot.date, slot.time)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total */}
              <div className="bg-card/80 rounded-lg p-4 mb-4 border-2 border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="font-inter font-medium text-foreground">
                    Total ({selectedSlots.length} sessão{selectedSlots.length > 1 ? 'ões' : ''}):
                  </span>
                  <span className="text-xl font-inter font-bold text-primary">
                    R$ {totalPrice},00
                  </span>
                </div>
              </div>
              
              <Button 
                className="w-full font-inter font-semibold" 
                onClick={handleConfirmSelection}
                size="lg"
              >
                Continuar para Pagamento
              </Button>
            </CardContent>
          </Card>
        )}

        <WhatsAppFloat />

      </div>
    );
  };

export default Dashboard;