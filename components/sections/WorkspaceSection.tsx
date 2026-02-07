'use client';

import { Layers, Eye, Download, Save } from 'lucide-react';

export function WorkspaceSection() {
  const features = [
    {
      icon: Layers,
      title: 'Canvas Editor with Mask Tool',
      description: 'Precise layer-based editing with advanced masking and selection tools.',
    },
    {
      icon: Layers,
      title: 'Layer Preview',
      description: 'View and manage multiple layers with real-time preview updates.',
    },
    {
      icon: Eye,
      title: 'Before/After Comparison',
      description: 'Toggle between original and edited versions to see your changes clearly.',
    },
    {
      icon: Download,
      title: 'Download Final Image',
      description: 'Export your finished work in multiple formats: PNG, JPG, WebP, TIFF.',
    },
    {
      icon: Save,
      title: 'Auto-save Draft Projects',
      description: 'Never lose your work with automatic cloud-based project saving.',
    },
  ];

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">🧩 Image Editor Workspace</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Professional-grade canvas editing with advanced features for creators
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="glass rounded-lg p-6 flex gap-4">
                <Icon className="h-8 w-8 flex-shrink-0 text-cyan-400" />
                <div className="flex-grow">
                  <h3 className="mb-2 font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
