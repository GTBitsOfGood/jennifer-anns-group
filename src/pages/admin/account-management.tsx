import DeleteModal from "@/components/account-management/DeleteModal";
import { Button } from "@/components/ui/button";
import CrossIcon from "@/components/ui/icons/crossicon";
import WarningIcon from "@/components/ui/icons/warningicon";
import { IAdmin } from "@/server/db/models/AdminModel";
import { UNDELETABLE_EMAILS } from "@/utils/consts";
import { Box, Tooltip } from "@chakra-ui/react";
import { ObjectId } from "mongodb";
import { useEffect, useState } from "react";

export type Admin = IAdmin & { _id: ObjectId };

const AccountManagementPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newEmail, setNewEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [deleteModalDisclosure, setDeleteModalDisclosure] = useState(false);
  const [selectedDeleteAdmin, setSelectedDeleteAdmin] = useState<Admin | null>(
    null,
  );

  useEffect(() => {
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
    fetchData();
  }, [admins]);

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
        setNewEmail("");
        setEmailError("");
      } else {
        const error = await response.text();
        setEmailError(error);
      }
    } catch (error) {
      console.log("Error adding account:", error);
    }
  };

  return (
    <div>
      <div className="mb-28 mt-10">
        <div className="text-center text-5xl font-semibold text-black">
          Account Management
        </div>
        <div className="mt-24 flex flex-col px-28">
          <div className="text-2xl font-semibold text-black">
            Add New Account
          </div>
          <div className="mt-5 flex flex-row flex-wrap justify-between gap-5">
            <input
              className={`h-16 w-full max-w-[57rem] rounded-xl border bg-gray-50 px-7 text-lg ${
                emailError ? "border-red-600" : "border-stone-500"
              }`}
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              name="Email"
            />
            <Button
              variant="primary"
              className="h-14 w-60 rounded-xl text-3xl"
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
          <div className="mt-14 text-2xl font-semibold text-black">
            Manage Accounts
          </div>
          <div className="font-['DM Sans'] mx-1 mt-14 flex flex-row justify-between text-base font-medium leading-7 text-slate-400">
            <div>Email</div>
            <div>Delete</div>
          </div>
          <div className="mt-1.5 border border-violet-100"></div>
          {[...UNDELETABLE_EMAILS, ...admins.map((admin) => admin.email)].map(
            (email, index) => {
              const isUndeletable = index < UNDELETABLE_EMAILS.length;
              return (
                <div className="mt-9 flex flex-row justify-between" key={index}>
                  <div className="break-all font-inter text-xl text-slate-800">
                    {email}
                  </div>
                  <div className="pr-4">
                    {isUndeletable ? (
                      <Tooltip
                        className="rounded-lg bg-white p-3 text-xs shadow-md"
                        label="This email cannot be removed"
                        placement="bottom"
                        hasArrow
                        arrowSize={16}
                      >
                        <Box as="span" cursor="pointer">
                          <CrossIcon color="#7d7e82" />
                        </Box>
                      </Tooltip>
                    ) : (
                      <CrossIcon
                        color="#8b0000"
                        onClick={() => {
                          const selectedAdmin = admins.find(
                            (admin) => admin.email === email,
                          );
                          setSelectedDeleteAdmin(
                            selectedAdmin ? selectedAdmin : null,
                          );
                          setDeleteModalDisclosure(true);
                        }}
                        className="cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              );
            },
          )}
        </div>
        <DeleteModal
          open={deleteModalDisclosure}
          setOpen={setDeleteModalDisclosure}
          admin={selectedDeleteAdmin}
        />
      </div>
    </div>
  );
};

export default AccountManagementPage;
