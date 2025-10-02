import { Element } from "@/screens/game";
import { Button } from "@react-navigation/elements";
import { View } from "react-native";

export default function GamePad({
  onPressElement,
  wildElements,
}: {
  onPressElement: (element: Element) => void;
  wildElements: number;
}) {
  return (
    <View style={{ width: 200, height: 200, flexDirection: "column" }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1 }}></View>
        <View style={{ flex: 1 }}>
          <Button
            onPress={() => onPressElement("AIR")}
            style={{
              backgroundColor: "yellow",
              width: "100%",
              height: "100%",
              borderRadius: 100,
            }}
          >
            Air
          </Button>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Button
            onPress={() => onPressElement("FIRE")}
            style={{
              backgroundColor: "red",
              width: "100%",
              height: "100%",
              borderRadius: 100,
            }}
          >
            Fire
          </Button>
        </View>
        <View style={{ flex: 1 }}>
          {wildElements > 0 && (
            <Button
              onPress={() => onPressElement("WILD")}
              style={{
                backgroundColor: "black",
                width: "100%",
                height: "100%",
                borderRadius: 100,
              }}
            >
              Wild
            </Button>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Button
              onPress={() => onPressElement("WATER")}
              style={{
                backgroundColor: "blue",
                width: "100%",
                height: "100%",
                borderRadius: 100,
              }}
            >
              Water
            </Button>
          </View>
        </View>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1 }}></View>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Button
              onPress={() => onPressElement("EARTH")}
              style={{
                backgroundColor: "green",
                width: "100%",
                height: "100%",
                borderRadius: 100,
              }}
            >
              Earth
            </Button>
          </View>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
    </View>
  );
}
