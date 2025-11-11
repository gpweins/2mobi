import { Link } from "react-router-dom";
import { Plus, Settings, Users, ClipboardClock, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock data - será substituído por dados reais do backend
const mockData = {
  today: {
    profit: 250.0,
    rides: 5,
  },
  month: {
    profit: 3450.0,
    rides: 89,
  },
  recentRides: [
    {
      id: 1,
      customer: "João Silva",
      distance: 12,
      grossValue: 45.0,
      profit: 33.0,
      time: "14:30",
    },
    {
      id: 2,
      customer: "Maria Santos",
      distance: 8,
      grossValue: 32.0,
      profit: 24.0,
      time: "12:15",
    },
    {
      id: 3,
      customer: "Pedro Costa",
      distance: 15,
      grossValue: 58.0,
      profit: 43.0,
      time: "10:45",
    },
  ],
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-baseline justify-between max-w-2xl mx-auto px-4 py-2 space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-background">2Mobi</h1>
          </div>
          <Link to="/settings">
            <Button variant="secondary" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Resumo do Dia */}
        <Card className="bg-primary text-primary-foreground animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-3xl font-bold">
                  R$ {mockData.today.profit.toFixed(2)}
                </span>
              </div>
              <p className="text-sm opacity-90">{mockData.today.rides} corridas realizadas</p>
            </div>
          </CardContent>
        </Card>

        {/* Resumo do Mês */}
        <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Este Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold text-foreground">
                  R$ {mockData.month.profit.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {mockData.month.rides} corridas realizadas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botão Nova Corrida */}
        <Link to="/newride" className="block animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Button className="w-full h-14 text-base font-semibold" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Nova Corrida
          </Button>
        </Link>

        {/* Últimas Corridas */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Últimas Corridas</h2>
            <Link to="/history">
              <Button variant="ghost" size="sm" className="text-primary">
                Ver todas
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {mockData.recentRides.map((ride, index) => (
              <Card
                key={ride.id}
                className="hover-scale cursor-pointer"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{ride.time}</span>
                      </div>
                      <p className="font-semibold text-foreground">{ride.customer}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{ride.distance}km</span>
                        <span>•</span>
                        <span>R$ {ride.grossValue.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Lucro</p>
                      <p className="text-lg font-bold text-primary">
                        R$ {ride.profit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-around">
          <Link to="/dashboard" className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-primary">Início</span>
          </Link>

          <Link to="/clients" className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-lg">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">Clientes</span>
          </Link>

          <Link to="/history" className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-lg">
              <ClipboardClock className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">Histórico</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
