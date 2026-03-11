const FIRESPOT_PAY_BASE_URL = "https://pay.firespot.co/business";
const QR_SERVER_BASE_URL = "https://api.qrserver.com/v1/create-qr-code/";

export function getBusinessPayLink(businessId: string): string {
  return `${FIRESPOT_PAY_BASE_URL}?businessId=${businessId}`;
}

export function getBusinessQrImageUrl(
  businessId: string,
  size = 420,
): string {
  const params = new URLSearchParams({
    size: `${size}x${size}`,
    format: "png",
    margin: "24",
    ecc: "H",
    color: "0-0-0",
    bgcolor: "255-255-255",
    data: getBusinessPayLink(businessId),
  });

  return `${QR_SERVER_BASE_URL}?${params.toString()}`;
}
