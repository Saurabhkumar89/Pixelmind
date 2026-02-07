'use client';

import { Zap, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BatchProcessingSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-4xl font-bold">⚡ Batch Processing</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Process multiple images at once and download all results as a zip file.
            </p>

            <div className="space-y-4">
              {[
                'Bulk Background Removal',
                'Bulk Image Upscaling',
                'Multi-image Editing',
                'Batch Effect Application',
                'ZIP Download of Results',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Button className="mt-8" size="lg">
              Try Batch Processing
            </Button>
          </div>

          <div className="glass rounded-lg p-8 flex flex-col justify-center">
            <Upload className="mb-4 h-12 w-12 text-yellow-400" />
            <h3 className="mb-2 text-2xl font-semibold">Drop files or click to upload</h3>
            <p className="mb-6 text-muted-foreground">
              Upload up to 50 images at once. Supported formats: JPG, PNG, WebP
            </p>

            <div className="mb-6 rounded-lg border-2 border-dashed border-yellow-400/30 p-8 text-center">
              <p className="text-sm text-muted-foreground">Max file size: 50MB per image</p>
            </div>

            <Button variant="outline" className="w-full gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download Results as ZIP
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
