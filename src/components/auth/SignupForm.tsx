import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty({ message: "Nome é obrigatório" })
    .min(2, { message: "Nome deve ter no mínimo 2 caracteres" })
    .max(100, { message: "Nome muito longo" }),
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
  confirmPassword: z
    .string()
    .nonempty({ message: "Confirme sua senha" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      // TODO: Implementar cadastro real quando backend estiver configurado
      console.log("Signup data:", { ...data, password: "[REDACTED]" });
      
      toast({
        title: "Cadastro simulado",
        description: "Backend ainda não configurado. Redirecionando...",
      });
      
      // Simular cadastro bem-sucedido
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Verifique seus dados e tente novamente",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Seu nome completo"
                  autoComplete="name"
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
                  autoComplete="new-password"
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
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="h-12 text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-12 text-base font-semibold" size="lg">
          Criar Conta
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
