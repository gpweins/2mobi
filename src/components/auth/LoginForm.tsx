import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty({ message: "Email é obrigatório" })
    .email({ message: "Email inválido" })
    .max(255, { message: "Email muito longo" }),
  password: z
    .string()
    .nonempty({ message: "Senha é obrigatória" })
    .min(6, { message: "Senha deve ter no mínimo 6 caracteres" })
    .max(100, { message: "Senha muito longa" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // TODO: Implementar autenticação real quando backend estiver configurado
      console.log("Login data:", data);
      
      toast({
        title: "Login simulado",
        description: "Backend ainda não configurado. Redirecionando...",
      });
      
      // Simular login bem-sucedido
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className="h-12 text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-12 text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-12 text-base font-semibold" size="lg">
          Entrar
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
