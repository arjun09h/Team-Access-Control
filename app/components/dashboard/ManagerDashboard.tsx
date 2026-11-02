import { User } from "@/app/types";

interface ManagerDashboardProps{
    myTeamMembers:User[];
    allTeamMembers:User[];
    currentUser:User;
}
export default function ManagerDashboard ({myTeamMembers,allTeamMembers,currentUser} : ManagerDashboardProps){
    return(
        <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold mb-3 text-slate-100">Manager Dashboard</h1>
                    <p className="text-slate-300">Team Management View</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Team Members */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg ">
                        <div className="p-4 border-b border-slate-700">
                            <h2 className="text-lg text-slate-100 font-semibold" > Team Members : ( {allTeamMembers.length} )</h2>
                        </div>
                        <div className="p-4">
                           {allTeamMembers.map((member)=>(
                                <div
                                 key={member.id}
                                 className="border-b border-slate-700 py-2 last:border-b-0"
                                >
                                    <p className="font-medium text-white">{member.name}</p>
                                    <p className="text-sm text-slate-400">{member.email} - {member.role} - {member.team?.code}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* My Team Members */}
                     <div className="bg-slate-800 border border-slate-700 rounded-lg ">
                        <div className="p-4 border-b border-slate-700">
                            <h2 className="text-lg text-slate-100 font-semibold" >My Team Members : ( {myTeamMembers.length} )</h2>
                        </div>
                        <div className="p-4">
                           {myTeamMembers.map((member)=>(
                                <div
                                 key={member.id}
                                 className="border-b border-slate-700 py-2 last:border-b-0"
                                >
                                    <p className="font-medium text-white">{member.name}</p>
                                    <p className="text-sm text-slate-400">{member.email} - {member.role} - {member.team?.code}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                   
                </div>
            </div>
    );
};