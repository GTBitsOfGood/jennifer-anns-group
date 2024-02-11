import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { profile } from "console"
import { useState, useEffect } from "react"
import { z } from "zod";

export function ProfileModal() {

    const [profileState, setProfileState] = useState("view");

    const [open, setOpen] = useState(false);


    const FNAME_FORM_KEY = "firstname";
    const LNAME_FORM_KEY = "lastname";
    const EMAIL_FORM_KEY = "email";
    const ROLE_FORM_KEY = "role";
    
    const OLDPW_FORM_KEY = "oldpassword";
    const PW_FORM_KEY = "password";
    const PW_CONFIRM_FORM_KEY = "passwordConfirm";

    const userSchema = z.object({
        firstname: z.string(),
        lastname: z.string(),
        email: z.string().email("Not a valid email."),
        role: z.enum(["Student", "Administrator", "Parent", "Educator"])

    });

    const pwSchema = z.object({
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
            firstname: formData.get(FNAME_FORM_KEY),
            lastname: formData.get(LNAME_FORM_KEY),
            role: formData.get(ROLE_FORM_KEY),
            email: formData.get(EMAIL_FORM_KEY),
            // password: formData.get(PASSWORD_FORM_KEY),
            // passwordConfirm: formData.get(PASSWORD_CONFIRM_FORM_KEY),
        };
        const parse = userSchema.safeParse(input);
        if (parse.success) {
            setInvalidEmail("");
            setOpen(false);
            setAccountData(parse.data);
        } else {
          const errors = parse.error.formErrors.fieldErrors;
        //   TODO:show errors on frontend
            if (errors.email) {
                setInvalidEmail(errors.email[0]);
            }
            
        }

      }

      function setAccountData(data: Object) {
        console.log(data);
        // TODO: put request
      }

      function setPassword(data: string) {
        console.log("New Password Set!: " + data);
        // TODO: put request
      }

      function handlePasswordFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const input = {
            oldpassword: formData.get(OLDPW_FORM_KEY),
            password: formData.get(PW_FORM_KEY),
            passwordConfirm: formData.get(PW_CONFIRM_FORM_KEY),
        };
        const parse = pwSchema.safeParse(input);
        if (parse.success) {
            setProfileState("edit");
            setInvalidPW("");
            setInvalidPWConfirm("");
            setPassword(parse.data.password);
        } else {
            const errors = parse.error.formErrors.fieldErrors;
            if (errors.password) {
                console.log(errors);

                setInvalidPW(errors.password[0]);
                console.log("pw1" + invalidPW);
            } else {
                setInvalidPW("");
            }
            if (errors.passwordConfirm) {
                console.log(errors);

                setInvalidPWConfirm(errors.passwordConfirm[0]);
                console.log("pw2" + invalidPWConfirm);
            } else {
                setInvalidPWConfirm("");
            }
        }
      }

      const [invalidEmail, setInvalidEmail] = useState("");
      const [invalidPW, setInvalidPW] = useState("");
      const [invalidPWConfirm, setInvalidPWConfirm] = useState("");


      useEffect (() => {
        setInvalidEmail("");
        setInvalidPW("");
        setInvalidPWConfirm("");

      }, [profileState])

    return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={(() => setProfileState("view"))}>Your profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] py-10 px-12  border-solid border-4 border-blue-primary">
        <DialogHeader>
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
                id="firstname"
                defaultValue="Pedro"
                className="text-xs font-light text-black col-span-3"
                />
            }

            {
                profileState=="view" &&
                <p className="text-sm font-light text-blue-primary col-span-3 py-2">
                Firstname
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
              id="lastname"
              name={LNAME_FORM_KEY}
              defaultValue="Duarte"
              className="text-xs font-light text-black col-span-3"
              /> 
            }
            {
                profileState=="view" &&
            <p className="text-sm font-light text-blue-primary col-span-3 py-2">
                Lastname
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
                    defaultValue="abc@gmail.com"
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
                example@gmail.com
                </p>
            }   
          </div>

          <div className="items-center col-span-8">
            <Label htmlFor={ROLE_FORM_KEY} className="text-right text-lg font-normal">
              Role
            </Label>
            {profileState == "view" && 
                <p className="text-sm font-light text-blue-primary col-span-3 py-2">
                    Student
                </p>
            }
            
            {profileState == "edit" &&
                <Select
                name={ROLE_FORM_KEY}
                defaultValue="Student"
                >
                <SelectTrigger className="col-span-8">
                    <SelectValue placeholder="Student" className="text-red-500"/>
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
                        className="text-xs font-light text-black col-span-8" />
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
