import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Shield, UserCog } from "lucide-react";
import { useState } from "react";

import { getUsers, updateUserRole } from "../api/userApi";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import LoadingState from "../components/common/LoadingState";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/formatters";

const roleOptions = ["ADMIN", "ANNOTATOR", "REVIEWER"];

function UsersPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [roleFilter, setRoleFilter] = useState("");
  const [roleDrafts, setRoleDrafts] = useState({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", roleFilter],
    queryFn: () => getUsers(roleFilter ? { role: roleFilter } : {}),
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) => updateUserRole(userId, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const users = data?.users || [];

  function handleRoleChange(targetUserId) {
    const nextRole = roleDrafts[targetUserId];

    if (!nextRole) {
      window.alert("Please select a role first.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to update this user's role?"
    );

    if (!confirmed) return;

    roleMutation.mutate({
      userId: targetUserId,
      role: nextRole,
    });
  }

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Manage platform users, roles, and user-level workload counts."
      />

      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Role
            </label>

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-950"
            >
              <option value="">All roles</option>
              <option value="ADMIN">Admin</option>
              <option value="ANNOTATOR">Annotator</option>
              <option value="REVIEWER">Reviewer</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setRoleFilter("")}
            >
              Clear Filter
            </Button>
          </div>
        </div>
      </Card>

      {roleMutation.error ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {roleMutation.error.response?.data?.message ||
            "Failed to update user role."}
        </div>
      ) : null}

      {roleMutation.isSuccess ? (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          User role updated successfully.
        </div>
      ) : null}

      {isLoading ? <LoadingState message="Loading users..." /> : null}

      {error ? (
        <ErrorState
          title="Unable to load users"
          message={error.response?.data?.message || "Please try again later."}
        />
      ) : null}

      {!isLoading && !error && users.length === 0 ? (
        <EmptyState
          title="No users found"
          description="No users match the selected filter."
        />
      ) : null}

      {!isLoading && !error && users.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">User</th>
                  <th className="px-3 py-3 font-semibold">Role</th>
                  <th className="px-3 py-3 font-semibold">Assigned Tasks</th>
                  <th className="px-3 py-3 font-semibold">Evaluations</th>
                  <th className="px-3 py-3 font-semibold">Joined</th>
                  <th className="px-3 py-3 font-semibold">Change Role</th>
                </tr>
              </thead>

              <tbody>
                {users.map((item) => {
                  const isSelf = item.id === user?.id;

                  return (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                            {item.name?.charAt(0)?.toUpperCase()}
                          </div>

                          <div>
                            <p className="font-medium text-slate-950">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        <Badge value={item.role} />
                      </td>

                      <td className="px-3 py-4 text-slate-700">
                        {item._count?.assignedTasks ?? 0}
                      </td>

                      <td className="px-3 py-4 text-slate-700">
                        {item._count?.evaluations ?? 0}
                      </td>

                      <td className="px-3 py-4 text-slate-600">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="px-3 py-4">
                        {isSelf ? (
                          <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                            <Shield size={14} />
                            Current user
                          </span>
                        ) : (
                          <div className="flex min-w-64 gap-2">
                            <select
                              value={roleDrafts[item.id] || item.role}
                              onChange={(event) =>
                                setRoleDrafts((current) => ({
                                  ...current,
                                  [item.id]: event.target.value,
                                }))
                              }
                              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-950"
                            >
                              {roleOptions.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>

                            <Button
                              variant="secondary"
                              onClick={() => handleRoleChange(item.id)}
                              disabled={roleMutation.isPending}
                            >
                              <UserCog size={16} />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

export default UsersPage;
