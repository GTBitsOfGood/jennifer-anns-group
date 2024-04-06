import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { Admin } from "@/pages/admin/account-management";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  admin: Admin | null | undefined;
  fetchData: () => void;
}

function DeleteModal({ open, setOpen, admin, fetchData }: Props) {
  if (!admin) {
    return <div></div>;
  }

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`../api/admin/${admin._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.text();
        console.log(error);
      } else {
        setOpen(false);
        fetchData();
      }
    } catch (error) {
      console.log("Error deleting account:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="flex flex-col items-center gap-14 border-4 border-blue-primary px-16 pb-20 pt-24"
        isDelete={true}
      >
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-center font-inter text-2xl font-semibold text-blue-primary">
            Are you sure you want to <br /> delete account <br />
            <span className="break-all font-normal">
              &quot;{admin?.email}&quot;
            </span>{" "}
            ?
          </h2>
          <div className="text-center text-base font-normal text-black ">
            This account will automatically change to student role
          </div>
        </div>
        <div className="flex w-full flex-row flex-wrap justify-center gap-11">
          <Button
            variant="primary"
            type="submit"
            form="form"
            className="w-48 bg-red-700 hover:bg-red-800"
            onClick={handleDeleteAccount}
          >
            Yes, delete
          </Button>
          <DialogClose asChild>
            <Button variant="outline" className="w-48">
              No, return
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteModal;
