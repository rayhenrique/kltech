import { getLeads } from "@/lib/queries";
import { LeadsClient } from "./leads-client";

export default async function LeadsPage() {
    const leads = await getLeads();
    return <LeadsClient leads={leads} />;
}
