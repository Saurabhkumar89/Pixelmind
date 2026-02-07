import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Image Generator - Create Images from Text | PixelMind',
  description: 'Generate stunning, high-quality images from text descriptions using advanced AI. Free AI image generator with 10 free credits. No credit card required.',
  keywords: [
    'AI image generator',
    'text to image',
    'AI art generator',
    'free image generator',
    'image creation tool',
    'stable diffusion',
  ],
  openGraph: {
    title: 'AI Image Generator - Create Images from Text',
    description: 'Transform your ideas into stunning visuals with PixelMind AI Image Generator',
    images: [{ url: '/seo/generator-og.jpg' }],
  },
};

export default function AIImageGeneratorPage() {
  const features = [
    'Generate unlimited variations',
    'High-resolution output (up to 2K)',
    'Multiple style options',
    'Fast processing (< 30 seconds)',
    'Commercial license included',
    'Batch processing available',
  ];

  const faq = [
    {
      q: 'How does the AI image generator work?',
      a: 'Our generator uses state-of-the-art diffusion models trained on millions of images. You provide a text description, and our AI creates a unique image matching your prompt.',
    },
    {
      q: 'Can I use generated images commercially?',
      a: 'Yes! All images generated with PixelMind can be used for commercial purposes, including in products, marketing, and resale.',
    },
    {
      q: 'How many images can I generate?',
      a: 'With our free plan, you get 10 credits (5 images). Paid plans offer 300-unlimited generations per month.',
    },
    {
      q: 'What file formats are supported?',
      a: 'Generated images are available in PNG and JPG formats, optimized for web and print.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="mx-auto max-w-4xl relative">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 sm:text-6xl">
              Create Stunning Images with{' '}
              <span className="gradient-text">AI Text-to-Image</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Turn your imagination into reality. Generate unlimited high-quality images from simple text descriptions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  Start Generating Free <Zap className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/tools/generate">
                <Button size="lg" variant="outline">
                  Try Demo <ArrowRight className="h-4 w-4" />
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
                title: 'Write Your Prompt',
                description: 'Describe the image you want to create in detail',
              },
              {
                step: '2',
                title: 'AI Generates',
                description: 'Our AI model creates your image in seconds',
              },
              {
                step: '3',
                title: 'Download & Use',
                description: 'Get high-resolution images ready to use',
              },
            ].map((item) => (
              <div key={item.step} className="glass rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-400">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold mb-12 text-center">Powerful Features</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 glass rounded-lg p-4">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold mb-12 text-center">Sample Results</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              'A serene mountain landscape at sunset with golden light and misty valleys',
              'Cyberpunk city street with neon signs and flying vehicles',
              'Portrait of an elegant woman with mystical glowing eyes, fantasy style',
              'Steampunk airship in clouds with intricate mechanical details',
            ].map((prompt, idx) => (
              <div key={idx}>
                <div className="aspect-video rounded-lg bg-secondary/50 border border-border mb-3 flex items-center justify-center overflow-hidden">
                  <img
                    src={`/api/placeholder/400/300?text=${encodeURIComponent(prompt)}`}
                    alt={prompt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground">{prompt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold mb-12 text-center">Affordable Pricing</h2>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { plan: 'Free', credits: '10', price: '₹0' },
              { plan: 'Starter', credits: '300', price: '₹199/month' },
              { plan: 'Pro', credits: '1000', price: '₹499/month' },
            ].map((tier, idx) => (
              <div key={idx} className="glass rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">{tier.plan}</h3>
                <p className="text-3xl font-bold mb-2">{tier.price}</p>
                <p className="text-muted-foreground mb-4">{tier.credits} credits</p>
                <Button variant="outline" className="w-full bg-transparent">
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {faq.map((item, idx) => (
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
          <h2 className="text-3xl font-bold mb-4">Ready to Generate Amazing Images?</h2>
          <p className="text-muted-foreground mb-8">
            Start for free with 10 credits. No credit card required.
          </p>
          <Link href="/auth/signup">
            <Button size="lg">
              Start Creating <ArrowRight className="ml-2 h-4 w-4" />
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
