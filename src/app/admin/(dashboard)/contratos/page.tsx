import { getContracts } from "@/lib/queries";
import { ContratosClient } from "./contratos-client";

export default async function ContratosPage() {
    const contracts = await getContracts();
    return <ContratosClient contracts={contracts} />;
}
