import { getProducts } from "@/lib/queries";
import { VitrineClient } from "./vitrine-client";

export default async function VitrinePage() {
    const products = await getProducts();
    return <VitrineClient products={products} />;
}
