import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calculator, ClipboardClock, Save, Settings, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const rideSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente"),
  distance: z.string().min(1, "Digite a distância").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Distância deve ser maior que 0",
  }),
  grossValue: z.string().min(1, "Digite o valor bruto").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Valor deve ser maior que 0",
  }),
});

type RideForm = z.infer<typeof rideSchema>;

// Mock data - será substituído com dados reais do backend
const mockClients = [
  { id: "1", name: "João Silva" },
  { id: "2", name: "Maria Santos" },
  { id: "3", name: "Pedro Costa" },
  { id: "4", name: "Ana Oliveira" },
];

const COST_PER_KM = 2.5; // Mock - virá das configurações

export default function NewRide() {
  const navigate = useNavigate();
  const [netProfit, setNetProfit] = useState<number | null>(null);
  const [selectedClient, setSelectedClient] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<RideForm>({
    resolver: zodResolver(rideSchema),
  });

  const distance = watch("distance");
  const grossValue = watch("grossValue");

  const calculateProfit = () => {
    if (distance && grossValue) {
      const distanceNum = Number(distance);
      const grossValueNum = Number(grossValue);
      const cost = distanceNum * COST_PER_KM;
      const profit = grossValueNum - cost;
      setNetProfit(profit);
    }
  };

  const onSubmit = (data: RideForm) => {
    // Mock save - será implementado com backend
    console.log("Saving ride:", data);
    toast({
      title: "Corrida registrada!",
      description: `Lucro líquido: R$ ${netProfit?.toFixed(2)}`,
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-baseline justify-between max-w-2xl mx-auto px-4 py-2 space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-background">2Mobi</h1>
          </div>
          <h1 className="text-xl text-center font-bold">Nova Corrida</h1>
          <Link to="/settings">
            <Button variant="secondary" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Cliente */}
          <div className="space-y-2">
            <Label htmlFor="client">Cliente</Label>
            <Select
              value={selectedClient}
              onValueChange={(value) => {
                setSelectedClient(value);
                setValue("clientId", value);
              }}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && (
              <p className="text-sm text-destructive">{errors.clientId.message}</p>
            )}
          </div>

          {/* Distância */}
          <div className="space-y-2">
            <Label htmlFor="distance">Distância (km)</Label>
            <Input
              id="distance"
              type="number"
              step="0.1"
              placeholder="0.0"
              className="h-12 text-base"
              {...register("distance")}
            />
            {errors.distance && (
              <p className="text-sm text-destructive">{errors.distance.message}</p>
            )}
          </div>

          {/* Valor Bruto */}
          <div className="space-y-2">
            <Label htmlFor="grossValue">Valor Bruto (R$)</Label>
            <Input
              id="grossValue"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="h-12 text-base"
              {...register("grossValue")}
            />
            {errors.grossValue && (
              <p className="text-sm text-destructive">{errors.grossValue.message}</p>
            )}
          </div>

          {/* Botão Calcular */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 text-base"
            onClick={calculateProfit}
          >
            <Calculator className="h-5 w-5 mr-2" />
            Calcular Lucro Líquido
          </Button>

          {/* Lucro Líquido */}
          {netProfit !== null && (
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="text-lg">Lucro Líquido</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold ${netProfit >= 0 ? "text-primary" : "text-destructive"}`}>
                  R$ {netProfit.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Custo: R$ {(Number(distance || 0) * COST_PER_KM).toFixed(2)} ({COST_PER_KM.toFixed(2)}/km)
                </p>
              </CardContent>
            </Card>
          )}

          {/* Botão Salvar */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            disabled={netProfit === null}
          >
            <Save className="h-5 w-5 mr-2" />
            Salvar Corrida
          </Button>
        </form>

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
      </main>
    </div>
  );
}
