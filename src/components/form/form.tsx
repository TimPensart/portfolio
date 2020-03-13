import React, { useState } from "react";
import "animate.css/animate.min.css";
import ScrollAnimation from "react-animate-on-scroll";
import { FormStyle } from "./form-style";
import { MyButton } from "../button/button-style";

interface formValues {
  name: string;
  email: string;
  message: string;
}

export const MyForm = () => {
  const [values, setValues] = useState<formValues>({
    name: "",
    email: "",
    message: ""
  });

  const getFormValues = (
    event:
      | React.FormEvent<HTMLInputElement>
      | React.FormEvent<HTMLTextAreaElement>
  ) => {
    console.log(event.currentTarget.name);
    const current: string = event.currentTarget.name;
    const { name, value } = event.currentTarget;

    setValues(prevState => ({ ...prevState, [name]: value }));

    console.log(values);
  };

  return (
    <FormStyle>
      <form action="https://formspree.io/xoqlvdbv" method="POST">
        <input
          required={true}
          type="text"
          name="name"
          placeholder="name"
          onChange={event => {
            getFormValues(event);
          }}
        />
        <input
          required={true}
          type="email"
          name="email"
          placeholder="e-mail"
          onChange={event => {
            getFormValues(event);
          }}
        />
        <textarea
          required={true}
          rows={5}
          name="message"
          placeholder="message"
          onChange={event => {
            getFormValues(event);
          }}
        ></textarea>
        <MyButton type="submit">Send</MyButton>
      </form>
    </FormStyle>
  );
};
