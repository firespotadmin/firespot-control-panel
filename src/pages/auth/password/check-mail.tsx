import { Button } from "@/components/ui/button";
import { ArrowLeft } from "iconsax-reactjs";
import { Link } from "react-router-dom";
import { useState } from "react";

const CheckMail = () => {
    const [loading] = useState<boolean>(false);

    // Optionally: get email from query param if available
    // const [searchParams] = useSearchParams();
    // const email = searchParams.get("email") || "areegbedavid@gmail.com";

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#F4F5F7]">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm">
                {/* Header */}
                <div
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 px-6 py-4 border-b cursor-pointer hover:bg-gray-50 rounded-t-2xl transition"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">Back</span>
                </div>

                {/* Body */}
                <div className="px-10 py-8 text-center">
                    <div className="flex justify-center mb-5">
                        <img src="/mail.png" className="w-20 h-20 object-contain" alt="Mail illustration" />
                    </div>

                    <p className="font-semibold text-xl text-gray-900">Check your inbox</p>
                    <p className="text-sm text-gray-600 mt-2">
                        We’ve sent a password reset link to your email <br />
                        <span className="font-medium text-gray-800">areegbedavid@gmail.com</span>
                    </p>

                    <div className="flex justify-center mt-8">
                        <Link to="/">
                            <Button
                                disabled={loading}
                                className="py-5 px-8 rounded-full bg-[#F4F5F7] hover:bg-gray-200 text-black font-semibold text-xs"
                            >
                                OKAY, GOT IT
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckMail;
