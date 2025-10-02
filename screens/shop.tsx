import DeckViewer from "@/components/DeckViewer";
import { Button } from "@react-navigation/elements";
import { useState } from "react";
import { Text, View } from "react-native";
import { GameState, GameStateAction } from "./game";

export default function Shop({
  gameState,
  dispatchGameStateAction,
}: {
  gameState: GameState;
  dispatchGameStateAction: React.ActionDispatch<[action: GameStateAction]>;
}) {
  const [showingDeckModal, setShowingDeckModal] = useState(false);

  return (
    <>
      <View
        style={{
          flex: 1,
          alignSelf: "stretch",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Text>Welcome to the shop! You have {gameState.gold} gold!</Text>
        <View style={{ flexDirection: "row", gap: 20, margin: 20 }}>
          <View style={{ flex: 1 }}></View>
          <Button
            style={{
              height: 150,
              width: 90,
              borderWidth: 2,
              borderColor: "brown",
              backgroundColor: "grey",
              borderRadius: 20,
              flexDirection: "row",
            }}
            onPress={() => setShowingDeckModal(true)}
          >
            View deck
          </Button>{" "}
        </View>
        <Button
          onPress={() => dispatchGameStateAction({ type: "START_NEXT_ROUND" })}
        >
          Start next round
        </Button>
      </View>
      {showingDeckModal && (
        <DeckViewer
          deck={gameState.deck}
          onClose={() => setShowingDeckModal(false)}
        />
      )}
    </>
  );
}
