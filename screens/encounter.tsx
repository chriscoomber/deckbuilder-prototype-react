import CardComponent from "@/components/CardComponent";
import DeckViewer from "@/components/DeckViewer";
import ElementDot from "@/components/ElementDot";
import GamePad from "@/components/GamePad";
import { Button, Text } from "@react-navigation/elements";
import { useState } from "react";
import { View } from "react-native";
import { GameState, GameStateAction } from "./game";

export default function Encounter({
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
            <Text>Turns left {gameState.encounterState!.turnsRemaining}</Text>
            <Text>Gold {gameState.gold}</Text>
            <Text>
              Wild element orbs {gameState.encounterState!.wildElements}
            </Text>
            <Text>Draw pile {gameState.encounterState!.drawPile.length}</Text>
            <Text>
              Discard pile {gameState.encounterState!.discardPile.length}
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
          {gameState.encounterState!.elementOrder.map((element, i) => (
            <ElementDot key={i} actual={element} />
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
          </Button>
        </View>
      </View>
      {showingDeckModal && (
        <DeckViewer
          deck={gameState.deck}
          inHand={gameState.encounterState!.hand}
          inDiscard={gameState.encounterState!.discardPile}
          onClose={() => setShowingDeckModal(false)}
        />
      )}
      {gameState.encounterState!.roundEnded &&
        gameState.encounterState!.points >=
          gameState.encounterState!.requiredPoints && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text>You win!</Text>
              <Text>Target {gameState.encounterState!.requiredPoints}</Text>
              <Text>Points {gameState.encounterState!.points}</Text>
              <Text>
                Gold: {gameState.gold} +
                {gameState.encounterState!.turnsRemaining} (from unused turns)
              </Text>
              <Button
                onPressIn={() =>
                  dispatchGameStateAction({
                    type: "WIN_ENCOUNTER",
                    goldEarned: gameState.encounterState!.turnsRemaining,
                  })
                }
              >
                Continue
              </Button>
            </View>
          </View>
        )}
      {gameState.encounterState!.roundEnded &&
        gameState.encounterState!.points <
          gameState.encounterState!.requiredPoints && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text>You lose!</Text>
              <Text>Target {gameState.encounterState!.requiredPoints}</Text>
              <Text>Points {gameState.encounterState!.points}</Text>
              <Button
                onPressIn={() =>
                  dispatchGameStateAction({
                    type: "LOSE_ENCOUNTER",
                  })
                }
              >
                Continue
              </Button>
            </View>
          </View>
        )}
    </>
  );
}
