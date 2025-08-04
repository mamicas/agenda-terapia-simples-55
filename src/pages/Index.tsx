import React, { useState } from 'react';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import MySessions from '@/components/MySessions';
import AppointmentConfirmation from '@/components/AppointmentConfirmation';
import PaymentScreen from '@/components/PaymentScreen';
import ConfirmationScreen from '@/components/ConfirmationScreen';
import TopBar from '@/components/TopBar';

type AppState = 'login' | 'dashboard' | 'sessions' | 'confirmation' | 'payment' | 'success';

const Index = () => {
  console.log('Index.tsx renderizando - Debug');
  
  const [currentState, setCurrentState] = useState<AppState>('login');
  const [selectedSlots, setSelectedSlots] = useState<Array<{
    date: string;
    time: string;
  }>>([]);
  const [paymentData, setPaymentData] = useState<any>(null);

  const sessionPrice = 150;

  const handleLogin = (email: string, password: string) => {
    console.log('Login:', { email, password });
    setCurrentState('dashboard');
  };

  const handleLogout = () => {
    setCurrentState('login');
    setSelectedSlots([]);
    setPaymentData(null);
  };

  const handleScheduleAppointment = (appointments: Array<{date: string, time: string}>) => {
    setSelectedSlots(appointments);
    setCurrentState('confirmation');
  };

  const handleConfirmAppointments = () => {
    setCurrentState('payment');
  };

  const handleBackToConfirmation = () => {
    setCurrentState('dashboard');
  };

  const handleBackToDashboard = () => {
    setCurrentState('dashboard');
  };

  const handlePaymentComplete = (payment: any) => {
    setPaymentData(payment);
    setCurrentState('success');
  };

  const handleBackToHome = () => {
    setCurrentState('dashboard');
    setSelectedSlots([]);
    setPaymentData(null);
  };

  const handleMySessionsClick = () => {
    setCurrentState('sessions');
  };

  const handleBackFromSessions = () => {
    setCurrentState('dashboard');
  };

  return (
    <div className="font-inter">
      {currentState === 'login' && (
        <Login onLogin={handleLogin} />
      )}
      
      {currentState !== 'login' && (
        <TopBar
          title={
            currentState === 'sessions' ? 'Minhas Sessões' :
            currentState === 'confirmation' ? 'Confirmar Agendamentos' :
            currentState === 'payment' ? 'Pagamento' :
            currentState === 'success' ? 'Confirmação' : undefined
          }
          subtitle={
            currentState === 'sessions' ? 'Histórico e próximas consultas' :
            currentState === 'confirmation' ? 'Revise suas sessões selecionadas' :
            currentState === 'payment' ? 'Finalize seu agendamento' :
            currentState === 'success' ? 'Agendamento realizado com sucesso' : undefined
          }
          showBackButton={currentState === 'sessions' || currentState === 'confirmation'}
          onBack={currentState === 'sessions' ? handleBackFromSessions : handleBackToConfirmation}
          onMySessionsClick={currentState !== 'sessions' ? handleMySessionsClick : undefined}
          onLogout={handleLogout}
          currentPage={currentState === 'dashboard' ? 'dashboard' : currentState === 'sessions' ? 'sessions' : 'other'}
        />
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-primary-light/20 via-background to-secondary/30">
        {currentState === 'dashboard' && (
          <Dashboard 
            onLogout={handleLogout}
            onScheduleAppointment={handleScheduleAppointment}
          />
        )}
        
        {currentState === 'sessions' && (
          <MySessions onBack={handleBackFromSessions} />
        )}
        
        {currentState === 'confirmation' && selectedSlots.length > 0 && (
          <AppointmentConfirmation
            selectedSlots={selectedSlots}
            sessionPrice={sessionPrice}
            onConfirm={handleConfirmAppointments}
            onBack={handleBackToConfirmation}
          />
        )}

        {currentState === 'payment' && selectedSlots.length > 0 && (
          <PaymentScreen
            selectedSlots={selectedSlots}
            totalPrice={selectedSlots.length * sessionPrice}
            sessionPrice={sessionPrice}
            onBack={handleBackToDashboard}
            onPaymentComplete={handlePaymentComplete}
          />
        )}

        {currentState === 'success' && paymentData && (
          <ConfirmationScreen
            paymentData={paymentData}
            sessionPrice={sessionPrice}
            onBackToHome={handleBackToHome}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
