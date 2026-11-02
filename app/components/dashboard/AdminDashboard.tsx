"use client"

import { apiClient } from "@/app/lib/apiClient";
import { Role, Team, User } from "@/app/types";
import { useTransition } from "react";

interface AdminDashboardProps {
    users: User[];
    teams: Team[];
    currentUser: User;
}
const AdminDashboard = ({ users, teams, currentUser }: AdminDashboardProps) => {
    const [isPending, startTransition] = useTransition();
    const handleTeamAssignment = async (userId: string, teamId: string | null) => {
        const user = users.find((user) => (userId === user.id));
        startTransition(async () => {
            try {
                await apiClient.updateUserTeam(userId, teamId);
                window.location.reload();
            } catch (error) {
                alert(error instanceof Error ? error.message : `Something went wrong with updating ${user?.name} Team Assignment`)
            }
        })
    }
    const handleRoleAssignment = async (userId: string, newRole: Role) => {
        const user = users.find((user) => (userId === user.id));
        if (userId === currentUser.id) {
            alert("You Cannot Change Yout Own Role")
        }
        startTransition(async () => {
            try {
                await apiClient.updateUserRole(userId, newRole);
                window.location.reload();
            } catch (error) {
                alert(error instanceof Error ? error.message : `Something went wrong with updating ${user?.name}'s Role Assignment`)
            }
        })
    }

    return <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold mb-3 text-slate-100">Admin Dashboard</h1>
            <p className="text-slate-300">User And Team Management</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
            {/* User Table with Role Assignment and Team Assignment */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg ">
                <div className="p-4 border-b border-slate-700">
                    <h2 className="text-lg text-slate-100 font-semibold" >Users : ( {users.length} )</h2>
                    <p className="text-slate-400 text-sm">Manage Roles And Team Assignment</p>
                </div>
                <div className="p-4">
                    <table className="text-sm w-full ">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left text-slate-300 py-2">Name</th>
                                <th className="text-left text-slate-300 py-2">Role</th>
                                <th className="text-left text-slate-300 py-2">Team</th>
                                <th className="text-left text-slate-300 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-slate-700">
                                    <td className="py-3 text-slate-300">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-slate-200 text-xs">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div>{user.name}</div>
                                                <div className="text-slate-400 text-xs">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleAssignment(user.id, e.target.value as Role)
                                            }
                                            disabled={isPending || user.id === currentUser.id}
                                            className="border rounded-lg p-2 bg-slate-900 border-slate-700 hover:bg-slate-900 focus:outline-none focus:ring-0 focus:ring-offset-1 focus:ring-offset-blue-500"
                                        >
                                            <option value={Role.USER}>User</option>
                                            <option value={Role.MANAGER}>Manager</option>
                                            <option value={Role.ADMIN}>Admin</option>
                                        </select>
                                    </td>
                                    <td className="py-2">
                                        <select
                                            value={user.teamId || ""}
                                            onChange={(e) => handleTeamAssignment(user.id, e.target.value || null)
                                            }
                                            disabled={isPending}
                                            className="border rounded-lg p-2 bg-slate-900 border-slate-700 hover:bg-slate-900 focus:outline-none focus:ring-0  focus:ring-offset-1 focus:ring-offset-blue-500"
                                        >
                                            <option value="">No Team</option>
                                            {teams.map((team) => (
                                                <option value={team.id} key={team.id}>{team.name}</option>
                                            ))}
                                        </select>
                                        {user.team &&
                                            <span className="text-xs text-slate-400 p-2">
                                                {user.team.code}
                                            </span>}
                                    </td>
                                    <td>
                                        {user.team &&
                                            <button
                                                onClick={() => handleTeamAssignment(user.id, null)}
                                                disabled={isPending}
                                                className="text-red-400 hover:text-red-300 text-xs disabled:opacity-50"
                                            >
                                                Remove Team
                                            </button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Teams Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg ">
                <div className="p-4 border-b border-slate-700">
                    <h2 className="text-lg text-slate-100 font-semibold" >Teams : ( {teams.length} )</h2>
                    <p className="text-slate-400 text-sm">Team Overview</p>
                </div>
                <div className="p-4">
                    <table className="text-sm w-full ">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left text-slate-300 py-2">Name</th>
                                <th className="text-left text-slate-300 py-2">Code</th>
                                <th className="text-left text-slate-300 py-2">Members</th>
                                <th className="text-left text-slate-300 py-2">Manager</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map((team) => {
                                const teamMembers = users.filter((user) => user.teamId === team.id);
                                const teamManagers = teamMembers.filter((user) => user.role === Role.MANAGER);
                                return (
                                    <tr key={team.id} className="border-b border-slate-700 ">
                                        <td className="py-3 text-slate-300 font-medium">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-6 h-6 bg-amber-300 rounded-full flex items-center justify-center text-slate-900 text-xs">
                                                    {team.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div>{team.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2">
                                            <span className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-xs" >{team.code}</span>
                                        </td>
                                        <td className="py-2">
                                            <div> {teamMembers.length} {teamMembers.length > 1 ? "Members" : "Member"}</div>
                                        </td>
                                        <td>
                                            {teamManagers.length > 0 ?
                                                (
                                                    teamManagers.map((manager) =>
                                                        
                                                            <span
                                                                key={manager.id}
                                                                className="bg-amber-500/20 text-amber-300 mr-2 px-2 py-1 rounded text-xs" >
                                                                {manager.name}
                                                            </span>
                                                        
                                                    )
                                                ) : (
                                                    
                                                        <span className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-xs" > No Manager </span>
                                                    
                                                )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{users.length}</div>
                <div className="text-xs font-bold text-slate-400"> Total Users </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{users.filter((user) => user.role === Role.ADMIN).length}</div>
                <div className="text-xs font-bold text-slate-400"> Admin </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{users.filter((user) => user.role === Role.MANAGER).length}</div>
                <div className="text-xs font-bold text-slate-400"> Manager </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{users.filter((user) => user.role === Role.USER).length}</div>
                <div className="text-xs font-bold text-slate-400"> Users </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{teams.length}</div>
                <div className="text-xs font-bold text-slate-400"> Teams </div>
            </div>

        </div>
    </div>
}
export default AdminDashboard;