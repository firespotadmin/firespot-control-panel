import { Button } from "@/components/ui/button";
import { ArrowLeft } from "iconsax-reactjs";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useResendOtp, useVerifyOtp } from "@/hooks/auth-hook.hook";
import type { VerifyOtpResponse } from "@/types/auth";
import toast, { Toaster } from "react-hot-toast";

const VerifyEmail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>(""); // ✅ store OTP
  const [timer, setTimer] = useState<number>(0); // 2 minutes
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email") || "areegbedavid@gmail.com";
  const navigate = useNavigate();

  // ⏳ Countdown timer logic
  useEffect(() => {
    //@ts-ignore
    let interval: NodeJS.Timeout | null = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // 🕑 Format timer (e.g., 1:23)
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? `0${s}` : s}`;
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      toast.error("Please enter the complete OTP.", {
        style: {
          borderRadius: "100px",
          background: "#333",
          color: "#fff",
          fontSize: "12px",
        },
      });
      return;
    }

    if (!email) {
      toast.error("Email is missing.", {
        style: {
          borderRadius: "100px",
          background: "#333",
          color: "#fff",
          fontSize: "12px",
        },
      });
      return;
    }

    setLoading(true);

    const res = (await useVerifyOtp({
      data: { email, otp },
    })) as VerifyOtpResponse;

    setLoading(false);
    const response = res;
    console.log(response);

    if (response?.data?.isVerified) {
      toast.success("Thank you", {
        icon: "✅",
        style: {
          borderRadius: "100px",
          background: "#333",
          fontSize: "12px",
          color: "#fff",
        },
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      toast.error("OTP verification failed!", {
        icon: "❌",
        style: {
          borderRadius: "100px",
          background: "#333",
          color: "#fff",
          fontSize: "12px",
        },
      });
    }
  };

  // ✅ Resend OTP
  const handleResend = async () => {
    setTimer(120);
    setIsResendDisabled(true);

    const response = await useResendOtp({ email });
    console.log(response);

    toast.success(response?.message || "OTP resent successfully!", {
      icon: "✉️",
      style: {
        borderRadius: "100px",
        background: "#333",
        color: "#fff",
        fontSize: "12px",
      },
    });
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#F4F5F7]">
      <Toaster />
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm">
        {/* Header */}
        <div
          onClick={() => window.history.back()}
          className="flex items-center gap-2 cursor-pointer justify-start px-8 h-14 border-b border-[#ddd] rounded-t-2xl hover:bg-gray-50 transition"
        >
          <ArrowLeft size={20} />
        </div>

        {/* Body */}
        <div className="px-8 py-8">
          <p className="font-semibold text-xl text-gray-900">
            Verify your email address
          </p>
          <p className="pt-1 text-sm text-gray-600 font-medium leading-relaxed">
            We have sent a one-time password (OTP) to the email address you used
            to register on Firespot Control Panel{" "}({email})
          </p>

          <div className="pt-3">
            <p className="pb-2 font-medium text-[#545F6C]">Enter OTP</p>
            <InputOTP
              maxLength={4}
              value={otp}
              onChange={(val: string) => setOtp(val)}
            >
              {[0, 1, 2, 3].map((index) => (
                <InputOTPGroup key={index}>
                  <InputOTPSlot
                    style={{
                      width: 50,
                      height: 60,
                      fontSize: 20,
                    }}
                    index={index}
                  />
                </InputOTPGroup>
              ))}
            </InputOTP>
          </div>

          <div className="pt-5">
            <Button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="py-6 cursor-pointer px-8 w-full rounded-full bg-black text-white hover:bg-gray-800 font-semibold transition"
            >
              {loading ? <Loader className="animate-spin" /> : "Continue"}
            </Button>
          </div>

          {/* Timer and Resend OTP */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {isResendDisabled ? (
              <p className="font-semibold text-md">
                Request a new code in{" "}
                <span className="text-black">{formatTime(timer)}</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="font-semibold cursor-pointer"
              >
                Didn’t receive an OTP? {" "} <span className="bg-gradient-to-r from-[#ff512f] to-[#dd2476] bg-clip-text text-transparent font-semibold hover:opacity-80 transition">Resend OTP</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
