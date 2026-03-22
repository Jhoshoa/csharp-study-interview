import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/csharp-fundamentals">
            Start Learning
          </Link>
        </div>
      </div>
    </header>
  );
}

type FeatureItem = {
  title: string;
  description: string;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'C# Fundamentals',
    description: 'Master the core concepts: type system, memory management, value vs reference types, and more.',
    link: '/docs/csharp-fundamentals',
  },
  {
    title: 'Advanced C# Topics',
    description: 'Dive deep into generics, delegates, events, LINQ, async/await, and expression trees.',
    link: '/docs/csharp-advanced',
  },
  {
    title: 'SOLID & Design Patterns',
    description: 'Learn software design principles and common patterns used in enterprise applications.',
    link: '/docs/solid-principles',
  },
  {
    title: 'ASP.NET Core & Web APIs',
    description: 'Build modern web applications and RESTful APIs with ASP.NET Core.',
    link: '/docs/aspnetcore-webapi',
  },
  {
    title: 'Entity Framework & Databases',
    description: 'Work with databases using Entity Framework Core, understand ORM concepts.',
    link: '/docs/ef-databases',
  },
  {
    title: 'Interview Questions',
    description: 'Practice with real interview questions covering all major C# and .NET topics.',
    link: '/docs/interview-questions',
  },
];

function Feature({title, description, link}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={clsx('card', styles.featureCard)}>
        <div className="card__header">
          <Heading as="h3">{title}</Heading>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <Link className="button button--primary button--block" to={link}>
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home(): React.ReactElement {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Comprehensive C# and .NET study guide for technical interviews">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
