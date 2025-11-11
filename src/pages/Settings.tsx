import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ClipboardClock, Save, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const settingsSchema = z.object({
  driverName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  vehiclePlate: z.string().min(7, "Placa inválida").max(8, "Placa inválida"),
  costPerKm: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Custo deve ser maior que zero",
  }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock data - em produção virá do backend
  const [settings] = useState({
    driverName: "João Silva",
    vehiclePlate: "ABC1234",
    costPerKm: "1.50",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      console.log("Configurações salvas:", data);
      
      toast({
        title: "Configurações salvas!",
        description: "Suas configurações foram atualizadas com sucesso.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-baseline justify-between max-w-2xl mx-auto px-4 py-2 space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-background">2Mobi</h1>
          </div>
          <h1 className="text-xl text-center font-bold">Configurações</h1>
          <div>&nbsp;</div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Dados do Motorista</CardTitle>
            <CardDescription>
              Configure suas informações e parâmetros operacionais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Nome do Motorista */}
              <div className="space-y-2">
                <Label htmlFor="driverName">Nome do Motorista</Label>
                <Input
                  id="driverName"
                  {...register("driverName")}
                  placeholder="Seu nome completo"
                  className="h-12 text-base"
                />
                {errors.driverName && (
                  <p className="text-sm text-destructive">{errors.driverName.message}</p>
                )}
              </div>

              {/* Placa do Veículo */}
              <div className="space-y-2">
                <Label htmlFor="vehiclePlate">Placa do Veículo</Label>
                <Input
                  id="vehiclePlate"
                  {...register("vehiclePlate")}
                  placeholder="ABC1234"
                  className="h-12 text-base uppercase"
                  maxLength={8}
                />
                {errors.vehiclePlate && (
                  <p className="text-sm text-destructive">{errors.vehiclePlate.message}</p>
                )}
              </div>

              {/* Custo por KM */}
              <div className="space-y-2">
                <Label htmlFor="costPerKm">Custo Operacional por KM (R$)</Label>
                <Input
                  id="costPerKm"
                  {...register("costPerKm")}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="h-12 text-base"
                />
                {errors.costPerKm && (
                  <p className="text-sm text-destructive">{errors.costPerKm.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Este valor será usado para calcular o lucro líquido de cada corrida
                </p>
              </div>

              {/* Botão Salvar */}
              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Salvando..."
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle>Sobre o Custo Operacional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              O custo operacional por quilômetro inclui:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Combustível</li>
              <li>Manutenção do veículo</li>
              <li>Depreciação</li>
              <li>Seguro e taxas</li>
            </ul>
            <p className="mt-4">
              Uma boa estimativa é calcular seus gastos mensais totais e dividir pelos quilômetros rodados no mês.
            </p>
          </CardContent>
        </Card>

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
};

export default Settings;
