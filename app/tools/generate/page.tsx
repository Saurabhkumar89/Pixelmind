'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/Navbar';
import { Sparkles, Download, Loader } from 'lucide-react';
import Link from 'next/link';

export default function GenerateToolPage() {
  const { user, isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (!user || user.credits < 2) {
      setError('Not enough credits. Please upgrade your plan.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);

      // Update user credits
      if (user) {
        user.credits -= 2;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pixelmind-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download image');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-blue-400" />
              AI Image Generation
            </h1>
            <p className="text-muted-foreground">
              Create stunning images from text descriptions using advanced AI
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <div className="glass rounded-lg p-6 sticky top-20">
                <h2 className="text-lg font-semibold mb-4">Generation Settings</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Prompt</label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the image you want to generate..."
                      className="w-full rounded-lg bg-secondary/50 border border-border px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-400"
                      rows={6}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-muted-foreground">
                      <strong>Credits:</strong> 2 credits per generation
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Available:</strong> {user?.credits || 0} credits
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleGenerate}
                    disabled={isLoading || !user || user.credits < 2}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Image
                      </>
                    )}
                  </Button>

                  {!isAuthenticated && (
                    <p className="text-xs text-muted-foreground text-center">
                      <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
                        Sign in to generate images
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2">
              <div className="glass rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Preview</h2>

                {generatedImage ? (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-secondary aspect-square flex items-center justify-center">
                      <img
                        src={generatedImage || "/placeholder.svg"}
                        alt="Generated"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <Button
                      onClick={handleDownload}
                      className="w-full bg-transparent"
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Image
                    </Button>

                    <Button
                      onClick={() => {
                        setGeneratedImage(null);
                        setPrompt('');
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Generate Another
                    </Button>
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center text-center">
                    <div>
                      <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">
                        Enter a prompt and click "Generate Image" to create your first artwork
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="mt-6 glass rounded-lg p-6">
                <h3 className="font-semibold mb-3">Tips for Better Results</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Be specific about what you want to see</li>
                  <li>✓ Include details like style, lighting, and mood</li>
                  <li>✓ Use descriptive adjectives</li>
                  <li>✓ Reference art styles or artists if desired</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
