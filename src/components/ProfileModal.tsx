import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { MoveLeft } from "lucide-react";

export function ProfileModal() {
  const [profileState, setProfileState] = useState("view");
  const [open, setOpen] = useState(false);

  interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    label: string;
    _id: any;
    hashedPassword: any;
  }

  const { data: session } = useSession();
  const currentUser = session?.user;
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (currentUser) {
      getUserData(currentUser.email);
    }
  }, [currentUser]);

  // for testing, need to create user in Postman with email "abc@gmail.com" first
  useEffect(() => {
    getUserData("abc@gmail.com");
  }, []);

  async function getUserData(email: any) {
    try {
      const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      setUserData(data.data);
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async function editUser(data: any, type: string) {
    try {
      const response = await fetch(`/api/users?type=${type}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(`Error editing user ${type}:`, error);
      throw error;
    }
  }

  const FNAME_FORM_KEY = "firstName";
  const LNAME_FORM_KEY = "lastName";
  const EMAIL_FORM_KEY = "email";
  const LABEL_FORM_KEY = "label";
  const OLDPW_FORM_KEY = "oldpassword";
  const PW_FORM_KEY = "password";
  const PW_CONFIRM_FORM_KEY = "passwordConfirm";

  const userSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email("Not a valid email."),
    label: z.enum(["Student", "Administrator", "Parent", "Educator"])
  });

  const pwSchema = z.object({
    email: z.string().email(),
    oldpassword: z.string(),
    password: z.string().min(8, "Password must contain at least 8 characters."),
    passwordConfirm: z.string(),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

  function handleProfileFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = {
      firstName: formData.get(FNAME_FORM_KEY),
      lastName: formData.get(LNAME_FORM_KEY),
      label: formData.get(LABEL_FORM_KEY),
      email: formData.get(EMAIL_FORM_KEY),
    };
    const parse = userSchema.safeParse(input);
    if (parse.success) {
      setInvalidEmail("");
      setOpen(false);
      setUserData({ ...parse.data, _id: userData?._id, hashedPassword: userData?.hashedPassword });
      editUser({ ...parse.data, _id: userData?._id, hashedPassword: userData?.hashedPassword }, "info");
    } else {
      const errors = parse.error.formErrors.fieldErrors;
      if (errors.email) {
        setInvalidEmail(errors.email[0]);
      }
    }
  }

  function handlePasswordFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = {
      email: userData?.email,
      oldpassword: formData.get(OLDPW_FORM_KEY),
      password: formData.get(PW_FORM_KEY),
      passwordConfirm: formData.get(PW_CONFIRM_FORM_KEY),
    };
    const parse = pwSchema.safeParse(input);
    if (parse.success) {
      setInvalidPW("");
      setInvalidPWConfirm("");
      editUser(parse.data, "password")
        .then((res) => {
          if (!res.success) {
            setInvalidOldPW(res.message);
          } else {
            setProfileState("edit");
            setInvalidOldPW("");
          }
        });

    } else {
      const errors = parse.error.formErrors.fieldErrors;
      if (errors.password) {
        setInvalidPW(errors.password[0]);
      } else {
        setInvalidPW("");
      }
      if (errors.passwordConfirm) {
        setInvalidPWConfirm(errors.passwordConfirm[0]);
      } else {
        setInvalidPWConfirm("");
      }
    }
  }

  const [invalidEmail, setInvalidEmail] = useState("");
  const [invalidPW, setInvalidPW] = useState("");
  const [invalidPWConfirm, setInvalidPWConfirm] = useState("");
  const [invalidOldPW, setInvalidOldPW] = useState("");

  useEffect(() => {
    setInvalidEmail("");
    setInvalidPW("");
    setInvalidPWConfirm("");
    setInvalidOldPW("");
  }, [profileState]);

    return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="mainorange" onClick={(() => setProfileState("view"))}>Your profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] py-10 px-12  border-solid border-4 border-blue-primary">
        <DialogHeader>
          {profileState=="changePw" && 
            <MoveLeft onClick={()=>{setProfileState("edit")}}className="absolute left-4 top-4 rounded-sm h-6 w-6 text-blue-primary hover:cursor-pointer opacity-100 ring-offset-white transition-opacity focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none" />
          }
        
          <DialogTitle className="text-lg text-blue-primary font-semibold -mb-2">
            {
            profileState == "view" && "Profile" ||
            profileState == "edit" && "Edit Profile" ||
            profileState == "changePw" && "Edit Password"
            }
            </DialogTitle>

            
        </DialogHeader>
      
        {profileState != "changePw" &&
        <form onSubmit={handleProfileFormSubmit}>
        <div className="grid grid-cols-8 gap-3 py-4 -my-2">
          <div className="items-center col-span-4">
            <Label htmlFor={FNAME_FORM_KEY} className="text-right text-lg font-normal">
              First Name
            </Label>
            {
                profileState=="edit" &&            
                <Input
                name={FNAME_FORM_KEY}
                id="firstName"
                defaultValue={userData?.firstName}
                className="text-xs font-light text-black col-span-3"
                />
            }

            {
                profileState=="view" &&
                <p className="text-sm font-light text-blue-primary col-span-3 py-2">
                {userData?.firstName}
                </p>
            }   
            
          </div>
          <div className="items-center col-span-4">
            <Label htmlFor={LNAME_FORM_KEY} className="text-right text-lg font-normal">
              Last Name
            </Label>
            {
                profileState=="edit" &&
                <Input
              id="lastName"
              name={LNAME_FORM_KEY}
              defaultValue={userData?.lastName}
              className="text-xs font-light text-black col-span-3"
              /> 
            }
            {
                profileState=="view" &&
            <p className="text-sm font-light text-blue-primary col-span-3 py-2">
                {userData?.lastName}
            </p>
            }       
          </div>
          <div className="items-center col-span-8">
            <Label htmlFor={EMAIL_FORM_KEY} className="text-right text-lg font-normal">
              Email
            </Label>
            {
              profileState=="edit" && 
                <>           
                  <Input
                  name={EMAIL_FORM_KEY}
                  id="email"
                  defaultValue={userData?.email}
                  autoComplete="email"
                  className={(invalidEmail=="" ? "" : "border-red-500 ") + ("text-xs font-light text-black col-span-8")} />
                  
                  <p className="text-xs text-red-500 mt-1">
                      {invalidEmail}
                  </p>
                </>
            }
            {
                profileState=="view" &&
                <p className="text-sm font-light text-blue-primary col-span-3 py-2">
                {userData?.email}
                </p>
            }   
          </div>

          <div className="items-center col-span-8">
            <Label htmlFor={LABEL_FORM_KEY} className="text-right text-lg font-normal">
              Label
            </Label>
            {profileState == "view" && 
                <p className="text-sm font-light text-blue-primary col-span-3 py-2">
                    {userData?.label}
                </p>
            }
            
            {profileState == "edit" &&
                <Select
                name={LABEL_FORM_KEY}
                defaultValue={userData?.label}
                >
                <SelectTrigger className="col-span-8">
                    <SelectValue placeholder={userData?.label} className="text-red-500"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Parent">Parent</SelectItem>
                    <SelectItem value="Educator">Educator</SelectItem>
                    <SelectItem value="Administrator">Administrator</SelectItem>
                    </SelectGroup>
                </SelectContent>
                </Select>
            }
            

          </div>
          <div className="items-center col-span-8">
            
            {profileState == "edit" && 
            <p 
                onClick={()=>setProfileState("changePw")}
                className="text-lg text-blue-primary font-semibold mt-2 mb-6 hover:cursor-pointer">
                Change Password
            </p>
            }

            {profileState == "view" && 
            <>
                <Label htmlFor="name" className="text-right text-lg font-normal">
                Password
            </Label>

            <Input
                id="password"
                defaultValue="********"
                disabled
            className="text-sm font-light text-blue-primary col-span-8 disabled:border-none disabled:hover:cursor-default disabled:pl-0 disabled:bg-transparent"
            />
            </>
            }
            
          </div>
        </div>
        <DialogFooter>
            {profileState == "view" &&
          <Button variant="mainblue" className="text-lg px-6" onClick={(() => setProfileState("edit"))}>Edit</Button>
            
            }
            {profileState == "edit" &&
            <div className="relative w-full mt-10">
          <Button variant="outline2" className="absolute bottom-0 left-0 text-lg px-4" onClick={(() => setProfileState("view"))}>Cancel</Button>

          <Button type="submit" variant="mainblue" className="absolute bottom-0 right-0 text-lg px-4" onClick={(() => setProfileState("edit"))}>Save Changes</Button>
          </div>
            }
        </DialogFooter>
        </form>
        }


        {profileState == "changePw" &&
            <form onSubmit={handlePasswordFormSubmit}>
                <div className="grid grid-cols-8 gap-6 py-4 -my-2">            
                    <div className="items-center col-span-8">
                        <Label htmlFor={OLDPW_FORM_KEY} className="text-right text-lg font-normal">
                        Old Password
                        </Label>
    
                        <Input
                        name={OLDPW_FORM_KEY}
                        type="password"
                        id={OLDPW_FORM_KEY}
                        defaultValue=""
                        className={(invalidOldPW=="" ? "" : "border-red-500 ") + ("text-xs font-light text-black col-span-8")} />

                        <p className="text-xs text-red-500 mt-1">
                            {invalidOldPW}
                        </p>
                    </div>
                    <div className="items-center col-span-8">
                        <Label htmlFor={PW_FORM_KEY} className="text-right text-lg font-normal">
                        New Password
                        </Label>
    
                        <Input
                        name={PW_FORM_KEY}
                        type="password"
                        placeholder="Min. 8 characters"
                        id={PW_FORM_KEY}
                        defaultValue=""
                        className={(invalidPW=="" ? "" : "border-red-500 ") + ("text-xs font-light text-black col-span-8")} />
                   
                        <p className="text-xs text-red-500 mt-1">
                            {invalidPW}
                        </p>
                    </div>
                    <div className="items-center col-span-8">
                        <Label htmlFor={PW_CONFIRM_FORM_KEY} className="text-right text-lg font-normal">
                        Confirm New Password
                        </Label>
    
                        <Input
                        name={PW_CONFIRM_FORM_KEY}
                        id={PW_CONFIRM_FORM_KEY}
                        defaultValue=""
                        type="password"
                        placeholder="Min. 8 characters"
                        className={(invalidPWConfirm=="" ? "" : "border-red-500 ") + ("text-xs font-light text-black col-span-8")} />
                   
                        <p className="text-xs text-red-500 mt-1">
                            {invalidPWConfirm}
                        </p>
                    </div>
                </div>
            
            <DialogFooter>
            <div className="w-full relative mt-16">
                <Button type="submit" variant="mainblue" className="absolute right-0 bottom-0 text-lg px-4">Save Password</Button>
             </div>
            </DialogFooter>
        </form>
        }
      </DialogContent>
    </Dialog>
  )
}
