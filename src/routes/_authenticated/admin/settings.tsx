import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { AdminPage, Button, ConfirmDelete, Field, Input } from "@/components/admin/kit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createTeamMember,
  listAdminUsers,
  removeTeamMember,
} from "@/lib/admin-users.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const queryClient = useQueryClient();
  const fetchMembers = useServerFn(listAdminUsers);
  const addMember = useServerFn(createTeamMember);
  const deleteMember = useServerFn(removeTeamMember);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "editor">("admin");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { data: members = [] } = useQuery({
    queryKey: ["team-members"],
    queryFn: () => fetchMembers(),
  });

  const invite = useMutation({
    mutationFn: () => addMember({ data: { email: email.trim(), password, role } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      setEmail("");
      setPassword("");
      toast.success("Team member added.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not add."),
  });

  const removeMember = useMutation({
    mutationFn: (userId: string) => deleteMember({ data: { userId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast.success("Access removed.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not remove."),
  });

  const changePassword = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
        // @ts-expect-error current_password is supported by Lovable Cloud auth
        current_password: currentPassword,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password updated.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not update."),
  });

  return (
    <AdminPage title="Settings" description="Who can manage the website, and your own password.">
      <section>
        <h2 className="text-sm font-semibold">Team access</h2>
        <div className="mt-4 divide-y divide-border rounded-md border border-border">
          {members.map((member) => (
            <div key={member.userId} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{member.email || member.userId}</p>
                <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
              </div>
              <ConfirmDelete
                label={member.email || "this account"}
                onConfirm={() => removeMember.mutate(member.userId)}
                trigger={
                  <Button variant="ghost" size="sm" className="text-destructive">
                    Remove access
                  </Button>
                }
              />
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-5 rounded-md border border-border p-5">
          <h3 className="text-sm font-medium">Add a team member</h3>
          <Field label="Email">
            <Input
              type="email"
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Temporary password" hint="At least 10 characters. They can change it later.">
            <Input
              type="password"
              maxLength={200}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Field label="Role">
            <Select value={role} onValueChange={(value) => setRole(value as "admin" | "editor")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin — full access</SelectItem>
                <SelectItem value="editor">Editor — limited access</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Button
            disabled={invite.isPending || !email.trim() || password.length < 10}
            onClick={() => invite.mutate()}
          >
            Add member
          </Button>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold">Change your password</h2>
        <div className="mt-4 space-y-5 rounded-md border border-border p-5">
          <Field label="Current password">
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Field>
          <Field label="New password" hint="At least 10 characters.">
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Field>
          <Button
            disabled={changePassword.isPending || newPassword.length < 10}
            onClick={() => changePassword.mutate()}
          >
            Update password
          </Button>
        </div>
      </section>
    </AdminPage>
  );
}
