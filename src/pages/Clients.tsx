import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ClipboardClock, Pencil, Plus, Search, Trash2, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const clientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  address: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface Client extends ClientFormData {
  id: string;
}

const Clients = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([
    { id: "1", name: "João Silva", phone: "(11) 98765-4321", address: "Rua A, 123" },
    { id: "2", name: "Maria Santos", phone: "(11) 98765-1234", address: "Av. B, 456" },
    { id: "3", name: "Pedro Oliveira", phone: "(11) 98765-5678", address: "Rua C, 789" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: editingClient || {},
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const onSubmit = (data: ClientFormData) => {
    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...data } : c));
      toast({ title: "Cliente atualizado com sucesso!" });
    } else {
      const newClient = { ...data, id: Date.now().toString() };
      setClients([...clients, newClient]);
      toast({ title: "Cliente adicionado com sucesso!" });
    }
    setIsDialogOpen(false);
    setEditingClient(null);
    reset();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    reset(client);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
    toast({ title: "Cliente removido com sucesso!" });
  };

  const handleAddNew = () => {
    setEditingClient(null);
    reset({ name: "", phone: "", address: "" });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-baseline justify-between max-w-2xl mx-auto px-4 py-2 space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-background">2Mobi</h1>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Clientes</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-1" />
                Novo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingClient ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" {...register("phone")} placeholder="(11) 98765-4321" />
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <Label htmlFor="address">Endereço (opcional)</Label>
                  <Input id="address" {...register("address")} />
                </div>
                <Button type="submit" className="w-full">
                  {editingClient ? "Atualizar" : "Adicionar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Clients List */}
        <div className="px-4 space-y-3">
          {filteredClients.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
              </CardContent>
            </Card>
          ) : (
            filteredClients.map((client) => (
              <Card key={client.id} className="animate-fade-in">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{client.name}</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(client)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(client.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-muted-foreground">
                  <p>📱 {client.phone}</p>
                  {client.address && <p>📍 {client.address}</p>}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-around">
            <Link to="/dashboard" className="flex flex-col items-center gap-1">
              <div className="p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">Início</span>
            </Link>

            <Link to="/clients" className="flex flex-col items-center gap-1">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5  text-primary" />
              </div>
              <span className="text-xs font-medium text-primary">Clientes</span>
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

export default Clients;
