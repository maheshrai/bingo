import { ChakraProvider } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import UserContext from "../lib/UserContext";
import { supabase } from "../lib/supabase";
import styles from "../styles/Home.module.css";
import { Header } from "../components/Header";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.session();
    setSession(session);
    setUser(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        const currentUser = session?.user;
        setUser(currentUser ?? null);
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, [user]);

  const signOut = async () => {
    const result = await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        signOut,
      }}
    >
      <ChakraProvider>
        <Header></Header>
        <Component {...pageProps} />
        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
          </a>
        </footer>
      </ChakraProvider>
    </UserContext.Provider>
  );
}

export default MyApp;
