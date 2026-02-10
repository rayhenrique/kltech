import { getProjects } from "@/lib/queries";
import { PortfolioClient } from "./portfolio-client";

export default async function PortfolioPage() {
    const projects = await getProjects();
    return <PortfolioClient projects={projects} />;
}
