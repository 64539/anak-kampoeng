import { redirect } from "next/navigation";

export const revalidate = 0;

export default function AdminIndex() {
  redirect("/admin/dashboard");
}
