import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { AlertKeys, accountSchema } from "@/pages/signup";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export enum Label {
  Student = "student",
  Parent = "parent",
  Educator = "educator",
  Administrator = "administrator",
}

export const ROLE_LABEL_MAP: Record<Label, string> = {
  [Label.Student]: "Student",
  [Label.Parent]: "Parent",
  [Label.Educator]: "Educator",
  [Label.Administrator]: "Administrator",
};

enum YesNo {
  Yes = "yes",
  No = "no",
}

const AGE_LABEL_MAP: Record<YesNo, string> = {
  [YesNo.Yes]: "Yes, I am at least 13 years old",
  [YesNo.No]: "No, I am not 13 years old",
};

const FIRST_NAME_FORM_KEY = "firstName";
const LAST_NAME_FORM_KEY = "lastName";
const LABEL_FORM_KEY = "label";
const AGE_FORM_KEY = "age";

export const informationSchema = z.object({
  firstName: z.string().min(1, { message: "This field is required" }),
  lastName: z.string().min(1, { message: "This field is required" }),
  label: z.nativeEnum(Label, {
    errorMap: (issue, ctx) => ({
      message: "This field is required",
    }),
  }),
  age: z
    .nativeEnum(YesNo, {
      errorMap: (issue, ctx) => ({
        message: "This field is required",
      }),
    })
    .refine((val) => val === YesNo.Yes, {
      path: [AGE_FORM_KEY],
      message: "Sorry, you are not old enough to create an account",
    }),
});

interface Props {
  accountData: Partial<
    Record<keyof z.infer<typeof accountSchema>, string | undefined>
  >;
  setAlertType: React.Dispatch<React.SetStateAction<AlertKeys>>;
  setIsAlertShowing: React.Dispatch<React.SetStateAction<boolean>>;
}

function InformationSlide({
  accountData,
  setIsAlertShowing,
  setAlertType,
}: Props) {
  const router = useRouter();

  const [validationErrors, setValidationErrors] = useState<
    Record<keyof z.infer<typeof informationSchema>, string | undefined>
  >({
    firstName: undefined,
    lastName: undefined,
    label: undefined,
    age: undefined,
  });

  async function handleInformationFormSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = {
      firstName: formData.get(FIRST_NAME_FORM_KEY),
      lastName: formData.get(LAST_NAME_FORM_KEY),
      label: formData.get(LABEL_FORM_KEY),
      age: formData.get(AGE_FORM_KEY),
    };
    const parse = informationSchema.safeParse(input);
    if (!parse.success) {
      const errors = parse.error.formErrors.fieldErrors;
      setValidationErrors({
        firstName: errors.firstName?.at(0),
        lastName: errors.lastName?.at(0),
        label: errors.label?.at(0),
        age: errors.age?.at(0),
      });
      return;
    }
    const { passwordConfirm, age, ...combinedAccountData } = {
      ...accountData,
      ...parse.data,
    };
    if (parse.data.label == "administrator") {
      const admin = await fetch(
        `/api/admin?email=${combinedAccountData.email}`,
      );
      if (!admin.ok) {
        setIsAlertShowing(true);
        setAlertType("generic");
        return;
      }
      const admin_data = await admin.json();
      if (Object.keys(admin_data).length == 0) {
        setIsAlertShowing(true);
        setAlertType("admin");
        return;
      }
    }
    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(combinedAccountData),
    });
    if (!res.ok) {
      setIsAlertShowing(true);
      setAlertType("generic");
      return;
    }
    const creds = signIn("credentials", {
      email: combinedAccountData.email,
      password: combinedAccountData.password,
      redirect: false,
    });
    router.replace("/");
  }

  return (
    <form
      className="grid w-[20em] grid-cols-2 gap-x-4 gap-y-8"
      onSubmit={handleInformationFormSubmit}
    >
      <div className="relative">
        <label htmlFor={FIRST_NAME_FORM_KEY} className="text-xl">
          First Name*
        </label>
        <Input
          name={FIRST_NAME_FORM_KEY}
          placeholder="Your first name"
          className={
            validationErrors.firstName
              ? "border-red-500"
              : "border-input-border focus:border-blue-primary"
          }
        />
        <p className="absolute bottom-[-2em] text-xs text-red-500">
          {validationErrors.firstName}
        </p>
      </div>
      <div className="relative">
        <label htmlFor={LAST_NAME_FORM_KEY} className="text-xl">
          Last Name*
        </label>
        <Input
          name={LAST_NAME_FORM_KEY}
          placeholder="Your last name"
          className={
            validationErrors.lastName
              ? "border-red-500"
              : "border-input-border focus:border-blue-primary"
          }
        />
        <p className="absolute bottom-[-2em] text-xs text-red-500">
          {validationErrors.lastName}
        </p>
      </div>
      <div className="relative col-span-2 w-full">
        <label htmlFor={LABEL_FORM_KEY} className="text-xl">
          I am a*
        </label>
        <Select name={LABEL_FORM_KEY}>
          <SelectTrigger
            className={
              validationErrors.label
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-input-border focus:border-blue-primary"
            }
          >
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ROLE_LABEL_MAP).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="absolute bottom-[-2em] text-xs text-red-500">
          {validationErrors.label}
        </p>
      </div>
      <div className="relative col-span-2 w-full">
        <label htmlFor={AGE_FORM_KEY} className="text-xl">
          Are you at least 13 years old?*
        </label>
        <Select name={AGE_FORM_KEY}>
          <SelectTrigger
            className={
              validationErrors.age
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-input-border focus:border-blue-primary"
            }
          >
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(AGE_LABEL_MAP).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="absolute bottom-[-2em] text-xs text-red-500">
          {validationErrors.age}
        </p>
      </div>
      <div className="col-span-2 flex flex-row justify-center">
        <Button type="submit" variant="outline" size="lg" className="w-fit">
          Register
        </Button>
      </div>
    </form>
  );
}

export default InformationSlide;
