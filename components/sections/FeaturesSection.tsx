import { Check, Zap, Shield, Sparkles } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Tools',
      description: 'Access to state-of-the-art image generation and editing models.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process images in seconds with optimized AI infrastructure.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your images are encrypted and never shared with third parties.',
    },
    {
      icon: Check,
      title: 'No Installation',
      description: 'Work directly in your browser. No software to download.',
    },
  ];

  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8 border-b border-border">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose PixelMind?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional-grade AI image editing tools for creators, designers, and enterprises.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="glass rounded-lg p-8 smooth-transition hover:bg-white/15">
                <Icon className="h-8 w-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
