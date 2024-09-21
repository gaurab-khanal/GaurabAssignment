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
import { signupSchema } from "@/schema/Auth";
import { toast } from "@/hooks/use-toast";
import {  signupApi } from "@/lib/api/auth/auth";
import { useRouter } from "next/navigation";

type signupFormValue = z.infer<typeof signupSchema>;

export default function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<signupFormValue>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: signupFormValue) => {
        try {
            setLoading(true);
          
              const res = await signupApi(data);

            if (res.status === 201) {
                toast({
                    variant: "default",
                    description: res.data.message,
                    duration: 1000,
                });
                router.push("/dashboard");   
            }
        } catch (error: any) {

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
                    Create an account
                </h1>
                <p className="text-sm  text-black text-muted-foreground">
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Enter your name..."
                                        disabled={loading}
                                        {...field}
                                        className="border-[#e5c4c4] rounded-md"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-600"/>
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
                                        placeholder="Enter your email..."
                                        disabled={loading}
                                        {...field}
                                        className="border-[#e5c4c4] rounded-md"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-600"/>
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
                                            <span className="sr-only">
                                                {showPassword ? "Hide password" : "Show password"}
                                            </span>
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-red-600"/>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
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
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeIcon className="h-4 w-4" aria-hidden="true" />
                                            ) : (
                                                <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                                            )}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-red-600"/>
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-between">
                        <div
                            className=" text-sm flex gap-2 float-end py-3 underline-offset-4 "
                        >
                            <div>
                                Already have an account?
                            </div>
                            <Link href={"/"} className="hover:underline">
                                Login
                            </Link>
                        </div>
                    </div>

                    <Button
                        disabled={loading}
                        className="ml-auto w-full hover:bg-[#FAFAFA] rounded-xl"
                        type="submit"
                        variant={"outline"}
                    >
                        Signup
                    </Button>
                </form>
            </Form>
        </div>
    );
}