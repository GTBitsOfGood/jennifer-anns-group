import connectMongoDB from "../mongodb";
import HomePageModel, {
  IEditHomePage,
  IHomePage,
} from "../models/HomePageModel";

export async function getHomePage() {
  await connectMongoDB();

  return HomePageModel.findOne({ singleton: true });
}

export async function createHomePage(data: Omit<IHomePage, "singleton">) {
  await connectMongoDB();

  return await HomePageModel.create({ ...data, singleton: true });
}

export async function editHomePage(data: IEditHomePage) {
  await connectMongoDB();

  return await HomePageModel.findOneAndUpdate({ singleton: true }, data);
}
