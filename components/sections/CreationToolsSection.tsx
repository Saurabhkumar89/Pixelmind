'use client';

import { Sparkles, Palette, BookOpen } from 'lucide-react';
import Link from 'next/link';

export function CreationToolsSection() {
  const tools = [
    {
      icon: Sparkles,
      title: 'Text to Image Generator',
      description: 'Describe any image and watch AI bring your vision to life with stunning detail and accuracy.',
      link: '/ai-image-generator',
    },
    {
      icon: Palette,
      title: 'AI Art & Illustration',
      description: 'Create professional artwork, digital paintings, and artistic illustrations in any style.',
      link: '/tools/generate',
    },
    {
      icon: BookOpen,
      title: 'Thumbnail & Poster Generation',
      description: 'Generate eye-catching thumbnails and posters optimized for social media and marketing.',
      link: '/ai-image-generator',
    },
    {
      icon: Sparkles,
      title: 'Style-Based Generation',
      description: 'Choose from cinematic, anime, realistic, painting, and more artistic styles.',
      link: '/tools/generate',
    },
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">🧠 AI Creation Tools</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Transform your ideas into stunning visuals using advanced AI generation models
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <Link key={idx} href={tool.link}>
                <div className="glass rounded-lg p-6 smooth-transition hover:bg-white/15 cursor-pointer h-full flex flex-col">
                  <Icon className="mb-4 h-8 w-8 text-blue-400" />
                  <h3 className="mb-2 font-semibold text-lg">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground flex-grow">{tool.description}</p>
                  <span className="mt-4 text-xs text-blue-400 font-medium">Learn More →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
