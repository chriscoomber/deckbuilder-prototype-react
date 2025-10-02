import Game from "@/screens/game";
import { Button } from "@react-navigation/elements";
import { useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const [navStatus, setNavStatus] = useState<{ inGame: boolean }>({
    inGame: false,
  });

  return (
    <View style={{ borderWidth: 1, flexGrow: 0, alignSelf: "flex-start" }}>
      <View
        style={{
          width: 1024,
          height: 768,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!navStatus.inGame ? (
          <>
            <Button onPress={() => setNavStatus({ inGame: true })}>
              Start game
            </Button>
            <Text>Imagine that there's an options button here too...</Text>
            <Text>And an exit button</Text>
          </>
        ) : (
          <Game onExit={() => setNavStatus({ inGame: false })} />
        )}
      </View>
    </View>
  );
}
