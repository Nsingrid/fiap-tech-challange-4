"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "~/components/button/button";

import styles from "./not-found-main.module.css";

export const NotFoundMain = () => {
  const router = useRouter();

  const backToHome = () => {
    router.push("/");
  };

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.banner}>
          <div className={styles.text}>
            <p className={styles.title}>Ops! Não encontramos a página...</p>
            <p className={styles.description}>
              E olha que exploramos o universo procurando por ela! Que tal
              voltar e tentar novamente?
            </p>
          </div>
          <Button variant="dashPrimary" onClick={backToHome}>
            Voltar ao início
          </Button>
          <Image
            src="/images/not-found-banner.svg"
            width={660}
            height={420}
            alt="Not Found Banner"
          />
        </div>
      </div>
    </main>
  );
};
