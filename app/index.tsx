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
          <View
            style={{
              padding: 20,
              gap: 20,
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Button onPress={() => setNavStatus({ inGame: true })}>
              Start game
            </Button>
            <Text>Imagine that there's an options button here too...</Text>
            <Text>And an exit button...</Text>
            <Text>
              Notice: This is a prototype of an game idea. If it's any good,
              I'll make it properly in a game engine, with graphics and sound
              and animations and stuff. For now, you'll have to use your
              imagination a bit. In particular, things I know are lacking:{"\n"}
              - Shop not implemented yet. "Jokers" (a la belatro) and card
              upgrades, and more cards with interesting effect (a la Slay the
              Spire) are needed to make this an interesting game! Please let me
              know of any ideas you have!{"\n"}- UI is ugly as sin{"\n"}- Game
              Balance{"\n"}- The whole "points" system is a placeholder for
              something actually interesting, like fighting monsters or building
              a village idk. Any ideas let me know!{"\n"}- No tutorial{"\n"}
              Other ideas I had:{"\n"}- Casting one or more spells at once gives
              some kind of synergy bonus, rewarding careful planning.
            </Text>
            <Text>
              Because there's no tutorial, all you need to know so far is:{"\n"}
              - Each turn, you cast an element using the 4 colored buttons on
              the right{"\n"} - Casting an element fills in the next slot on any
              spell in your hand where that slot matches the element you cast.
              {"\n"} - When a spell is cast, you get points, and it's put in the
              discard pile. You automatically draw a new card from the draw
              pile. (No animations, sorry, so this can be a bit confusing){"\n"}{" "}
              - If you cast a spell in one perfect sequence immediately after
              drawing it, you're rewarded with a "wild element" (black). These
              fill any slot. You can tell if you are on track for this because
              the card has a light blue border. {"\n"} - "White" slots accept
              any element.{"\n"}
            </Text>
          </View>
        ) : (
          <Game onExit={() => setNavStatus({ inGame: false })} />
        )}
      </View>
    </View>
  );
}
