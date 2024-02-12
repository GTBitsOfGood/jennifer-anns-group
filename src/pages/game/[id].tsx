import styles from "@/styles/game.module.css";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function gamePage() {
    const gameID = useRouter().query.id;
    const [gameData, setGameData] = useState([]);

    useEffect(() => {
        if (gameID) {
            getGame();
        }
    }, [gameID]);

    async function getGame() {
        console.log("running...");
        console.log(gameID);
        console.log("/api/games/" + gameID);
        const response = await fetch("../api/games/" + gameID + "?id=" + gameID);
        const data = await response.json();
        setGameData(data.data);
    }

    return (
        <div>
            <h1 className={styles.name}>{gameData.name}</h1>
        </div>
    );
}