"use client"
import { apiClient } from "@/app/lib/apiClient";
import Link from "next/link";
import { useActionState } from "react";
export type RegisterState = {
    error?:string;
    success?:boolean;
}
const RegisterPage = ()=>{
    const [state,registerAction,isPending] = useActionState(
        async (prevState:RegisterState,
            formdata:FormData
        ):Promise<RegisterState> =>{
            const name = formdata.get("name") as string;
            const email = formdata.get("email") as string;
            const password = formdata.get("password") as string;
            const teamCode = formdata.get("teamCode") as string;
            try {
                await apiClient.register({
                    name,
                    email,
                    password,
                    teamCode: teamCode || undefined 
                });
                window.location.href = "/dashboard";

                return {
                    success:true,
                }

            } catch (error) {
                return{
                    error: error instanceof Error? error.message:"Registration Failed",
                }
            }
        },
        {error:undefined,success:undefined}

    );
    return(
        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 w-full max-w-md">


            <form action={registerAction}>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-100 mb-4">Create New Account</h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Or <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300"> Sign in to existing Account</Link>
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
                        htmlFor="name"
                        className="block text-slate-300 font-medium text-sm mb-1"
                        >Full Name</label>
                        <input 
                        id="name"
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        placeholder="Enter Your Full Name"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
                        />
                    </div>
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
                    <div>
                        <label 
                        htmlFor="teamCode"
                        className="block text-slate-300 font-medium text-sm mb-1"
                        >Team Code (Optional) </label>
                        <input 
                        id="teamCode"
                        type="text"
                        name="teamCode"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
                        placeholder="Enter a Team Code if you have one"
                        />
                        <p className="text-xs text-slate-500 mt-1">Leave Empty if you don't have a team code</p>
                    </div>
                </div>

                <button type="submit" disabled = {isPending} className="w-full px-4 py-2 mt-4 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    {isPending ? 'Loading...' : 'Register'}
                </button>

 
            </form>
        </div>
    )
};

export default RegisterPage;
