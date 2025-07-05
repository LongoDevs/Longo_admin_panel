interface State {
  currentUser: string | null;
}

interface Action {
  type: "LOGIN" | "LOGOUT";
  payload?: string;
}

const AuthReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LOGIN": {
      return {
        currentUser: action.payload || null,
      };
    }
    case "LOGOUT": {
      return {
        currentUser: null,
      };
    }
    default:
      return state;
  }
};

export default AuthReducer;
