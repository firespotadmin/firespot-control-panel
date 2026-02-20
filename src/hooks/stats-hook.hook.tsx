import { getAllTransactions, getBusiness, getBusinessCharges, getBusinessFeedbacks, getBusinessProducts, getBusinessQrKits, getBusinessTransactions, getCustomers, getCustomerStats, getStats, getStatsBusiness, getStatsBusinessById, getTransactionStats } from "@/services/stats-service.service"
import type { BusinessChargesQuery } from "@/types/charge";
import type { CustomersQuery } from "@/types/customer";
import type { BusinessFeedbackQuery } from "@/types/feedback";
import type { BusinessProductsQuery } from "@/types/product";
import type { BusinessQrKitsQuery } from "@/types/qr-kit";
import type { AdminAllTransactionsQuery, BusinessTransactionsQuery } from "@/types/transaction";

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

export const useGetBusinessQrKits = async (
    params: BusinessQrKitsQuery
) => {
    const response = await getBusinessQrKits(params);
    return response;
}

export const useGetCustomers = async (
    params: CustomersQuery
) => {
    const response = await getCustomers(params);
    return response;
}

export const useGetCustomerStats = async () => {
    const response = await getCustomerStats();
    return response;
}

export const useGetTransactionStats = async () => {
    const response = await getTransactionStats();
    return response;
}

export const useGetAllTransactions = async (
    params: AdminAllTransactionsQuery
) => {
    const response = await getAllTransactions(params);
    return response;
}