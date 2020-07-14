import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { sessionState } from "../recoil/atoms";
import { OK, Error, Title } from "../style/styles";
import UploadFile from "./UploadFile";

const ADD_RECIPE_MUTATION = gql`
  mutation AddRecipe($title: String!, $userid: ID!, $description: String!, $token: String!, $steps: [StepInput!]!, $ingredients: [ID!]!, $mainImage: FileInput!) {
    addRecipe(title: $title, userid: $userid, description: $description, token: $token, steps: $steps, ingredients: $ingredients, mainImage: $mainImage) {
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
  const [session] = useRecoilState(sessionState);
  const [addRecipe, { data, error }] = useMutation(
    ADD_RECIPE_MUTATION,
    {
      update(cache, { data: { addRecipe } }) {
        const { recipes } = cache.readQuery({
          query: RECIPES_LIST_QUERY,
        });
        cache.writeQuery({
          query: RECIPES_LIST_QUERY,
          data: { recipes: recipes.concat([addRecipe]) },
        });
      },
      onError(error) {
        if (error.message.includes("duplicate key")) {
          console.error("Error: Dupulicated Key");
        } else if (error.message.includes("Cast to ObjectId")) {
          console.log("Usuario no loggeado");
        } else {
          console.log(
            "Ha ocurrido un error inesperado, vuelve a intentarlo más tarde",
          );
        }
      },
    },
  );

  const add = (title, description, steps, ingredients, mainImage) => {
    console.log(`userid: ${session.userid}, token: ${session.token}`);
    addRecipe({
      variables: { title: title, userid: session.userid, description: description, token: session.token, steps: steps, ingredients: ingredients, mainImage: mainImage },
    });
  };

  let output = "";

  if (data) {
    output = (<OK>Receta añadida con éxito</OK>);
  }

  if (error) {
    if (error.message.includes("duplicate key")) {
      output = (
        <Error>La receta ya existe</Error>
      );
    } else if (error.message.includes("Cast to ObjectId")) {
      output = (
        <Error>El usuario no está loggeado</Error>
      );
    } else {
      output = (
        <Error>
          Ha ocurrido un error inesperado, vuelve a intentarlo más tarde
        </Error>
      );
    }
  }
  return (
    <AddRecipe>
      <Title>Añadir nueva receta</Title>
      {output}
      <Input id="title" type="text" placeholder="Titulo de la receta"></Input>
      <Button
        onClick={() => {
          add(document.getElementById("title").value);
          document.getElementById("title").value = "";
        }}
      >
        Añadir Receta
      </Button>
    </AddRecipe>
  );
};



const AddRecipe = styled.div`
  color: #333333;
  margin: 2em;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  border: 1px solid #333;
  height: 30px;
  width: 500px;
`;

const Button = styled.button`
  color: black;
  font-weight: bold;
  height: 30px;
  width: 500px;
  border: 1px solid #333;
  &:hover {
    background-color: #bbbbbb;
    cursor: pointer;
  }
`;
