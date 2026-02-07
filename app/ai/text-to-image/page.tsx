'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Sparkles, Download, RefreshCw } from 'lucide-react';

export default function TextToImagePage() {
  const { user, token } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [size, setSize] = useState('512x512');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!token) {
      window.location.href = '/auth/login';
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/text-to-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt, style, size }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setError(`Insufficient credits. Need ${data.required}, have ${data.available}`);
        } else {
          setError(data.error || 'Generation failed');
        }
        return;
      }

      // Poll for result
      let attempts = 0;
      while (attempts < 30) {
        const resultRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tools/result/${data.editId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (resultRes.ok) {
          const result = await resultRes.json();
          if (result.status === 'success') {
            setResult(result);
            break;
          }
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }
    } catch (err) {
      setError('Error: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">AI Image Generator</h1>
            <p className="text-muted-foreground">Create images from text descriptions</p>
            <p className="text-sm text-blue-400 mt-2">Cost: 2 credits</p>
          </div>

          {/* Credit Check */}
          {user && (
            <div className="mb-6 p-4 glass rounded-lg">
              <p className="text-sm">Credits: <span className="font-bold">{user.credits}</span></p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to create..."
                  className="w-full h-32 p-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full p-3 bg-secondary border border-border rounded-lg focus:outline-none"
                >
                  <option value="realistic">Realistic</option>
                  <option value="cinematic">Cinematic</option>
                  <option value="anime">Anime</option>
                  <option value="painting">Painting</option>
                  <option value="illustration">Illustration</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Size</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full p-3 bg-secondary border border-border rounded-lg focus:outline-none"
                >
                  <option value="256x256">256x256</option>
                  <option value="512x512">512x512</option>
                  <option value="768x768">768x768</option>
                  <option value="1024x1024">1024x1024</option>
                </select>
              </div>

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={loading}
                size="lg"
                className="w-full gap-2"
              >
                {loading ? 'Generating...' : <>Generate Image <Sparkles className="h-4 w-4" /></>}
              </Button>
            </div>

            {/* Preview Section */}
            <div>
              <div className="glass rounded-lg p-6 min-h-96 flex items-center justify-center">
                {loading ? (
                  <div className="text-center">
                    <div className="inline-block animate-spin mb-4">
                      <RefreshCw className="h-8 w-8" />
                    </div>
                    <p className="text-muted-foreground">Generating your image...</p>
                  </div>
                ) : result?.outputImageUrl ? (
                  <div className="w-full">
                    <img
                      src={result.outputImageUrl || "/placeholder.svg"}
                      alt="Generated"
                      className="w-full rounded-lg mb-4"
                    />
                    <a href={result.outputImageUrl} download>
                      <Button className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </a>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">
                    Your generated image will appear here
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
