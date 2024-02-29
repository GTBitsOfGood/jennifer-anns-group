import React from "react";
import pageAccessHOC from "@/components/HOC/PageAccess";
import { z } from "zod";
import cn from "classnames";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MoveLeft } from "lucide-react";

import {
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
  ChakraProvider,
} from "@chakra-ui/react";

const NAME_FORM_KEY = "name";
const TRAILER_FORM_KEY = "videoTrailer";
const DESCR_FORM_KEY = "description";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ThemeSelect from "@/components/Themes/ThemeSelect";

export const createGameSchema = z.object({
  name: z.string().min(3, "Title must be at least 3 characters"),
  videoTrailer: z.string().url("Not a valid URL").or(z.literal("")),
  description: z.string().min(1, "Description is required"),
});

function CreateGame() {
  const router = useRouter();

  const [themes, setThemes] = useState<string[]>([
    "Gaslighting",
    "Critical Thinking",
    "Fake News",
    "Social Media Addiction",
    "Cyberbullying",
    "Body Image",
    "Environmental Awareness",
    "Gender Equality",
    "Mental Health",
    "Diversity and Inclusion",
    "Racism",
    "Bullying",
    "Discrimination",
    "Consent",
    "Self-Esteem",
    "Healthy Relationships",
    "Peer Pressure",
    "Stress Management",
    "Empathy",
    "Social Justice",
    "Human Rights",
    "Media Literacy",
    "Political Awareness",
    "Digital Privacy",
    "Educational Equity",
    "Community Engagement",
    "Cultural Understanding",
    "Inclusivity",
    "Ethical Responsibility",
    "Global Citizenship",
  ]);

  // useEffect(() => {
  //   console.log("Tryna fetch");
  //   const fetchData = async () => {
  //     try {
  //       console.log("TRYING TO fetch");

  //       const res = await fetch("/api/themes/", { method: "GET" });
  //       const data = await res.json();
  //       console.log("data", data);

  //       setThemes(data);
  //     } catch (error) {
  //       console.error("Error fetching themes:", error);
  //     }
  //   };

  //   fetchData();
  //   setThemes(["Consent", "Gaslighting", "IDK"]);
  // }, []);

  const [validationErrors, setValidationErrors] = useState<
    Record<keyof z.input<typeof createGameSchema>, string | undefined>
  >({
    name: undefined,
    videoTrailer: undefined,
    description: undefined,
  });

  async function createGame(data: z.infer<typeof createGameSchema>) {
    try {
      const response = await fetch(`/api/games`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(`Error creating game:`, error);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = {
      name: formData.get(NAME_FORM_KEY),
      videoTrailer: formData.get(TRAILER_FORM_KEY),
      description: formData.get(DESCR_FORM_KEY),
    };
    const parse = createGameSchema.safeParse(input);

    if (parse.success) {
      try {
        const res = await createGame(parse.data);
        setValidationErrors({
          name: undefined,
          videoTrailer: undefined,
          description: undefined,
        });
        if (res?.message?.includes("duplicate")) {
          setValidationErrors({
            ...validationErrors,
            name: "Game with this title already exists",
          });
        } else {
          router.replace("/games");
        }
      } catch (error) {
        console.error("Error creating game:", error);
      }
    } else {
      const errors = parse.error.formErrors.fieldErrors;
      setValidationErrors({
        name: errors.name?.at(0),
        videoTrailer: errors.videoTrailer?.at(0),
        description: errors.description?.at(0),
      });
    }
  }

  return (
    <div className="m-12 md:mx-24">
      <div className="mb-16 grid grid-cols-6 items-center">
        <div className="col-span-1 rounded-sm opacity-100 ring-offset-white transition-opacity hover:cursor-pointer focus:outline-none focus:ring-2">
          <MoveLeft
            onClick={() => {
              console.log("clicked");
            }}
            className="h-12 w-12 text-blue-primary"
          />
        </div>
        <h1 className="col-start-2 col-end-6 text-center text-5xl font-semibold">
          Create a Game
        </h1>
      </div>
      <form className="flex w-full flex-col gap-12" onSubmit={handleSubmit}>
        <div className="relative flex w-full flex-col gap-3 md:w-2/5">
          <label htmlFor={NAME_FORM_KEY} className="text-xl font-semibold">
            Title
            <span className="text-orange-primary">*</span>
          </label>
          <Input
            name={NAME_FORM_KEY}
            className={cn(
              validationErrors.name
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-input-border focus:border-blue-primary",
              "h-12",
            )}
          />
          <p className="absolute bottom-[-2em] text-xs text-red-500">
            {validationErrors.name}
          </p>
        </div>
        <div className="relative flex w-full flex-col gap-3 md:w-2/3">
          <label htmlFor={TRAILER_FORM_KEY} className="text-xl font-semibold">
            Video Trailer Link
          </label>
          <Input
            name={TRAILER_FORM_KEY}
            placeholder="https://www.example.com"
            className={cn(
              validationErrors.videoTrailer
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-input-border focus:border-blue-primary",
              "h-12",
            )}
          />
          <p className="absolute bottom-[-2em] text-xs text-red-500">
            {validationErrors.videoTrailer}
          </p>
        </div>

        <div className="relative flex w-full flex-col gap-3 md:w-2/3">
          <label htmlFor={DESCR_FORM_KEY} className="text-xl font-semibold">
            Description
            <span className="text-orange-primary">*</span>
          </label>
          <Textarea
            name={DESCR_FORM_KEY}
            className={
              validationErrors.description
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-input-border focus:border-blue-primary"
            }
          />
          <p className="absolute bottom-[-2em] text-xs text-red-500">
            {validationErrors.description}
          </p>
        </div>

        <div className="relative flex w-full flex-col gap-3">
          <label htmlFor={DESCR_FORM_KEY} className="text-xl font-semibold">
            Theme(s)
          </label>
          <ThemeSelect themes={themes} type="theme" />
        </div>

        <div className="relative flex w-full flex-col gap-3">
          <label htmlFor={DESCR_FORM_KEY} className="text-xl font-semibold">
            Accessibility
          </label>
          <ThemeSelect themes={themes} type="tag" />
        </div>

        <div className="relative flex w-full flex-col gap-3">
          <label htmlFor={DESCR_FORM_KEY} className="text-xl font-semibold">
            Tag(s)
          </label>
          <ThemeSelect themes={themes} type="tag" />
        </div>

        <div className="relative mt-10 flex w-full justify-end">
          <Button
            type="submit"
            variant="mainblue"
            className="px-6 py-6 text-2xl font-semibold"
          >
            Publish
          </Button>
        </div>
      </form>
    </div>
  );
}

export default pageAccessHOC(CreateGame);
