import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {Amplify} from "aws-amplify";
import awsconfig from "../src/aws-exports";

Amplify.configure(awsconfig);

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
