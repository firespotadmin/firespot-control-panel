import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
  return (
    <div className="flex justify-center pt-70">
      <div className="">
        <div className="text-center">
          <h1 className="text-[30px] uppercase font-bold">Omo you don lost</h1>
          <div className="flex justify-center py-5">
            <img src="/logo.png" alt="" />
          </div>
          <p className="font-bold">firespot</p>

          <div className="flex justify-center gap-5">
            <Button className="mt-5 cursor-pointer" onClick={()=>{
                navigate("/dashboard")
            }}>Back Home</Button>
             <Button className="mt-5 cursor-pointer" onClick={()=>{
                window.history.back()
            }}>Back to Previous Page</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
