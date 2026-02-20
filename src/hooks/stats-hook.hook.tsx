import { getBusiness, getBusinessCharges, getBusinessFeedbacks, getBusinessProducts, getBusinessTransactions, getStats, getStatsBusiness, getStatsBusinessById } from "@/services/stats-service.service"
import type { BusinessChargesQuery } from "@/types/charge";
import type { BusinessFeedbackQuery } from "@/types/feedback";
import type { BusinessProductsQuery } from "@/types/product";
import type { BusinessTransactionsQuery } from "@/types/transaction";

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

export const useGetBusinessTransactions = async (
    params: BusinessTransactionsQuery
) => {
    const response = await getBusinessTransactions(params);
    return response;
}

export const useGetBusinessFeedbacks = async (
    params: BusinessFeedbackQuery
) => {
    const response = await getBusinessFeedbacks(params);
    return response;
}

export const useGetBusinessProducts = async (
    params: BusinessProductsQuery
) => {
    const response = await getBusinessProducts(params);
    return response;
}

export const useGetBusinessCharges = async (
    params: BusinessChargesQuery
) => {
    const response = await getBusinessCharges(params);
    return response;
}