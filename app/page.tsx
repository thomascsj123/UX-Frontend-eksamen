"use client"

import { createClient } from '@supabase/supabase-js';
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { TextInput } from '@mantine/core';
import { useState, useEffect } from "react";
import { PasswordInput } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {

  const theme = useMantineTheme();
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [userdata, setUserdata] = useState([])
  const [errortext, setErrortext] = useState("")
  const [errorcolor, setErrorColor] = useState("rgba(72, 72, 72, 1)")

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from("user-table")
      .select("*")

      //checks if the mail and password state is equal to any mail or passowrd 
      .eq("user_mail", mail) //only execute the rest of the code if the inputted mail matches any mail in the user table
      .eq("user_password", password)
      .single(); // ensures only one user is returned

    if (error || !data) {
      setErrortext("Den indtastede mail eller kodeord er forkert prøv igen :(")
      setErrorColor("rgba(240, 62, 62, 1)")
      return;
    }



    window.location.href = "/dashboard-page";
    console.log(mail, password)
    const userRole = data.user_role
    console.log("user role", userRole)
    // After login
    sessionStorage.setItem("userName", data.username); //the name of the user that has been logged in with
    sessionStorage.setItem("userRole", data.user_role);
    sessionStorage.setItem("userMail", data.user_mail); //the only user_mail extracted is the 1 matching the mail variable
//the data.username is saved with the key "userName" in the session storage with the data.username as its "key value"
  };

  //useEffect kørers igennem hver gang mail og password opdateres i state

  /* {userdata.map((user, index) => (
        const username = {user.user_name}
   <div key={index}>
    {user}





   </div>
   //take each users username and store it in userName variable 


  ))} */
  return (
    <div className="loginpage-con">

      <div className="loginpage-content-con">

        <div className="login-main-content-con" >

          <Image
            src="/timeann-img.png"
            alt="TimeAnn logo"
            width={100}
            height={100}
            priority

      
          />

        </div>
        <div className="login-input-con">
          <div className="login-input-header">
            <h1>Log ind</h1>
          </div>

          <TextInput
            id="email-input"
            styles={{
              input: {

                borderColor: errorcolor,
                paddingLeft: 10,
                padding: 10,
                color: errorcolor,

              },
              label: {

                color: errorcolor

              },

            }}

            size="md"
            radius="lg"
            label="E-mail"
            withAsterisk
            placeholder="Skriv her"
            value={mail}
            onChange={(e) => setMail(e.currentTarget.value)}
          />

          <PasswordInput
            id="password-input"
            styles={{
              input: {

                borderColor: errorcolor,
                paddingLeft: 10,
                padding: 10,

              },

              label: {

                color: errorcolor

              },

            }}
            size="md"
            radius="lg"
            label="Kodeord"
            type="password"
            withAsterisk
            placeholder="Skriv her"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <div className="login-btn-con">

            <p>Glemt oplysninger</p>


            <div className="login-btn" onClick={handleLogin}><p>Log ind</p></div>

          </div>
          <p id="error-text">{errortext}</p>
        </div>

      </div>
    </div>
  );
}
