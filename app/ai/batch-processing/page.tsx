'use client';

import React from "react"

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Zap, Download, Upload } from 'lucide-react';

export default function BatchProcessingPage() {
  const { user, token } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [operation, setOperation] = useState('background-remove');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Batch Processing</h1>
            <p className="text-muted-foreground">Process multiple images at once</p>
            <p className="text-sm text-blue-400 mt-2">Cost: 5 credits per batch</p>
          </div>

          {user && (
            <div className="mb-6 p-4 glass rounded-lg">
              <p className="text-sm">Credits: <span className="font-bold">{user.credits}</span></p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Operation</label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="w-full p-3 bg-secondary border border-border rounded-lg"
              >
                <option value="background-remove">Remove Backgrounds</option>
                <option value="upscale">Upscale All</option>
              </select>
            </div>

            <label className="glass rounded-lg p-8 cursor-pointer hover:bg-white/15 transition flex flex-col items-center justify-center min-h-64">
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Click to upload multiple images</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {images.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-4">
                  {images.length} image{images.length !== 1 ? 's' : ''} selected
                </p>
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img || "/placeholder.svg"}
                      alt={`Batch ${idx}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            <Button
              disabled={loading || images.length === 0}
              size="lg"
              className="w-full gap-2"
            >
              {loading ? 'Processing...' : <>Process Batch <Zap className="h-4 w-4" /></>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
