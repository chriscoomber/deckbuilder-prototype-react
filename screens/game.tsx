import { shuffle } from "@/utils/random";
import { Button } from "@react-navigation/elements";
import { useEffect, useReducer } from "react";
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

export type GameStateAction =
  | { type: "INVOKE_ELEMENT"; element: Element }
  | { type: "WIN_ENCOUNTER"; goldEarned: number }
  | { type: "LOSE_ENCOUNTER" }
  | { type: "START_NEXT_ROUND" };

export type GameState = {
  round: number;
  location: "encounter" | "shop";
  gold: number;
  encounterState?: {
    requiredPoints: number;
    points: number;
    turnsRemaining: number;
    hand: Card[];
    drawPile: DeckCard[];
    discardPile: DeckCard[];
    wildElements: number;
    elementOrder: Element[];
    roundEnded: boolean;
  };
  deck: DeckCard[];
  hasLost?: boolean;
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
              perfectSequence:
                card.perfectSequence && action.element === nextElementRequired,
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

      // Reduce turns remaining
      state.encounterState = {
        ...state.encounterState!,
        turnsRemaining: state.encounterState!.turnsRemaining - 1,
      };

      // Check if round ended
      if (
        state.encounterState.turnsRemaining <= 0 ||
        state.encounterState.points >= state.encounterState.requiredPoints
      ) {
        state.encounterState = { ...state.encounterState, roundEnded: true };
        // Early return
        return state;
      }

      const drawPile = [...state.encounterState!.drawPile];
      const hand = [...state.encounterState!.hand];
      const discardPile = [...state.encounterState!.discardPile];
      while (hand.length < HAND_SIZE) {
        // Deal out new cards
        console.log("Dealing new cards", {
          draw: drawPile.map((c) => c.name),
          discard: discardPile.map((c) => c.name),
          hand: hand.map((c) => c.deckCard.name),
        });
        if (drawPile.length === 0) {
          // Reshuffle discard pile into draw pile
          drawPile.push(...shuffle(discardPile.splice(0, discardPile.length)));
        }

        const cardIndex = Math.floor(Math.random() * drawPile.length);
        const [deckCard] = drawPile.splice(cardIndex, 1);
        hand.push({ deckCard, spellProgress: [], perfectSequence: true });
      }
      state.encounterState = {
        ...state.encounterState!,
        hand,
        drawPile,
        discardPile,
      };

      return state;

    case "WIN_ENCOUNTER":
      state = {
        ...state,
        location: "shop",
        gold: state.gold + action.goldEarned,
        encounterState: undefined,
      };
      return state;

    case "LOSE_ENCOUNTER":
      state = {
        ...state,
        hasLost: true,
      };
      return state;

    case "START_NEXT_ROUND":
      state = {
        ...state,
        round: state.round + 1,
        encounterState: generateEncounter(state.round + 1, state.deck),
        location: "encounter",
      };
      return state;
  }
}

function applyCardAction(state: GameState, card: Card): GameState {
  if (card.perfectSequence) {
    // Perfect sequence bonus
    state.encounterState!.wildElements += 1;
  }

  state = (() => {
    switch (card.deckCard.action.type) {
      case "GAIN_POINTS":
        state.encounterState!.points += card.deckCard.action.points;
        return state;
    }
  })();

  // Put card into discard pile
  state.encounterState!.hand = state.encounterState!.hand.filter(
    (c) => c !== card,
  );
  state.encounterState!.discardPile.push(card.deckCard);

  return state;
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
      name: "Splash",
      description: "+ 1",
      requiredElements: ["WATER"],
      action: { type: "GAIN_POINTS", points: 1 },
    },
    {
      name: "Splash",
      description: "+ 1",
      requiredElements: ["WATER"],
      action: { type: "GAIN_POINTS", points: 1 },
    },
    {
      name: "Splash",
      description: "+ 1",
      requiredElements: ["WATER"],
      action: { type: "GAIN_POINTS", points: 1 },
    },
    {
      name: "Elemental Genesis",
      description: "+ 60",
      requiredElements: ["FIRE", "WATER", "EARTH", "AIR"],
      action: { type: "GAIN_POINTS", points: 60 },
    },
    {
      name: "Consolidate Power",
      description: "+ 60",
      requiredElements: ["ANY", "ANY", "ANY", "ANY", "ANY", "ANY"],
      action: { type: "GAIN_POINTS", points: 60 },
    },
  ];
}

function generateEncounter(
  round: number,
  deck: DeckCard[],
): GameState["encounterState"] {
  // Deal out a hand
  const drawPile = [...deck];
  const hand: Card[] = [];
  while (hand.length < HAND_SIZE && drawPile.length > 0) {
    const cardIndex = Math.floor(Math.random() * drawPile.length);
    const [deckCard] = drawPile.splice(cardIndex, 1);
    hand.push({ deckCard, spellProgress: [], perfectSequence: true });
  }

  return {
    requiredPoints: round * 100,
    points: 0,
    turnsRemaining: 20,
    hand,
    drawPile: drawPile,
    discardPile: [],
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

  useEffect(() => {
    if (gameState.hasLost) {
      {
        onExit();
      }
    }
  }, [gameState.hasLost]);

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
