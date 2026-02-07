'use client';

import { Copy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  popularity: number;
}

export function PromptTemplates() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const templates: PromptTemplate[] = [
    {
      id: '1',
      title: 'Professional Portrait',
      description: 'Generate professional headshots and portrait photos',
      prompt:
        'Professional headshot of a {person}, studio lighting, clean background, high quality, 4k, professional photography',
      category: 'Portraits',
      popularity: 234,
    },
    {
      id: '2',
      title: 'Product Photography',
      description: 'Create high-quality product showcase images',
      prompt:
        '{product} on white background, professional studio lighting, 3/4 view, high resolution, product photography, e-commerce',
      category: 'Products',
      popularity: 189,
    },
    {
      id: '3',
      title: 'Cinematic Scene',
      description: 'Generate cinematic movie-like scenes',
      prompt:
        '{scene}, cinematic lighting, dramatic mood, trending on artstation, 8k, high quality, professional color grading',
      category: 'Cinematic',
      popularity: 567,
    },
    {
      id: '4',
      title: 'Digital Art',
      description: 'Create stunning digital artwork',
      prompt:
        '{subject}, digital art, trending on artstation, concept art, detailed, professional artist, vibrant colors, 4k',
      category: 'Art',
      popularity: 456,
    },
    {
      id: '5',
      title: 'Anime Style',
      description: 'Generate anime and manga style images',
      prompt:
        '{character}, anime style, manga illustration, beautiful detailed eyes, trending on pixiv, high quality, detailed',
      category: 'Anime',
      popularity: 712,
    },
    {
      id: '6',
      title: 'Realistic Landscape',
      description: 'Create stunning landscape photography',
      prompt:
        '{landscape}, realistic photography, professional landscape photo, golden hour, cinematic lighting, national geographic, 8k',
      category: 'Landscapes',
      popularity: 345,
    },
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-400" />
          Prompt Templates
        </h2>
        <p className="text-muted-foreground">
          Use these templates to improve your AI image generation results. Customize them with your own details.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <div key={template.id} className="glass rounded-lg p-6 smooth-transition hover:bg-white/15">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{template.title}</h3>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </div>
              <span className="badge-premium ml-2">{template.category}</span>
            </div>

            <div className="mb-4 rounded-lg bg-black/30 p-3 font-mono text-sm">
              <p className="line-clamp-3 text-muted-foreground">{template.prompt}</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{template.popularity} uses</span>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
                onClick={() => copyToClipboard(template.prompt, template.id)}
              >
                <Copy className="h-3 w-3" />
                {copiedId === template.id ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
