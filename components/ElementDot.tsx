import { Element, RequiredElement } from "@/screens/game";
import { View } from "react-native";

function getColor(type: Element | RequiredElement): string {
  switch (type) {
    case "FIRE":
      return "red";
    case "EARTH":
      return "green";
    case "AIR":
      return "yellow";
    case "WATER":
      return "blue";
    case "WILD":
      return "black";
    case "ANY":
      return "lightgrey";
  }
}

export default function ElementDot({
  required,
  actual,
}: {
  required?: RequiredElement;
  actual?: Element;
}) {
  return (
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: actual ? getColor(actual) : "white",
        borderWidth: 2,
        borderColor: getColor(required ?? actual!),
      }}
    />
  );
}
