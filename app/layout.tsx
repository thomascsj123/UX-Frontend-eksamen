// app/layout.tsx

import Link from "next/link";

import "./globals.css";


import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; // Add this for date picker styles
import { MantineProvider } from '@mantine/core';
export const metadata = {

  title: "Next Routing Workshop",

};



export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (

    <html lang="en">

      <body>

        
        <MantineProvider>

          <main >{children}</main>

        </MantineProvider>

       
        

      </body>

    </html>



  );
}



