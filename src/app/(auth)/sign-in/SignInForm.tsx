'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { signInAction } from '@/app/actions/sign-in';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signInSchema } from '@/lib/schemas/auth';

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(signInSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    setError('');
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) =>
        formData.append(k, v as string),
      );
      const res = await signInAction(formData);
      if (res?.error) setError(formatError(res.error));
      else if (res.success) router.replace('/dashboard');
    });
  };

  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-lg p-2 lg:max-w-sm xl:max-w-xl 2xl:max-w-2xl">
        <Card className="px-2 py-12">
          <CardHeader>
            <div className="w-full text-center">
              <CardTitle className="text-3xl">Nexiam Admin Panel</CardTitle>
            </div>
            <CardDescription>
              <div className="my-6 flex items-center">
                <div className="border-muted flex-1 border-t" />
                <span className="text-muted-foreground mx-3 text-sm">
                  Please sign in to continue.
                </span>
                <div className="border-muted flex-1 border-t" />
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Email"
                          type="email"
                          autoComplete="email"
                        />
                      </FormControl>
                      <div className="min-h-[20px] transition-all">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="Password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                            aria-label={
                              showPassword ? 'Hide password' : 'Show password'
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                {/* Sign In Button */}
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || isPending}
                  className="mt-6 w-full py-6 text-lg"
                >
                  {isPending ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        {/* Error */}
        <div className="mt-8 min-h-[56px]">
          {error && (
            <div className="text-muted-foreground flex items-center gap-2 rounded-sm bg-gray-100 px-4 py-4 text-sm">
              <Info className="h-5 w-5" />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatError(error: string): string {
  if (!error) return 'An unknown error occurred.';

  // Find the last colon (to handle cases like: "SomeException: Blah: Real message")
  const parts = error.split(':');
  let message =
    parts.length > 1 ? parts.slice(1).join(':').trim() : error.trim();

  // For Lambda exception, remove the extra "PreTokenGeneration failed with error"
  if (
    error.includes('UserLambdaValidationException') &&
    message.startsWith('PreTokenGeneration failed with error')
  ) {
    message = message
      .replace('PreTokenGeneration failed with error', '')
      .trim();
    // Remove leading ":" or whitespace if present
    message = message.replace(/^[:\s]+/, '');
  }

  return message || 'An error occurred. Please try again.';
}
