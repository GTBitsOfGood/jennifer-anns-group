import { setDefaultAutoSelectFamily } from "net";
import { z, RefinementCtx } from "zod";

const verifyObjectId = (value: string) => {
  //Instead of converting to an Object, verify that it can be converted into an ObjectId
  const regex_string: RegExp = /[0-9A-Fa-f]{24}/g;
  if (regex_string.test(value)) {
    return true;
  }
  return false;
};

const validGameBuild = (value: string) => {
  const validBuilds = [
    "amazon",
    "android",
    "appstore",
    "linux",
    "mac",
    "webgl",
    "windows",
  ];
  return validBuilds.includes(value);
};

const validGameContent = (value: string) => {
  const validContent = [
    "answerKey",
    "parentingGuide",
    "lessonPlan",
    "videoTrailer",
  ];
  return validContent.includes(value);
};

// Theme
export const themeSchema = z.object({
  name: z.string(),
});

// Tag
const tag_types = ["accessibility", "custom"] as const; //
export const tagSchema = z.object({
  name: z.string(),
  type: z.enum(tag_types),
});

// Game
//We might need to make two gameSchemas, one for input verification and another

export const gameSchema = z.object({
  //Make sure to modify gameSchema endpoints, as well as editGameSchema I suppose.
  name: z.string().min(3).max(50),
  themes: z.array(themeSchema).optional(),
  tags: z.array(tagSchema).optional(),
  description: z.string(),
  game: z.string().url(),
  lesson: z.string().url().optional(),
  parentingGuide: z.string().url().optional(),
  answerKey: z.string().url().optional(),
  videoTrailer: z.string().url().optional(),
});

export const gameSchemaAPI = z.object({
  //Make sure to modify gameSchema endpoints, as well as editGameSchema I suppose.
  name: z.string().min(3).max(50),
  themes: z.array(z.string().refine(verifyObjectId)).optional(),
  tags: z.array(z.string().refine(verifyObjectId)).optional(),
  description: z.string(),
  game: z.string().url(),
  lesson: z.string().url().optional(),
  parentingGuide: z.string().url().optional(),
  answerKey: z.string().url().optional(),
  videoTrailer: z.string().url().optional(),
});
//Since arrays from req.query are just strings, and need to be converted into arrays.
const convert_JSON = (val: string, ctx: RefinementCtx) => {
  try {
    return JSON.parse(val);
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Not a valid array of strings",
    });
    return z.NEVER;
  }
};
//Ensure its an integer
const convert_INT = (val: string, ctx: RefinementCtx) => {
  const result = parseInt(val);
  if (isNaN(result)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Not a valid integer",
    });
    return z.NEVER;
  } else {
    return result;
  }
};
//For validating game query in the GET endpoint
//Be aware that zod.transform alters the data during parsing.
export const GetGameQuerySchema = z.object({
  name: z.string().min(3).max(50).optional(),
  theme: z.string().optional(),
  tags: z.string().transform(convert_JSON).pipe(z.array(z.string())).optional(),
  accessibility: z
    .string()
    .transform(convert_JSON)
    .pipe(z.array(z.string()))
    .optional(),
  gameBuilds: z
    .string()
    .transform(convert_JSON)
    .pipe(z.array(z.string().refine(validGameBuild)))
    .optional(),
  gameContent: z
    .string()
    .transform(convert_JSON)
    .pipe(z.array(z.string().refine(validGameContent)))
    .optional(),
  page: z.string().transform(convert_INT).pipe(z.number().gte(1)).optional(),
});

// For editing game
export const editGameSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  themes: z.array(z.string().refine(verifyObjectId)).optional(),
  tags: z.array(z.string().refine(verifyObjectId)).optional(),
  multiClass: z.boolean().optional(),
  description: z.string().optional(),
  game: z.string().url().optional(),
  lesson: z.string().url().optional(),
  parentingGuide: z.string().url().optional(),
  answerKey: z.string().url().optional(),
  videoTrailer: z.string().url().optional(),
});

// User
export const userSchema = z.object({
  email: z.string().email("Not a valid email"),
  hashedPassword: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  label: z.enum(["educator", "student", "parent", "administrator"]),
});

// For changing password
export const changePWSchema = z.object({
  oldpassword: z.string(),
  password: z.string().min(8, "Password must contain at least 8 characters."),
  passwordConfirm: z.string(),
});
