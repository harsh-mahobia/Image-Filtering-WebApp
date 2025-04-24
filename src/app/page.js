'use client'

import Head from 'next/head';
import { useState } from 'react';
import ImageFilter from '../components/ImageFilter';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Advanced Image Filter App with AI</title>
        <meta name="description" content="Real-time image filtering application with AI generation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Advanced Image Filter with AI
        </h1>
        
        <p className={styles.description}>
          Generate images with AI or upload your own, then apply filters in real-time
        </p>

        <ImageFilter />
      </main>

      <footer className={styles.footer}>
        <p>Advanced Image Filtering Application with AI Generation</p>
      </footer>
    </div>
  );
}