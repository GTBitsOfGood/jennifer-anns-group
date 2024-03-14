import { Button } from "@/components/ui/button";
import CrossIcon from "@/components/ui/crossicon";
import { IAdmin } from "@/server/db/models/AdminModel";
import { UNDELETABLE_EMAILS } from "@/utils/consts";
import { Box, Tooltip } from "@chakra-ui/react";
import { ObjectId } from "mongodb";
import { useEffect, useState } from "react";

/**
 * TODO
 *  - Add error message and input styling for bad email addition
 *  - Add "Are you sure..." popup on account deletion
 *  - Convert all remaining pixel sizes to rem
 *  - Change font to DM Sans and investigate Inter
 *  - Write script to add first two email addresses to database
 * */

type Admin = IAdmin & { _id: ObjectId };

const AccountManagementPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newEmail, setNewEmail] = useState<string>("");

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
      } else {
        //has correct error text, add actual popup for it later
        const error = await response.text();
        console.log(error);
      }
    } catch (error) {
      console.log("Error adding account:", error);
    }
  };

  const handleDeleteAccount = async (admin_id: ObjectId) => {
    try {
      const response = await fetch(`../api/admin/${admin_id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.text();
        console.log(error);
      }
    } catch (error) {
      console.log("Error adding account:", error);
    }
  };

  return (
    <div className="mb-[121px] mt-[40px] ">
      <div className="text-center text-[2.98em] font-semibold text-black">
        Account Management
      </div>
      <div className="ml-[7.361rem] mr-[7.5rem] mt-[6rem] flex flex-col">
        <div className="text-2xl font-semibold text-black">Add New Account</div>
        <div className="mt-[1rem] flex flex-row justify-between">
          <input
            className="h-[63px] w-[56.32rem] rounded-[10px] border border-stone-500 bg-gray-50 px-[1.8rem] text-lg"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Button
            variant="primary"
            className="h-[58px] w-[17rem] rounded-[10px] text-3xl"
            onClick={handleAddAccount}
          >
            Add Account
          </Button>
        </div>
        <div className="mt-[5.33rem] text-2xl font-semibold text-black">
          Manage Accounts
        </div>
        <div className="mt-[2.9rem] flex flex-row justify-between">
          <div className="font-open-sans text-base font-medium leading-7 text-slate-400">
            Email
          </div>
          <div className="font-open-sans text-base font-medium leading-7 text-slate-400">
            Delete
          </div>
        </div>
        <div className="mt-[6px] h-[0px] w-full border border-violet-100"></div>
        {UNDELETABLE_EMAILS.map((email) => {
          return (
            <div className="mt-[2.4rem] flex flex-row justify-between">
              <div className="font-inter text-xl font-medium text-slate-800">
                {email}
              </div>
              <div className="mr-[15px]">
                <Tooltip
                  label="This email cannot be removed"
                  placement="bottom"
                  hasArrow
                  arrowSize={16}
                  padding={"0.8rem"}
                  borderRadius={8}
                  bg={"white"}
                  boxShadow="0px 8px 16px rgba(0, 0, 0, 0.2)"
                  fontSize={12}
                >
                  <Box as="span" cursor="pointer">
                    <CrossIcon w="1.7rem" h="1.7rem" color="#7d7e82" />
                  </Box>
                </Tooltip>
              </div>
            </div>
          );
        })}
        {admins.map((admin) => {
          return (
            <div className="mt-[2.4rem] flex flex-row justify-between">
              <div className="font-inter text-xl font-medium text-slate-800">
                {admin.email}
              </div>
              <div className="mr-[15px]">
                <CrossIcon
                  w="1.7rem"
                  h="1.7rem"
                  color="#8b0000"
                  cursor="pointer"
                  onClick={() => {
                    handleDeleteAccount(admin._id);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountManagementPage;
