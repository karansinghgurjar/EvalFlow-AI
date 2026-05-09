import Badge from "../components/common/Badge";
import Card from "../components/common/Card";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { formatDateTime } from "../utils/formatters";

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        title="Profile"
        description="View your account and role information."
      />

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-950 text-2xl font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-950">
              {user?.name}
            </h3>

            <p className="mt-1 text-sm text-slate-500">{user?.email}</p>

            <div className="mt-4">
              <Badge value={user?.role} />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-slate-950">
            Account Details
          </h3>

          <div className="mt-5 space-y-4 text-sm">
            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span className="text-slate-500">User ID</span>
              <span className="break-all text-right font-medium text-slate-900">
                {user?.id}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span className="text-slate-500">Name</span>
              <span className="font-medium text-slate-900">{user?.name}</span>
            </div>

            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span className="text-slate-500">Email</span>
              <span className="font-medium text-slate-900">{user?.email}</span>
            </div>

            <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
              <span className="text-slate-500">Role</span>
              <Badge value={user?.role} />
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Last synced</span>
              <span className="font-medium text-slate-900">
                {formatDateTime(new Date())}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;
