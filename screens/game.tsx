import { Button } from "@react-navigation/elements";
import { useReducer } from "react";
import { View } from "react-native";
import Encounter from "./encounter";
import Shop from "./shop";

const HAND_SIZE = 5;

export type Element = "FIRE" | "EARTH" | "AIR" | "WATER" | "WILD";
export type RequiredElement = "FIRE" | "EARTH" | "AIR" | "WATER" | "ANY";

type CardAction = { type: "GAIN_POINTS"; points: number };

export type DeckCard = {
  name: string;
  description: string;
  requiredElements: RequiredElement[];
  action: CardAction;
};

export type Card = {
  deckCard: DeckCard;
  spellProgress: Element[];
  perfectSequence: boolean;
};

export type GameStateAction = { type: "INVOKE_ELEMENT"; element: Element };

export type GameState = {
  round: number;
  location: "encounter" | "shop";
  gold: number;
  encounterState?: {
    requiredPoints: number;
    points: number;
    turnsLeft: number;
    hand: Card[];
    remainingDeck: DeckCard[];
    wildElements: number;
    elementOrder: Element[];
    roundEnded: boolean;
  };
  deck: DeckCard[];
};

function gameStateReducer(origState: GameState, action: GameStateAction) {
  let state = { ...origState };

  switch (action.type) {
    case "INVOKE_ELEMENT":
      // Record element
      state.encounterState = {
        ...state.encounterState!,
        elementOrder: [...state.encounterState!.elementOrder, action.element],
      };

      // If it was a wild element, use it up
      if (action.element === "WILD") {
        state.encounterState = {
          ...state.encounterState!,
          wildElements: state.encounterState!.wildElements - 1,
        };
      }

      // Add element to all cards in hand
      state.encounterState = {
        ...state.encounterState!,
        hand: state.encounterState!.hand.map((card) => {
          const nextElementRequired =
            card.deckCard.requiredElements[card.spellProgress.length];
          if (
            nextElementRequired === action.element ||
            nextElementRequired === "ANY" ||
            action.element === "WILD"
          ) {
            return {
              ...card,
              spellProgress: [...card.spellProgress, action.element],
            };
          } else {
            return { ...card, perfectSequence: false };
          }
        }),
      };

      // Apply card effects
      for (const card of state.encounterState.hand) {
        if (
          card.spellProgress.length === card.deckCard.requiredElements.length
        ) {
          // Card is completed
          state = applyCardAction(state, card);
        }
      }

      // Reduce turns left
      state.encounterState = {
        ...state.encounterState!,
        turnsLeft: state.encounterState!.turnsLeft - 1,
      };

      // Check if round ended
      if (
        state.encounterState.turnsLeft <= 0 ||
        state.encounterState.points >= state.encounterState.requiredPoints
      ) {
        state.encounterState = { ...state.encounterState, roundEnded: true };
        // Early return
        return state;
      }

      // Deal out new cards
      const remainingDeck = [...state.encounterState!.remainingDeck];
      const hand = [...state.encounterState!.hand];
      while (hand.length < HAND_SIZE && remainingDeck.length > 0) {
        const cardIndex = Math.floor(Math.random() * remainingDeck.length);
        const [deckCard] = remainingDeck.splice(cardIndex, 1);
        hand.push({ deckCard, spellProgress: [], perfectSequence: true });
      }
      state.encounterState = {
        ...state.encounterState!,
        hand,
        remainingDeck,
      };

      return state;
  }
}

function applyCardAction(state: GameState, card: Card): GameState {
  if (card.perfectSequence) {
    // Perfect sequence bonus
    state.encounterState!.wildElements += 1;
  }

  switch (card.deckCard.action.type) {
    case "GAIN_POINTS":
      state.encounterState!.points += card.deckCard.action.points;
      state.encounterState!.hand = state.encounterState!.hand.filter(
        (c) => c !== card,
      );
      return state;
  }
}

