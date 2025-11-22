
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { TextInput } from '@mantine/core';

export default function Home() {
  return (
    <div className="loginpage-con">
      <div className="loginpage-content-con">

        <div className="login-main-content-con" >

          <Image
          src="/timeann-img.png"
          alt="TimeAnn logo"
          width={100}
          height={20}
          priority
        />

        </div>
        <div className="login-input-con">
<div className="login-input-header">
  <h1>Log ind</h1>
</div>

          <TextInput
            size="md"
            radius="lg"
            label="E-mail"
            withAsterisk
            placeholder="Skriv her"
          />

          <TextInput
            styles={{
              input: {

                paddingLeft: 10,
                padding: 10,

              },
            }}
            size="md"
            radius="lg"
            label="Kodeord"
            withAsterisk
            placeholder="Skriv her"
          />
          <div className="login-btn-con">

            <p>Glemt oplysninger</p>

            <div className="login-btn"><Link href="/dashboard-page"><p>Log ind</p></Link></div>

          </div>

        </div>

      </div>
    </div>
  );
}
