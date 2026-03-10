import Header from "@/layouts/dashboard/header";
import SideBar from "@/layouts/dashboard/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getStoredAuthUser } from "@/lib/auth-storage";
import {
  listAdminUsers,
  createAdminUser,
  updateAdminRole,
  setAdminActive,
} from "@/services/admin-users.service";
import type { AdminUserListItem } from "@/types/admin-users";
import type { CreateUserDto, Role } from "@/types/auth";
import { ArrowLeft, Loader, Plus, UserPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const ROLES: Role[] = ["ADMIN", "CUSTOMER_CARE"];

function roleLabel(r: Role) {
  return r === "CUSTOMER_CARE" ? "Customer care" : "Admin";
}

export default function UserRolesPage() {
  const navigate = useNavigate();
  const currentUser = getStoredAuthUser();
  const currentUserId = currentUser?.id ?? null;

  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);
  const [togglingEmail, setTogglingEmail] = useState<string | null>(null);

  const [formEmail, setFormEmail] = useState("");
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<Role>("CUSTOMER_CARE");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listAdminUsers();
      setUsers(list);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load admin users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddAdmin = async () => {
    const email = formEmail.trim();
    const firstName = formFirstName.trim();
    const lastName = formLastName.trim();
    const phone = formPhone.trim();
    const password = formPassword;

    if (!email || !firstName || !lastName || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: CreateUserDto = {
        emailAddress: email,
        firstName,
        lastName,
        phone: phone || "+2340000000000",
        password,
        role: formRole,
      };
      await createAdminUser(payload);
      toast.success("Admin user created. They may need to verify via OTP.");
      setAddOpen(false);
      resetForm();
      fetchUsers();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create admin user");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormEmail("");
    setFormFirstName("");
    setFormLastName("");
    setFormPhone("");
    setFormPassword("");
    setFormRole("CUSTOMER_CARE");
  };

  const handleRoleChange = async (user: AdminUserListItem, newRole: Role) => {
    if (user.role === newRole) return;
    setUpdatingRoleId(user.id);
    try {
      await updateAdminRole(user.id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
      toast.success(`Role updated to ${roleLabel(newRole)}.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update role");
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleToggleActive = async (user: AdminUserListItem) => {
    if (user.id === currentUserId) {
      toast.error("You cannot deactivate your own account here.");
      return;
    }
    const next = !user.isActive;
    setTogglingEmail(user.emailAddress);
    try {
      await setAdminActive(user.emailAddress, next);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isActive: next } : u
        )
      );
      toast.success(next ? "Admin activated." : "Admin deactivated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setTogglingEmail(null);
    }
  };

  return (
    <div className="bg-[#F4F6F8] min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        <div className="flex-1 p-6 overflow-y-auto bg-[#F4F6F8] space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => navigate("/settings")}
              >
                <ArrowLeft size={20} />
              </Button>
              <h1 className="text-[28px] leading-[1.1] font-[700] text-[#0F172A]">
                User roles and permissions
              </h1>
            </div>
            <Button
              className="rounded-full bg-[#111827] hover:bg-[#1F2937] gap-2"
              onClick={() => setAddOpen(true)}
            >
              <UserPlus size={18} />
              Add admin user
            </Button>
          </div>

          <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
            <p className="text-[13px] text-[#6B7280] mb-4">
              Manage admin users and assign roles. New users may need to verify their email via OTP.
            </p>

            <div className="rounded-[10px] border border-[#ECEEF1] overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#E5E7EB] hover:bg-transparent">
                    <TableHead className="text-[12px] font-[500] text-[#374151]">User</TableHead>
                    <TableHead className="text-[12px] font-[500] text-[#374151]">Email</TableHead>
                    <TableHead className="text-[12px] font-[500] text-[#374151]">Role</TableHead>
                    <TableHead className="text-[12px] font-[500] text-[#374151]">Status</TableHead>
                    <TableHead className="text-[12px] font-[500] text-[#374151] w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center text-[#6B7280]">
                        <Loader className="animate-spin size-6 mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center text-[#6B7280]">
                        No admin users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow
                        key={user.id}
                        className="border-[#F3F4F6] last:border-0"
                      >
                        <TableCell className="text-[13px] text-[#111827]">
                          <span className="font-[500]">
                            {user.firstName} {user.lastName}
                          </span>
                          {user.id === currentUserId && (
                            <span className="ml-2 text-[11px] text-[#6B7280]">(You)</span>
                          )}
                        </TableCell>
                        <TableCell className="text-[13px] text-[#374151]">
                          {user.emailAddress}
                        </TableCell>
                        <TableCell className="text-[13px]">
                          <Select
                            value={user.role}
                            onValueChange={(v) => handleRoleChange(user, v as Role)}
                            disabled={updatingRoleId === user.id}
                          >
                            <SelectTrigger className="h-8 w-[140px] rounded-[8px] border-[#E5E7EB] text-[13px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLES.map((r) => (
                                <SelectItem key={r} value={r}>
                                  {updatingRoleId === user.id ? (
                                    <span className="flex items-center gap-2">
                                      <Loader className="animate-spin size-3" />
                                      {roleLabel(r)}
                                    </span>
                                  ) : (
                                    roleLabel(r)
                                  )}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-[500] ${
                              user.isActive
                                ? "bg-[#DCFCE7] text-[#166534]"
                                : "bg-[#FEE2E2] text-[#991B1B]"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.id !== currentUserId ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-[8px] text-[12px]"
                              onClick={() => handleToggleActive(user)}
                              disabled={togglingEmail === user.emailAddress}
                            >
                              {togglingEmail === user.emailAddress ? (
                                <Loader className="animate-spin size-3" />
                              ) : user.isActive ? (
                                "Deactivate"
                              ) : (
                                "Activate"
                              )}
                            </Button>
                          ) : (
                            <span className="text-[12px] text-[#9CA3AF]">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-[14px]">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-[600]">Add admin user</DialogTitle>
            <DialogDescription>
              Create a new admin. They will need to verify their email (OTP) if your backend requires it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-[13px]">First name</Label>
                <Input
                  id="firstName"
                  value={formFirstName}
                  onChange={(e) => setFormFirstName(e.target.value)}
                  placeholder="Jane"
                  className="h-[40px] rounded-[10px] border-[#E5E7EB]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-[13px]">Last name</Label>
                <Input
                  id="lastName"
                  value={formLastName}
                  onChange={(e) => setFormLastName(e.target.value)}
                  placeholder="Doe"
                  className="h-[40px] rounded-[10px] border-[#E5E7EB]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[13px]">Email</Label>
              <Input
                id="email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="admin@example.com"
                className="h-[40px] rounded-[10px] border-[#E5E7EB]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[13px]">Phone (optional)</Label>
              <Input
                id="phone"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="+2348012345678"
                className="h-[40px] rounded-[10px] border-[#E5E7EB]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[13px]">Password</Label>
              <Input
                id="password"
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="h-[40px] rounded-[10px] border-[#E5E7EB]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px]">Role</Label>
              <Select
                value={formRole}
                onValueChange={(v) => setFormRole(v as Role)}
              >
                <SelectTrigger className="h-[40px] rounded-[10px] border-[#E5E7EB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {roleLabel(r)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              className="rounded-full bg-[#111827] hover:bg-[#1F2937]"
              onClick={handleAddAdmin}
              disabled={submitting}
            >
              {submitting ? (
                <Loader className="animate-spin size-4" />
              ) : (
                <>
                  <Plus size={16} className="mr-1" />
                  Create admin
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
