import { getStats } from "@/services/stats-service.service"

export const useGetStats = async () => {
    const response = await getStats();
    return response;
}