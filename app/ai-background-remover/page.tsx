import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Background Remover - Remove BG from Images | PixelMind',
  description: 'Remove image backgrounds instantly with AI precision. Free background remover tool. Perfect for product photos, portraits, and graphics. 1 credit per removal.',
  keywords: [
    'background remover',
    'remove background',
    'bg remover',
    'image background removal',
    'transparent background',
    'product photography',
  ],
  openGraph: {
    title: 'AI Background Remover - Professional Background Removal',
    description: 'Remove backgrounds instantly with pixel-perfect AI technology',
    images: [{ url: '/seo/remover-og.jpg' }],
  },
};

export default function BackgroundRemoverPage() {
  const features = [
    'Pixel-perfect edge detection',
    'Instant processing',
    'Transparent PNG output',
    'Batch processing available',
    'No quality loss',
    'Works with any image type',
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-green-600/20 blur-3xl" />
        <div className="mx-auto max-w-4xl relative">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 sm:text-6xl">
              Remove Image Backgrounds with{' '}
              <span className="gradient-text">AI Precision</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Instantly extract subjects from backgrounds. Perfect for product photos, portraits, graphics, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  Remove BG Now Free <Zap className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/tools/remove-bg">
                <Button size="lg" variant="outline">
                  Try Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Upload Image',
                description: 'Select your image from any format (JPG, PNG, WebP)',
              },
              {
                step: '2',
                title: 'AI Processes',
                description: 'Advanced AI detects and removes background instantly',
              },
              {
                step: '3',
                title: 'Download Result',
                description: 'Get transparent PNG with perfect edges',
              },
            ].map((item) => (
              <div key={item.step} className="glass rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-400">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold mb-12 text-center">Perfect For</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              'E-commerce product photography',
              'Social media graphics',
              'Professional portraits',
              'Logo design assets',
              'Marketing materials',
              'Website headers',
            ].map((useCase, idx) => (
              <div key={idx} className="flex items-start gap-3 glass rounded-lg p-4">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>{useCase}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold mb-12 text-center">Quality Examples</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              'Product photo with complex background',
              'Portrait with hair details',
            ].map((example, idx) => (
              <div key={idx}>
                <div className="aspect-video rounded-lg bg-secondary/50 border border-border mb-3 flex items-center justify-center overflow-hidden">
                  <img
                    src={`/api/placeholder/400/300?text=Before & After: ${example}`}
                    alt={example}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground">{example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold mb-12 text-center">Affordable Pricing</h2>

          <div className="glass rounded-lg p-8">
            <div className="grid gap-4 md:grid-cols-4 text-center mb-8">
              {[
                { plan: 'Free', credits: '10', removals: '10' },
                { plan: 'Starter', credits: '300', removals: '300' },
                { plan: 'Pro', credits: '1000', removals: '1000' },
                { plan: 'Studio', credits: 'Unlimited', removals: 'Unlimited' },
              ].map((tier, idx) => (
                <div key={idx}>
                  <p className="text-sm text-muted-foreground mb-1">{tier.plan}</p>
                  <p className="text-2xl font-bold">{tier.removals}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-muted-foreground">
              Just 1 credit per background removal. Remove as many as you need!
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold mb-12 text-center">FAQ</h2>

          <div className="space-y-6">
            {[
              {
                q: 'What image formats are supported?',
                a: 'We support JPG, PNG, WebP, and GIF formats. Maximum file size is 25MB.',
              },
              {
                q: 'Is the background removal reversible?',
                a: 'No, but you can always upload a new image. Download the original for reference.',
              },
              {
                q: 'Can I remove backgrounds from multiple images?',
                a: 'Yes! Use our batch processing feature with Pro or Studio plans.',
              },
              {
                q: 'What about complex backgrounds?',
                a: 'Our AI handles complex backgrounds, hair, fur, and fine details with precision.',
              },
            ].map((item, idx) => (
              <div key={idx} className="glass rounded-lg p-6">
                <h3 className="font-semibold mb-3">{item.q}</h3>
                <p className="text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl glass rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Removing Backgrounds Today</h2>
          <p className="text-muted-foreground mb-8">
            Just 1 credit per image. Start free with 10 credits.
          </p>
          <Link href="/auth/signup">
            <Button size="lg">
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>&copy; 2024 PixelMind AI Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
