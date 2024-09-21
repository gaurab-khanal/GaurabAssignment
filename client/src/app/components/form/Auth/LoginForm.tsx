"use client"
import { Button } from "@/app/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/app/components/ui/separator";
import Link from "next/link";
import { loginSchema } from "@/schema/Auth";
import { toast } from "@/hooks/use-toast";
import { loginApi } from "@/lib/api/auth/auth";
import { useRouter } from "next/navigation";

type loginFormValue = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const form = useForm<loginFormValue>({
        resolver: zodResolver(loginSchema),
    });



    const router = useRouter();

    const onSubmit = async (data: loginFormValue) => {
        try {
            setLoading(true);
          
              const res = await loginApi(data);
                console.log(res);
            if (res.status === 200) {
                toast({
                    variant: "default",
                    description: res?.data?.message,
                    duration: 1000
                });
                router.push("/dashboard");   
            }
        } catch (error: any) {
            console.log(error);
            toast({
                variant: "destructive",
                description: error?.response?.data?.message || error?.message,
                duration: 1000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[500px] border rounded-xl bg-white p-10 ">
            <div className="flex flex-col space-y-2 pb-2 ">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Log in to your Account
                </h1>
                <p className="text-sm text-black text-muted-foreground">
                    Welcome to Taskify!
                </p>
            </div>
            <Separator />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-2 pt-2 w-full"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email..."
                                        disabled={loading}
                                        {...field}
                                        className="border-[#e5c4c4] rounded-md"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-600" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password..."
                                            disabled={loading}
                                            {...field}
                                            className="border-[#e5c4c4] rounded-md"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="h-4 w-4" aria-hidden="true" />
                                            ) : (
                                                <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                                            )}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-red-600" />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-between">
                        <div
                            className=" text-sm flex gap-2 float-end py-3 underline-offset-4 "
                        >
                            <div>
                                Don't have an account?
                            </div>
                            <Link href={"/signup"} className="hover:underline">
                                Sign up
                            </Link>
                        </div>
                    </div>

                    <Button
                        disabled={loading}
                        className="ml-auto w-full hover:bg-[#FAFAFA] rounded-xl"
                        type="submit"
                        variant={"outline"}
                    >
                        Login
                    </Button>
                </form>
            </Form>
        </div>
    );
}