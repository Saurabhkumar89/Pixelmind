'use client';

import { Wand2, Lightbulb, Trash2, Palette } from 'lucide-react';

export function EditingToolsSection() {
  const tools = [
    {
      icon: Wand2,
      title: 'Prompt-based Photo Editing',
      description: 'Edit photos using natural language prompts. Tell AI what to change and it does it.',
      credits: '2 credits',
    },
    {
      icon: Wand2,
      title: 'Generative Fill',
      description: 'Select areas of your image and let AI intelligently fill them based on surroundings.',
      credits: '2 credits',
    },
    {
      icon: Trash2,
      title: 'AI Object Add / Remove',
      description: 'Remove unwanted objects or add new ones to your images seamlessly.',
      credits: '2 credits',
    },
    {
      icon: Lightbulb,
      title: 'Background Replacement',
      description: 'Replace image backgrounds with AI-generated or custom alternatives instantly.',
      credits: '2 credits',
    },
    {
      icon: Lightbulb,
      title: 'Lighting & Color Enhancement',
      description: 'Adjust lighting, color grading, and tone with AI-powered enhancement tools.',
      credits: '1 credit',
    },
    {
      icon: Palette,
      title: 'Style Transfer Effects',
      description: 'Apply artistic styles from famous paintings and photographers to your images.',
      credits: '2 credits',
    },
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">🖌 AI Editing Tools</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Professional editing capabilities powered by advanced AI models
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <div key={idx} className="glass rounded-lg p-6 smooth-transition hover:bg-white/15">
                <Icon className="mb-4 h-8 w-8 text-purple-400" />
                <h3 className="mb-2 font-semibold text-lg">{tool.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{tool.description}</p>
                <span className="inline-block rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-400">
                  {tool.credits}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
