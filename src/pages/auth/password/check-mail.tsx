import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/auth-hook.hook";
import { loginSchema } from "@/schema/auth-schema";
import { Field, Form, Formik } from "formik";
import { ArrowLeft, InfoCircle } from "iconsax-reactjs";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Link, useNavigation } from "react-router-dom";

const CheckMail = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [errorObject, setErrorObject] = useState<{ email?: string; password?: string; general?: string }>({});

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#F4F5F7]">
            <div className="max-w-lg shadow-sm rounded-2xl w-full bg-[#fff] h-fit">
                {/* Header */}
                 <div onClick={()=>{
                    window.history.back();
                }} className="flex items-center cursor-pointer justify-left px-8 h-15 border-b-[1px] border-[#ddd] rounded-t-2xl">
                    <ArrowLeft />
                </div>

                {/* Body */}
                <div className="bg-[#fff] rounded-b-2xl px-10 py-8">
                    <div className="flex justify-center">
                        <img src="/mail.png" className="w-30 h-30 object-fill" alt="" />
                    </div>

                    <div className="text-center pt-1">
                        <p className="font-semibold text-xl">Check your inbox</p>
                        <p>We've sent a password reset link to your email areegbedavid@gmail.com</p>
                    </div>

                    <Link to={"/forgot-password"}>
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                className="mt-5 py-6 rounded-full font-semibold text-xs bg-[#F4F5F7] hover:bg-[#F4F5F7] text-[#000] cursor-pointer px-7"
                            >
                                OKAY, GOT IT
                            </Button>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckMail;
