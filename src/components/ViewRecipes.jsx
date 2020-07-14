import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import styled from "styled-components";
import { OK, Error, Title } from "../style/styles";

const RECIPES_LIST_QUERY = gql`
  {
    recipes {
        _id
        title
        description
        steps
        date
        ingredients
        mainImage
        author
    }
  }
`;
export default () => {
  const { loading, error, data } = useQuery(RECIPES_LIST_QUERY);
  if (loading) return <p>Cargando lista de recetas...</p>;
  if (error) return <p>Error cargando la lista de recetas...</p>;

  return (
    <ViewRecipes>
      <Title>Recetas ya creadas</Title>
      {data.recipes.map(({ _id, title }) => (
        <Recipe key={_id}>{title}</Recipe>
      ))}
    </ViewRecipes>
  );
};

const ViewRecipes = styled.div`
  color: #333333;
  margin: 2em;
  display: flex;
  flex-direction: column;
`;

const Recipe = styled.div`
  margin-left: 1em;
`;
