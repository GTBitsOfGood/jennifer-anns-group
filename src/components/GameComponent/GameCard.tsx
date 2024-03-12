import { Card, Image, CardBody, Stack } from "@chakra-ui/react";
import { gameSchema } from "@/utils/types";
import z from "zod";

interface Props {
  game: z.infer<typeof gameSchema>;
}

export default function GameCard({ game }: Props) {
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
          <p className="font-sans text-xl font-extrabold text-gray-500">
            {game.name}
          </p>
          <p className="line-clamp-4 font-inter text-gray-500">
            {game.description}
          </p>
        </Stack>
      </CardBody>
    </Card>
  );
}
