import { getBusiness, getStats, getStatsBusiness, getStatsBusinessById } from "@/services/stats-service.service"

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

export const useGetBusiness = async (
    { from, to, status, search, page = 0, size = 10 }: {
        from?: string;
        to?: string;
        status?: string;
        search?: string;
        page?: number;
        size?: number;
    }
) => {
    const response = await getBusiness({
        from,
        to,
        status,
        search,
        page,
        size
    });
    return response;
}

export const useGetStatsBusiness = async () => {
    const response = await getStatsBusiness();
    return response;
}
export const useGetStatsBusinessById = async ({ id }: { id: string }) => {
    const response = await getStatsBusinessById({ id });
    return response;
}