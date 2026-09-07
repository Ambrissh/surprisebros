export const initialAlbumState = {
  phase: 'closed',
  spread: 0,
  turn: null,
  revision: 0,
};

export function albumReducer(state, action) {
  switch (action.type) {
    case 'open':
      return state.phase === 'closed'
        ? { ...state, phase: 'opening', revision: state.revision + 1 }
        : state;
    case 'close':
      return state.phase === 'open'
        ? { ...state, phase: 'closing', revision: state.revision + 1 }
        : state;
    case 'turn':
      if (
        state.phase !== 'open' ||
        action.to === state.spread ||
        action.to < 0 ||
        action.to >= action.count
      )
        return state;
      return {
        phase: 'turning',
        spread: action.to,
        turn: {
          from: state.spread,
          to: action.to,
          direction: action.direction,
        },
        revision: state.revision + 1,
      };
    case 'settled':
      if (action.revision !== state.revision) return state;
      return {
        ...state,
        phase: state.phase === 'closing' ? 'closed' : 'open',
        spread: state.phase === 'closing' ? 0 : state.spread,
        turn: null,
      };
    default:
      return state;
  }
}
