'use client';

import { Trash, ArrowUp, Expand, Filter } from 'lucide-react';

export function EnhancementSection() {
  const features = [
    {
      icon: Trash,
      title: 'Background Removal',
      description: 'Remove backgrounds automatically with precision cutting and transparency.',
      credits: '1 credit',
      type: 'Enhancement',
    },
    {
      icon: ArrowUp,
      title: 'AI Image Upscaling (HD/4K)',
      description: 'Enlarge images up to 4x without losing quality using advanced AI upscalers.',
      credits: '2 credits',
      type: 'Enhancement',
    },
    {
      icon: Expand,
      title: 'Image Expansion (Outpainting)',
      description: 'Extend images beyond their original boundaries with intelligent content generation.',
      credits: '3 credits',
      type: 'Enhancement',
    },
    {
      icon: Filter,
      title: 'Noise Reduction',
      description: 'Remove grain and noise from photos while preserving detail.',
      credits: '1 credit',
      type: 'Enhancement',
    },
    {
      icon: Trash,
      title: 'Sharpen & Detail Enhancement',
      description: 'Enhance clarity and bring out fine details in your images.',
      credits: '1 credit',
      type: 'Enhancement',
    },
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">🖼 Image Enhancement</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Improve your images with cutting-edge AI enhancement capabilities
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="glass rounded-lg p-6 smooth-transition hover:bg-white/15">
                <Icon className="mb-4 h-8 w-8 text-green-400" />
                <h3 className="mb-2 font-semibold text-lg">{feature.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{feature.description}</p>
                <span className="inline-block rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                  {feature.credits}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
