const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

class ApiClient{
    private baseURL: string;

    constructor (){
        this.baseURL = API_BASE_URL;
    }
    async request(endpoint:string, options : RequestInit = {}){
        const url = `${this.baseURL}/${endpoint}`;
        const config: RequestInit = {
            headers: {
                "Content-type": "application/json",
                ...options.headers,
            },
            // Important For Cookies
            credentials:"include",
            ...options
        }
       
        
        const response = await fetch(url, config);
        
        
        // Handle 401 Unauthorized
        if(response.status === 401) return null;

        if(!response.ok){
            const error = await response
            .json()
            .catch(
                ()=>({error:"Network Error"})
            );
            throw new Error(error.error || "Request Failed");
            
        }
    }

    // Auth Method 
    async register(userData:unknown){
        console.log("User Date is ",userData);
        
        return this.request("api/auth/register",{
            method:"POST",
            body:JSON.stringify(userData),
        });
    }
    async login(email:string,password:string){
        return this.request("api/auth/login",{
            method:"POST",
            body:JSON.stringify({email, password}),
        });
    }
    async logout(){
        return this.request("api/auth/logout",{
            method:"POST",
        });
    }
    async getCurrentUser(){
        return this.request("api/auth/me");
    }
    // User Method
    async getUser(){
        return this.request("api/user");
    }

    // Admin Method
    async updateUserRole(userId:string,role:string){
        return this.request(`api/user/${userId}/role`,{
            method:"PATCH",
            body:JSON.stringify({role}),
        });

    }
    async updateUserTeam(userId:string,teamId:string | null){
        return this.request(`api/user/${userId}/team`,{
            method:"PATCH",
            body:JSON.stringify({teamId}),
        });

    }
}

export const apiClient = new ApiClient();
