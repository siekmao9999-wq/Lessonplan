import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'ប្រព័ន្ធបង្កើតកិច្ចតែងការបង្រៀន AI - KrouPlan',
  description: 'ប្រព័ន្ធបង្កើតកិច្ចតែងការបង្រៀនស្វ័យប្រវត្តិតាមស្តង់ដារ ៥ ជំហានរបស់ក្រសួងអប់រំ យុវជន និងកីឡា ជាមួយការកែសម្រួលនិងទាញយកជា HTML ភ្លាមៗ',
  openGraph: {
    title: 'ប្រព័ន្ធបង្កើតកិច្ចតែងការបង្រៀន AI - KrouPlan',
    description: 'ប្រព័ន្ធបង្កើតកិច្ចតែងការបង្រៀនស្វ័យប្រវត្តិតាមស្តង់ដារ ៥ ជំហានរបស់ក្រសួងអប់រំ យុវជន និងកីឡា ជាមួយការកែសម្រួលនិងទាញយកជា HTML ភ្លាមៗ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ប្រព័ន្ធបង្កើតកិច្ចតែងការបង្រៀន AI - KrouPlan',
    description: 'ប្រព័ន្ធបង្កើតកិច្ចតែងការបង្រៀនស្វ័យប្រវត្តិតាមស្តង់ដារ ៥ ជំហានរបស់ក្រសួងអប់រំ យុវជន និងកីឡា ជាមួយការកែសម្រួលនិងទាញយកជា HTML ភ្លាមៗ',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=STIX+Two+Math&family=STIX+Two+Text:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
