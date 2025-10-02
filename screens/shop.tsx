import { GameState, GameStateAction } from "./game";

export default function Shop({
  gameState,
  dispatchGameStateAction,
}: {
  gameState: GameState;
  dispatchGameStateAction: React.ActionDispatch<[action: GameStateAction]>;
}) {
  return null;
}
