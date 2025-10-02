import { Card, DeckCard } from "@/screens/game";
import { Button } from "@react-navigation/elements";
import { View } from "react-native";
import CardComponent from "./CardComponent";

export default function DeckViewer({
  deck,
  inHand,
  inDiscard,
  onClose,
}: {
  deck: DeckCard[];
  inHand?: Card[];
  inDiscard?: DeckCard[];
  onClose: () => void;
}) {
  return (
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
          flex: 1,
          alignSelf: "stretch",
          backgroundColor: "white",
          padding: 20,
          margin: 20,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            flexWrap: "wrap",
            gap: 20,
            alignSelf: "stretch",
          }}
        >
          {deck.map((deckCard, i) => {
            const cardInHand = inHand?.find((c) => c.deckCard === deckCard);

            return (
              <CardComponent
                key={i}
                card={
                  cardInHand ?? {
                    deckCard,
                    perfectSequence: true,
                    spellProgress: [],
                  }
                }
                symbol={
                  cardInHand
                    ? "hand"
                    : inDiscard?.includes(deckCard)
                      ? "discard"
                      : undefined
                }
              />
            );
          })}
        </View>
        <Button onPress={onClose}>Close</Button>
      </View>
    </View>
  );
}
