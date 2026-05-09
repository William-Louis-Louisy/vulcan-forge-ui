import { useTranslations } from 'next-intl';

export default function PricingPage() {
  const t = useTranslations('PricingPage');

  return (
    <main className="bg-background-app text-content-primary min-h-screen px-6 py-16">
      <section className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-content-secondary mt-4">{t('description')}</p>
      </section>
    </main>
  );
}
