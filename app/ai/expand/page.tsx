'use client';

import React from "react"

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Maximize2, Download, Upload, RefreshCw } from 'lucide-react';

export default function ExpandPage() {
  const { user, token } = useAuth();
  const [image, setImage] = useState<string>('');
  const [direction, setDirection] = useState('all');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleExpand = async () => {
    if (!token) {
      window.location.href = '/auth/login';
      return;
    }
    if (!image) {
      setError('Please upload an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/expand`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl: image, direction }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Expansion failed');
        return;
      }

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
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Expand Image</h1>
            <p className="text-muted-foreground">Add context around your image intelligently</p>
            <p className="text-sm text-blue-400 mt-2">Cost: 3 credits</p>
          </div>

          {user && (
            <div className="mb-6 p-4 glass rounded-lg">
              <p className="text-sm">Credits: <span className="font-bold">{user.credits}</span></p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <label className="block">
                <span className="text-sm font-semibold mb-4 block">Upload Image</span>
                <label className="glass rounded-lg p-8 cursor-pointer hover:bg-white/15 transition flex flex-col items-center justify-center min-h-64">
                  <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload</p>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </label>

              {image && (
                <div>
                  <p className="text-sm font-semibold mb-2">Preview</p>
                  <img src={image || "/placeholder.svg"} alt="Upload" className="w-full rounded-lg" />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">Direction</label>
                <select value={direction} onChange={(e) => setDirection(e.target.value)} className="w-full p-3 bg-secondary border border-border rounded-lg focus:outline-none">
                  <option value="all">All Directions</option>
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </select>
              </div>

              {error && <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}

              <Button onClick={handleExpand} disabled={loading || !image} size="lg" className="w-full gap-2">
                {loading ? 'Expanding...' : <>Expand <Maximize2 className="h-4 w-4" /></>}
              </Button>
            </div>

            <div>
              <div className="glass rounded-lg p-6 min-h-96 flex items-center justify-center">
                {loading ? (
                  <div className="text-center">
                    <div className="inline-block animate-spin mb-4"><RefreshCw className="h-8 w-8" /></div>
                    <p className="text-muted-foreground">Expanding...</p>
                  </div>
                ) : result?.outputImageUrl ? (
                  <div className="w-full">
                    <img src={result.outputImageUrl || "/placeholder.svg"} alt="Result" className="w-full rounded-lg mb-4" />
                    <a href={result.outputImageUrl} download>
                      <Button className="w-full gap-2"><Download className="h-4 w-4" />Download</Button>
                    </a>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">Result will appear here</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
