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
import { useState } from "react"
import { z } from "zod";

export function ProfileModal() {

    const [profileState, setProfileState] = useState("view");

    const FNAME_FORM_KEY = "firstname";
    const LNAME_FORM_KEY = "lastname";
    const ROLE_FORM_KEY = "role";

    const EMAIL_FORM_KEY = "email";
    const PASSWORD_FORM_KEY = "password";
    const PASSWORD_CONFIRM_FORM_KEY = "passwordConfirm";

    const userSchema = z.object({
        firstname: z.string(),
        lastname: z.string(),
        email: z.string().email("Not a valid email."),
        role: z.enum(["Student", "Administrator", "Parent", "Educator"])
        // password: z.string().min(8, "Password must contain at least 8 characters."),
        // passwordConfirm: z.string(),
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
          setAccountData(parse.data);
        } else {
          const errors = parse.error.formErrors.fieldErrors;
          console.log(errors);
        }

      }

      function setAccountData(data: Object) {
        console.log(data);
      }

      const [validationErrors, setValidationErrors] = useState({
        firstname: "",
        email: undefined,
        password: undefined,
        passwordConfirm: undefined,
    });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={(() => setProfileState("view"))}>Your profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] py-10 px-12  border-solid border-4 border-blue-primary">
        <DialogHeader>
          <DialogTitle className="text-blue-primary">
            {
            profileState == "view" && "Profile" ||
            profileState == "edit" && "Edit Profile" ||
            profileState == "changePw" && "Edit Password"
                
            }
            </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleProfileFormSubmit}>
        <div className="grid grid-cols-8 gap-2 py-4 -my-2">
          <div className="items-center col-span-4">
            <Label htmlFor={FNAME_FORM_KEY} className="text-right text-lg font-normal">
              First Name
            </Label>
            <Input
            name={FNAME_FORM_KEY}
            id="firstname"
            defaultValue="Pedro"
            disabled = {profileState == "view" ? true : undefined}
            className="text-sm font-light text-blue-primary col-span-3 disabled:border-none disabled:hover:cursor-default disabled:pl-0 disabled:bg-transparent"

            />
       
            
          </div>
          <div className="items-center col-span-4">
            <Label htmlFor={LNAME_FORM_KEY} className="text-right text-lg font-normal">
              Last Name
            </Label>
            <Input
              id="lastname"
              name={LNAME_FORM_KEY}
              defaultValue="Duarte"
              disabled = {profileState == "view" ? true : undefined}
            className="text-sm font-light text-blue-primary col-span-3 disabled:border-none disabled:hover:cursor-default disabled:pl-0 disabled:bg-transparent"

            />
          </div>
          <div className="items-center col-span-8">
            <Label htmlFor={EMAIL_FORM_KEY} className="text-right text-lg font-normal">
              Email
            </Label>
            <Input
              name={EMAIL_FORM_KEY}
              id="email"
              defaultValue="abc@gmail.com"
              disabled = {profileState == "view" ? true : undefined}
            className="text-sm font-light text-blue-primary col-span-8 disabled:border-none disabled:hover:cursor-default disabled:pl-0 disabled:bg-transparent"

            />
          </div>
          <div className="items-center col-span-8">
            <Label htmlFor={ROLE_FORM_KEY} className="text-right text-lg font-normal">
              Role
            </Label>
            {profileState == "view" && 
            <Input
            id="label"
            defaultValue="Student"
            disabled
          className="text-sm font-light text-blue-primary col-span-8 disabled:border-none disabled:hover:cursor-default disabled:pl-0 disabled:bg-transparent"
          
          />
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
                className="text-lg text-blue-primary font-bold my-5 hover:cursor-pointer">
                Change Password.
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
          <Button variant="outline" className="absolute bottom-0 left-0 text-lg px-4" onClick={(() => setProfileState("view"))}>Cancel</Button>

          <Button type="submit" variant="mainblue" className="absolute bottom-0 right-0 text-lg px-4" onClick={(() => setProfileState("edit"))}>Save Changes</Button>
          </div>
            }
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
