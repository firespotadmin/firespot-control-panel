import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoCircle } from "iconsax-reactjs";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Formik, Form, Field } from "formik";
import { requestAccessSchema } from "@/schema/auth-schema";
import { useRequestAccess } from "@/hooks/auth-hook.hook";
import type { AdminResponse, CreateUserDto, Role } from "@/types/auth";
import toast, { Toaster } from "react-hot-toast";

const RequestAccess = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorObject, setErrorObject] = useState<{ general?: string }>({});
  const [phone, setPhone] = useState<string>("");
  const navigate = useNavigate();

  const handleRequestAccess = async ({ data }: { data: CreateUserDto }) => {
    try {
      const response = await useRequestAccess({ data }) as AdminResponse;


      if (response?.success) {
        toast.success("Request sent successfully!", {
          icon: "✅",
          style: {
            borderRadius: "100px",
            background: "#333",
            color: "#fff",
            fontSize: "12px",
          },
        });

        setTimeout(() => {
          navigate("/MFA");
        }, 1500);
      }
      else {
        toast.error(
          response?.data?.message ||
          "Something went wrong. Please try again.",
          {
            icon: "⚠️",
            style: {
              borderRadius: "100px",
              background: "#333",
              color: "#fff",
              fontSize: "12px",
            },
          }
        );
      }
    } catch (error: any) {
      console.error("RequestAccess Error:", error);

      toast.error(
        error?.response?.data?.message ||
        "Something went wrong. Please try again.",
        {
          icon: "⚠️",
          style: {
            borderRadius: "100px",
            background: "#333",
            color: "#fff",
            fontSize: "12px",
          },
        }
      );
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#F4F5F7]">
      <Toaster position="top-center" />
      <div className="max-w-lg shadow-sm rounded-2xl w-full bg-[#fff] h-fit">
        {/* Header */}
        <div className="bg-[#F4F5F7] flex items-center justify-center h-14 rounded-t-2xl">
          <p className="font-[700] text-[#00000080] text-center text-[14px]">
            Already have an account?{" "}
            <Link to={"/"}>
              <span className="bg-gradient-to-r text-[14px] font-[700] from-[#ff512f] to-[#dd2476] bg-clip-text text-transparent">
                Log in
              </span>
            </Link>
          </p>
        </div>

        {/* Body */}
        <div className="bg-[#fff] rounded-b-2xl p-[32px]">
          <div className="flex justify-center">
            <img src="/logo.png" alt="" className="w-[48px] h-[48px]" />
          </div>

          <div className="text-center pt-5">
            <p className="font-[700] text-[20px]">Request access</p>
            <p className="text-[14px] font-[500] text-[#00000080]">
              The Super Admin will approve or deny your request
            </p>
          </div>

          <Formik
            initialValues={{
              emailAddress: "",
              role: "ADMIN" as Role,
              firstName: "",
              lastName: "",
              password: "Test@1234",
              phone: "",
            }}
            validationSchema={requestAccessSchema}
            onSubmit={async (values: CreateUserDto) => {
              try {
                setErrorObject({});
                setLoading(true);
                console.log(values);
                await handleRequestAccess({ data: values });
              } catch (error: any) {
                console.error(error);
                setErrorObject({
                  general:
                    error?.response?.data?.message ||
                    "Something went wrong. Please try again.",
                });
                toast.error("Something went wrong. Please try again.", {
                  icon: "⚠️",
                  style: {
                    borderRadius: "100px",
                    background: "#333",
                    color: "#fff",
                    fontSize: "12px",
                  },
                });
              } finally {
                setLoading(false);
              }
            }}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form>
                {/* Email Field */}
                <div className="pt-5">
                  <Label
                    className="font-[500] text-[#545F6C] text-[12px]"
                    htmlFor="emailAddress"
                  >
                    Email address
                  </Label>
                  <Field
                    as={Input}
                    disabled={loading}
                    name="emailAddress"
                    id="emailAddress"
                    className="p-[16px] h-[44px] mt-1 text-[14px] font-[500]"
                    placeholder="Enter your email address"
                    type="emailAddress"
                  />
                  {touched.emailAddress && errors.emailAddress && (
                    <div className="flex items-center gap-1 text-red-600 text-sm pt-1">
                      <InfoCircle size={16} variant="Bold" />
                      <p>{errors.emailAddress}</p>
                    </div>
                  )}
                </div>

                {/* Role Field */}
                <div className="pt-5">
                  <Label className="font-[500] text-[#545F6C] text-[12px]" htmlFor="role">
                    Role
                  </Label>

                  <Select
                    onValueChange={(value) => setFieldValue("role", value)}
                    defaultValue={values.role}
                  >
                    <SelectTrigger className="w-full py-5 mt-1">
                      <SelectValue className="text-[14px]" placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="text-[14px]">
                      <SelectItem value={"ADMIN"}>ADMIN</SelectItem>
                      <SelectItem value="CUSTOMER_CARE">
                        CUSTOMER_CARE
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {touched.role && errors.role && (
                    <div className="flex items-center gap-1 text-red-600 text-sm pt-1">
                      <InfoCircle size={16} variant="Bold" />
                      <p>{errors.role}</p>
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="pt-5">
                  <Label className="text-sm text-[#545F6C]">
                    Contact Information
                  </Label>

                  <div className="contact-input-group mt-1">
                    <div className="flex border border-[#ddd] rounded-t-lg overflow-hidden">
                      <Field
                        as={Input}
                        disabled={loading}
                        name="firstName"
                        id="firstName"
                        className="py-5 flex-1 border-none shadow-none focus-visible:ring-0"
                        placeholder="First name"
                        type="text"
                      />
                      <div className="w-[1px] bg-[#ddd]" />
                      <Field
                        as={Input}
                        disabled={loading}
                        name="lastName"
                        id="lastName"
                        className="py-5 flex-1 border-none shadow-none focus-visible:ring-0"
                        placeholder="Last name"
                        type="text"
                      />
                    </div>

                    <div>
                      <PhoneInput
                        defaultCountry="ng"
                        value={phone}
                        onChange={(val) => {
                          setPhone(val);
                          setFieldValue("phone", val);
                        }}
                        style={{
                          width: "100%",
                          alignItems: "center",
                          borderTopRightRadius: 0,
                          borderBottomLeftRadius: 10,
                          borderBottomRightRadius: 10,
                        }}
                        forceDialCode={true}
                        countrySelectorStyleProps={{
                          buttonStyle: {
                            padding: 20,
                            borderTop: "none",
                            borderTopRightRadius: 0,
                            borderBottomLeftRadius: 15,
                          },
                        }}
                        inputClassName="w-full py-6"
                        inputStyle={{
                          padding: "20px 10px",
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 15,
                          borderTop: "none",
                        }}
                      />
                    </div>
                  </div>

                  {(touched.firstName && errors.firstName) ||
                    (touched.lastName && errors.lastName) ||
                    (touched.phone && errors.phone) ? (
                    <div className="flex flex-col gap-1 text-red-600 text-sm pt-1">
                      {errors.firstName && (
                        <div className="flex items-center gap-1">
                          <InfoCircle size={16} variant="Bold" />
                          <p>{errors.firstName}</p>
                        </div>
                      )}
                      {errors.lastName && (
                        <div className="flex items-center gap-1">
                          <InfoCircle size={16} variant="Bold" />
                          <p>{errors.lastName}</p>
                        </div>
                      )}
                      {errors.phone && (
                        <div className="flex items-center gap-1">
                          <InfoCircle size={16} variant="Bold" />
                          <p>{errors.phone}</p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                {errorObject.general && (
                  <div className="flex items-center gap-1 text-red-600 text-sm pt-3">
                    <InfoCircle size={16} variant="Bold" />
                    <p>{errorObject.general}</p>
                  </div>
                )}

                <Button
                  disabled={loading}
                  type="submit"
                  className="mt-6 p-[12px] h-[48px] rounded-full bg-[#000000] cursor-pointer w-full"
                >
                  {loading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Send Request"
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RequestAccess;
