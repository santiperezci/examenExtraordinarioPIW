import React from "react";
import styled from "styled-components";

import ViewRecipes from "./ViewRecipes";
import AddRecipe from "./AddRecipe";


export default () => {
  return (
    <RecipesCMS>
      <ViewRecipes />
      <AddRecipe />
    </RecipesCMS>
  );
};

const RecipesCMS = styled.div`
  display: flex;
  flex-direction: row;
`;
