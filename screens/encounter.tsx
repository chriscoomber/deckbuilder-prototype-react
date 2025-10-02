import CardComponent from "@/components/CardComponent";
import ElementDot from "@/components/ElementDot";
import GamePad from "@/components/GamePad";
import { Text } from "@react-navigation/elements";
import { View } from "react-native";
import { GameState, GameStateAction } from "./game";

export default function Encounter({
  gameState,
  dispatchGameStateAction,
}: {
  gameState: GameState;
  dispatchGameStateAction: React.ActionDispatch<[action: GameStateAction]>;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignSelf: "stretch",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        gap: 50,
      }}
    >
      <Text>Round {gameState.round}</Text>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            justifyContent: "space-evenly",
          }}
        >
          <Text>Target {gameState.encounterState!.requiredPoints}</Text>
          <Text>Points {gameState.encounterState!.points}</Text>
          <Text>Turns left {gameState.encounterState!.turnsLeft}</Text>
          <Text>Gold {gameState.gold}</Text>
          <Text>
            Wild element orbs {gameState.encounterState!.wildElements}
          </Text>
          <Text>
            Deck size {gameState.encounterState!.remainingDeck.length}
          </Text>
        </View>
        <GamePad
          onPressElement={(element) =>
            dispatchGameStateAction({ type: "INVOKE_ELEMENT", element })
          }
          wildElements={gameState.encounterState!.wildElements}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          gap: 10,
        }}
      >
        {gameState.encounterState!.elementOrder.map((element) => (
          <ElementDot actual={element} />
        ))}
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "space-evenly",
          flexDirection: "row",
        }}
      >
        {gameState.encounterState!.hand.map((card) => (
          <CardComponent
            key={gameState.deck.indexOf(card.deckCard)}
            card={card}
          />
        ))}
      </View>
    </View>
  );
}
