import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { sessionState, bodyState } from "../recoil/atoms";
import { OK, Error, Title } from "../style/styles";

const SIGNIN_MUTATION = gql`
  mutation signin($userName: String!, $pwd: String!) {
    signin(userName: $userName, pwd: $pwd) {
      userName,
      _id
    }
  }
`;

export default () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [body, setBody] = useRecoilState(bodyState);
    const [signinMutation, {data}] = useMutation(SIGNIN_MUTATION, {
        onError(error){
            console.log("Error creating user");
        }
    });

    const register = (userName, pwd) => {
        signinMutation({
            variables: { userName, pwd}
        });
    };

    if(data){
        setBody("Login");
    }
    if (data) {
      if(data.signin.pwd !== data.signin.pwd){
        console.log("Error with passwords");
      }
    }

    return(
        <Signin>
            <Title>Register</Title>
            {errorMessage !== "" ? <Error>{errorMessage}</Error>: null}
            <Signin>
                <Input
                id="userName"
                type="text"
                placeholder="Nombre de usuario"
                >
                </Input>
                <Input id="pwd" type="password" placeholder="Contraseña"></Input>
                <Input id="pwd" type="password" placeholder="Contraseña"></Input>
                <Button
                onClick={() => {
                    register(
                    document.getElementById("userName").value,
                    document.getElementById("pwd").value,
                    document.getElementById("pwd").value,
                    );
                }}>
                Enviar
                </Button>
          </Signin>
        </Signin>
    )
};

const Signin = styled.div`
  color: #333333;
  margin: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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