function generateStartingDeck(): DeckCard[] {
  return [
    {
      name: "Fireball",
      description: "+ 10",
      requiredElements: ["FIRE", "FIRE", "EARTH"],
      action: { type: "GAIN_POINTS", points: 10 },
    },
    {
      name: "Fireball",
      description: "+ 10",
      requiredElements: ["FIRE", "FIRE", "EARTH"],
      action: { type: "GAIN_POINTS", points: 10 },
    },
    {
      name: "Fireball",
      description: "+ 10",
      requiredElements: ["FIRE", "FIRE", "EARTH"],
      action: { type: "GAIN_POINTS", points: 10 },
    },
    {
      name: "Fireball",
      description: "+ 10",
      requiredElements: ["FIRE", "FIRE", "EARTH"],
      action: { type: "GAIN_POINTS", points: 10 },
    },
    {
      name: "Fireball",
      description: "+ 10",
      requiredElements: ["FIRE", "FIRE", "EARTH"],
      action: { type: "GAIN_POINTS", points: 10 },
    },
    {
      name: "Magma",
      description: "+ 15",
      requiredElements: ["EARTH", "FIRE", "EARTH", "FIRE"],
      action: { type: "GAIN_POINTS", points: 15 },
    },
    {
      name: "Magma",
      description: "+ 15",
      requiredElements: ["EARTH", "FIRE", "EARTH", "FIRE"],
      action: { type: "GAIN_POINTS", points: 15 },
    },
    {
      name: "Magma",
      description: "+ 15",
      requiredElements: ["EARTH", "FIRE", "EARTH", "FIRE"],
      action: { type: "GAIN_POINTS", points: 15 },
    },
    {
      name: "Lightning Strike",
      description: "+ 40",
      requiredElements: ["AIR", "AIR", "WATER"],
      action: { type: "GAIN_POINTS", points: 40 },
    },
    {
      name: "SPLASH",
      description: "+ 1",
      requiredElements: ["WATER"],
      action: { type: "GAIN_POINTS", points: 1 },
    },
    {
      name: "SPLASH",
      description: "+ 1",
      requiredElements: ["WATER"],
      action: { type: "GAIN_POINTS", points: 1 },
    },
    {
      name: "SPLASH",
      description: "+ 1",
      requiredElements: ["WATER"],
      action: { type: "GAIN_POINTS", points: 1 },
    },
  ];
}

function generateEncounter(
  round: number,
  deck: DeckCard[],
): GameState["encounterState"] {
  // Deal out a hand
  const remainingDeck = [...deck];
  const hand: Card[] = [];
  while (hand.length < HAND_SIZE && remainingDeck.length > 0) {
    const cardIndex = Math.floor(Math.random() * remainingDeck.length);
    const [deckCard] = remainingDeck.splice(cardIndex, 1);
    hand.push({ deckCard, spellProgress: [], perfectSequence: true });
  }

  return {
    requiredPoints: round * 100,
    points: 0,
    turnsLeft: 20,
    hand,
    remainingDeck,
    elementOrder: [],
    wildElements: 0,
    roundEnded: false,
  };
}

export default function Game({ onExit }: { onExit: () => void }) {
  const [gameState, dispatchGameStateAction] = useReducer(
    gameStateReducer,
    undefined,
    () => {
      const startingDeck = generateStartingDeck();
      const encounterState = generateEncounter(1, startingDeck);
      return {
        round: 1,
        location: "encounter" as const,
        encounterState,
        gold: 0,
        deck: startingDeck,
      };
    },
  );

  return (
    <View
      style={{
        flex: 1,
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {gameState.location === "encounter" ? (
        <Encounter
          gameState={gameState}
          dispatchGameStateAction={dispatchGameStateAction}
        />
      ) : (
        <Shop
          gameState={gameState}
          dispatchGameStateAction={dispatchGameStateAction}
        />
      )}
      <Button
        style={{ position: "absolute", right: 0, top: 0 }}
        onPress={onExit}
      >
        Exit
      </Button>
    </View>
  );
}
