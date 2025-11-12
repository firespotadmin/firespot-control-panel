import { getStats } from "@/services/stats-service.service"

export const useGetStats = async ({
    fromDate,
    toDate,
}: {
    fromDate: string;
    toDate: string;
}) => {
    const response = await getStats({
        fromDate,
        toDate
    });
    return response;
}