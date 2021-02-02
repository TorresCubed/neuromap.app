import React, { useCallback, useState } from "react";
import update from "immutability-helper";

export const ThemeStateManagementProvider = () => {
  const [theme, setTheme] = useState({
    freeFormIdeasColor: "#008080",
    optionBarColor: "#800080",
    selectedIdeaColor: "#FFD700",
  });

  const updateTheme = useCallback(
    (action) => {
      setTheme(
        update(theme, {
          [action.element]: {
            $set: action.color,
          },
        })
      );
    },
    [theme]
  );

  return { theme: theme, updateTheme: updateTheme };
};

export const ThemeContext = React.createContext();
