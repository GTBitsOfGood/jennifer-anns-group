import pageAccessHOC from "@/components/HOC/PageAccess";
import EditModal from "@/components/Admin/AccountManagement/EditModal";
import DeleteModal from "@/components/Admin/AccountManagement/DeleteModal";
import { Button } from "@/components/ui/button";
import CrossIcon from "@/components/ui/icons/crossicon";
import WarningIcon from "@/components/ui/icons/warningicon";
import { IAdmin } from "@/server/db/models/AdminModel";
import AdminTabs from "@/components/Admin/AdminTabs";
import { Pages } from "@/utils/consts";
import { UNDELETABLE_EMAILS } from "@/utils/consts";
import { Box, Tooltip } from "@chakra-ui/react";
import { ObjectId } from "mongodb";
import { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";

export type Admin = IAdmin & { _id: ObjectId };

const AccountManagementPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newEmail, setNewEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [editModalDisclosure, setEditModalDisclosure] = useState(false);
  const [deleteModalDisclosure, setDeleteModalDisclosure] = useState(false);
  const [chosenAdmin, setChosenAdmin] = useState<Admin | null>(null);

  const fetchData = async () => {
    try {
      const promise = await fetch("../api/admin");
      const data = await promise.json();
      const removableAdmins = data.filter(
        (admin: Admin) => !UNDELETABLE_EMAILS.includes(admin.email),
      );
      setAdmins(removableAdmins);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [editModalDisclosure, deleteModalDisclosure]);

  const handleAddAccount = async () => {
    try {
      const response = await fetch("../api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newEmail }),
      });
      if (response.ok) {
        fetchData();
        setNewEmail("");
        setEmailError("");
      } else {
        const res = await response.json();
        setEmailError(res.error);
      }
    } catch (error) {
      console.log("Error adding account:", error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddAccount();
    }
  };

  return (
    <AdminTabs page={Pages.ACCOUNTMANAGEMENT}>
      <div className="px-18 my-6 flex flex-col">
        <div className="font-['Poppins'] text-[24pt] font-semibold text-[#1A222B]">
          Add New Admin Account
        </div>
        <div className="mt-6 flex flex-row flex-wrap gap-4">
          <input
            className={`h-12 flex-grow  rounded-xl border bg-gray-50 px-7 text-lg ${
              emailError ? "border-red-600" : "border-stone-500"
            }`}
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={handleKeyPress}
            name="Email"
          />
          <Button
            variant="primary"
            className="flex h-12 items-center justify-center space-x-2 rounded-[6px] bg-[#2352A0] px-[16px] font-['Poppins'] text-[18px] font-medium text-[#FFFFFF] hover:bg-[#4F75B3]"
            onClick={handleAddAccount}
          >
            Add Account
          </Button>
        </div>
        <div
          className={`flex flex-row items-stretch gap-2 ${emailError === "" ? "mb-10" : "mb-1 mt-4"}`}
        >
          {emailError && <WarningIcon />}
          <div className="text-sm font-normal text-red-600">{emailError}</div>
        </div>
        <div className="mb-6 mt-12 font-['Poppins'] text-[24pt] font-semibold text-[#1A222B]">
          Manage Admin Accounts
        </div>
        <div className="rounded-[8px] border border-[#E2EFFF]">
          <div className="font-['DM Sans'] mx-1 flex flex-row items-center justify-between text-base font-medium leading-7 text-slate-400 ">
            <div className="flex items-center py-3 pl-6 font-inter text-14pt font-medium text-[#7A8086]">
              Email
            </div>
            <div className="flex items-center py-3 pr-6 font-inter text-14pt font-medium text-[#7A8086]">
              Edit & Delete
            </div>
          </div>
          <div className=" border border-[#E2EFFF]"></div>
          {[...UNDELETABLE_EMAILS, ...admins.map((admin) => admin.email)].map(
            (email, index) => {
              const isUndeletable = index < UNDELETABLE_EMAILS.length;
              return (
                <div
                  className="flex flex-row justify-between border-b border-[#E2EFFF] p-6"
                  key={index}
                >
                  <div className="text-md break-all font-inter text-[#384414B]">
                    {email}
                  </div>
                  {isUndeletable ? (
                    <div className="flex gap-4 pr-4">
                      <Pencil color="#A3AED0" />

                      <Tooltip
                        className="rounded-lg bg-white p-3  text-xs shadow-md"
                        label="This email cannot be removed"
                        placement="bottom"
                        hasArrow
                        arrowSize={16}
                      >
                        <Trash color="#A3AED0" />
                      </Tooltip>
                    </div>
                  ) : (
                    <div className="flex gap-4 pr-4">
                      <Pencil
                        className="cursor-pointer text-blue-primary"
                        onClick={() => {
                          const selectedAdmin = admins.find(
                            (admin) => admin.email === email,
                          );
                          setChosenAdmin(selectedAdmin ? selectedAdmin : null);
                          setEditModalDisclosure(true);
                        }}
                      />
                      <Trash
                        color="#8b0000"
                        className="cursor-pointer"
                        onClick={() => {
                          const selectedAdmin = admins.find(
                            (admin) => admin.email === email,
                          );
                          setChosenAdmin(selectedAdmin ? selectedAdmin : null);
                          setDeleteModalDisclosure(true);
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            },
          )}
        </div>
      </div>
      <EditModal
        open={editModalDisclosure}
        setOpen={setEditModalDisclosure}
        admin={chosenAdmin}
        fetchData={fetchData}
      />
      <DeleteModal
        open={deleteModalDisclosure}
        setOpen={setDeleteModalDisclosure}
        admin={chosenAdmin}
        fetchData={fetchData}
      />
    </AdminTabs>
  );
};

export default pageAccessHOC(AccountManagementPage);
