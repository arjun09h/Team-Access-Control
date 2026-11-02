"use client"
import { apiClient } from "@/app/lib/apiClient";
import Link from "next/link";
import { useActionState } from "react";
export type LoginState = {
    error?:string;
    success?:boolean;
}
const LoginPage = ()=>{
    const [state,loginAction,isPending] = useActionState(
        async (prevState:LoginState,
            formdata:FormData
        ):Promise<LoginState> =>{
            const email = formdata.get("email") as string;
            const password = formdata.get("password") as string;
            try {
                await apiClient.login(
                     email,
                    password,
                );
                window.location.href = "/dashboard";

                return {
                    success:true,
                }

            } catch (error) {
                return{
                    error: error instanceof Error? error.message:"Login Failed",
                }
            }
        },
        {error:undefined,success:undefined}

    );
    return(
        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 w-full max-w-md">


            <form action={loginAction}>
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Sign in to your account</h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Or <Link href="/register" className="font-medium text-blue-400 hover:text-blue-300"> Create a new Account</Link>
                    </p>
                </div>
                {state?.error && (
                    <div className="text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded mb-4">
                        {state.error}
                    </div>
                )}  
                <div className="flex flex-col space-y-4">
                    
                    <div>
                        <label 
                        htmlFor="email"
                        className="block text-slate-300 font-medium text-sm mb-1"
                        >Email</label>
                        <input 
                        id="email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        placeholder="Enter Your Email"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
                        />
                    </div>
                    <div>
                        <label 
                        htmlFor="password"
                        className="block text-slate-300 font-medium text-sm mb-1"
                        >Password</label>
                        <input 
                        id="password"
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        required
                        placeholder="Create a Password"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
                        />
                    </div>
                    
                </div>

                <button type="submit" disabled = {isPending} className="w-full px-4 py-2 mt-4 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    {isPending ? 'Loading...' : 'Sign In'}
                </button>

 
            </form>
        </div>
    )
};

export default LoginPage;
