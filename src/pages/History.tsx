import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ClipboardClock, Filter, Search, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data - será substituído com dados reais do backend
const mockRides = [
  {
    id: "1",
    date: "2025-11-07T10:30:00",
    clientId: "1",
    clientName: "João Silva",
    distance: 15.5,
    grossValue: 85.00,
    cost: 38.75,
    netProfit: 46.25,
  },
  {
    id: "2",
    date: "2025-11-07T14:15:00",
    clientId: "2",
    clientName: "Maria Santos",
    distance: 8.2,
    grossValue: 45.00,
    cost: 20.50,
    netProfit: 24.50,
  },
  {
    id: "3",
    date: "2025-11-06T09:00:00",
    clientId: "3",
    clientName: "Pedro Costa",
    distance: 22.0,
    grossValue: 120.00,
    cost: 55.00,
    netProfit: 65.00,
  },
  {
    id: "4",
    date: "2025-11-06T16:45:00",
    clientId: "1",
    clientName: "João Silva",
    distance: 12.3,
    grossValue: 70.00,
    cost: 30.75,
    netProfit: 39.25,
  },
  {
    id: "5",
    date: "2025-11-05T11:20:00",
    clientId: "4",
    clientName: "Ana Oliveira",
    distance: 18.7,
    grossValue: 95.00,
    cost: 46.75,
    netProfit: 48.25,
  },
];

const mockClients = [
  { id: "1", name: "João Silva" },
  { id: "2", name: "Maria Santos" },
  { id: "3", name: "Pedro Costa" },
  { id: "4", name: "Ana Oliveira" },
];

export default function History() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredRides = useMemo(() => {
    return mockRides.filter((ride) => {
      // Filtro por cliente
      if (selectedClient !== "all" && ride.clientId !== selectedClient) {
        return false;
      }

      // Filtro por busca (nome do cliente)
      if (searchTerm && !ride.clientName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filtro por data
      const rideDate = new Date(ride.date);
      if (startDate) {
        const start = new Date(startDate);
        if (rideDate < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (rideDate > end) return false;
      }

      return true;
    });
  }, [searchTerm, selectedClient, startDate, endDate]);

  const totalRides = filteredRides.length;
  const totalProfit = filteredRides.reduce((sum, ride) => sum + ride.netProfit, 0);
  const totalGrossValue = filteredRides.reduce((sum, ride) => sum + ride.grossValue, 0);
  const totalDistance = filteredRides.reduce((sum, ride) => sum + ride.distance, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-baseline justify-between max-w-2xl mx-auto px-4 py-2 space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-background">2Mobi</h1>
          </div>
          <h1 className="text-xl font-bold">Histórico de Corridas</h1>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <div className="p-4 space-y-4 animate-fade-in">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cliente */}
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Todos os clientes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os clientes</SelectItem>
                      {mockClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Data Inicial */}
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data Inicial</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="pl-10 h-10"
                    />
                  </div>
                </div>

                {/* Data Final */}
                <div className="space-y-2">
                  <Label htmlFor="endDate">Data Final</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="pl-10 h-10"
                    />
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedClient("all");
                      setStartDate("");
                      setEndDate("");
                    }}
                  >
                    Limpar Filtros
                  </Button>
                  <Button className="flex-1" onClick={() => setShowFilters(false)}>
                    Aplicar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Totalizadores */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total de Corridas</p>
                <p className="text-2xl font-bold text-foreground">{totalRides}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Lucro Total</p>
                <p className="text-2xl font-bold text-primary">R$ {totalProfit.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Valor Bruto</p>
                <p className="text-xl font-semibold text-foreground">R$ {totalGrossValue.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Distância Total</p>
                <p className="text-xl font-semibold text-foreground">{totalDistance.toFixed(1)} km</p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Corridas */}
          {filteredRides.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Nenhuma corrida encontrada</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredRides.map((ride) => (
                <Card key={ride.id} className="hover-scale">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-foreground">{ride.clientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(ride.date)} às {formatTime(ride.date)}
                        </p>
                      </div>
                      <Badge variant={ride.netProfit >= 0 ? "default" : "destructive"}>
                        R$ {ride.netProfit.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Distância</p>
                        <p className="font-medium text-foreground">{ride.distance} km</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Valor Bruto</p>
                        <p className="font-medium text-foreground">R$ {ride.grossValue.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Custo</p>
                        <p className="font-medium text-foreground">R$ {ride.cost.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-around">
            <Link to="/dashboard" className="flex flex-col items-center gap-1">
              <div className="p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Início</span>
            </Link>

            <Link to="/clients" className="flex flex-col items-center gap-1">
              <div className="p-2 rounded-lg">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">Clientes</span>
            </Link>

            <Link to="/history" className="flex flex-col items-center gap-1">
              <div className="p-2 rounded-lg bg-primary/10">
                <ClipboardClock className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs text-primary">Histórico</span>
            </Link>
          </div>
        </nav>
      </main>
    </div>
  );
}