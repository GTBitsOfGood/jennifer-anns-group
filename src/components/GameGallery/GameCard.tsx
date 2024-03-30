import { Card, Image, CardBody, Stack } from "@chakra-ui/react";
import { gameDataSchema } from "@/pages/games";
import z from "zod";
import { useRouter } from "next/router";

interface Props {
  game: z.infer<typeof gameDataSchema>;
}

export default function GameCard({ game }: Props) {
  const router = useRouter();

  const goToGame = () => {
    router.push(`/games/${game._id}`);
  };

  return (
    <Card borderRadius="8px" width="312px" height="380px">
      <CardBody p="0px">
        <Image
          borderTopLeftRadius="8px"
          borderTopRightRadius="8px"
          height="200px"
          width="100%"
          fit="cover"
          src="https://img.freepik.com/free-vector/hand-drawn-houseplant-collection_23-2148910610.jpg"
        />
        <Stack mt="4" mr="5" ml="5" mb="5" spacing="2">
          <p
            onClick={goToGame}
            className="cursor-pointer font-sans text-xl font-extrabold text-[#6D758F]"
          >
            {game.name}
          </p>
          <p
            onClick={goToGame}
            className="line-clamp-4 cursor-pointer font-inter text-[#6D758F]"
          >
            {game.description}
          </p>
        </Stack>
      </CardBody>
    </Card>
  );
}
