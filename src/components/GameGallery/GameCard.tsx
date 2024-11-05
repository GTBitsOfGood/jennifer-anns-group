import { Card, Image, CardBody, Stack } from "@chakra-ui/react";
import z from "zod";
import { useRouter } from "next/compat/router";
import { gameSchema } from "@/utils/types";

const idSchema = z.string().length(24);
const gameDataSchema = gameSchema.extend({
  _id: idSchema,
});

interface Props {
  game: z.infer<typeof gameDataSchema>;
}

export default function GameCard({ game }: Props) {
  const router = useRouter();

  const goToGame = () => {
    router?.push(`/games/${game._id}`);
  };

  return (
    <Card
      onClick={goToGame}
      cursor="pointer"
      borderRadius="8px"
      width="312px"
      height="380px"
    >
      <CardBody p="0px">
        {game.image ? (
          <Image
            borderTopLeftRadius="8px"
            borderTopRightRadius="8px"
            height="200px"
            width="100%"
            fit="cover"
            src={game.image}
            alt="Game Image Preview"
          />
        ) : (
          <div className="h-[200px] w-full rounded-t-lg bg-placeholder"></div>
        )}
        <Stack mt="4" mr="5" ml="5" mb="5" spacing="2">
          <p className="font-sans text-xl font-semibold text-input-stroke">
            {game.name}
          </p>
          <p className="line-clamp-4 font-inter text-input-stroke">
            {game.description}
          </p>
        </Stack>
      </CardBody>
    </Card>
  );
}
