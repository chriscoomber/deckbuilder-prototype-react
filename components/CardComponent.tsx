import { Card } from "@/screens/game";
import { Text, View } from "react-native";
import ElementDot from "./ElementDot";

export default function CardComponent({
  card,
  symbol,
}: {
  card: Card;
  symbol?: "hand" | "discard";
}) {
  return (
    <View
      style={{
        height: 150,
        width: 90,
        borderWidth: 2,
        borderColor: card.perfectSequence ? "lightblue" : "brown",
        backgroundColor: "lightyellow",
        borderRadius: 20,
        flexDirection: "row",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 5,
          padding: 5,
          flex: 1,
        }}
      >
        <Text>{card.deckCard.name}</Text>
        <Text>{card.deckCard.description}</Text>
      </View>
      <View
        style={{
          flexDirection: "column",
          width: 30,
          justifyContent: "flex-start",
          gap: 2,
          padding: 5,
        }}
      >
        {card.deckCard.requiredElements.map((element, index) => (
          <ElementDot
            key={index}
            required={element}
            actual={card.spellProgress[index]}
          />
        ))}
      </View>
      {symbol && (
        <Text style={{ position: "absolute", bottom: 5, right: 5 }}>
          {symbol === "hand" ? "✋" : symbol === "discard" ? "🗑️" : ""}
        </Text>
      )}
    </View>
  );
}
