import { vcodeurl } from "./Link";

export const generateVoucherNumber = async (type: string) => {
  let voucherNo;
  try {
    const res = await fetch(`${vcodeurl}/report/last_voucher/${type}`);
    const data = await res.json();
    voucherNo = data?.data?.voucherNo || data?.data?.orderNo;
  } catch (error) {
    console.log(error);
  }
  let number;
  if (voucherNo) {
    number = getNextNumber(voucherNo);
  }

  const vNumber = number ? number : "00000001";

  const result = type + "-" + vNumber;

  return result;
};

const getNextNumber = (voucherNo: string) => {
  const parts = voucherNo.split("-");
  const lastNumber = parseInt(parts[1]);
  const nextNumber = (lastNumber + 1).toString().padStart(8, "0");
  return nextNumber;
};
